import { useEffect, useState } from "react";
import { UserX, Database, Fingerprint } from "lucide-react";

export default function SessionManager({ flag }) {
  const [checking, setChecking] = useState(true);

  // Set the cookie silently
  useEffect(() => {
    if (flag && flag !== "ERROR_MISSING_FLAG") {
      document.cookie = `temp_guest_session=${flag}; path=/`;
    }
    const timer = setTimeout(() => setChecking(false), 1500);
    return () => clearTimeout(timer);
  }, [flag]);

  return (
    <div className="min-h-full bg-slate-900 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300 font-bold tracking-wider text-sm">
            <Database size={16} className="text-blue-500" />
            IAM GATEWAY
          </div>
          <Fingerprint size={16} className="text-slate-500" />
        </div>

        <div className="p-8 text-center">
          {checking ? (
            <div className="py-10 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 font-mono text-xs animate-pulse">
                VALIDATING SESSION TOKENS...
              </p>
            </div>
          ) : (
            <div className="animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <UserX size={40} className="text-red-500" />
              </div>
              <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
                Access Denied
              </h1>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                The current session token is restricted. You must present valid
                Administrator credentials to proceed.
              </p>

              <div className="bg-black/50 p-4 rounded text-left border border-slate-700">
                <div className="text-xs text-slate-500 mb-1 font-mono uppercase tracking-wider">
                  Current State:
                </div>
                <div className="text-sm text-yellow-500 font-mono">
                  Role: GUEST
                </div>
                <div className="text-xs text-slate-500 mt-3 mb-1 font-mono uppercase tracking-wider">
                  Diagnostic:
                </div>
                <div className="text-xs text-slate-400 font-mono leading-relaxed">
                  A temp session has been dumped to dB storage for diagnostic.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
