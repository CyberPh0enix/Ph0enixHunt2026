import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase"; // Needed for Mission Briefing
import { PUZZLE_CONFIG } from "../../data/puzzles";
import { SYSTEM_COMMANDS } from "../../data/commands";

export default function Terminal({ onClose }) {
  const { user } = useAuth();

  // --- STATE ---
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [cwd, setCwd] = useState("/home/user");
  const [processing, setProcessing] = useState(false);
  const [crash, setCrash] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  if (crash) throw new Error("MANUAL_KERNEL_PANIC_INITIATED_BY_USER");

  // BUILD REGISTRY (System + Puzzle Commands)
  const registry = useMemo(() => {
    const reg = { ...SYSTEM_COMMANDS };
    PUZZLE_CONFIG.forEach((puzzle) => {
      if (puzzle.commands) {
        Object.entries(puzzle.commands).forEach(([cmdName, cmdDef]) => {
          reg[cmdName] = cmdDef;
        });
      }
    });
    return reg;
  }, []);

  // MISSION BRIEFING (Run on Startup)
  useEffect(() => {
    async function initTerminal() {
      // A. Get Solved Levels
      const { data } = await supabase
        .from("solved_puzzles")
        .select("puzzle_id")
        .eq("user_id", user?.id);

      const solvedIds = data?.map((r) => r.puzzle_id) || [];

      // B. Find Active Level (First Unsolved Terminal Level)
      const activeLevel = PUZZLE_CONFIG.find(
        (p) => p.type === "terminal" && !solvedIds.includes(p.id),
      );

      // C. Build Startup Logs
      const startupLogs = [
        { type: "system", content: `Ph0enixOS Kernel v1.0.4-release` },
        { type: "system", content: `Connected as: ${user?.email}` },
        { type: "info", content: "----------------------------------------" },
      ];

      if (activeLevel) {
        startupLogs.push({
          type: "success",
          content: `ACTIVE MISSION: ${activeLevel.title}`,
        });
        startupLogs.push({
          type: "info",
          content: `OBJECTIVE: ${activeLevel.desc}`,
        });

        // Show Level Specific Hint
        if (activeLevel.onStart) {
          startupLogs.push({
            type: "warning",
            content: `>> ${activeLevel.onStart}`,
          });
        }
      } else {
        startupLogs.push({
          type: "success",
          content: "ALL SYSTEMS SECURE. No active threats.",
        });
      }

      startupLogs.push({
        type: "info",
        content: "----------------------------------------",
      });
      startupLogs.push({
        type: "info",
        content: `Type 'help' for available commands.`,
      });

      setHistory(startupLogs);
    }

    if (user) initTerminal();
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  // Focus Input on Mount & Click
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addToHistory = (type, content) => {
    setHistory((prev) => [...prev, { type, content }]);
  };

  const handleCommand = async (e) => {
    if (e.key === "Enter") {
      const cmdStr = input.trim();
      if (!cmdStr) return;

      // Log the command with the Current Working Directory
      addToHistory("user", `root@ph0enix:${cwd}# ${cmdStr}`);

      setInput("");
      setCursorPos(0);
      setProcessing(true);

      const args = cmdStr.split(" ");
      const commandName = args[0].toLowerCase();

      try {
        const command = registry[commandName];
        if (command) {
          await command.execute(args, {
            addToHistory,
            setHistory,
            setCrash,
            user,
            registry,
            cwd,
            setCwd,
          });
        } else {
          addToHistory("error", `Command not found: ${commandName}`);
        }
      } catch (err) {
        addToHistory("error", `SYSTEM ERROR: ${err.message}`);
      }
      setProcessing(false);
    }
  };

  // Cursor & Input Handlers
  const handleInputChange = (e) => {
    setInput(e.target.value);
    setCursorPos(e.target.selectionStart);
  };

  const handleCursorSelect = (e) => {
    setCursorPos(e.target.selectionStart);
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

      {/* History Output */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 pb-4 z-20">
        {history.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "error"
                ? "text-red-500"
                : line.type === "success"
                  ? "text-green-300 font-bold"
                  : line.type === "warning"
                    ? "text-yellow-500"
                    : line.type === "system"
                      ? "text-green-800"
                      : line.type === "user"
                        ? "text-white"
                        : "text-green-500"
            }
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
      <div className="flex items-center gap-2 mt-2 shrink-0 z-20 relative text-base">
        {/* Dynamic Prompt with CWD */}
        <span className="text-green-600 shrink-0">root@ph0enix:{cwd}#</span>

        <div className="relative flex-1 flex flex-wrap break-all">
          {/* Hidden Input for Typing Logic */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleCommand}
            onSelect={handleCursorSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
            autoComplete="off"
            autoFocus
          />

          {/* Visual Output with Block Cursor */}
          <span className="text-white whitespace-pre-wrap">
            {input.slice(0, cursorPos)}
            <span className="border-b-2 border-green-500 animate-pulse text-white">
              {input[cursorPos] || "\u00A0"}
            </span>
            {input.slice(cursorPos + 1)}
          </span>
        </div>
      </div>
    </div>
  );
}
