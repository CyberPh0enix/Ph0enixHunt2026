import { useState, useEffect } from "react";
import {
  Mail as MailIcon,
  AlertTriangle,
  User,
  RefreshCw,
  ChevronLeft,
  ShieldAlert,
  TerminalSquare,
  Paperclip,
} from "lucide-react";
import { SYSTEM_DATA } from "../../config/build.prop";

export default function Mail({ onClose }) {
  const [emails, setEmails] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [status, setStatus] = useState("connecting");

  // Read emails from local storage dynamically
  useEffect(() => {
    const checkMail = () => {
      const inbox = localStorage.getItem("ph0enix_inbox");
      if (inbox) {
        setEmails(JSON.parse(inbox));
        setStatus("connected");
      } else {
        const timer = setTimeout(() => setStatus("failed"), 2500);
        return () => clearTimeout(timer);
      }
    };

    checkMail();
    window.addEventListener("storage", checkMail);
    return () => window.removeEventListener("storage", checkMail);
  }, []);

  const selectedEmail = emails.find((e) => e.id === selectedId);

  // --- OFFLINE STATE ---
  if (status !== "connected" || emails.length === 0) {
    return (
      <div className="h-full bg-white text-gray-800 flex flex-col font-sans animate-in fade-in duration-200">
        <div className="bg-blue-600 p-3 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <MailIcon size={16} /> WebMail
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 px-2 rounded"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
          {status === "connecting" ? (
            <div className="flex flex-col items-center animate-pulse">
              <RefreshCw
                size={32}
                className="text-blue-500 animate-spin mb-4"
              />
              <h2 className="text-lg font-bold text-gray-700">
                Connecting to Exchange...
              </h2>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in slide-in-from-bottom-4">
              <AlertTriangle size={32} className="text-red-500 mb-4" />
              <h2 className="text-xl font-black text-gray-800 mb-2">
                Connection Refused
              </h2>
              <p className="text-sm text-gray-600">
                The internal mail server is currently unreachable.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- ACTIVE INBOX STATE ---
  return (
    <div className="h-full bg-white text-gray-800 flex flex-col font-sans animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-blue-600 p-3 flex items-center justify-between shrink-0 shadow-md z-10">
        <div className="flex items-center gap-3">
          {selectedId && (
            <button
              onClick={() => setSelectedId(null)}
              className="md:hidden text-white hover:bg-blue-700 rounded p-1 -ml-1"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <MailIcon size={18} className="text-white hidden md:block" />
          <span className="font-bold text-sm text-white tracking-wide">
            {SYSTEM_DATA.orgShort} Mail
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
            <ShieldAlert size={12} /> SECURE
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 px-2 rounded"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar (Email List) */}
        <div
          className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-gray-50 overflow-y-auto custom-scrollbar ${selectedId ? "hidden md:block" : "block"}`}
        >
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => setSelectedId(email.id)}
              className={`p-3 border-b border-gray-200 cursor-pointer transition-colors ${selectedId === email.id ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:bg-gray-100 border-l-4 border-l-transparent"} ${email.unread ? "bg-white" : ""}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`text-sm truncate ${email.unread ? "font-black text-gray-900" : "font-semibold text-gray-700"}`}
                >
                  {email.from}
                </span>
                <span className="text-[10px] text-gray-500 whitespace-nowrap ml-2">
                  {email.time}
                </span>
              </div>
              <div
                className={`text-xs truncate mb-1 ${email.unread ? "font-bold text-gray-800" : "text-gray-600"}`}
              >
                {email.subject}
              </div>
              <div className="text-[10px] text-gray-500 truncate">
                {email.preview}
              </div>
            </div>
          ))}
        </div>

        {/* Email Body */}
        <div
          className={`w-full md:w-2/3 lg:w-3/4 bg-white flex flex-col ${!selectedId ? "hidden md:flex" : "flex"}`}
        >
          {selectedEmail ? (
            <div className="p-4 md:p-6 flex-1 overflow-y-auto custom-scrollbar">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                  {selectedEmail.subject}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    <User size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-gray-900 flex items-center gap-2 flex-wrap">
                      {selectedEmail.from}
                      <span className="text-xs font-normal text-gray-500 truncate">
                        &lt;{selectedEmail.address}&gt;
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      To: {selectedEmail.to}
                    </div>
                  </div>
                </div>
              </div>

              {/* Flexible Body Content */}
              <div className="text-sm text-gray-800 leading-relaxed font-sans">
                {selectedEmail.body && (
                  <div className="whitespace-pre-wrap mb-4">
                    {selectedEmail.body}
                  </div>
                )}

                {selectedEmail.command && (
                  <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs flex items-center justify-between border border-gray-700 my-4 select-all shadow-inner">
                    <span>{selectedEmail.command}</span>
                    <TerminalSquare size={14} className="text-gray-500" />
                  </div>
                )}

                {selectedEmail.footer && (
                  <div className="text-gray-500 italic mt-6 whitespace-pre-wrap">
                    {selectedEmail.footer}
                  </div>
                )}

                {selectedEmail.attachments && (
                  <div className="mt-8 pt-4 border-t border-gray-100 flex gap-2">
                    {selectedEmail.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 border border-gray-200 rounded p-2 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      >
                        <Paperclip size={14} /> {att}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm bg-gray-50/50">
              <MailIcon size={48} className="mb-4 text-gray-300 opacity-50" />
              Select a message to read
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
