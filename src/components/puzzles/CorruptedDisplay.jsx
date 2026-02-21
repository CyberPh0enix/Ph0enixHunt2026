import { useState } from "react";
import { Key, AlertTriangle, ShieldCheck } from "lucide-react";

export default function CorruptedDisplay({ flag }) {
  const [revealed, setRevealed] = useState(false);

  if (revealed) {
    throw new Error(`CRITICAL_FAILURE: ${flag}`);
  }

  const handleFakeClick = () => {
    alert(
      "WARNING: This element is locked by System Administrator. Please upgrade your corporate license.",
    );
  };

  return (
    <div className="min-h-full bg-slate-50 flex items-center justify-center p-6 font-sans">
      {/* The Target UI (Underneath) */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden relative border border-slate-200">
        <div className="bg-slate-900 p-6 text-center">
          <Key size={40} className="text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">
            Master Key Generator
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Authorized Personnel Only
          </p>
        </div>

        <div className="p-8 text-center flex flex-col items-center">
          <p className="text-slate-600 mb-8">
            Click below to provision a new Level-5 Clearance Flag.
          </p>

          {/* THE REAL BUTTON (Hidden under ad) */}
          <button
            onClick={() => setRevealed(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95 z-0"
          >
            <ShieldCheck size={20} />
            PROVISION CLEARANCE FLAG
          </button>
        </div>

        {/* THE BLOCKER (Top Layer - high z-index) */}
        <div
          onClick={handleFakeClick}
          className="absolute inset-0 bg-red-600/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center cursor-not-allowed border-4 border-red-500/50"
          style={{ zIndex: 9999 }}
        >
          <AlertTriangle size={64} className="text-white mb-6 animate-bounce" />
          <h2 className="text-white text-3xl font-black tracking-tight text-center px-4">
            LICENSE EXPIRED
          </h2>
          <p className="text-white/90 font-medium mt-4 text-center px-8">
            This module has been disabled by the IT Department due to an unpaid
            software license.
          </p>
          <div className="mt-8 bg-black/30 px-4 py-2 rounded text-white/50 text-xs font-mono">
            DOM Element ID: block-overlay-99
          </div>
        </div>
      </div>
    </div>
  );
}
