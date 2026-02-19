import { supabase } from "../lib/supabase";
import { FILE_SYSTEM, FILE_CONTENTS } from "./filesystem";
import { encodeSecret, decodeSecret } from "../utils/crypto";
import { LEVEL_CONFIG } from "./config"; // Import your config

// Helper to hash text (Simple SHA-256 for the browser)
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const resolvePath = (current, target) => {
  if (target === "/") return "/";
  if (target.startsWith("/")) return target; // Absolute
  if (target === "..") {
    const parts = current.split("/").filter(Boolean);
    parts.pop();
    return "/" + parts.join("/");
  }
  if (target === ".") return current;

  // Relative path
  return current === "/" ? `/${target}` : `${current}/${target}`;
};

export const SYSTEM_COMMANDS = {
  help: {
    description: "Show this menu",
    execute: (args, { addToHistory, registry }) => {
      addToHistory("info", "AVAILABLE COMMANDS:");
      Object.entries(registry).forEach(([name, def]) => {
        if (!def.hidden) {
          addToHistory("info", `${name.padEnd(12)} - ${def.description}`);
        }
      });
    },
  },

  clear: {
    description: "Clear terminal",
    execute: (args, { setHistory }) => {
      setHistory([]);
    },
  },

  whoami: {
    description: "Show current user",
    execute: (args, { addToHistory, user }) => {
      addToHistory("success", `USER: ${user?.email}`);
      addToHistory("success", `UUID: ${user?.id}`);
    },
  },

  panic: {
    description: "Trigger Kernel Panic",
    execute: (args, { addToHistory, setCrash }) => {
      addToHistory("system", "Initiating kernel dump...");
      setTimeout(() => {
        setCrash(true);
      }, 1000);
    },
  },
  pwd: {
    description: "Print working directory",
    execute: (args, { addToHistory, cwd }) => {
      addToHistory("user", cwd);
    },
  },

  ls: {
    description: "List directory contents",
    execute: (args, { addToHistory, cwd }) => {
      // Logic to find children of current cwd
      // Handle "ls /etc" vs just "ls"
      const targetPath = args[1] ? resolvePath(cwd, args[1]) : cwd;
      const dir = FILE_SYSTEM[targetPath];

      if (dir && dir.type === "dir") {
        // Format output neatly (columns or just space separated)
        addToHistory("user", dir.children.join("  "));
      } else {
        addToHistory(
          "error",
          `ls: cannot access '${targetPath}': No such file or directory`,
        );
      }
    },
  },

  cd: {
    description: "Change directory",
    execute: (args, { addToHistory, cwd, setCwd }) => {
      const target = args[1] || "/home/user"; // Default to home
      const newPath = resolvePath(cwd, target);

      if (FILE_SYSTEM[newPath] && FILE_SYSTEM[newPath].type === "dir") {
        setCwd(newPath);
      } else {
        addToHistory("error", `cd: ${target}: No such file or directory`);
      }
    },
  },

  cat: {
    description: "Concatenate and display file content",
    execute: (args, { addToHistory, cwd }) => {
      if (!args[1]) {
        addToHistory("error", "Usage: cat <filename>");
        return;
      }
      const target = resolvePath(cwd, args[1]);

      if (FILE_CONTENTS[target]) {
        // Display content (handles newlines)
        FILE_CONTENTS[target].split("\n").forEach((line) => {
          addToHistory("user", line);
        });
      } else if (FILE_SYSTEM[target] && FILE_SYSTEM[target].type === "dir") {
        addToHistory("error", `cat: ${args[1]}: Is a directory`);
      } else {
        addToHistory("error", `cat: ${args[1]}: No such file or directory`);
      }
    },
  },

  submit: {
    description: "Submit a flag",
    // 1. Destructure 'setSolvedIds' here
    execute: async (args, { addToHistory, user, solvedIds, setSolvedIds }) => {
      if (args.length < 2) {
        addToHistory("error", "Usage: submit <flag_string>");
        return;
      }

      const inputFlag = args.slice(1).join(" ").trim();
      const inputHash = await sha256(inputFlag);

      addToHistory("system", "Verifying hash signature...");

      // --- DYNAMIC CHECK START ---
      let matchedLevel = null;
      for (const level of LEVEL_CONFIG) {
        if (level.encryptedFlag) {
          const realFlag = decodeSecret(level.encryptedFlag);
          const realHash = await sha256(realFlag);
          if (realHash === inputHash) {
            matchedLevel = level;
            break;
          }
        }
      }
      // --- DYNAMIC CHECK END ---

      if (matchedLevel) {
        if (solvedIds && solvedIds.includes(matchedLevel.id)) {
          addToHistory(
            "warning",
            `Level ${matchedLevel.id} is already solved.`,
          );
          return;
        }

        if (user) {
          const { error } = await supabase.from("solved_puzzles").insert([
            {
              user_id: user.id,
              puzzle_id: matchedLevel.id,
              solved_at: new Date().toISOString(),
            },
          ]);

          if (error) {
            if (error.code === "23505") {
              addToHistory("success", "You have already solved this level!");
              // NO RELOAD NEEDED HERE
            } else {
              console.error("Supabase Error:", error);
              addToHistory("error", `Database Error: ${error.message}`);
            }
          } else {
            addToHistory(
              "success",
              `CORRECT! ${matchedLevel.title} Completed.`,
            );
            addToHistory("info", "Updating profile clearance...");

            // 2. UPDATE STATE INSTANTLY (No Reload)
            if (setSolvedIds) {
              setSolvedIds((prev) => [...prev, matchedLevel.id]);
            }
          }
        } else {
          addToHistory("success", `CORRECT! (Guest Mode)`);
          // Update local state for guests too so they can keep playing
          if (setSolvedIds) {
            setSolvedIds((prev) => [...prev, matchedLevel.id]);
          }
        }
      } else {
        addToHistory("error", "INCORRECT. Flag signature mismatch.");
      }
    },
  },

  dev_encode: {
    description: "Encode string to Hex",
    execute: (args, { addToHistory }) => {
      if (args.length < 2) {
        addToHistory("error", "Usage: dev_encode <string>");
        return;
      }
      // Rejoin args in case flag has spaces
      const text = args.slice(1).join(" ");
      const hex = encodeSecret(text);

      addToHistory("success", "ENCODED OUTPUT:");
      addToHistory("user", hex);
      addToHistory("info", "(Add this to 'encryptedFlag')");
    },
  },
};
