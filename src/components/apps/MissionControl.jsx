import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  Shield,
  Target,
  Lock,
  Unlock,
  Zap,
  Database,
  Terminal,
  Globe,
} from "lucide-react";

export default function MissionControl({ onClose }) {
  const { user, profile, refreshProfile } = useAuth();
  const [solvedIds, setSolvedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define the 15-Level Blueprint
  const LEVEL_MAP = [
    {
      id: "level-00",
      title: "First Blood",
      phase: "0. TUTORIAL",
      icon: Terminal,
    },
    { id: "level-01", title: "Dev Notes", phase: "I. WEB", icon: Globe },
    { id: "level-02", title: "Design V2", phase: "I. WEB", icon: Globe },
    { id: "level-03", title: "System Logs", phase: "I. WEB", icon: Globe },
    { id: "level-04", title: "Transmission", phase: "I. WEB", icon: Globe },
    { id: "level-05", title: "Corrupted", phase: "I. WEB", icon: Globe },
    { id: "level-06", title: "Session", phase: "II. INTERNAL", icon: Database },
    {
      id: "level-07",
      title: "Hidden Port",
      phase: "II. INTERNAL",
      icon: Terminal,
    },
    {
      id: "level-08",
      title: "Data Recovery",
      phase: "II. INTERNAL",
      icon: Terminal,
    },
    {
      id: "level-09",
      title: "Log Poison",
      phase: "II. INTERNAL",
      icon: Database,
    },
    { id: "level-10", title: "Privilege", phase: "II. INTERNAL", icon: Shield },
    { id: "level-11", title: "Injection", phase: "III. APT", icon: Zap },
    { id: "level-12", title: "Forgery", phase: "III. APT", icon: Zap },
    { id: "level-13", title: "Reverse Eng.", phase: "III. APT", icon: Zap },
    { id: "level-14", title: "The Matrix", phase: "ENDGAME", icon: Target },
    { id: "level-15", title: "Root", phase: "ENDGAME", icon: Shield },
  ];

  useEffect(() => {
    async function fetchProgress() {
      if (!user) return;
      const { data } = await supabase
        .from("solved_puzzles")
        .select("puzzle_id")
        .eq("user_id", user.id);
      if (data) setSolvedIds(data.map((r) => r.puzzle_id));
      await refreshProfile(user.id);
      setLoading(false);
    }
    fetchProgress();
  }, [user]);

  return (
    <div className="h-full bg-neutral-950 text-green-500 font-mono flex flex-col border border-green-900/50">
      {/* HEADER: Wallet & Stats */}
      <div className="p-4 bg-green-950/20 border-b border-green-900/50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
            <Target size={20} className="text-green-500" /> MISSION CONTROL
          </h2>
          <p className="text-xs text-green-700 mt-1">
            OPERATIVE: {profile?.username || "UNKNOWN"}
          </p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <div className="text-[10px] text-green-700">CREDITS (BTC)</div>
            <div className="font-bold text-yellow-500 flex items-center gap-1 justify-end">
              {profile?.credits || 0} <span className="text-xs">cR</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="text-[10px] text-green-700">CLEARANCE SCORE</div>
            <div className="font-bold text-white">{profile?.score || 0} XP</div>
          </div>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-400 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      </div>

      {/* CONTENT: Skill Tree Map */}
      <div className="flex-1 overflow-y-auto p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-950/20 via-neutral-950 to-neutral-950">
        {loading ? (
          <div className="h-full flex items-center justify-center animate-pulse text-green-700">
            SYNCING CLEARANCE...
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <h3 className="text-sm font-bold text-neutral-500 mb-6 border-b border-neutral-800 pb-2">
              SYSTEM BREACH PROGRESSION
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {LEVEL_MAP.map((level, idx) => {
                const isSolved = solvedIds.includes(level.id);
                // Determine if this is the "Next" level to solve
                const previousLevelId = idx > 0 ? LEVEL_MAP[idx - 1].id : null;
                const isNext =
                  !isSolved &&
                  (previousLevelId === null ||
                    solvedIds.includes(previousLevelId));

                let stateClasses =
                  "bg-neutral-900 border-neutral-800 text-neutral-600 opacity-50";
                if (isSolved)
                  stateClasses =
                    "bg-green-950/30 border-green-600 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
                if (isNext)
                  stateClasses =
                    "bg-yellow-950/20 border-yellow-500 text-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.4)]";

                return (
                  <div
                    key={level.id}
                    className={`relative flex flex-col p-3 rounded-xl border-2 transition-all ${stateClasses}`}
                  >
                    <div className="text-[9px] mb-2 opacity-70 font-bold">
                      {level.phase}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <level.icon
                        size={20}
                        className={
                          isSolved
                            ? "text-green-500"
                            : isNext
                              ? "text-yellow-500"
                              : "text-neutral-700"
                        }
                      />
                      {isSolved ? <Unlock size={14} /> : <Lock size={14} />}
                    </div>
                    <div className="mt-auto">
                      <div className="text-[10px] opacity-50">
                        NODE {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="text-xs font-bold truncate">
                        {level.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
