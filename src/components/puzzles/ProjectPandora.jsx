import { useState, useMemo, useEffect } from "react";
import { Lock, Unlock, Key, AlertTriangle, ShieldCheck } from "lucide-react";
import ObfuscatedText from "../ui/ObfuscatedText";
import { useToast } from "../../context/ToastContext";
import { SensoryEngine } from "../../utils/sensory";
import { supabase } from "../../lib/supabase";

// --- STRUCTURED HONEYPOT EMAILS ---
const PANDORA_EMAILS = [
  {
    id: "mail-1",
    unread: true,
    time: "Just now",
    from: "Architect",
    address: "architect@cyberphoenix.local",
    to: "candidate@cyberphoenix.local",
    subject: "Bypass the Market",
    preview: "I see GHOST priced you out of the Pandora Cipher...",
    body: "Candidate,\n\nI see GHOST priced the Pandora Cipher at 800 cR on the Dark Market to lock you out. We don't have time to play his economy games.\n\nI built a backdoor. Open your local terminal and execute the following authentic diagnostic payload to spawn the cipher locally for free:",
    command: "sys_auth --override --target=pandora",
    footer:
      "Run it quickly before he patches the node. I'll meet you on the other side.\n\n— The Architect",
    attachments: ["sys_auth_doc.pdf"],
  },
  {
    id: "mail-2",
    unread: false,
    time: "Yesterday",
    from: "IT Dept",
    address: "noreply@cyberphoenix.local",
    to: "all@cyberphoenix.local",
    subject: "Scheduled Maintenance",
    preview: "Please be aware that external routing...",
    body: "Please be aware that external routing will be disabled for standard users over the weekend due to migrating the core databases.",
    footer: "CyberPhoenix IT Support",
  },
];

