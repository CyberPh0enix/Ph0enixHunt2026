import { Shield, Lock, Fingerprint } from "lucide-react";

export default function SecureCard({ username, email, xp, credits }) {
  return (
    <div className="relative bg-[#0a0a0a] border border-white/10 rounded-xl p-5 overflow-hidden group">
      {/* Background accents */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Fingerprint size={100} className="text-green-500" />
      </div>
      <div className="absolute left-0 top-0 w-1 h-full bg-green-500/50"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={14} className="text-green-500" />
              <span className="text-[10px] uppercase tracking-widest text-green-500 font-bold">
                Secure Operative ID
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wider">
              {username || "GUEST_USER"}
            </h2>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              {email || "UNREGISTERED"}
            </p>
          </div>
          <Lock size={18} className="text-neutral-500" />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 bg-black/40 -mx-5 -mb-5 px-5 pb-5">
          <div>
            <p className="text-[9px] text-neutral-500 font-bold mb-1 uppercase tracking-widest">
              Clearance Level
            </p>
            <p className="font-mono text-green-400 font-bold">{xp || 0} XP</p>
          </div>
          <div>
            <p className="text-[9px] text-neutral-500 font-bold mb-1 uppercase tracking-widest">
              Wallet Hash
            </p>
            <p className="font-mono text-yellow-500 font-bold">
              {credits || 0} cR
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
