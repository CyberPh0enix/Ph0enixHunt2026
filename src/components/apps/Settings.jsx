import { useState, useEffect } from "react";
import eruda from "eruda";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { SensoryEngine } from "../../utils/sensory";
import {
  LogOut,
  Shield,
  ArrowLeft,
  Cpu,
  Code,
  Layers,
  Activity,
  Bug,
  ToggleLeft,
  ToggleRight,
  Volume2,
  VolumeX,
  Vibrate,
} from "lucide-react";
import LogoutConfirmation from "../os/LogoutConfirm";
import { SYSTEM_DATA } from "../../config/build.prop";
import { devExploitManager } from "../../utils/devExploit";
import SecureCard from "../ui/SecureCard";

export default function Settings({ onClose }) {
  const { user, profile, logout } = useAuth();
  const { addToast } = useToast();
  const [showConfirm, setShowConfirm] = useState(false);

  // SENSORY STATES
  const [soundOn, setSoundOn] = useState(SensoryEngine.soundEnabled);
  const [hapticsOn, setHapticsOn] = useState(SensoryEngine.hapticsEnabled);

  // EASTER EGG STATES (Original logic retained)
  const [osClicks, setOsClicks] = useState(0);
  const [showOsEgg, setShowOsEgg] = useState(false);
  const [devClicks, setDevClicks] = useState(0);

  const [devMenuUnlocked, setDevMenuUnlocked] = useState(
    localStorage.getItem("_DEV_MENU_UNLOCKED") === "true",
  );
  const [devModeActive, setDevModeActive] = useState(
    localStorage.getItem("_DEV_MODE_ACTIVE") === "true",
  );
  const [webInspectorActive, setWebInspectorActive] = useState(
    localStorage.getItem("_WEB_INSPECTOR_ACTIVE") === "true",
  );

  const toggleSound = () => {
    SensoryEngine.soundEnabled = !soundOn;
    setSoundOn(!soundOn);
    if (!soundOn) SensoryEngine.playKeystroke();
  };

  const toggleHaptics = () => {
    SensoryEngine.hapticsEnabled = !hapticsOn;
    setHapticsOn(!hapticsOn);
    if (!hapticsOn) SensoryEngine.vibrate([50]);
  };

  const handleBuildClick = () => {
    if (devMenuUnlocked) return;
    const newCount = devClicks + 1;
    setDevClicks(newCount);
    if (newCount >= 7) {
      setDevMenuUnlocked(true);
      localStorage.setItem("_DEV_MENU_UNLOCKED", "true");
      setDevModeActive(true);
      localStorage.setItem("_DEV_MODE_ACTIVE", "true");
      addToast("Developer Mode Enabled. Debugging active.", "warning");
      devExploitManager.triggerDevMode();
    }
  };

  const toggleDevMode = () => {
    const newState = !devModeActive;
    setDevModeActive(newState);
    localStorage.setItem("_DEV_MODE_ACTIVE", newState.toString());
  };

  const toggleWebInspector = () => {
    if (!devModeActive) return;
    const newState = !webInspectorActive;
    setWebInspectorActive(newState);
    localStorage.setItem("_WEB_INSPECTOR_ACTIVE", newState.toString());
  };

  const handleOsClick = () => {
    setOsClicks((prev) => prev + 1);
  };

  useEffect(() => {
    if (osClicks >= 3) {
      setShowOsEgg(true);
      const timer = setTimeout(() => {
        setShowOsEgg(false);
        setOsClicks(0);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [osClicks]);

  useEffect(() => {
    if (!devModeActive && webInspectorActive) {
      setWebInspectorActive(false);
      localStorage.setItem("_WEB_INSPECTOR_ACTIVE", "false");
    }
  }, [devModeActive]);

  useEffect(() => {
    if (devModeActive && webInspectorActive) {
      if (!eruda._isInit) {
        eruda.init({
          defaults: {
            displaySize: 40,
            transparency: 0.9,
            theme: "Monokai Pro",
          },
        });
        addToast("Mobile Web Inspector Injected.", "success");
      }
    } else {
      if (eruda._isInit) {
        eruda.destroy();
        addToast("Mobile Web Inspector Removed.", "info");
      }
    }
  }, [devModeActive, webInspectorActive]);

  return (
    <div className="h-full bg-neutral-900 text-white flex flex-col font-mono animate-in slide-in-from-right duration-300 relative overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-neutral-800/50 shrink-0">
        <button
          onClick={onClose}
          className="hover:bg-white/10 p-1 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-bold tracking-wider">SYSTEM_CONFIG</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* NEW SECURE CARD UI */}
        <SecureCard
          username={profile?.full_name}
          email={user?.email}
          xp={profile?.score}
          credits={profile?.credits}
        />

        {/* SENSORY CONTROLS */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
          <div className="flex items-center gap-3 text-purple-400 mb-2">
            <Activity size={18} />
            <span className="text-sm font-bold uppercase">
              Sensory Interface
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-xs text-neutral-300 flex items-center gap-2">
              <Volume2 size={14} /> System Audio
            </span>
            <button
              onClick={toggleSound}
              className={`${soundOn ? "text-green-500" : "text-neutral-600"} transition-colors`}
            >
              {soundOn ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-xs text-neutral-300 flex items-center gap-2">
              <Vibrate size={14} /> Haptics
            </span>
            <button
              onClick={toggleHaptics}
              className={`${hapticsOn ? "text-green-500" : "text-neutral-600"} transition-colors`}
            >
              {hapticsOn ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
          </div>
        </div>

        {/* SYSTEM INFO & EASTER EGGS */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1 select-none">
          <div className="flex items-center gap-3 text-yellow-500 mb-4">
            <Cpu size={18} />
            <span className="text-sm font-bold uppercase">System Build</span>
          </div>
          <div
            onClick={handleOsClick}
            className="flex justify-between items-center p-2 rounded hover:bg-white/5 cursor-pointer transition-colors active:scale-95"
          >
            <label className="text-[10px] text-neutral-500 uppercase tracking-widest">
              OS Version
            </label>
            <p className="text-sm text-neutral-300">{SYSTEM_DATA.version}</p>
          </div>
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
          <div className="flex justify-between items-center p-2 rounded hover:bg-white/5 transition-colors">
            <label className="text-[10px] text-neutral-500 uppercase tracking-widest">
              Developer
            </label>
            <p className="text-sm text-neutral-300 font-mono text-right">
              {SYSTEM_DATA.developer}
            </p>
          </div>
        </div>

        {/* HIDDEN DEV MENU */}
        {devMenuUnlocked && (
          <div className="bg-green-900/10 p-4 rounded-xl border border-green-500/30 space-y-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3 text-green-400 mb-2">
              <Code size={18} />
              <span className="text-sm font-bold uppercase">
                Developer Options
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-green-500/50">
              <span className="text-xs font-bold text-neutral-200">
                Developer Mode
              </span>
              <button
                onClick={toggleDevMode}
                className={`${devModeActive ? "text-green-500" : "text-neutral-500"} transition-colors`}
              >
                {devModeActive ? (
                  <ToggleRight size={28} />
                ) : (
                  <ToggleLeft size={28} />
                )}
              </button>
            </div>
            <div
              className={`transition-opacity duration-300 space-y-3 ${devModeActive ? "opacity-100" : "opacity-30 pointer-events-none"}`}
            >
              <div className="flex items-center justify-between py-1 border-b border-green-500/20 mb-2">
                <span className="text-xs text-neutral-300">
                  Enable Web Inspector
                </span>
                <button
                  onClick={toggleWebInspector}
                  className={`${webInspectorActive ? "text-green-500" : "text-neutral-500"} transition-colors`}
                >
                  {webInspectorActive ? (
                    <ToggleRight size={28} />
                  ) : (
                    <ToggleLeft size={28} />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-neutral-400">
                Debug tools active. View & Modify DOM.
              </p>
              <button
                onClick={() =>
                  addToast("Memory Dump: 0x000000 - [PROTECTED]", "error")
                }
                className="flex items-center gap-2 text-xs bg-green-500/10 text-green-300 px-3 py-2 rounded hover:bg-green-500/20 w-full text-left font-mono transition-colors border border-green-500/20"
              >
                <Layers size={14} /> View Heap Dump
              </button>
              <button
                onClick={() =>
                  addToast("Proxy Bypass: FAILED (Root Required)", "error")
                }
                className="flex items-center gap-2 text-xs bg-green-500/10 text-green-300 px-3 py-2 rounded hover:bg-green-500/20 w-full text-left font-mono transition-colors border border-green-500/20"
              >
                <Shield size={14} /> Bypass Network Proxy
              </button>
              <button
                onClick={() =>
                  addToast("Error Logs: Clean. No threats detected.", "success")
                }
                className="flex items-center gap-2 text-xs bg-green-500/10 text-green-300 px-3 py-2 rounded hover:bg-green-500/20 w-full text-left font-mono transition-colors border border-green-500/20"
              >
                <Bug size={14} /> System Error Logs
              </button>
            </div>
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
