import { supabase } from "../lib/supabase";
import { FILE_SYSTEM, FILE_CONTENTS } from "./filesystem";

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
        addToHistory("info", `${name.padEnd(12)} - ${def.description}`);
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
    description: "Submit a capture flag",
    execute: async (args, { addToHistory }) => {
      if (args.length < 3) {
        addToHistory("error", "USAGE: submit <level-id> <flag>");
        return;
      }
      const puzzleId = args[1];
      const flagAttempt = args[2];

      addToHistory("system", "Verifying hash signature...");

      try {
        const { data, error } = await supabase.rpc("submit_flag", {
          puzzle_id_input: puzzleId,
          flag_input: flagAttempt,
        });

        if (error) throw error;

        if (data === true) {
          addToHistory("success", "ACCESS GRANTED. Flag accepted.");
          addToHistory(
            "success",
            "Points have been transferred to your profile.",
          );
        } else {
          addToHistory(
            "error",
            "ACCESS DENIED. Invalid flag or already solved.",
          );
        }
      } catch (err) {
        addToHistory("error", `SYSTEM ERROR: ${err.message}`);
      }
    },
  },
};
