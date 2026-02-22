import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { PUZZLE_CONFIG } from "../../data/puzzles";
import { SYSTEM_COMMANDS } from "../../data/commands";
import { SYSTEM_DATA } from "../../config/build.prop";
import { checkCommandLock } from "../../utils/game";
import { heistCommand } from "../../utils/devExploit";
import { SensoryEngine } from "../../utils/sensory";
import DecryptedText from "../ui/DecryptedText";
import AppHeader from "../ui/AppHeader";
import { Terminal as TerminalIcon } from "lucide-react";

export default function Terminal({
  onClose,
  solvedIds,
  setSolvedIds,
  skippedIds,
  setSkippedIds,
  progressionIds,
}) {
  const { user, profile, refreshProfile } = useAuth();

  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [cwd, setCwd] = useState("/home/user");
  const [processing, setProcessing] = useState(false);
  const [crash, setCrash] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const initialized = useRef(false);

  if (crash) throw new Error("MANUAL_KERNEL_PANIC_INITIATED_BY_USER");

  const registry = useMemo(() => {
    const reg = { ...SYSTEM_COMMANDS, heist: heistCommand };
    PUZZLE_CONFIG.forEach((mod) => {
      if (mod.commands) {
        Object.entries(mod.commands).forEach(([cmdName, cmdDef]) => {
          reg[cmdName] = cmdDef;
        });
      }
    });
    return reg;
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const startupLogs = [
      {
        type: "system",
        content: `${SYSTEM_DATA.osName} Kernel ${SYSTEM_DATA.version}`,
      },
      {
        type: "system",
        content: `Connected as: ${profile?.operative_id || "guest"} [${profile?.full_name || "Unverified"}]`,
      },
      { type: "info", content: "----------------------------------------" },
      { type: "info", content: `Type 'help' for available commands.` },
      { type: "info", content: "----------------------------------------" },
    ];
    setHistory(startupLogs);
  }, [profile]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addToHistory = (type, content, options = {}) => {
    setHistory((prev) => [...prev, { type, content, options }]);
  };

  const handleCommand = async (e) => {
    if (e.key === "Enter") {
      const cmdStr = input.trim();
      if (!cmdStr) return;

      const shellPrompt = `${profile?.operative_id || "guest"}@ph0enix:${cwd}$`;
      addToHistory("user", `${shellPrompt} ${cmdStr}`);
      setInput("");
      setCursorPos(0);
      setProcessing(true);

      const args = cmdStr.split(" ");
      const commandName = args[0].toLowerCase();
      const lockStatus = checkCommandLock(commandName, progressionIds);

      if (lockStatus.isLocked) {
        addToHistory(
          "error",
          `PERMISSION DENIED: Command '${commandName}' is encrypted.`,
        );
        setProcessing(false);
        return;
      }

      try {
        const command = registry[commandName];
        if (command) {
          await command.execute(args, {
            addToHistory,
            setHistory,
            setCrash,
            user,
            profile,
            refreshProfile,
            registry,
            cwd,
            setCwd,
            solvedIds,
            setSolvedIds,
            skippedIds,
            setSkippedIds,
          });
        } else {
          addToHistory("error", `bash: ${commandName}: command not found`);
        }
      } catch (err) {
        addToHistory("error", `SYSTEM ERROR: ${err.message}`);
      }
      setProcessing(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setCursorPos(e.target.selectionStart);
    SensoryEngine.playKeystroke();
  };

  return (
    <div
      className="h-full bg-[#050505] text-green-500 font-mono text-sm flex flex-col overflow-hidden relative"
      onClick={() => inputRef.current?.focus()}
    >
      <AppHeader title="Terminal" icon={TerminalIcon} onClose={onClose} />

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 p-4 z-20">
        {history.map((line, i) => (
          <div
            key={i}
            className={`leading-relaxed break-words ${
              line.type === "error"
                ? "text-red-500 font-bold"
                : line.type === "success"
                  ? "text-green-400 font-bold"
                  : line.type === "system"
                    ? "text-blue-400 font-bold"
                    : line.type === "warning"
                      ? "text-yellow-500"
                      : line.type === "user"
                        ? "text-white font-bold"
                        : "text-green-500"
            }`}
          >
            {line.options?.animate === "decrypt" ? (
              <DecryptedText text={line.content} speed={10} />
            ) : (
              line.content
            )}
          </div>
        ))}
        {processing && (
          <div className="text-green-800 animate-pulse">Processing...</div>
        )}
        <div ref={bottomRef} className="h-2" />
      </div>

      <div className="flex items-start gap-2 p-4 pt-0 shrink-0 z-20 relative text-base">
        <span className="text-green-600 font-bold shrink-0 pt-0.5">
          {profile?.operative_id || "guest"}@ph0enix:{cwd}$
        </span>
        <div className="relative flex-1 flex flex-wrap break-all min-h-[24px]">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleCommand}
            onSelect={(e) => setCursorPos(e.target.selectionStart)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
            autoCapitalize="off"
            autoComplete="off"
            spellCheck="false"
            autoFocus
          />
          <span className="text-white whitespace-pre-wrap mt-0.5">
            {input.slice(0, cursorPos)}
            <span className="inline-block w-2.5 h-4 bg-green-500 animate-pulse translate-y-0.5 mx-[1px]"></span>
            {input.slice(cursorPos)}
          </span>
        </div>
      </div>
    </div>
  );
}
