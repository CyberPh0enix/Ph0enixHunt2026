import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Target,
  Lock,
  Unlock,
  FastForward,
  Globe,
  Terminal,
  Zap,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { LEVEL_CONFIG } from "../../data/config";
import CountUp from "../ui/CountUp";

// Dynamic Icon Assign
const getIconForType = (type) => {
  switch (type?.toLowerCase()) {
    case "browser":
      return Globe;
    case "terminal":
      return Terminal;
    case "osint":
      return Zap;
    default:
      return Shield;
  }
};

export default function MissionControl({
  onClose,
  solvedIds = [],
  skippedIds = [],
  progressionIds = [],
}) {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (user) await refreshProfile(user.id);
      setLoading(false);
    }
    loadProfile();
  }, [user]);

  return (
    <div className="h-full bg-neutral-950 text-green-500 font-mono flex flex-col border border-green-900/50">
      <div className="p-4 bg-green-950/20 border-b border-green-900/50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
            <Target size={20} className="text-green-500" /> MISSION CONTROL
          </h2>
          <p className="text-xs text-green-700 mt-1">
            OPERATIVE: {profile?.full_name || "UNKNOWN"}
          </p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <div className="text-[10px] text-green-700">CREDITS (BTC)</div>
            <div className="font-bold text-yellow-500 flex items-center gap-1 justify-end">
              <CountUp end={profile?.credits || 0} />{" "}
              <span className="text-xs">cR</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="text-[10px] text-green-700">CLEARANCE SCORE</div>
            <div className="font-bold text-white">
              <CountUp end={profile?.score || 0} suffix=" XP" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-400 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      </div>

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
              {LEVEL_CONFIG.map((level, idx) => {
                const isSolved = solvedIds.includes(level.id);
                const isSkipped = skippedIds.includes(level.id);
                const isUnlocked =
                  !level.requires || progressionIds.includes(level.requires);

                const isActive = isUnlocked && !isSolved && !isSkipped;
                const isSolvedPostBypass = isSolved && isSkipped; // The stubborn player state

                // Smart State Styling
                let stateClasses =
                  "bg-neutral-900 border-neutral-800 text-neutral-600 opacity-50";

                if (isSolvedPostBypass) {
                  // Golden yellow for solving a skipped level
                  stateClasses =
                    "bg-yellow-950/20 border-yellow-600 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.15)]";
                } else if (isSolved) {
                  stateClasses =
                    "bg-green-950/30 border-green-600 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]";
                } else if (isSkipped) {
                  stateClasses = "bg-red-950/20 border-red-900 text-red-500";
                } else if (isActive) {
                  stateClasses =
                    "bg-blue-950/20 border-blue-500 text-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.4)]";
                }

                const TypeIcon = getIconForType(level.type);

                return (
                  <div
                    key={level.id}
                    className={`relative flex flex-col p-3 rounded-xl border-2 transition-all ${stateClasses}`}
                  >
                    <div className="text-[9px] mb-2 opacity-70 font-bold uppercase">
                      {level.type || "MISSION"}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <TypeIcon
                        size={20}
                        className={
                          isSolvedPostBypass
                            ? "text-yellow-500"
                            : isSolved
                              ? "text-green-500"
                              : isActive
                                ? "text-blue-500"
                                : isSkipped
                                  ? "text-red-500"
                                  : "text-neutral-700"
                        }
                      />

                      {/* Top Right Status Badge */}
                      {isSolvedPostBypass ? (
                        <CheckCircle2 size={14} className="text-yellow-500" />
                      ) : isSolved ? (
                        <Unlock size={14} />
                      ) : isSkipped ? (
                        <FastForward size={14} />
                      ) : (
                        <Lock size={14} />
                      )}
                    </div>
                    <div className="mt-auto">
                      <div className="text-[10px] opacity-50">
                        NODE {String(idx + 1).padStart(2, "0")}
                      </div>
                      <div className="text-xs font-bold truncate">
                        {level.title}
                      </div>

                      {/* Labels for states */}
                      {isSolvedPostBypass ? (
                        <div className="text-[7px] text-yellow-500 font-bold mt-1 tracking-widest uppercase">
                          SOLVED (POST-BYPASS)
                        </div>
                      ) : isSolved ? (
                        <div className="text-[7px] text-green-500 font-bold mt-1 tracking-widest uppercase">
                          COMPLETED
                        </div>
                      ) : isSkipped ? (
                        <div className="text-[8px] text-red-500 font-bold mt-1 tracking-widest uppercase">
                          BYPASSED
                        </div>
                      ) : isActive ? (
                        <div className="text-[8px] text-blue-500 font-bold mt-1 tracking-widest uppercase animate-pulse">
                          ACTIVE NODE
                        </div>
                      ) : null}
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
