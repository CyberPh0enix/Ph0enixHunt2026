import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import {
  ShieldAlert,
  Key,
  TerminalSquare,
  AlertTriangle,
  FastForward,
} from "lucide-react";
import { LEVEL_CONFIG } from "../../data/config";

export default function DarkMarket({
  onClose,
  solvedIds = [],
  skippedIds = [],
  setSkippedIds,
  progressionIds = [],
}) {
  const { profile, refreshProfile } = useAuth();
  const [purchaseStatus, setPurchaseStatus] = useState(null);

  const activeLevel = LEVEL_CONFIG.find(
    (level) =>
      (!level.requires || progressionIds.includes(level.requires)) &&
      !solvedIds.includes(level.id) &&
      !skippedIds.includes(level.id),
  );

  const MARKET_ITEMS = [
    {
      id: "hint_tier1",
      title: "Encrypted Hint (Tier 1)",
      desc: "Decrypts a minor clue for your current active node.",
      price: 50,
      icon: Key,
      color: "text-yellow-500",
    },
    {
      id: "hint_tier2",
      title: "Root Exploit Guide",
      desc: "Detailed vulnerability analysis for the active node.",
      price: 150,
      icon: TerminalSquare,
      color: "text-orange-500",
    },
  ];

  const handlePurchase = async (item) => {
    if (profile.credits < item.price) {
      setPurchaseStatus({
        type: "error",
        msg: "INSUFFICIENT FUNDS. TRANSACTION REJECTED.",
      });
      setTimeout(() => setPurchaseStatus(null), 3000);
      return;
    }

    const newBalance = profile.credits - item.price;
    const { error: creditError } = await supabase
      .from("profiles")
      .update({ credits: newBalance })
      .eq("id", profile.id);

    if (creditError) {
      setPurchaseStatus({
        type: "error",
        msg: "NETWORK ERROR. TRANSACTION FAILED.",
      });
      return;
    }

    if (item.id === "skip_level" && activeLevel) {
      const { error: skipError } = await supabase
        .from("skipped_puzzles")
        .insert([{ user_id: profile.id, puzzle_id: activeLevel.id }]);

      if (!skipError) {
        setSkippedIds([...skippedIds, activeLevel.id]);
      }
    }

    await refreshProfile(profile.id);
    setPurchaseStatus({
      type: "success",
      msg: `TRANSACTION CLEARED. ${item.title.toUpperCase()} ACQUIRED.`,
    });
    setTimeout(() => setPurchaseStatus(null), 3000);
  };

  return (
    // flex column with h-full
    <div className="h-full bg-black text-red-500 font-mono flex flex-col animate-in fade-in duration-500 relative">
      {/* Background Textures */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-black pointer-events-none z-0"></div>

      {/* Header: Fixed at top */}
      <div className="p-6 border-b border-red-900/50 shrink-0 relative z-10 bg-black/60 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-red-950 border border-red-500 flex items-center justify-center animate-pulse shrink-0">
              <ShieldAlert className="text-red-500 w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
                PH0ENIX MARKET
              </h1>
              <p className="text-[10px] md:text-xs text-red-700 mt-1">
                TOR HIDDEN SERVICE v3
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right bg-red-950/30 p-2 md:p-3 border border-red-900/50 w-full md:w-auto flex md:block justify-between items-center">
            <div className="text-[10px] text-red-700 md:mb-1">
              WALLET BALANCE
            </div>
            <div className="text-xl md:text-2xl font-bold text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">
              {profile?.credits || 0}{" "}
              <span className="text-xs md:text-sm">cR</span>
            </div>
          </div>
        </div>
      </div>

      {/*  Body: Scrollable area for the items grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative z-10">
        <div className="max-w-4xl mx-auto">
          {purchaseStatus && (
            <div
              className={`p-4 mb-6 border flex items-center gap-3 font-bold text-[10px] md:text-sm tracking-widest uppercase animate-in slide-in-from-top-2 ${purchaseStatus.type === "error" ? "bg-red-950/50 border-red-500 text-red-400" : "bg-green-950/50 border-green-500 text-green-400"}`}
            >
              <AlertTriangle size={18} className="shrink-0" />{" "}
              {purchaseStatus.msg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-8">
            {MARKET_ITEMS.map((item) => (
              <div
                key={item.id}
                className="bg-neutral-950 border border-red-900/30 p-4 md:p-5 group hover:border-red-500 transition-all flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`p-2 md:p-3 bg-black border border-neutral-800 ${item.color}`}
                  >
                    <item.icon size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div className="text-lg md:text-xl font-bold text-yellow-500">
                    {item.price} cR
                  </div>
                </div>
                <h3 className="text-base md:text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-[10px] md:text-xs text-neutral-500 leading-relaxed mb-6 flex-1">
                  {item.desc}
                </p>
                <button
                  onClick={() => handlePurchase(item)}
                  className="w-full py-2.5 md:py-3 font-bold tracking-widest text-[10px] md:text-sm border bg-red-950/50 border-red-900 text-red-500 hover:bg-red-900 hover:text-white transition-all mt-auto"
                >
                  INITIATE TRANSFER
                </button>
              </div>
            ))}

            {/* ZERO-DAY BYPASS SECURE ITEM */}
            <div className="bg-[#0a0a0a] border border-red-900 p-4 md:p-5 group shadow-[0_0_15px_rgba(255,0,0,0.1)] flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 md:p-3 bg-black border border-red-900 text-red-500 animate-pulse">
                  <FastForward size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="text-lg md:text-xl font-bold text-red-500 border border-red-900 bg-red-950/30 px-2 rounded">
                  50 cR
                </div>
              </div>
              <h3 className="text-base md:text-lg font-bold text-white mb-2">
                Zero-Day Bypass
              </h3>
              <p className="text-[10px] md:text-xs text-neutral-500 leading-relaxed mb-4 flex-1">
                Deploy a syndicate exploit to forcefully bypass the active
                security node.
              </p>

              <div className="bg-red-950/40 border border-red-900/50 rounded p-2 text-[9px] md:text-[10px] text-red-400 mb-4 flex justify-between items-center">
                <span>TARGET NODE:</span>
                <span className="font-bold text-white truncate max-w-[120px] md:max-w-none text-right">
                  {activeLevel
                    ? activeLevel.title.toUpperCase()
                    : "NONE ACTIVE"}
                </span>
              </div>

              <button
                onClick={() =>
                  handlePurchase({
                    id: "skip_level",
                    price: 50,
                    title: "Zero-Day Bypass",
                  })
                }
                disabled={!activeLevel}
                className={`w-full py-2.5 md:py-3 font-bold tracking-widest text-[10px] md:text-sm border transition-all mt-auto ${!activeLevel ? "bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed" : "bg-red-900/40 border-red-500 text-red-100 hover:bg-red-600 shadow-[0_0_15px_rgba(255,0,0,0.4)]"}`}
              >
                {!activeLevel
                  ? "NO TARGET ACQUIRED"
                  : "DEPLOY EXPLOIT (-50 cR)"}
              </button>
            </div>
          </div>

          <div className="mt-4 md:mt-8 pb-8 text-center text-[8px] md:text-[10px] text-red-900">
            ALL SALES FINAL. DO NOT TRUST ANYONE.
          </div>
        </div>
      </div>
    </div>
  );
}
