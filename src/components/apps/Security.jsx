import { useState } from "react";
import { Video, Lock, Activity, Menu, X, Sliders } from "lucide-react";

export default function Security({ onClose, isUnlocked, renderFeed }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Advanced Forensic Calibration States
  const [exposure, setExposure] = useState(100);
  const [gain, setGain] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [invert, setInvert] = useState(false);

  // The CSS filter string
  const filterStyle = {
    filter: `brightness(${exposure}%) contrast(${gain}%) saturate(${saturation}%) ${invert ? "invert(100%) hue-rotate(180deg)" : ""}`,
  };

  return (
    <div className="h-full bg-black text-white flex flex-col font-sans animate-in zoom-in-95 duration-200 relative select-none">
      {/* CSS Animations for CCTV Feel */}
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
        @keyframes jitter {
          0% { transform: translateX(0); }
          50% { transform: translateX(1px); }
          100% { transform: translateX(0); }
        }
        .animate-jitter {
          animation: jitter 0.2s infinite;
        }
      `}</style>

      {/* App Header */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between bg-neutral-900 shrink-0 z-40 relative">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden hover:bg-white/10 p-1.5 rounded-full transition-colors text-neutral-400"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-1.5 rounded-full transition-colors text-neutral-400"
          >
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          </button>
          <span className="font-mono text-sm font-bold flex items-center gap-2 text-neutral-300">
            <Video size={16} /> CCTV_MONITOR_v3
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isMenuOpen && (
          <div
            className="absolute inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Sidebar Controls */}
        <div
          className={`absolute md:relative z-40 h-full w-64 bg-neutral-900/95 backdrop-blur-md border-r border-white/10 p-4 flex flex-col gap-6 shrink-0 transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div>
            <h3 className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2 font-bold">
              Live Feeds
            </h3>
            <button className="w-full text-left p-2 rounded bg-white/10 text-xs font-mono border border-white/20 flex justify-between items-center">
              CAM_01_SRV{" "}
              {isUnlocked ? (
                <Activity size={12} className="text-green-500" />
              ) : (
                <Lock size={12} className="text-red-500" />
              )}
            </button>
          </div>

          <div
            className={`flex-1 flex flex-col gap-5 transition-opacity duration-300 ${isUnlocked ? "opacity-100" : "opacity-30 pointer-events-none"}`}
          >
            <h3 className="text-[10px] text-neutral-500 uppercase tracking-widest border-b border-white/10 pb-2 font-bold flex items-center gap-2">
              <Sliders size={12} /> Forensic Calibrator
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>EXPOSURE</span>
                <span>{exposure}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                step="10"
                value={exposure}
                onChange={(e) => setExposure(e.target.value)}
                className="w-full accent-blue-500 h-1 bg-white/20 rounded appearance-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>SIGNAL GAIN</span>
                <span>{gain}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="4000"
                step="100"
                value={gain}
                onChange={(e) => setGain(e.target.value)}
                className="w-full accent-green-500 h-1 bg-white/20 rounded appearance-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                <span>COLOR BOOST</span>
                <span>{saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={saturation}
                onChange={(e) => setSaturation(e.target.value)}
                className="w-full accent-purple-500 h-1 bg-white/20 rounded appearance-none"
              />
            </div>

            <label className="flex items-center gap-2 mt-2 cursor-pointer group bg-white/5 p-2 rounded border border-white/10 hover:bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={invert}
                onChange={(e) => setInvert(e.target.checked)}
                className="appearance-none w-4 h-4 border border-white/30 rounded checked:bg-orange-500 transition-colors"
              />
              <span className="text-xs font-mono text-neutral-300">
                THERMAL INVERSION
              </span>
            </label>

            <button
              onClick={() => {
                setExposure(100);
                setGain(100);
                setSaturation(100);
                setInvert(false);
              }}
              className="mt-auto text-[10px] text-neutral-500 hover:text-white border border-white/10 rounded p-1.5 transition-colors"
            >
              RESET CALIBRATION
            </button>
          </div>
        </div>

        {/* Video Feed Area */}
        <div className="flex-1 relative bg-[#050505] overflow-hidden flex items-center justify-center min-w-0">
          {isUnlocked ? (
            // Add a subtle jitter animation to the feed
            <div className="w-full h-full animate-jitter opacity-90">
              {renderFeed(filterStyle)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-red-500/50 space-y-4 font-mono p-4 text-center">
              <Video size={48} className="opacity-20" />
              <p className="text-sm tracking-widest">FEED OFFLINE</p>
            </div>
          )}

          {/* THE MAGIC: SVG Fractal Noise Overlay */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay z-20 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          ></div>

          {/* Animated CRT Scanline */}
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-30 mix-blend-screen">
            <div className="w-full h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-scanline shadow-[0_0_20px_rgba(255,255,255,0.1)]"></div>
          </div>

          {/* Static CRT Scanline Texture */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-30 opacity-40"></div>

          {/* Timestamp */}
          {isUnlocked && (
            <div className="absolute top-4 right-4 font-mono text-[10px] md:text-xs text-white/70 z-40 pointer-events-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              <span className="text-red-500 animate-pulse mr-2 drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]">
                ● REC
              </span>
              2026-02-19 {new Date().toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
