import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  LogOut,
  User,
  Shield,
  ArrowLeft,
  Cpu,
  Code,
  Layers,
  Activity,
  Bug,
} from "lucide-react";
import LogoutConfirmation from "../os/LogoutConfirm";
import { SYSTEM_DATA } from "../../config/build.prop";

export default function Settings({ onClose }) {
  const { user, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  // EASTER EGG STATES
  const [devClicks, setDevClicks] = useState(0);
  const [devMode, setDevMode] = useState(false);

  const [osClicks, setOsClicks] = useState(0);
  const [showOsEgg, setShowOsEgg] = useState(false);

  // 1. DEVELOPER MODE LOGIC (7 Clicks)
  const handleBuildClick = () => {
    if (devMode) return;
    const newCount = devClicks + 1;
    setDevClicks(newCount);
    if (newCount >= 7) {
      setDevMode(true);
      // Optional: Sound effect could go here
    }
  };

  // 2. OS VERSION EASTER EGG LOGIC (3 Clicks)
  const handleOsClick = () => {
    setOsClicks((prev) => prev + 1);
  };

  useEffect(() => {
    if (osClicks >= 3) {
      setShowOsEgg(true);
      // Auto-close the egg after 3 seconds
      const timer = setTimeout(() => {
        setShowOsEgg(false);
        setOsClicks(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [osClicks]);

  return (
    <div className="h-full bg-neutral-900 text-white flex flex-col font-mono animate-in slide-in-from-right duration-300 relative overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-neutral-800/50 shrink-0">
        <button
          onClick={onClose}
          className="hover:bg-white/10 p-1 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-bold tracking-wider">SYSTEM_CONFIG</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Profile Card */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
          <div className="flex items-center gap-3 text-green-400 mb-2">
            <User size={18} />
            <span className="text-sm font-bold uppercase">
              Operator Identity
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase tracking-widest">
              Access ID
            </label>
            <p className="text-sm text-neutral-300 truncate">{user?.email}</p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase tracking-widest">
              UUID
            </label>
            <p className="text-[10px] text-neutral-400 font-mono break-all">
              {user?.id}
            </p>
          </div>
        </div>

        {/* SYSTEM INFO & EASTER EGGS */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1 select-none">
          <div className="flex items-center gap-3 text-yellow-500 mb-4">
            <Cpu size={18} />
            <span className="text-sm font-bold uppercase">System Build</span>
          </div>

          {/* OS Version (Triple Click Trigger) */}
          <div
            onClick={handleOsClick}
            className="flex justify-between items-center p-2 rounded hover:bg-white/5 cursor-pointer transition-colors active:scale-95"
          >
            <label className="text-[10px] text-neutral-500 uppercase tracking-widest">
              OS Version
            </label>
            <p className="text-sm text-neutral-300">{SYSTEM_DATA.version}</p>
          </div>

          {/* Build Number (7 Click Trigger) */}
          <div
            onClick={handleBuildClick}
            className="flex justify-between items-center p-2 rounded hover:bg-white/5 cursor-pointer transition-colors active:scale-95"
          >
            <label className="text-[10px] text-neutral-500 uppercase tracking-widest">
              Build Number
            </label>
            <p className="text-sm text-neutral-300 font-mono">
              {SYSTEM_DATA.buildNumber}
            </p>
          </div>

          {/* Registered Developer */}
          <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
            <label className="text-[10px] text-neutral-500 uppercase tracking-widest">
              Developer
            </label>
            <p className="text-sm text-neutral-300 font-mono text-right">
              {SYSTEM_DATA.developer}
            </p>
          </div>
        </div>

        {/* HIDDEN DEV MENU (Now Interactive) */}
        {devMode && (
          <div className="bg-green-900/10 p-4 rounded-xl border border-green-500/30 space-y-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3 text-green-400 mb-2">
              <Code size={18} />
              <span className="text-sm font-bold uppercase">
                Developer Options
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Debug tools unlocked. Proceed with caution.
            </p>

            <button
              onClick={() => alert("Memory Dump: 0x000000 - [PROTECTED]")}
              className="flex items-center gap-2 text-xs bg-green-500/10 text-green-300 px-3 py-2 rounded hover:bg-green-500/20 w-full text-left font-mono transition-colors border border-green-500/20"
            >
              <Layers size={14} /> View Heap Dump
            </button>
            <button
              onClick={() => alert("Proxy Bypass: FAILED (Root Required)")}
              className="flex items-center gap-2 text-xs bg-green-500/10 text-green-300 px-3 py-2 rounded hover:bg-green-500/20 w-full text-left font-mono transition-colors border border-green-500/20"
            >
              <Shield size={14} /> Bypass Network Proxy
            </button>
            <button
              onClick={() => alert("Error Logs: Clean")}
              className="flex items-center gap-2 text-xs bg-green-500/10 text-green-300 px-3 py-2 rounded hover:bg-green-500/20 w-full text-left font-mono transition-colors border border-green-500/20"
            >
              <Bug size={14} /> System Error Logs
            </button>
          </div>
        )}

        {/* Danger Zone */}
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full bg-red-900/20 hover:bg-red-600 hover:text-white border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center justify-between group transition-all duration-300 mt-8"
        >
          <span className="text-sm font-bold uppercase">Terminate Session</span>
          <LogOut
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>

        <div className="h-4"></div>
      </div>

      {/* OS EASTER EGG OVERLAY */}
      {showOsEgg && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <Activity size={120} className="text-green-500 animate-spin-slow" />
          <h1 className="text-4xl font-bold text-white mt-8 tracking-tighter">
            Ph0enix OS
          </h1>
          <p className="text-green-500 font-mono mt-2">NIGHTSHADE EDITION</p>
        </div>
      )}

      <LogoutConfirmation
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={logout}
      />
    </div>
  );
}
