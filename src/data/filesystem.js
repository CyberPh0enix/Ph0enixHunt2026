export const FILE_SYSTEM = {};
export const FILE_CONTENTS = {};

// --- VFS BUILDER ENGINE ---
export const createDir = (
  path,
  owner = "root",
  perms = "drwxr-xr-x",
  date = "Feb 19 09:00",
) => {
  FILE_SYSTEM[path] = { type: "dir", owner, perms, date, children: [] };

  if (path !== "/") {
    const parts = path.split("/");
    const name = parts.pop();
    const parentPath = parts.join("/") || "/";
    if (
      FILE_SYSTEM[parentPath] &&
      !FILE_SYSTEM[parentPath].children.includes(name)
    ) {
      FILE_SYSTEM[parentPath].children.push(name);
    }
  }
};

export const createFile = (
  path,
  content,
  owner = "root",
  perms = "-rw-r--r--",
  date = "Feb 19 09:05",
) => {
  FILE_CONTENTS[path] = content;
  FILE_SYSTEM[path] = {
    type: "file",
    owner,
    perms,
    date,
    size: content.length,
  };

  const parts = path.split("/");
  const name = parts.pop();
  const parentPath = parts.join("/") || "/";
  if (
    FILE_SYSTEM[parentPath] &&
    !FILE_SYSTEM[parentPath].children.includes(name)
  ) {
    FILE_SYSTEM[parentPath].children.push(name);
  }
};

// MOUNT BASE DIRECTORIES
[
  "/",
  "/home",
  "/home/user",
  "/home/user/Desktop",
  "/home/user/Documents",
  "/home/user/Downloads",
  "/home/user/.ssh",
  "/etc",
  "/etc/ssh",
  "/etc/nginx",
  "/etc/cron.d",
  "/etc/vpn",
  "/var",
  "/var/log",
  "/var/log/nginx",
  "/var/backups",
  "/var/www",
  "/var/www/html",
  "/bin",
  "/usr",
  "/usr/bin",
  "/tmp",
  "/opt",
].forEach((dir) => {
  const owner = dir.includes("/home/user") ? "user" : "root";
  createDir(dir, owner);
});

// -- DUMMY FILES & DECOYS ---

// HOME DIR
createFile(
  "/home/user/readme.txt",
  "Welcome to Ph0enixOS v2.0.\nRemember to lock your terminal.\n- SysAdmin",
  "user",
);
createFile(
  "/home/user/.bash_history",
  "ping 8.8.8.8\nsudo apt update\nssh root@10.99.0.42\nls -la /opt\nwhoami\nexit",
  "user",
  "-rw-------",
);
createFile(
  "/home/user/Desktop/todo.md",
  "- Patch the Nginx server\n- Investigate the core dumps in /var/crash\n- Tell the devs to stop leaving permissions open on /opt scripts!",
  "user",
);
createFile(
  "/home/user/Documents/passwords.txt",
  "Bank: hunter2\nEmail: password123\nFlag: flag{nice_try_but_this_is_a_decoy}",
  "user",
  "-rw-------",
);
createFile(
  "/home/user/.ssh/id_rsa",
  "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAw...\n[ENCRYPTED_KEY_BLOCK]\n-----END RSA PRIVATE KEY-----",
  "user",
  "-rw-------",
);

// ETC
createFile(
  "/etc/passwd",
  "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash\nguest:x:1001:1001:guest:/home/guest:/bin/sh",
);
createFile(
  "/etc/shadow",
  "root:$6$xyz123$abc...:18600:0:99999:7:::\nuser:$6$qwe456$def...:18600:0:99999:7:::",
  "root",
  "-rw-------",
);
createFile(
  "/etc/hosts",
  "127.0.0.1\tlocalhost\n127.0.1.1\tph0enix\n10.99.0.42\tph0enix-vpn-node",
);
createFile(
  "/etc/vpn/client.conf",
  "client\ndev tun\nproto udp\nremote 10.99.0.42 1194\nresolv-retry infinite\nnobind\npersist-key\npersist-tun",
);
createFile(
  "/etc/nginx/nginx.conf",
  "user www-data;\nworker_processes auto;\npid /run/nginx.pid;\ninclude /etc/nginx/modules-enabled/*.conf;\n\nevents {\n\tworker_connections 768;\n}\nhttp {\n\t# access_log /var/log/nginx/access.log;\n}",
);

// VAR
createFile(
  "/var/www/html/index.html",
  "<!DOCTYPE html>\n<html>\n<head>\n<title>Welcome to nginx!</title>\n</head>\n<body>\n<h1>If you see this page, the nginx web server is successfully installed.</h1>\n</body>\n</html>",
);
createFile(
  "/var/log/syslog",
  "Feb 19 09:00:00 ph0enix systemd[1]: Starting System Logging Service...\nFeb 19 09:01:12 ph0enix systemd[1]: Started Nginx Web Server.",
);
createFile(
  "/var/log/auth.log",
  "Feb 19 10:00:01 ph0enix sshd[1234]: Failed password for root from 192.168.1.50\nFeb 19 10:02:14 ph0enix sshd[1255]: Accepted publickey for user from 192.168.1.103",
);
createFile(
  "/var/log/nginx/access.log",
  '192.168.1.50 - - [19/Feb/2026:10:15:32 +0000] "GET / HTTP/1.1" 200 612 "-" "Mozilla/5.0"\n192.168.1.50 - - [19/Feb/2026:10:16:01 +0000] "GET /admin HTTP/1.1" 403 153 "-" "curl/7.68.0"',
);
createFile(
  "/var/log/nginx/error.log",
  '2026/02/19 10:16:01 [error] 801#801: *1 open() "/var/www/html/admin" failed (2: No such file or directory)',
);

// TMP (Random garbage)
createFile(
  "/tmp/sess_a1b2c3d4",
  'php_session_data: a:2:{s:4:"role";s:5:"guest";s:2:"id";i:492;}',
);

// Simulated Binaries
[
  "ls",
  "cd",
  "cat",
  "pwd",
  "netstat",
  "grep",
  "chmod",
  "submit",
  "nmap",
  "ssh",
  "sudo",
  "echo",
].forEach((bin) => {
  createFile(
    `/bin/${bin}`,
    "[ELF_BINARY]\n0x7F454C46020101000000000000000000\n02003E0001000000...",
    "root",
    "-rwxr-xr-x",
  );
});
