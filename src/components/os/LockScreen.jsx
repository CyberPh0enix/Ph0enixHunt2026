import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { SYSTEM_DATA, WALLPAPER_mVjq } from "../../config/build.prop";
import { Lock, User, Loader2, Cpu } from "lucide-react";

export default function LockScreen({ onUnlock }) {
  const { user, login, signup } = useAuth();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Auto-Unlocker: Detects the exact moment Supabase confirms the user
  useEffect(() => {
    if (user && onUnlock) {
      onUnlock();
    }
  }, [user, onUnlock]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegistering) {
        if (!fullName || !email || !password) {
          throw new Error("All fields are required.");
        }

        if (localStorage.getItem("ph0enix_device_registered")) {
          throw new Error(
            "SECURITY LOCK: Device already registered to an operative.",
          );
        }

        const { data, error: signupError } = await signup(
          email,
          password,
          fullName,
        );
        if (signupError) throw signupError;

        // [FIX] Catch silent failures from Supabase (e.g., Email Confirmation still ON)
        if (!data?.session) {
          throw new Error(
            "Registration recorded, but Awaiting Email Verification. Check your inbox.",
          );
        }

        localStorage.setItem("ph0enix_device_registered", "true");
      } else {
        // [FIX] Cleanly await the login. If it fails, it will throw straight to the catch block.
        await login(email, password);
      }
    } catch (err) {
      // [FIX] Guarantee the spinner stops if an error occurs!
      setError(err.message);
      setLoading(false);
    }
  };

  const renderForm = () => (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-xs p-3 rounded font-mono text-center shadow-inner">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {isRegistering && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <input
              type="text"
              placeholder="Operative Full Name"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white/40 text-white"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        )}

        <input
          type="email"
          placeholder="Email Address"
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white/40 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-white/40 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-widest rounded-lg px-4 py-3 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(37,99,235,0.3)] mt-2"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : isRegistering ? (
            "INITIALIZE"
          ) : (
            "DECIPHER"
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => {
            setError("");
            setIsRegistering(!isRegistering);
          }}
          className="text-[10px] text-white/40 hover:text-white transition-colors tracking-widest uppercase font-bold"
        >
          {isRegistering ? "Return to Login" : "Register New Operative"}
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden text-white font-sans"
      style={{
        background: WALLPAPER_mVjq,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>

      {isDesktop ? (
        <div className="z-10 w-full max-w-5xl grid grid-cols-2 items-center gap-16 p-12 animate-in fade-in zoom-in duration-500">
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
            <div className="flex items-center justify-end gap-3 text-blue-500/80">
              <Cpu size={24} />
              <span className="font-mono tracking-[0.2em] text-sm uppercase">
                {SYSTEM_DATA.osName}
              </span>
            </div>
          </div>

          <div className="max-w-sm w-full bg-black/30 backdrop-blur-2xl p-8 rounded-2xl border border-white/10 shadow-2xl">
            <div className="mb-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-neutral-800/80 border border-white/10 flex items-center justify-center shadow-lg">
                <User size={28} className="text-white/70" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-wide">
                  System Access
                </h2>
                <p className="text-[10px] text-white/40 font-mono mt-1 tracking-widest">
                  RESTRICTED ENVIRONMENT
                </p>
              </div>
            </div>
            {renderForm()}
          </div>
        </div>
      ) : (
        <div className="z-10 flex flex-col items-center justify-center h-full w-full max-w-sm p-6 animate-in slide-in-from-bottom duration-500">
          <div className="text-center mb-8">
            <h1 className="text-6xl sm:text-7xl font-thin tracking-tighter drop-shadow-lg">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </h1>
            <p className="text-blue-500 font-mono text-[10px] mt-3 tracking-[0.3em] uppercase opacity-80">
              {SYSTEM_DATA.device}
            </p>
          </div>
          <div className="w-full backdrop-blur-2xl bg-black/40 p-6 rounded-3xl border border-white/10 shadow-2xl">
            {renderForm()}
          </div>
          <div className="flex flex-col items-center gap-2 text-white/20 mt-8">
            <Lock size={12} />
            <span className="text-[8px] tracking-[0.3em] font-mono">
              SECURE BOOT ENABLED
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
