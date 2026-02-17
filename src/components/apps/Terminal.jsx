import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function Terminal({ onClose }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([
    { type: "system", content: `Ph0enixOS Kernel v6.9.1-hardened` },
    { type: "system", content: `Connected as: ${user?.email}` },
    { type: "info", content: `Type 'help' for available commands.` },
  ]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [crash, setCrash] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  if (crash) {
    throw new Error("MANUAL_KERNEL_PANIC_INITIATED_BY_USER");
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addToHistory = (type, content) => {
    setHistory((prev) => [...prev, { type, content }]);
  };

  const handleCommand = async (e) => {
    if (e.key !== "Enter") return;

    const cmd = input.trim();
    if (!cmd) return;

    addToHistory("user", `root@ph0enix:~# ${cmd}`);
    setInput("");
    setProcessing(true);

    const args = cmd.split(" ");
    const command = args[0].toLowerCase();

    try {
      switch (command) {
        case "help":
          addToHistory("info", "AVAILABLE COMMANDS:");
          addToHistory("info", "help    - Show this menu");
          addToHistory("info", "clear   - Clear terminal");
          addToHistory("info", "whoami  - Show current user");
          addToHistory("info", "netstat - List active network connections");
          addToHistory("info", "fetch   - Retrieve data from a URL/IP");
          addToHistory("info", "panic   - Test Kernel Panic Screen");
          addToHistory("info", "submit <id> <flag> - Submit a capture flag");
          break;

        case "clear":
          setHistory([]);
          break;

        case "whoami":
          addToHistory("success", `USER: ${user?.email}`);
          addToHistory("success", `UUID: ${user?.id}`);
          break;

        case "panic":
          addToHistory("system", "DKMS: modules installed");
          addToHistory("system", "Initiating kernel dump...");
          setTimeout(() => {
            setCrash(true);
          }, 1000);
          break;

        // --- LEVEL 7 PUZZLE: PART 1 (Enumeration) ---
        case "netstat":
          addToHistory("system", "Scanning active sockets...");
          setTimeout(() => {
            addToHistory("info", "Proto  Local Address          State");
            addToHistory("user", "tcp    127.0.0.1:80           ESTABLISHED");
            addToHistory("user", "tcp    192.168.1.5:443        ESTABLISHED");
            // HINT: The suspicious port is 1337, but NO FLAG here.
            addToHistory(
              "error",
              "tcp    127.0.0.1:1337         LISTEN      <-- INTERNAL_ONLY",
            );
          }, 500);
          break;

        // --- LEVEL 7 PUZZLE: PART 2 (Exploitation) ---
        case "fetch":
          if (args.length < 2) {
            addToHistory("error", "USAGE: fetch <url_or_ip>");
            break;
          }
          const target = args[1];

          // Check if they are targeting the correct hidden port
          if (
            target.includes("127.0.0.1:1337") ||
            target.includes("localhost:1337")
          ) {
            addToHistory("system", `Connecting to ${target}...`);
            setTimeout(() => {
              addToHistory("success", "HTTP/1.1 200 OK");
              addToHistory("success", "Content-Type: text/plain");
              addToHistory("info", "");
              addToHistory("success", "flag{ports_are_open}"); // <--- THE REWARD
            }, 800);
          } else if (target.includes("1337")) {
            // Hint if they forget localhost
            addToHistory(
              "error",
              "Error: Connection refused. Did you mean 127.0.0.1?",
            );
          } else {
            // Generic response for other IPs
            addToHistory("system", `Connecting to ${target}...`);
            setTimeout(() => {
              addToHistory(
                "error",
                "Error: Connection timed out (Firewall blocked)",
              );
            }, 1000);
          }
          break;

        case "submit":
          if (args.length < 3) {
            addToHistory("error", "USAGE: submit <level-id> <flag>");
            break;
          }
          const puzzleId = args[1];
          const flagAttempt = args[2];

          addToHistory("system", "Verifying hash signature...");

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
          break;

        default:
          addToHistory("error", `Command not found: ${command}`);
      }
    } catch (err) {
      addToHistory("error", `SYSTEM ERROR: ${err.message}`);
    }

    setProcessing(false);
  };

  return (
    <div
      className="h-full bg-black text-green-500 font-mono text-sm p-4 flex flex-col overflow-hidden scanline relative"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex justify-between items-center border-b border-green-900/50 pb-2 mb-2 shrink-0 z-20">
        <span className="text-xs uppercase tracking-widest text-green-700">
          /bin/bash
        </span>
        <button onClick={onClose} className="text-red-500 hover:text-red-400">
          [X]
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 pb-4 z-20">
        {history.map((line, i) => (
          <div
            key={i}
            className={`${
              line.type === "error"
                ? "text-red-500"
                : line.type === "success"
                  ? "text-green-300 font-bold"
                  : line.type === "system"
                    ? "text-green-800"
                    : line.type === "user"
                      ? "text-white"
                      : "text-green-500"
            }`}
          >
            {line.content}
          </div>
        ))}
        {processing && (
          <div className="text-green-800 animate-pulse">Processing...</div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 mt-2 shrink-0 z-20">
        <span className="text-green-600">root@ph0enix:~#</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-1 bg-transparent border-none outline-none text-white caret-transparent"
          autoComplete="off"
          autoFocus
        />
        <span className="terminal-cursor"></span>
      </div>
    </div>
  );
}
