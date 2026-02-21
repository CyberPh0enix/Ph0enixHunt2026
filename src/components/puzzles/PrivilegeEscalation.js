import { createFile, FILE_SYSTEM, FILE_CONTENTS } from "../../data/filesystem";
import { getLevelFlag } from "../../utils/game";

const RAW_FLAG = getLevelFlag("privilege-escalation");

const injectLevelData = () => {
  // vulnerable backup file with the reused password
  if (!FILE_SYSTEM["/var/backups/config.php.bak"]) {
    createFile(
      "/var/backups/config.php.bak",
      "<?php\n// DEV NOTE: Reverting to old DB credentials temporarily.\n$DB_HOST = 'localhost';\n$DB_USER = 'root';\n$DB_PASS = 'n1ghtsh4d3_r00t';\n?>",
      "root",
      "-rw-r--r--",
    );

    // decoy backup file
    createFile(
      "/var/backups/syslog.bak",
      "Feb 18 00:00:00 ph0enix logrotate: syslog rotated. No errors.",
      "root",
      "-rw-r--r--",
    );
  }

  // update the todo.md to add breadcrumb
  const todoPath = "/home/user/Desktop/todo.md";
  if (FILE_CONTENTS[todoPath] && !FILE_CONTENTS[todoPath].includes("backups")) {
    FILE_CONTENTS[todoPath] +=
      "\n- URGENT: Clear old config files from /var/backups! Production credentials are exposed!";
  }
};

injectLevelData();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const privilegeEscalationCommands = {
  su: {
    description: "Change user or become superuser",
    execute: async (args, { addToHistory }) => {
      if (!args[1]) {
        addToHistory("error", "Usage: su <user>");
        return;
      }

      if (args[1] !== "root") {
        addToHistory(
          "error",
          `su: user ${args[1]} does not exist or access denied`,
        );
        return;
      }

      // Simulate the missing TTY reverse-shell error
      if (!args[2]) {
        addToHistory("error", "su: must be run from a terminal");
        addToHistory(
          "warning",
          "[SHELL_ENV_VARS]: No interactive TTY detected.",
        );
        addToHistory(
          "info",
          "Hint: In reverse shell,we pass auth directly in args",
        );
        return;
      }

      if (args[2] !== "n1ghtsh4d3_r00t") {
        addToHistory("error", "su: Authentication failure");
        return;
      }

      // SUCCESS SEQUENCE
      addToHistory("system", "Authenticating...");
      await sleep(500);
      addToHistory("success", "Authentication successful.");
      addToHistory("system", "Upgrading shell privileges to UID 0 (root)...");
      await sleep(600);
      addToHistory("warning", "ROOT PRIVILEGES ACQUIRED. SYSTEM COMPROMISED.");
      addToHistory("success", `>> FINAL ACT 2 FLAG: ${RAW_FLAG} <<`);
    },
  },
};