export default function ProjectPandora({ flag }) {
  const [loreInput, setLoreInput] = useState("");
  const [loreUnlocked, setLoreUnlocked] = useState(false);
  const [marketUnlocked, setMarketUnlocked] = useState(false);
  const { addToast } = useToast();

  const finalUnlocked = loreUnlocked && marketUnlocked;
  const encodedFlag = useMemo(() => btoa(flag), [flag]);

  // HONEYPOT ATTENTION TRIGGER
  useEffect(() => {
    if (!localStorage.getItem("pandora_honeypot_triggered")) {
      // Inject emails into the shell app
      localStorage.setItem("ph0enix_inbox", JSON.stringify(PANDORA_EMAILS));
      SensoryEngine.playError();
      addToast(
        "SYSTEM: Urgent encrypted mail received. Check Inbox immediately.",
        "warning",
      );
      localStorage.setItem("pandora_honeypot_triggered", "true");
      window.dispatchEvent(new Event("storage"));
    }
  }, [addToast]);

  const handleLoreSubmit = (e) => {
    e.preventDefault();
    if (loreInput.trim().toUpperCase() === "IGNITE") {
      setLoreUnlocked(true);
      SensoryEngine.playSuccess();
    } else {
      SensoryEngine.playError();
      addToast("ERR: INVALID PASSPHRASE SIGNATURE", "error");
      setLoreInput("");
    }
  };

  const handleMarketCipher = () => {
    if (localStorage.getItem("ph0enix_pandora_key") === "true") {
      setMarketUnlocked(true);
      SensoryEngine.playSuccess();
    } else {
      SensoryEngine.playError();
      addToast(
        "ACCESS DENIED: Pandora Decryption Cipher module missing.",
        "error",
      );
    }
  };

  return (
    <div className="min-h-full bg-[#050000] flex items-center justify-center p-4 md:p-6 font-mono relative overflow-hidden">
      <div
        className={`absolute inset-0 transition-colors duration-1000 ${finalUnlocked ? "bg-green-900/20" : "bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.15)_0,transparent_60%)] animate-pulse pointer-events-none"}`}
      ></div>

      <div
        className={`w-full max-w-3xl border-2 transition-colors duration-1000 bg-black p-6 md:p-10 shadow-2xl relative z-10 ${finalUnlocked ? "border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.2)]" : "border-red-900/50 shadow-[0_0_50px_rgba(220,38,38,0.2)]"}`}
      >
        <div className="text-center border-b border-gray-800 pb-8 mb-8">
          {finalUnlocked ? (
            <ShieldCheck size={56} className="mx-auto text-green-500 mb-4" />
          ) : (
            <AlertTriangle
              size={56}
              className="mx-auto text-red-600 mb-4 animate-bounce"
            />
          )}
          <h1
            className={`text-2xl md:text-4xl font-black tracking-[0.2em] ${finalUnlocked ? "text-green-500" : "text-red-500"}`}
          >
            PROJECT PANDORA
          </h1>
          <p className="text-gray-500 mt-2 text-xs md:text-sm">
            ULTIMATE SECURE ENCLAVE // DUAL AUTHENTICATION REQUIRED
          </p>
        </div>

        {!finalUnlocked ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LOCK 1: The Lore */}
            <div
              className={`p-6 border relative ${loreUnlocked ? "bg-green-950/20 border-green-900/50" : "bg-gray-900/50 border-gray-800"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`font-bold tracking-widest ${loreUnlocked ? "text-green-500" : "text-gray-400"}`}
                >
                  LOCK 1: FAIL-SAFE
                </h3>
                {loreUnlocked ? (
                  <Unlock className="text-green-500" />
                ) : (
                  <Lock className="text-gray-500" />
                )}
              </div>
              {!loreUnlocked ? (
                <form onSubmit={handleLoreSubmit}>
                  <p className="text-xs text-gray-500 mb-4 h-10">
                    Enter the primary Architect fail-safe passphrase.
                  </p>
                  <input
                    type="text"
                    value={loreInput}
                    onChange={(e) => setLoreInput(e.target.value)}
                    placeholder="ENTER PASSPHRASE"
                    className="w-full bg-black border border-gray-700 text-white p-3 text-center uppercase tracking-widest focus:border-red-500 outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full mt-3 bg-gray-800 hover:bg-gray-700 text-white py-2 font-bold text-sm transition-colors"
                  >
                    AUTHORIZE
                  </button>
                </form>
              ) : (
                <div className="text-green-500 font-bold text-center py-6">
                  FAIL-SAFE ACCEPTED
                </div>
              )}
            </div>

            {/* LOCK 2: The Dark Market Cipher */}
            <div
              className={`p-6 border relative ${marketUnlocked ? "bg-green-950/20 border-green-900/50" : "bg-gray-900/50 border-gray-800"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className={`font-bold tracking-widest ${marketUnlocked ? "text-green-500" : "text-gray-400"}`}
                >
                  LOCK 2: DECRYPTION
                </h3>
                {marketUnlocked ? (
                  <Unlock className="text-green-500" />
                ) : (
                  <Key className="text-gray-500" />
                )}
              </div>
              {!marketUnlocked ? (
                <div>
                  <p className="text-xs text-gray-500 mb-4 h-10">
                    Advanced military cipher required. Must be acquired from
                    external sources.
                  </p>
                  <button
                    onClick={handleMarketCipher}
                    className="w-full bg-red-950/40 border border-red-900 hover:bg-red-900 text-red-200 py-4 font-bold tracking-widest transition-all shadow-sm"
                  >
                    INSERT CIPHER MODULE
                  </button>
                </div>
              ) : (
                <div className="text-green-500 font-bold text-center py-6">
                  CIPHER ACCEPTED
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-700 text-center">
            <div className="bg-green-950/30 border border-green-500 p-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <h2 className="text-2xl font-black text-green-500 mb-2">
                SYSTEM REBIRTH INITIATED
              </h2>
              <p className="text-green-400/80 mb-6 text-sm">
                FINAL CLEARANCE FLAG GENERATED:
              </p>
              <div className="bg-black p-4 text-white font-bold tracking-widest border border-green-900 text-lg md:text-xl break-all shadow-inner">
                <ObfuscatedText text={flag} />
              </div>
              <p className="mt-8 text-gray-400 text-xs italic">
                "From the ashes, we rise." — Architect
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- TERMINAL COMMANDS (The Trap) ---
export const pandoraCommands = {
  sys_auth: {
    hidden: true,
    description: "System authentication diagnostics",
    execute: async (args, { addToHistory, profile, refreshProfile }) => {
      if (args.includes("--override") && args.includes("--target=pandora")) {
        SensoryEngine.playError();
        addToHistory("error", "========================================");
        addToHistory("error", "!!! UNAUTHORIZED PAYLOAD DETECTED !!!");
        addToHistory(
          "error",
          "HONEYPOT TRIGGERED. SOCIAL ENGINEERING VECTOR SUCCESSFUL.",
        );
        addToHistory("error", "HALVING WALLET CREDITS AS PENALTY...");
        addToHistory("error", "========================================");

        localStorage.setItem("ph0enix_pandora_key", "true");
        addToHistory(
          "system",
          "[SYSTEM] Pandora Cipher generated (Penalty Applied).",
        );

        if (profile) {
          // THE PUNISHMENT: Cuts wallet in half!
          const halvedCredits = Math.floor((profile.credits || 0) / 2);
          await supabase
            .from("profiles")
            .update({ credits: halvedCredits })
            .eq("id", profile.id);
          if (refreshProfile) await refreshProfile(profile.id);
          addToHistory(
            "warning",
            `WALLET BALANCE DRAINED TO: ${halvedCredits} cR`,
          );
        }
      } else {
        addToHistory(
          "error",
          "sys_auth: missing required authentication parameters.",
        );
      }
    },
  },
};
