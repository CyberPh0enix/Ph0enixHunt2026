import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function Terminal({ onClose }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([
    { type: "system", content: `Ph0enixOS Kernel v1.0.4-release` },
    { type: "system", content: `Connected as: ${user?.email}` },
    { type: "info", content: `Type 'help' for available commands.` },
  ]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Focus input on click
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

    // Add user's command to history
    addToHistory("user", `root@ph0enix:~# ${cmd}`);
    setInput("");
    setProcessing(true);

    const args = cmd.split(" ");
    const command = args[0].toLowerCase();

    // COMMAND LOGIC
    try {
      switch (command) {
        case "help":
          addToHistory("info", "AVAILABLE COMMANDS:");
          addToHistory("info", "help - Show this menu");
          addToHistory("info", "clear - Clear terminal");
          addToHistory("info", "whoami - Show current user");
          addToHistory("info", "submit <id> <flag>   - Submit a capture flag");
          addToHistory("info", "Ex: submit level-01 flag{...}");
          break;

        case "clear":
          setHistory([]);
          break;

        case "whoami":
          addToHistory("success", `USER: ${user?.email}`);
          addToHistory("success", `UUID: ${user?.id}`);
          break;

        case "submit":
          if (args.length < 3) {
            addToHistory("error", "USAGE: submit <level-id> <flag>");
            break;
          }
          const puzzleId = args[1];
          const flagAttempt = args[2];

          addToHistory("system", "Verifying hash signature...");

          // CALL SUPABASE RPC
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
      {/* Header */}
      <div className="flex justify-between items-center border-b border-green-900/50 pb-2 mb-2 shrink-0 z-20">
        <span className="text-xs uppercase tracking-widest text-green-700">
          /bin/bash
        </span>
        <button onClick={onClose} className="text-red-500 hover:text-red-400">
          [X]
        </button>
      </div>

      {/* Output Area */}
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

      {/* Input Area */}
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
