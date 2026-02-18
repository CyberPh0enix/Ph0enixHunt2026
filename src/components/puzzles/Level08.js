import { FILE_SYSTEM, FILE_CONTENTS } from "../../data/filesystem";

// OBFUSCATED (Hex Encoded)
const PART_1 = "\x66\x6c\x61\x67\x7b"; // "flag{"
const PART_2 = "\x66\x69\x6c\x65\x5f\x73\x79\x73\x74\x65\x6d\x73"; // "file_systems"
const PART_3 = "\x5f\x73\x74\x6f\x72\x65\x5f\x73\x65\x63\x72\x65\x74\x73\x7d"; // "_store_secrets}"

const HIDDEN_FLAG = `${PART_1}${PART_2}${PART_3}`;

// We add "chaff" (fake data) so the user is forced to use grep or read carefully.
const SECRET_FILE_CONTENT = `
# SYSTEM BACKUP CONFIGURATION
# Created: 2026-02-14
[database]
host=localhost
port=5432
user=admin
# password=... (redacted)

[legacy_systems]
# Old keys from the 2025 migration
server_key_1: A8F9-22K1-00L2
server_key_2: B2J1-99L0-11M3

# SECURITY AUDIT LOG
# ------------------
# CRITICAL: Found unencrypted flag in memory dump
recovered_data: ${HIDDEN_FLAG}
# Action: Please rotate keys immediately.
`;

// 3. AUTO-INJECTION FUNCTION
// This runs immediately when the module is imported by the game engine.
const injectLevelData = () => {
  const backupPath = "/var/backups";
  const logPath = "/var/log/syslog";
  const secretFile = "passwords.old";

  // A. Inject the Secret File
  if (
    FILE_SYSTEM[backupPath] &&
    !FILE_SYSTEM[backupPath].children.includes(secretFile)
  ) {
    FILE_SYSTEM[backupPath].children.push(secretFile);
    FILE_CONTENTS[`${backupPath}/${secretFile}`] = SECRET_FILE_CONTENT;
  }

  // B. Inject the Hint into System Logs
  // This is the "Breadcrumb" the user must find.
  const hintLog = `
Feb 17 10:15:00 ph0enix kernel: [sdc] Attached SCSI removable disk
Feb 17 10:15:01 ph0enix systemd[1]: Mounted /var/backups (read-only)
Feb 17 10:15:05 ph0enix kernel: [sdc] Write Protect is on.
`;

  if (
    FILE_CONTENTS[logPath] &&
    !FILE_CONTENTS[logPath].includes("Mounted /var/backups")
  ) {
    FILE_CONTENTS[logPath] += hintLog;
  }
};

// Execute Injection Immediately
injectLevelData();

export const level08Commands = {
  grep: {
    description: "Search for patterns in files (usage: grep <text> <file>)",
    execute: (args, { addToHistory, cwd }) => {
      if (args.length < 3) {
        addToHistory("error", "Usage: grep <pattern> <filename>");
        return;
      }

      const pattern = args[1];
      const filename = args[2];

      // Basic Path Resolution (Same logic as commands.js)
      const fullPath = filename.startsWith("/")
        ? filename
        : cwd === "/"
          ? `/${filename}`
          : `${cwd}/${filename}`;

      const content = FILE_CONTENTS[fullPath];

      if (!content) {
        // Check if it's a directory
        if (FILE_SYSTEM[fullPath]) {
          addToHistory("error", `grep: ${filename}: Is a directory`);
        } else {
          addToHistory("error", `grep: ${filename}: No such file`);
        }
        return;
      }

      // Search Logic
      const lines = content.split("\n");
      const matches = lines.filter((line) => line.includes(pattern));

      if (matches.length > 0) {
        matches.forEach((match) => addToHistory("success", match.trim()));
      } else {
        addToHistory("info", "No matches found.");
      }
    },
  },
};
