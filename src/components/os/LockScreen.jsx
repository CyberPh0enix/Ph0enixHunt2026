import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { SYSTEM_DATA, WALLPAPER_mVjq } from "../../config/build.prop";
import { Lock, User, ChevronRight, Loader2, Cpu } from "lucide-react";

export default function LockScreen() {
  const { login, signup } = useAuth();
  // Using the safer hook we fixed earlier
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegistering) {
        await signup(email, password, username);
      } else {
        const { error } = await login(email, password);
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // FIX 1: Use 'fixed inset-0' to guarantee full viewport coverage, just like Desktop.jsx
    <div
      className="fixed inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden text-white font-sans"
      style={{
        background: WALLPAPER_mVjq,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>

      {/* ================= DESKTOP LAYOUT ================= */}
      {isDesktop && (
        <div className="z-10 w-full max-w-5xl grid grid-cols-2 items-center gap-16 p-12 animate-in fade-in zoom-in duration-500">
          {/* Left Side: Clock & Branding */}
          <div className="space-y-6 text-right border-r border-white/10 pr-12">
            <div>
              <h1 className="text-9xl font-thin tracking-tighter drop-shadow-2xl">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </h1>
              <p className="text-3xl font-light text-white/60">
                {new Date().toLocaleDateString([], {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 text-green-500/80">
              <Cpu size={24} />
              <span className="font-mono tracking-[0.2em] text-sm uppercase">
                {SYSTEM_DATA.osName}
              </span>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="max-w-sm w-full bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/5 shadow-2xl">
            <div className="mb-8 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-neutral-800/80 border border-white/10 flex items-center justify-center shadow-lg">
                <User size={32} className="text-white/70" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-wide">
                  System Access
                </h2>
                <p className="text-xs text-white/40 font-mono mt-1">
                  RESTRICTED ENVIRONMENT
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-xs p-3 rounded font-mono text-center">
                  {error}
                </div>
              )}

              {isRegistering && (
                <input
                  type="text"
                  placeholder="Codename"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-white/20"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
              )}

              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-white/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Password"
                  className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all placeholder:text-white/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-4 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <ChevronRight size={24} />
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setIsRegistering(!isRegistering);
                  }}
                  className="text-xs text-white/40 hover:text-white transition-colors tracking-wide"
                >
                  {isRegistering ? "Back to Login" : "Initialize New Identity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MOBILE LAYOUT ================= */}
      {!isDesktop && (
        <div className="z-10 flex flex-col items-center justify-between h-full w-full max-w-xs py-12 animate-in slide-in-from-bottom duration-500">
          {/* Top: Clock */}
          <div className="text-center mt-8">
            <h1 className="text-7xl font-thin tracking-tighter drop-shadow-lg">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </h1>
            <p className="text-green-500 font-mono text-xs mt-3 tracking-[0.3em] uppercase opacity-80">
              {SYSTEM_DATA.device}
            </p>
          </div>

          {/* Middle: Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-4 backdrop-blur-xl bg-white/5 p-6 rounded-[2rem] border border-white/10 shadow-2xl"
          >
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-xs p-2 rounded text-center">
                {error}
              </div>
            )}

            {isRegistering && (
              <input
                type="text"
                placeholder="Codename"
                className="w-full bg-black/40 border-0 rounded-xl py-3 px-4 text-sm text-center focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-white/20 text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}

            <input
              type="email"
              placeholder="Enter ID"
              className="w-full bg-black/40 border-0 rounded-xl py-3 px-4 text-sm text-center focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-white/20 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter Passcode"
              className="w-full bg-black/40 border-0 rounded-xl py-3 px-4 text-sm text-center focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-white/20 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-500 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isRegistering ? (
                "INITIALIZE"
              ) : (
                "DECIPHER"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setError("");
                setIsRegistering(!isRegistering);
              }}
              className="w-full text-[10px] text-white/30 hover:text-white uppercase tracking-widest mt-2 transition-colors"
            >
              {isRegistering ? "Abort Registration" : "Create New User"}
            </button>
          </form>

          {/* Bottom: Footer */}
          <div className="flex flex-col items-center gap-2 text-white/20 pb-6">
            <Lock size={14} />
            <span className="text-[9px] tracking-[0.3em] font-mono">
              SECURE BOOT ENABLED
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
