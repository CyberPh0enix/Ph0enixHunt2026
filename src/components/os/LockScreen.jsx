import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Lock, User, ChevronRight, Loader2 } from "lucide-react";

export default function LockScreen() {
  const { login, signup } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form State
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
    <div className="h-full w-full flex flex-col justify-between p-6 bg-gradient-to-br from-neutral-900 to-black text-white relative overflow-hidden">
      {/* Background Glitch Effect */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>

      {/* Top Spacer */}
      <div className="flex-1"></div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center z-10 w-full max-w-xs mx-auto">
        {/* Clock */}
        <div className="mb-8 text-center">
          <h1 className="text-6xl font-thin tracking-tighter text-white/90">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </h1>
          <p className="text-green-500/80 font-mono text-xs mt-2 tracking-widest uppercase">
            {new Date().toLocaleDateString([], {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Auth Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full space-y-3 backdrop-blur-md bg-white/5 p-5 rounded-2xl border border-white/10 shadow-2xl"
        >
          {error && (
            <div className="text-red-400 text-[10px] text-center font-mono bg-red-900/20 p-2 rounded border border-red-500/20">
              {error}
            </div>
          )}

          {isRegistering && (
            <div className="relative group">
              <User
                size={14}
                className="absolute left-3 top-3 text-neutral-500 group-focus-within:text-green-500 transition-colors"
              />
              <input
                type="text"
                placeholder="Codename"
                className="w-full bg-black/60 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder:text-neutral-600 font-mono"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <input
            type="email"
            placeholder="Email ID"
            className="w-full bg-black/60 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder:text-neutral-600 font-mono"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Passcode"
            className="w-full bg-black/60 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-green-500/50 transition-all placeholder:text-neutral-600 font-mono"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-900/20 hover:bg-green-600 hover:text-black border border-green-500/30 text-green-400 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : isRegistering ? (
              "Initialize"
            ) : (
              "Decrypt"
            )}
            {!loading && (
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setError("");
                setIsRegistering(!isRegistering);
              }}
              className="text-[10px] text-neutral-500 hover:text-white uppercase tracking-widest transition-colors"
            >
              {isRegistering ? "Return to Login" : "Create Identity"}
            </button>
          </div>
        </form>
      </div>

      {/* Footer Spacer */}
      <div className="flex-1 flex flex-col justify-end items-center pb-2">
        <div className="flex flex-col items-center gap-1 text-neutral-700/50">
          <Lock size={12} />
          <span className="text-[9px] font-mono tracking-[0.2em]">
            SECURE BOOT ENABLED
          </span>
        </div>
      </div>
    </div>
  );
}
