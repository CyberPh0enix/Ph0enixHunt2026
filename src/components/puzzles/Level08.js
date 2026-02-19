import { FILE_SYSTEM, FILE_CONTENTS } from "../../data/filesystem";
import { getLevelFlag } from "../../utils/game";

const RAW_FLAG = getLevelFlag("level-08");

// Generate a mathematically perfect, uniform hex dump
const generateHexDump = (flagStr) => {
  const bytesPerLine = 48; // Wide format ensures the flag fits on a single line
  const totalLines = 30;
  const totalBytes = bytesPerLine * totalLines;
  const buffer = new Uint8Array(totalBytes);

  // 1. Fill the buffer with realistic memory noise
  for (let i = 0; i < totalBytes; i++) {
    // 60% chance of non-printable chars (dots), 40% chance of random ASCII noise
    const isPrintable = Math.random() > 0.6;
    buffer[i] = isPrintable
      ? 33 + Math.floor(Math.random() * 93)
      : Math.floor(Math.random() * 256);
  }

  // 2. Inject the flag seamlessly into the byte array
  const injectLine = 15; // Put it right in the middle
  const injectStart = injectLine * bytesPerLine + 5; // Offset it slightly from the start of the line

  for (let i = 0; i < flagStr.length; i++) {
    buffer[injectStart + i] = flagStr.charCodeAt(i);
  }

  // 3. Format the buffer into strict, fixed-width rows
  let dump = "";
  for (let i = 0; i < totalLines; i++) {
    const address = `0x${(8048000 + i * bytesPerLine).toString(16).toUpperCase().padStart(8, "0")}`;
    let hexPart = "";
    let asciiPart = "";

    for (let j = 0; j < bytesPerLine; j++) {
      const b = buffer[i * bytesPerLine + j];

      // Pad hex to 2 chars (e.g., 'A' -> '0A')
      hexPart += b.toString(16).padStart(2, "0").toUpperCase() + " ";

      // Render ASCII if printable, otherwise render a dot
      asciiPart += b >= 32 && b <= 126 ? String.fromCharCode(b) : ".";
    }

    dump += `${address}  ${hexPart} |${asciiPart}|\n`;
  }

  return dump;
};

const injectLevelData = () => {
  const crashDir = "/var/crash";
  const logPath = "/var/log/kern.log";
  const secretFile = "core.sys.1092.dmp";

  if (!FILE_SYSTEM[crashDir]) {
    FILE_SYSTEM["/var"].children.push("crash");
    FILE_SYSTEM[crashDir] = { type: "dir", children: [secretFile] };

    // Inject the perfectly formatted binary dump
    FILE_CONTENTS[`${crashDir}/${secretFile}`] =
      `[BINARY_DATA_CORRUPTION_PREVENTION]\n${generateHexDump(RAW_FLAG)}`;
  }

  const hintLog = `\nFeb 17 11:22:14 ph0enix kernel: [ 4123.456] traps: secure_vault[1092] general protection fault ip:7f8b9c sp:7ffe3e error:0 in libc.so.6\nFeb 17 11:22:15 ph0enix systemd-coredump[1093]: Process 1092 (secure_vault) dumped core.\nFeb 17 11:22:15 ph0enix systemd-coredump[1093]: Core file saved to /var/crash/core.sys.1092.dmp`;

  if (
    FILE_CONTENTS[logPath] &&
    !FILE_CONTENTS[logPath].includes("dumped core")
  ) {
    FILE_CONTENTS[logPath] += hintLog;
  }
};

injectLevelData();

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

          // Highlights the matched word
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
