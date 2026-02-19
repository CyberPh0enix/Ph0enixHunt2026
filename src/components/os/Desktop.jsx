import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useHintSystem } from "../../hooks/useHintSystem";
import { SYSTEM_DATA, WALLPAPER_mVjq } from "../../config/build.prop";
import {
  Terminal as TerminalIcon,
  MessageSquare,
  Image,
  Globe,
  Settings as SettingsIcon,
  Trophy,
  Cpu,
  LogOut,
  Square,
  Circle,
  Triangle,
  Target,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

// Apps
import Terminal from "../apps/Terminal";
import Messenger from "../apps/Messenger";
import Gallery from "../apps/Gallery";
import Browser from "../apps/Browser";
import Settings from "../apps/Settings";
import Leaderboard from "../apps/Leaderboard";
import MissionControl from "../apps/MissionControl";
import LogoutConfirmation from "./LogoutConfirm";
import { useDevExploitSequence } from "../../utils/devExploit";

export default function Desktop() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [activeApp, setActiveApp] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  // --- MASTER PROGRESS STATE ---
  const [solvedIds, setSolvedIds] = useState([]);

  // Fetch progress immediately when Desktop loads
  useEffect(() => {
    async function fetchProgress() {
      if (user) {
        const { data } = await supabase
          .from("solved_puzzles")
          .select("puzzle_id")
          .eq("user_id", user.id);
        if (data) {
          setSolvedIds(data.map((r) => r.puzzle_id));
        }
      }
    }
    fetchProgress();
  }, [user]);

  // Hint system now receives the live, master state
  const { messages, unreadCount, markAsRead } = useHintSystem(solvedIds);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const apps = [
    {
      id: "terminal",
      name: "Terminal",
      icon: TerminalIcon,
      color: "text-green-500",
      component: Terminal,
    },
    {
      id: "browser",
      name: "Net",
      icon: Globe,
      color: "text-orange-500",
      component: Browser,
    },
    {
      id: "messenger",
      name: "Signal",
      icon: MessageSquare,
      color: "text-blue-500",
      component: (props) => (
        <Messenger {...props} messages={messages} markAsRead={markAsRead} />
      ),
    },
    {
      id: "gallery",
      name: "Gallery",
      icon: Image,
      color: "text-yellow-400",
      component: Gallery,
    },
    {
      id: "leaderboard",
      name: "Rankings",
      icon: Trophy,
      color: "text-yellow-500",
      component: Leaderboard,
    },
    {
      id: "missioncontrol",
      name: "Mission",
      icon: Target,
      color: "text-red-500",
      component: MissionControl,
    },
    {
      id: "settings",
      name: "System",
      icon: SettingsIcon,
      color: "text-gray-400",
      component: Settings,
    },
  ];

  useDevExploitSequence(activeApp, () => {
    addToast("ROOT PRIVILEGES GRANTED. COMMAND 'heist' UNLOCKED.", "error");
    const terminalApp = apps.find((a) => a.id === "terminal");
    if (terminalApp) setActiveApp(terminalApp);
  });

  return (
    <div
      className="fixed inset-0 w-full h-full bg-black text-white font-sans overflow-hidden"
      style={{ background: WALLPAPER_mVjq, backgroundSize: "cover" }}
    >
      {isDesktop && (
        <>
          <div className="absolute top-0 left-0 w-full h-8 bg-black/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 z-50 select-none">
            <div className="flex items-center gap-4 text-xs font-bold tracking-wider">
              <span className="flex items-center gap-1 opacity-80">
                <Cpu size={14} /> {SYSTEM_DATA.osName}
              </span>
              <span className="text-white/50 hover:text-white transition-colors cursor-pointer">
                File
              </span>
              <span className="text-white/50 hover:text-white transition-colors cursor-pointer">
                Edit
              </span>
              <span className="text-white/50 hover:text-white transition-colors cursor-pointer">
                View
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-green-500/80 font-mono">
                {SYSTEM_DATA.version}
              </span>
              <span>
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {!activeApp && (
            <div className="absolute top-12 left-6 bottom-24 w-auto flex flex-col flex-wrap gap-4 z-10 content-start">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setActiveApp(app)}
                  className="flex flex-col items-center gap-1 group w-20 p-2 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 flex items-center justify-center shadow-lg group-hover:bg-white/10 transition-all">
                    <app.icon size={28} className={app.color} />
                    {app.id === "messenger" && unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-black flex items-center justify-center animate-bounce">
                        <span className="text-[10px] font-bold text-white">
                          {unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-shadow drop-shadow-md truncate w-full text-center">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 h-16 px-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center gap-3 z-50 shadow-2xl">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => setActiveApp(app)}
                className="relative group p-2 rounded-xl hover:bg-white/10 transition-all hover:-translate-y-2 duration-300"
              >
                <div className="p-2 bg-black/20 rounded-lg">
                  <app.icon size={24} className={app.color} />
                  {app.id === "messenger" && unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">
                        {unreadCount}
                      </span>
                    </div>
                  )}
                </div>
                {activeApp?.id === app.id && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                )}
                <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none whitespace-nowrap">
                  {app.name}
                </span>
              </button>
            ))}
            <div className="w-[1px] h-8 bg-white/20 mx-1"></div>
            <button
              onClick={() => setShowLogout(true)}
              className="p-2 hover:bg-red-500/20 rounded-xl group transition-all"
              title="Logout"
            >
              <LogOut
                size={24}
                className="text-red-400 group-hover:text-red-200"
              />
            </button>
          </div>
        </>
      )}

      {!isDesktop && (
        <>
          <div className="absolute top-0 w-full h-8 px-4 flex justify-between items-center text-xs font-mono bg-black/40 backdrop-blur-md z-50 border-b border-white/5">
            <span>
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <div className="flex gap-2">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {!activeApp && (
            <div className="p-6 pt-12 grid grid-cols-4 gap-4">
              {apps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setActiveApp(app)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="relative w-14 h-14 rounded-2xl bg-neutral-900/90 border border-white/10 flex items-center justify-center shadow-lg active:scale-95 transition-all">
                    <app.icon size={24} className={app.color} />

                    {app.id === "messenger" && unreadCount > 0 && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-black flex items-center justify-center animate-bounce">
                        <span className="text-[10px] font-bold text-white">
                          {unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] tracking-wide opacity-80">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="absolute bottom-0 w-full h-14 bg-black/80 backdrop-blur-xl border-t border-white/10 flex justify-around items-center z-50">
            <button
              onClick={() => setActiveApp(null)}
              className="p-4 active:opacity-50"
            >
              <Triangle size={20} className="rotate-[-90deg] fill-white/20" />
            </button>
            <button
              onClick={() => setActiveApp(null)}
              className="p-4 active:opacity-50"
            >
              <Circle size={18} className="fill-white/20" />
            </button>
            <button className="p-4 active:opacity-50">
              <Square size={16} className="fill-white/20" />
            </button>
          </div>
        </>
      )}

      {/* Active App Window */}
      {activeApp && (
        <div
          key={activeApp.id}
          className={`absolute z-40 bg-neutral-900 overflow-hidden shadow-2xl
          ${
            isDesktop
              ? "top-10 left-10 right-10 bottom-28 rounded-xl border border-white/10 animate-oxygen-zoom"
              : "top-8 left-0 right-0 bottom-14 animate-oxygen-zoom"
          }
        `}
        >
          {/* PASSED STATE DOWN TO ALL APPS */}
          <activeApp.component
            onClose={() => setActiveApp(null)}
            solvedIds={solvedIds}
            setSolvedIds={setSolvedIds}
          />
        </div>
      )}

      <LogoutConfirmation
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={logout}
      />
    </div>
  );
}
