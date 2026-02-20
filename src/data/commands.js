import { supabase } from "../lib/supabase";
import { FILE_SYSTEM, FILE_CONTENTS } from "./filesystem";
import { encodeSecret, decodeSecret } from "../utils/crypto";
import { LEVEL_CONFIG } from "./config"; // Import your config
import { SensoryEngine } from "../utils/sensory";

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
    hidden: true,
    description: "Show current user",
    execute: (args, { addToHistory, user }) => {
      addToHistory("success", `USER: ${user?.email}`);
      addToHistory("success", `UUID: ${user?.id}`);
    },
  },

  panic: {
    hidden: true,
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
      // Parse Flags
      const flags = args
        .filter((a) => a.startsWith("-"))
        .join("")
        .replace(/-/g, "");
      const isLong = flags.includes("l");
      const isAll = flags.includes("a");

      const targetArg = args.find((a) => a !== "ls" && !a.startsWith("-"));
      const targetPath = targetArg ? resolvePath(cwd, targetArg) : cwd;

      const dir = FILE_SYSTEM[targetPath];

      if (dir && dir.type === "dir") {
        let items = dir.children.filter(
          (child) => isAll || !child.startsWith("."),
        );

        if (isLong) {
          addToHistory("system", `total ${items.length * 4}`);
          items.forEach((child) => {
            const childPath =
              targetPath === "/" ? `/${child}` : `${targetPath}/${child}`;
            const meta = FILE_SYSTEM[childPath];
            if (meta) {
              const size = meta.size || 4096;
              const sizeStr = size.toString().padStart(5, " ");
              addToHistory(
                "info",
                `${meta.perms} 1 ${meta.owner.padEnd(4, " ")} ${meta.owner.padEnd(4, " ")} ${sizeStr} ${meta.date} ${child}`,
              );
            }
          });
        } else {
          addToHistory("user", items.join("  "));
        }
      } else if (dir && dir.type === "file") {
        addToHistory("user", targetArg); // Just print the file name if they ls a file
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
      if (!args[1]) return addToHistory("error", "Usage: cat <filename>");
      const target = resolvePath(cwd, args[1]);
      const meta = FILE_SYSTEM[target];

      if (meta && meta.type === "file") {
        const content = FILE_CONTENTS[target];
        // The safety block is removed. If they cat a binary, they get the raw garbage!
        content.split("\n").forEach((line) => addToHistory("info", line));
      } else if (meta && meta.type === "dir") {
        addToHistory("error", `cat: ${args[1]}: Is a directory`);
      } else {
        addToHistory("error", `cat: ${args[1]}: No such file or directory`);
      }
    },
  },

  chmod: {
    description: "Change file mode bits (permissions)",
    execute: (args, { addToHistory, cwd }) => {
      if (args.length < 3) {
        addToHistory("error", "Usage: chmod <permissions> <filename>");
        return;
      }

      const perms = args[1];
      const filename = args[2];
      const target = resolvePath(cwd, filename);
      const meta = FILE_SYSTEM[target];

      if (meta) {
        if (meta.type === "dir") {
          addToHistory(
            "error",
            `chmod: changing permissions of '${filename}': Operation not permitted`,
          );
          return;
        }

        if (perms === "+x") {
          // Flip the execute bits: -rw-r--r-- -> -rwxr-xr-x
          meta.perms = meta.perms.replace(/-/g, (match, offset) =>
            offset === 3 || offset === 6 || offset === 9 ? "x" : match,
          );
        } else {
          // Simplified fallback for numeric or other mods for now
          addToHistory("system", `Permissions updated for ${filename}`);
        }
      } else {
        addToHistory(
          "error",
          `chmod: cannot access '${filename}': No such file or directory`,
        );
      }
    },
  },

  submit: {
    description: "Submit a flag",
    execute: async (
      args,
      {
        addToHistory,
        user,
        profile,
        refreshProfile,
        solvedIds,
        setSolvedIds,
        skippedIds,
      },
    ) => {
      if (args.length < 2) {
        addToHistory("error", "Usage: submit <flag_string>");
        return;
      }

      const inputFlag = args.slice(1).join(" ").trim();
      const inputHash = await sha256(inputFlag);
      addToHistory("system", "Verifying hash signature...");

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

          if (error && error.code !== "23505") {
            addToHistory("error", `Database Error: ${error.message}`);
          } else {
            // Smart Rewards & Animations
            const isPostBypass =
              skippedIds && skippedIds.includes(matchedLevel.id);
            const rewardCR = isPostBypass ? 25 : 100;
            const rewardXP = isPostBypass ? 25 : 100;

            if (profile) {
              const newCredits = (profile.credits || 0) + rewardCR;
              const newScore = (profile.score || 0) + rewardXP;
              await supabase
                .from("profiles")
                .update({ credits: newCredits, score: newScore })
                .eq("id", user.id);
              if (refreshProfile) await refreshProfile(user.id);
            }

            SensoryEngine.playSuccess();
            addToHistory(
              "success",
              `CORRECT! ${matchedLevel.title} Completed.`,
              { animate: "decrypt" },
            );

            if (isPostBypass) {
              addToHistory(
                "warning",
                `PENALTY APPLIED: Partial Reward (+${rewardCR} cR / +${rewardXP} XP) due to prior bypass.`,
                { animate: "decrypt" },
              );
            } else {
              addToHistory(
                "info",
                `REWARD: +${rewardCR} cR / +${rewardXP} XP`,
                { animate: "decrypt" },
              );
            }

            if (setSolvedIds)
              setSolvedIds((prev) => [...prev, matchedLevel.id]);
          }
        } else {
          SensoryEngine.playSuccess();
          addToHistory("success", `CORRECT! (Guest Mode)`, {
            animate: "decrypt",
          });
          if (setSolvedIds) setSolvedIds((prev) => [...prev, matchedLevel.id]);
        }
      } else {
        SensoryEngine.playError();
        addToHistory("error", "INCORRECT. Flag signature mismatch.");
      }
    },
  },

  encode: {
    hidden: true,
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
