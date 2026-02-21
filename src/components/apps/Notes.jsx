import { useState, useEffect } from "react";
import { Save, FileText, Lock } from "lucide-react";

const DEFAULT_NOTES = `--- SECURE NOTES ---

> STANDARD PROTOCOL:
1. All secured payloads use the format: flag{...}
2. Submission is done via the main terminal using: submit <flag>
3. Do not attempt to brute-force the infrastructure.

> INVESTIGATION NOTES:
- The rogue admin locked down the main nodes.
- Need to check the HTML source of the Intranet welcome page first.
- Found a weird keyword in the old system dumps... something about a "heist" command? Might be a legacy dev exploit. Keep it in mind if things get too locked down.

[Use this space to store intercepted payloads, Encoded strings, and decrypted passwords]
--------------------------------------------------

`;

export default function Notes({ onClose }) {
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ph0enix_notes");
    if (stored) {
      setContent(stored);
    } else {
      setContent(DEFAULT_NOTES);
      localStorage.setItem("ph0enix_notes", DEFAULT_NOTES);
    }
  }, []);

  const handleChange = (e) => {
    setContent(e.target.value);
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("ph0enix_notes", content);
    setSaved(true);
  };

  // Auto-save every 2 seconds if changes exist
  useEffect(() => {
    if (!saved) {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [content, saved]);

  return (
    <div className="h-full bg-[#1e1e1e] text-gray-300 flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#252526] p-2 flex items-center justify-between border-b border-black shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 ml-2">
            <div
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer transition-colors"
            ></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 cursor-not-allowed"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 cursor-not-allowed"></div>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 ml-4 tracking-wider uppercase">
            <FileText size={14} /> Encrypted Notepad
          </div>
        </div>
        <div className="flex items-center gap-3 mr-2">
          <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
            <Lock size={10} /> AES-256
          </span>
          <button
            onClick={handleSave}
            className={`text-xs px-3 py-1 rounded transition-colors flex items-center gap-1 ${saved ? "bg-green-900/30 text-green-500" : "bg-blue-600 text-white hover:bg-blue-500"}`}
          >
            <Save size={12} /> {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
      <div className="flex-1 p-1 bg-[#1e1e1e]">
        <textarea
          value={content}
          onChange={handleChange}
          className="w-full h-full bg-[#1e1e1e] text-gray-300 font-mono text-sm p-4 outline-none resize-none custom-scrollbar leading-relaxed"
          spellCheck="false"
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
}
