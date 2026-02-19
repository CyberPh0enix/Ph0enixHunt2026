import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { PUZZLE_CONFIG } from "../../data/puzzles";
import { SYSTEM_COMMANDS } from "../../data/commands";
import { SYSTEM_DATA } from "../../config/build.prop";
import { checkCommandLock } from "../../utils/game";
import { heistCommand } from "../../utils/devExploit";

export default function Terminal({ onClose }) {
  const { user } = useAuth();

  // STATE
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [cwd, setCwd] = useState("/home/user");
  const [processing, setProcessing] = useState(false);
  const [crash, setCrash] = useState(false);
  const [solvedIds, setSolvedIds] = useState([]); // Track Progress

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  if (crash) throw new Error("MANUAL_KERNEL_PANIC_INITIATED_BY_USER");

  // 1. BUILD REGISTRY
  const registry = useMemo(() => {
    const reg = { ...SYSTEM_COMMANDS, heist: heistCommand };
    PUZZLE_CONFIG.forEach((puzzle) => {
      if (puzzle.commands) {
        // Check if puzzle has terminal commands
        Object.entries(puzzle.commands).forEach(([cmdName, cmdDef]) => {
          reg[cmdName] = cmdDef;
        });
      }
    });
    return reg;
  }, []);

  // 2. INITIALIZATION
  useEffect(() => {
    async function initTerminal() {
      // A. Fetch Solved Levels
      let currentSolvedIds = [];
      if (user) {
        const { data } = await supabase
          .from("solved_puzzles")
          .select("puzzle_id")
          .eq("user_id", user.id);
        if (data) {
          currentSolvedIds = data.map((r) => r.puzzle_id);
          setSolvedIds(currentSolvedIds);
        }
      }

      // B. Determine Next Mission (Fixes "Active Mission" Bug)
      // Find the first puzzle (Browser OR Terminal) that isn't solved
      const nextPuzzle = PUZZLE_CONFIG.find(
        (p) => !currentSolvedIds.includes(p.id),
      );

      const startupLogs = [
        {
          type: "system",
          content: `${SYSTEM_DATA.osName} Kernel ${SYSTEM_DATA.version}`,
        },
        { type: "system", content: `Connected as: ${user?.email || "guest"}` },
        { type: "info", content: "----------------------------------------" },
      ];

      if (!nextPuzzle) {
        startupLogs.push({
          type: "success",
          content: "ALL SYSTEMS SECURE. No active threats.",
        });
      } else if (nextPuzzle.type === "terminal") {
        // It's a Terminal Level - Show Briefing
        startupLogs.push({
          type: "success",
          content: `ACTIVE MISSION: ${nextPuzzle.title}`,
        });
        startupLogs.push({
          type: "info",
          content: `OBJECTIVE: ${nextPuzzle.desc}`,
        });
        if (nextPuzzle.onStart) {
          startupLogs.push({
            type: "warning",
            content: `>> ${nextPuzzle.onStart}`,
          });
        }
      } else {
        // It's a Browser Level - Show Warning
        startupLogs.push({
          type: "warning",
          content: `ALERT: Threat detected in ${nextPuzzle.title}.`,
        });

        startupLogs.push({
          type: "error",
          content: `Terminal: RESTRICTED MODE`,
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

    initTerminal();
  }, [user]);

  // Auto-scroll & Focus
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
    if (e.key === "Enter") {
      const cmdStr = input.trim();
      if (!cmdStr) return;

      addToHistory("user", `root@ph0enix:${cwd}# ${cmdStr}`);
      setInput("");
      setCursorPos(0);
      setProcessing(true);

      const args = cmdStr.split(" ");
      const commandName = args[0].toLowerCase();

      // --- AUTOMATIC GLOBAL LOCK CHECK ---
      // This single line secures your entire terminal
      const lockStatus = checkCommandLock(commandName, solvedIds);

      if (lockStatus.isLocked) {
        addToHistory(
          "error",
          `PERMISSION DENIED: Command '${commandName}' is encrypted.`,
        );
        addToHistory(
          "info",
          `security_protocol: Unlocks after completing ${lockStatus.requiredLevel}`,
        );
        setProcessing(false);
        return; // STOP EXECUTION HERE
      }
      // -----------------------------------

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
            solvedIds,
            setSolvedIds,
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
            className={
              line.type === "error"
                ? "text-red-500"
                : line.type === "success"
                  ? "text-green-300 font-bold"
                  : line.type === "system"
                    ? "text-green-800"
                    : line.type === "warning"
                      ? "text-yellow-500"
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
      <div className="flex items-center gap-2 mt-2 shrink-0 z-20 relative text-base">
        <span className="text-green-600 shrink-0">root@ph0enix:{cwd}#</span>
        <div className="relative flex-1 flex flex-wrap break-all">
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
