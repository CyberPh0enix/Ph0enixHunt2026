import { getLevelFlag } from "../../utils/game";

const RAW_FLAG = getLevelFlag("level-07");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const level07Commands = {
  netstat: {
    description:
      "Print network connections, routing tables, and interface statistics",
    execute: async (args, { addToHistory }) => {
      addToHistory(
        "system",
        "Active Internet connections (servers and established)",
      );
      addToHistory(
        "system",
        "Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name",
      );
      await sleep(200);

      // The "Noise" - Normal server traffic
      const traffic = [
        "tcp        0      0 0.0.0.0:80              0.0.0.0:* LISTEN      801/nginx: master",
        "tcp        0      0 0.0.0.0:443             0.0.0.0:* LISTEN      801/nginx: master",
        "tcp        0      0 127.0.0.1:5432          0.0.0.0:* LISTEN      943/postgres",
        "tcp        0      0 127.0.0.1:6379          0.0.0.0:* LISTEN      882/redis-server",
        "tcp        0      0 192.168.1.5:22          192.168.1.50:41238      ESTABLISHED 1024/sshd: root",
        "tcp        0      0 192.168.1.5:22          192.168.1.103:55312     ESTABLISHED 1055/sshd: root",
        "tcp6       0      0 :::80                   :::* LISTEN      801/nginx: master",
        "udp        0      0 0.0.0.0:68              0.0.0.0:* 712/dhclient",
        "udp        0      0 127.0.0.53:53           0.0.0.0:* 689/systemd-resolve",
      ];

      for (const line of traffic) {
        addToHistory("info", line);
        await sleep(50);
      }

      // The Anomaly - A hidden VPN/Docker subnet (10.99.0.42)
      await sleep(400);
      addToHistory(
        "warning",
        "tcp        0      0 10.99.0.42:31337        0.0.0.0:* LISTEN      -[unassigned]-",
      );
      addToHistory(
        "info",
        "tcp        0     64 192.168.1.5:22          192.168.1.50:44322      ESTABLISHED 1088/sshd: user",
      );
    },
  },

  nmap: {
    description: "Network exploration & security auditing",
    execute: async (args, { addToHistory }) => {
      if (args.length < 2) {
        addToHistory("error", "Usage: nmap <target_ip>");
        return;
      }
      const target = args[1];

      addToHistory(
        "system",
        `Starting Nmap 7.93 ( https://nmap.org ) at ${new Date().toISOString()}`,
      );

      // Simulate network probing delay
      await sleep(600);

      // If they scan the generic localhost, they just see normal ports
      if (
        target === "localhost" ||
        target === "127.0.0.1" ||
        target === "192.168.1.5"
      ) {
        addToHistory("info", `Nmap scan report for ${target}`);
        addToHistory("success", `Host is up (0.00013s latency).`);
        addToHistory("system", "PORT     STATE SERVICE");
        await sleep(100);
        addToHistory("success", "22/tcp   open  ssh");
        addToHistory("success", "80/tcp   open  http");
        addToHistory("success", "443/tcp  open  https");
        addToHistory(
          "system",
          `Nmap done: 1 IP address scanned in 0.42 seconds`,
        );
      }
      // If they find the exact anomalous IP from netstat
      else if (target === "10.99.0.42") {
        addToHistory(
          "info",
          `Nmap scan report for vpn-node-alpha (10.99.0.42)`,
        );
        addToHistory("success", `Host is up (0.042s latency).`);
        addToHistory("system", "PORT      STATE SERVICE  VERSION");
        await sleep(400);
        addToHistory(
          "warning",
          "31337/tcp open  elite    Ph0enix Backdoor v2.1",
        );

        // Simulate an Nmap script engine (NSE) pulling the banner
        await sleep(800);
        addToHistory("system", "| banner: SYSTEM COMPROMISED.");
        addToHistory("system", `|_payload: ${RAW_FLAG}`);

        await sleep(200);
        addToHistory(
          "system",
          `Nmap done: 1 IP address scanned in 1.84 seconds`,
        );
      }
      // Invalid target
      else {
        addToHistory(
          "error",
          `Note: Host seems down. If it is really up, but blocking our ping probes, try -Pn`,
        );
        addToHistory(
          "system",
          `Nmap done: 1 IP address (0 hosts up) scanned in 3.01 seconds`,
        );
      }
    },
  },
};
