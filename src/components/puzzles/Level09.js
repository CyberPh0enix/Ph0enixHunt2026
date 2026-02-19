import { createFile, FILE_SYSTEM } from "../../data/filesystem";
import { getLevelFlag } from "../../utils/game";

const RAW_FLAG = getLevelFlag("level-09");

const injectLevelData = () => {
  if (!FILE_SYSTEM["/opt/exploit.bin"]) {
    // GENUINE FILE
    createFile(
      "/opt/exploit.bin",
      `[BINARY_DATA_CORRUPTION_PREVENTION]\n0x7FELF010101000000000000000000... [COMPILED_GARBAGE]`,
      "root",
      "-rw-r--r--", // ro
    );

    // DECOY FILES
    createFile(
      "/opt/cleanup.sh",
      `#!/bin/bash\nrm -rf /tmp/*\necho "Temporary files cleared."`,
      "root",
      "-rwxr-xr-x",
    );
    createFile(
      "/opt/monitor.bin",
      `[BINARY_DATA_CORRUPTION_PREVENTION]\n0x7FELF... [SYSTEM_MONITOR_DAEMON_v1.4]`,
      "root",
      "-rwxr-xr-x",
    );
    createFile(
      "/opt/legacy_exploit.sh",
      `#!/bin/bash\n# Deprecated in v2.0.\n# The new override payload has been compiled into a binary format to prevent tampering.\nexit 1`,
      "root",
      "-rw-r--r--",
    );
  }
};
injectLevelData();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const level09Commands = {
  "./exploit.bin": {
    description: "Execute binary",
    hidden: true,
    execute: async (args, { addToHistory, cwd }) => {
      if (cwd !== "/opt") {
        addToHistory("error", `bash: ./exploit.bin: No such file or directory`);
        return;
      }

      const fileMeta = FILE_SYSTEM["/opt/exploit.bin"];

      if (!fileMeta.perms.includes("x")) {
        addToHistory("error", `bash: ./exploit.bin: Permission denied`);
        return;
      }

      addToHistory("system", "[+] Executing local override payload...");
      await sleep(400);
      addToHistory("info", "Loading memory offsets... OK");
      await sleep(300);
      addToHistory("info", "Decrypting payload... OK");
      await sleep(600);
      addToHistory("warning", "ROOT_SHELL_INJECTION_SUCCESSFUL");
      addToHistory("success", `>> PAYLOAD EXTRACTED: ${RAW_FLAG} <<`);
    },
  },
};
