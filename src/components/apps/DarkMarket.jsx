import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import {
  ShieldAlert,
  Key,
  Skull,
  TerminalSquare,
  AlertTriangle,
  EyeOff,
} from "lucide-react";

export default function DarkMarket() {
  const { profile, refreshProfile } = useAuth();
  const [purchaseStatus, setPurchaseStatus] = useState(null); // { type: 'success' | 'error', msg: '' }

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
    {
      id: "sabotage_ui",
      title: "UI Glitch Payload",
      desc: "Infects the target's visual interface with noise.",
      price: 500,
      icon: EyeOff,
      color: "text-purple-500",
      disabled: true, // Placeholder for multiplayer
    },
    {
      id: "skip_level",
      title: "Zero-Day Bypass",
      desc: "Completely bypass the current security node.",
      price: 1000,
      icon: Skull,
      color: "text-red-500",
    },
  ];

  const handlePurchase = async (item) => {
    if (item.disabled) return;

    if (profile.credits < item.price) {
      setPurchaseStatus({
        type: "error",
        msg: "INSUFFICIENT FUNDS. TRANSACTION REJECTED.",
      });
      setTimeout(() => setPurchaseStatus(null), 3000);
      return;
    }

    // 1. Deduct Credits in DB
    const newBalance = profile.credits - item.price;
    const { error } = await supabase
      .from("profiles")
      .update({ credits: newBalance })
      .eq("id", profile.id);

    if (error) {
      setPurchaseStatus({
        type: "error",
        msg: "NETWORK ERROR. TRANSACTION FAILED.",
      });
      return;
    }

    // 2. Refresh Context & Show Success
    await refreshProfile(profile.id);
    setPurchaseStatus({
      type: "success",
      msg: `TRANSACTION CLEARED. ${item.title.toUpperCase()} ACQUIRED.`,
    });

    // (Future Step: Actually trigger the hint/skip logic here based on item.id)

    setTimeout(() => setPurchaseStatus(null), 3000);
  };

  return (
    <div className="min-h-full bg-black text-red-500 font-mono p-6 animate-in fade-in duration-500 relative overflow-hidden">
      {/* Background Grid & Noise */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-black pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Market Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-red-900/50 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-950 border border-red-500 flex items-center justify-center animate-pulse">
              <ShieldAlert size={32} className="text-red-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
                PH0ENIX MARKET
              </h1>
              <p className="text-xs text-red-700 mt-1">
                TOR HIDDEN SERVICE v3 // ANONYMITY GUARANTEED
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 text-right bg-red-950/30 p-3 border border-red-900/50">
            <div className="text-[10px] text-red-700 mb-1">WALLET BALANCE</div>
            <div className="text-2xl font-bold text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">
              {profile?.credits || 0} <span className="text-sm">cR</span>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {purchaseStatus && (
          <div
            className={`p-4 mb-8 border flex items-center gap-3 font-bold text-sm tracking-widest uppercase animate-in slide-in-from-top-2
            ${purchaseStatus.type === "error" ? "bg-red-950/50 border-red-500 text-red-400" : "bg-green-950/50 border-green-500 text-green-400"}
          `}
          >
            <AlertTriangle size={18} /> {purchaseStatus.msg}
          </div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MARKET_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`bg-neutral-950 border border-red-900/30 p-5 relative group transition-all
              ${item.disabled ? "opacity-50 grayscale" : "hover:border-red-500 hover:shadow-[0_0_20px_rgba(255,0,0,0.2)]"}
            `}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 bg-black border border-neutral-800 ${item.color}`}
                >
                  <item.icon size={24} />
                </div>
                <div className="text-xl font-bold text-yellow-500">
                  {item.price} cR
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed min-h-[40px] mb-6">
                {item.desc}
              </p>

              <button
                onClick={() => handlePurchase(item)}
                disabled={item.disabled}
                className={`w-full py-3 font-bold tracking-widest text-sm border transition-all
                  ${
                    item.disabled
                      ? "bg-neutral-900 border-neutral-800 text-neutral-600 cursor-not-allowed"
                      : "bg-red-950/50 border-red-900 text-red-500 hover:bg-red-900 hover:text-white active:scale-[0.98]"
                  }
                `}
              >
                {item.disabled ? "OUT OF STOCK" : "INITIATE TRANSFER"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-[10px] text-red-900">
          ALL SALES FINAL. DO NOT TRUST ANYONE.
        </div>
      </div>
    </div>
  );
}
