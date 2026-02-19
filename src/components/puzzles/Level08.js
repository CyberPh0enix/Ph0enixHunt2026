import {
  FILE_SYSTEM,
  FILE_CONTENTS,
  createDir,
  createFile,
} from "../../data/filesystem";
import { getLevelFlag } from "../../utils/game";

const RAW_FLAG = getLevelFlag("level-08");

// Hex dump
const generateSafeHexDump = () => {
  const bytesPerLine = 48;
  const totalLines = 30;
  const totalBytes = bytesPerLine * totalLines;
  const buffer = new Uint8Array(totalBytes);

  for (let i = 0; i < totalBytes; i++) {
    const isPrintable = Math.random() > 0.6;
    buffer[i] = isPrintable
      ? 33 + Math.floor(Math.random() * 93)
      : Math.floor(Math.random() * 256);
  }

  let dump = "";
  for (let i = 0; i < totalLines; i++) {
    const address = `0x${(8048000 + i * bytesPerLine).toString(16).toUpperCase().padStart(8, "0")}`;
    let hexPart = "";
    let asciiPart = "";

    for (let j = 0; j < bytesPerLine; j++) {
      const b = buffer[i * bytesPerLine + j];
      hexPart += b.toString(16).padStart(2, "0").toUpperCase() + " ";
      asciiPart += b >= 32 && b <= 126 ? String.fromCharCode(b) : ".";
    }
    dump += `${address}  ${hexPart} |${asciiPart}|\n`;
  }
  return dump;
};

const injectLevelData = () => {
  if (!FILE_SYSTEM["/var/crash"]) {
    createDir("/var/crash", "root", "drwxr-xr-x");

    createFile(
      "/var/crash/core.sys.1092.dmp",
      `[BINARY_DATA_CORRUPTION_PREVENTION]\n${generateSafeHexDump()}`,
      "root",
      "-rw-r--r--",
    );

    createFile(
      "/var/crash/core.sys.0841.dmp",
      `[BINARY_DATA_CORRUPTION_PREVENTION]\n${generateSafeHexDump()}`,
      "root",
      "-rw-r--r--",
    );
    createFile(
      "/var/crash/core.sys.2044.dmp",
      `[BINARY_DATA_CORRUPTION_PREVENTION]\n0x7F454C460201010000... Segfault at 0x0000000000000000`,
      "root",
      "-rw-r--r--",
    );
    createFile(
      "/var/crash/crash_report.txt",
      "Analysis: secure_vault segfaulted due to an unchecked buffer. Core dumped to process 1092.\nNote: Other memory dumps in this directory are from legacy systems and contain junk data.",
      "root",
      "-rw-r--r--",
    );
  }

  const hintLog = `\nFeb 19 11:22:14 ph0enix kernel: [ 4123.456] traps: secure_vault[1092] general protection fault\nFeb 19 11:22:15 ph0enix systemd-coredump[1093]: Process 1092 (secure_vault) dumped core.\nFeb 19 11:22:15 ph0enix systemd-coredump[1093]: Core file saved to /var/crash/core.sys.1092.dmp`;

  if (
    FILE_CONTENTS["/var/log/kern.log"] &&
    !FILE_CONTENTS["/var/log/kern.log"].includes("dumped core")
  ) {
    FILE_CONTENTS["/var/log/kern.log"] += hintLog;
  }
};

injectLevelData();

// 2. The Dynamic Generator: Builds the flag line on-the-fly when grepped
const generateDynamicFlagLine = (pattern) => {
  const bytesPerLine = 48;
  const buffer = new Uint8Array(bytesPerLine);
  for (let i = 0; i < bytesPerLine; i++) {
    buffer[i] =
      Math.random() > 0.6
        ? 33 + Math.floor(Math.random() * 93)
        : Math.floor(Math.random() * 256);
  }

  const injectStart = 5;
  for (let i = 0; i < RAW_FLAG.length; i++) {
    buffer[injectStart + i] = RAW_FLAG.charCodeAt(i);
  }

  let hexPart = "";
  let asciiPart = "";
  for (let j = 0; j < bytesPerLine; j++) {
    const b = buffer[j];
    hexPart += b.toString(16).padStart(2, "0").toUpperCase() + " ";
    asciiPart += b >= 32 && b <= 126 ? String.fromCharCode(b) : ".";
  }

  const address = "0x080482D0";
  const rawLine = `${address}  ${hexPart} |${asciiPart}|`;
  return rawLine.replace(new RegExp(`(${pattern})`, "gi"), `>>$1<<`);
};

export const level08Commands = {
  grep: {
    description: "Search for patterns in files",
    execute: (args, { addToHistory, cwd }) => {
      if (args.length < 3) {
        addToHistory("error", "Usage: grep <pattern> <filename>");
        return;
      }

      const pattern = args[1];
      const filename = args[2];
      const fullPath = filename.startsWith("/")
        ? filename
        : cwd === "/"
          ? `/${filename}`
          : `${cwd}/${filename}`;

      // THE BULLETPROOF INTERCEPTOR
      if (
        fullPath === "/var/crash/core.sys.1092.dmp" &&
        (pattern.toLowerCase() === "flag" || RAW_FLAG.includes(pattern))
      ) {
        addToHistory("success", generateDynamicFlagLine(pattern));
        return;
      }

      // Standard grep fallback for normal files
      const content = FILE_CONTENTS[fullPath];
      if (!content) {
        if (FILE_SYSTEM[fullPath]) {
          addToHistory("error", `grep: ${filename}: Is a directory`);
        } else {
          addToHistory("error", `grep: ${filename}: No such file or directory`);
        }
        return;
      }

      const lines = content.split("\n");
      const matches = lines.filter((line) => line.includes(pattern));

      if (matches.length > 0) {
        matches.forEach((match) => {
          if (match.includes("[BINARY_DATA")) return;
          const highlightedMatch = match.replace(
            new RegExp(`(${pattern})`, "g"),
            `>>$1<<`,
          );
          addToHistory("success", highlightedMatch.trim());
        });
      } else {
        addToHistory("system", `grep: no matches found for '${pattern}'`);
      }
    },
  },
};
