import { useState, useEffect } from "react";
import { FileText, Lock, Plus, Trash2, Edit3, ShieldAlert } from "lucide-react";

// --- PRE-LOADED SYSTEM NOTES (READ-ONLY) ---
const STATIC_NOTES = [
  {
    id: "sys-01",
    title: "01_SECURITY_WARNING.txt",
    content:
      "--- SECURE ENCLAVE ALERT ---\n\nRule #1 of the Syndicate: The Architect NEVER gives away free tools. The economy is strictly regulated.\n\nIf you receive an internal email offering a 'free bypass' script or a local payload for a Dark Market item, DO NOT RUN IT. It is GHOST running a honeypot trap to drain your databanks.\n\nReal tools are ONLY bought on the Dark Market using legitimate credits.",
    isReadOnly: true,
    date: "SYSTEM",
  },
  {
    id: "lore-01",
    title: "admin_ramblings.log",
    content:
      "They thought they could lock me out. I built this network.\n\nI've scattered the access keys across the Intranet. I even secured the final prototype on the dark web.\n\nIf the core ever melts down, the primary fail-safe passphrase for Pandora's Box is 'IGNITE'. Let's see if they figure that out before the servers fry.",
    isReadOnly: true,
    date: "2026-02-12",
  },
  {
    id: "hint-01",
    title: "DONT_FORGET.md",
    content:
      "Note to self:\nIf I accidentally lock myself out of the root node, remember the developer exploit.\n\nTerminal command: heist\n\nDon't let management find out about this. It bypasses the standard progression protocols.",
    isReadOnly: true,
    date: "2026-02-14",
  },
];

export default function Notes({ onClose }) {
  const [userNotes, setUserNotes] = useState([]);
  const [activeId, setActiveId] = useState(STATIC_NOTES[0].id);

  // Load user notes from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem("ph0enix_user_notes");
    if (stored) {
      try {
        setUserNotes(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse notes", e);
      }
    }
  }, []);

  // Save user notes whenever they change
  useEffect(() => {
    localStorage.setItem("ph0enix_user_notes", JSON.stringify(userNotes));
  }, [userNotes]);

  const allNotes = [...STATIC_NOTES, ...userNotes];
  const activeNote = allNotes.find((n) => n.id === activeId) || allNotes[0];

  const handleAddNote = () => {
    const newNote = {
      id: `user-${Date.now()}`,
      title: "Untitled Note",
      content: "",
      isReadOnly: false,
      date: new Date().toLocaleDateString(),
    };
    setUserNotes([newNote, ...userNotes]);
    setActiveId(newNote.id);
  };

  const handleUpdateNote = (field, value) => {
    if (activeNote.isReadOnly) return;
    setUserNotes((prev) =>
      prev.map((n) => (n.id === activeId ? { ...n, [field]: value } : n)),
    );
  };

  const handleDeleteNote = (id) => {
    const updated = userNotes.filter((n) => n.id !== id);
    setUserNotes(updated);
    if (activeId === id) {
      setActiveId(updated.length > 0 ? updated[0].id : STATIC_NOTES[0].id);
    }
  };

  return (
    <div className="h-full bg-[#1e1e1e] text-gray-300 flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200">
      {/* APP WINDOW HEADER */}
      <div className="bg-[#252526] p-2 flex items-center justify-between border-b border-black shrink-0 shadow-sm z-10">
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
            <FileText size={14} /> Secure Notes
          </div>
        </div>
        <button
          onClick={handleAddNote}
          className="mr-2 text-xs px-2 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded flex items-center gap-1 transition-colors"
        >
          <Plus size={12} /> New Note
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-1/3 max-w-[200px] bg-[#1e1e1e] border-r border-[#333] overflow-y-auto custom-scrollbar flex flex-col">
          {allNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => setActiveId(note.id)}
              className={`text-left p-3 border-b border-[#2a2a2a] transition-colors relative ${activeId === note.id ? "bg-[#37373d]" : "hover:bg-[#2a2a2d]"}`}
            >
              {activeId === note.id && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500"></div>
              )}
              <div className="flex items-center gap-2 mb-1">
                {note.isReadOnly ? (
                  <ShieldAlert size={12} className="text-yellow-500 shrink-0" />
                ) : (
                  <Edit3 size={12} className="text-gray-500 shrink-0" />
                )}
                <span
                  className={`text-xs font-bold truncate ${activeId === note.id ? "text-white" : "text-gray-400"}`}
                >
                  {note.title}
                </span>
              </div>
              <div className="text-[10px] text-gray-600 font-mono">
                {note.date}
              </div>
            </button>
          ))}
        </div>

        {/* EDITOR AREA */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          {/* Editor Header */}
          <div className="p-3 border-b border-[#333] flex items-center justify-between shrink-0 bg-[#252526]">
            {activeNote.isReadOnly ? (
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Lock size={14} className="text-yellow-500" />
                {activeNote.title}
              </div>
            ) : (
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleUpdateNote("title", e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-bold text-white w-full max-w-[70%]"
                placeholder="Note Title"
              />
            )}

            {!activeNote.isReadOnly && (
              <button
                onClick={() => handleDeleteNote(activeNote.id)}
                className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                title="Delete Note"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Editor Body */}
          <div className="flex-1 p-4 relative">
            {activeNote.isReadOnly ? (
              <div className="w-full h-full text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap overflow-y-auto custom-scrollbar opacity-90">
                {activeNote.content}
              </div>
            ) : (
              <textarea
                value={activeNote.content}
                onChange={(e) => handleUpdateNote("content", e.target.value)}
                className="w-full h-full bg-transparent text-gray-300 font-mono text-sm outline-none resize-none custom-scrollbar leading-relaxed"
                spellCheck="false"
                placeholder="Start typing your intercepts here..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
