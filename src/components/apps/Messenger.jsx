import { useState } from "react";
import { CONTACTS } from "../../data/story";
import {
  ArrowLeft,
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
} from "lucide-react";

export default function Messenger({ onClose }) {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="h-full bg-neutral-900 text-white flex flex-col font-sans animate-in slide-in-from-right duration-300">
      {activeChat ? (
        // --- CHAT VIEW ---
        <div className="flex flex-col h-full bg-black/50">
          {/* Chat Header */}
          <div className="bg-neutral-800 p-3 flex items-center justify-between border-b border-neutral-700">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveChat(null)}
                className="hover:bg-white/10 p-1 rounded-full"
              >
                <ArrowLeft size={20} />
              </button>
              <img src={activeChat.avatar} className="w-8 h-8 rounded-full" />
              <div>
                <h3 className="text-sm font-bold">{activeChat.name}</h3>
                <span className="text-[10px] text-green-400">
                  Online via Proxy
                </span>
              </div>
            </div>
            <div className="flex gap-4 text-neutral-400">
              <Phone size={18} />
              <Video size={18} />
              <MoreVertical size={18} />
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://i.pinimg.com/originals/97/c0/07/97c00759d90d786d9b6096d274ad3e07.png')] bg-opacity-10 bg-repeat">
            {activeChat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${msg.sender === "me" ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "me"
                      ? "bg-green-700 text-white rounded-tr-none"
                      : "bg-neutral-800 text-neutral-200 rounded-tl-none border border-neutral-700"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-neutral-500 mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          {/* Input Area (Fake) */}
          <div className="p-3 bg-neutral-800 flex gap-2 items-center">
            <input
              disabled
              type="text"
              placeholder="Connection encrypted. Reply disabled."
              className="flex-1 bg-neutral-900 rounded-full px-4 py-2 text-sm text-neutral-500 focus:outline-none cursor-not-allowed"
            />
            <button
              disabled
              className="p-2 bg-neutral-700 rounded-full text-neutral-500"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        // --- CONTACT LIST VIEW ---
        <div className="flex flex-col h-full">
          {/* App Header */}
          <div className="p-4 bg-neutral-800 flex justify-between items-center shadow-md z-10">
            <span className="font-bold text-lg tracking-wide">Signal</span>
            <div className="flex gap-3 text-neutral-400">
              <Search size={20} />
              <MoreVertical size={20} />
              <button
                onClick={onClose}
                className="text-sm bg-neutral-700 px-2 py-1 rounded text-white"
              >
                Close
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {CONTACTS.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer border-b border-white/5 transition-colors"
              >
                <div className="relative">
                  <img
                    src={chat.avatar}
                    className="w-12 h-12 rounded-full bg-neutral-700"
                  />
                  {chat.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-black font-bold border border-black">
                      {chat.unread}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-sm truncate">
                      {chat.name}
                    </h3>
                    <span className="text-[10px] text-neutral-500">
                      10:45 PM
                    </span>
                  </div>
                  <p
                    className={`text-xs truncate ${chat.unread > 0 ? "text-white font-medium" : "text-neutral-500"}`}
                  >
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
