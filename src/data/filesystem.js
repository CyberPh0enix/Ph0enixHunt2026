// This file contains the PUBLIC file system structure.

export const FILE_SYSTEM = {
  "/": {
    type: "dir",
    children: ["home", "etc", "var", "bin", "usr", "tmp"],
  },
  "/home": {
    type: "dir",
    children: ["user"],
  },
  "/home/user": {
    type: "dir",
    children: [
      "Desktop",
      "Documents",
      "Downloads",
      "readme.txt",
      ".bash_history",
    ],
  },
  "/home/user/Desktop": {
    type: "dir",
    children: ["project_phoenix", "todo.md"],
  },
  // Fixed: Defined project_phoenix directory so 'cd' works
  "/home/user/Desktop/project_phoenix": {
    type: "dir",
    children: ["notes.txt", "assets"],
  },
  "/home/user/Desktop/project_phoenix/assets": {
    type: "dir",
    children: ["logo.png", "style.css"],
  },
  "/home/user/Documents": {
    type: "dir",
    children: ["report_final.pdf", "manifesto.txt"],
  },
  "/home/user/Downloads": {
    type: "dir",
    children: ["installer.sh", "suspicious_file.zip"],
  },
  "/etc": {
    type: "dir",
    children: ["passwd", "shadow", "hosts", "resolv.conf"],
  },
  "/var": {
    type: "dir",
    children: ["log", "www", "backups"],
  },
  "/var/log": {
    type: "dir",
    children: ["syslog", "auth.log", "kern.log"],
  },
  "/var/backups": {
    type: "dir",
    children: [],
  },
  "/bin": {
    type: "dir",
    children: ["ls", "cd", "cat", "pwd", "netstat", "fetch", "grep"],
  },
  "/tmp": {
    type: "dir",
    children: ["sess_a1b2c3d4"],
  },
};

export const FILE_CONTENTS = {
  // --- HOME DIRECTORY ---
  "/home/user/readme.txt":
    "Welcome to Ph0enixOS v1.0.\nRemember to check your backups regularly.\n- SysAdmin",

  "/home/user/.bash_history":
    "sudo apt update\nsudo apt install net-tools\nssh root@192.168.1.5\n# rm -rf /var/backups/passwords.old\nwhoami\nexit",

  "/home/user/Desktop/todo.md":
    "- Fix kernel panic bug\n- Update firewall rules\n- Buy more coffee",
  "/home/user/Desktop/project_phoenix/notes.txt":
    "Project Ph0enix is a go.\nTarget launch: Feb 2026.\nAssets are in the folder.",

  "/home/user/Documents/manifesto.txt":
    "Information wants to be free.\nWe are the Ph0enix.",

  "/home/user/Downloads/installer.sh":
    "#!/bin/bash\necho 'Installing malware... just kidding.'\necho 'Do not run scripts from unknown sources.'",

  // --- SYSTEM FILES ---
  "/etc/passwd":
    "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash\nguest:x:1001:1001:guest:/home/guest:/bin/sh",
  "/etc/hosts":
    "127.0.0.1\tlocalhost\n127.0.0.1\tcorpnet.internal\n192.168.1.5\tdatabase_server",
  "/etc/resolv.conf": "nameserver 8.8.8.8\nnameserver 1.1.1.1",

  // --- LOGS ---
  "/var/log/auth.log":
    "Feb 17 10:00:01 ph0enix sshd[1234]: Failed password for root from 192.168.1.50\nFeb 17 10:05:22 ph0enix sudo: user : TTY=pts/0 ; PWD=/home/user ; USER=root ; COMMAND=/usr/bin/apt update",
  "/var/log/syslog":
    "Feb 17 09:00:00 ph0enix systemd[1]: Starting System Logging Service...",
  "/var/log/kern.log":
    "Feb 17 09:00:02 ph0enix kernel: [    0.000000] Linux version 6.9.1-hardened (root@buildserver) (gcc version 12.2.0 (Debian 12.2.0-14)) #1 SMP PREEMPT_DYNAMIC Mon Feb 17 09:00:00 UTC 2026",
};
