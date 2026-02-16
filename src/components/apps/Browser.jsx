import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import {
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Home,
  Lock,
  Unlock,
  ExternalLink,
} from "lucide-react";

// --- PUZZLE PAGES ---

const PageLevel1 = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      const comment = document.createComment(
        " SECRET FLAG: flag{html_comments_are_not_secure} ",
      );
      containerRef.current.appendChild(comment);
    }
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">
        Welcome to CorpNet
      </h1>
      <p className="mb-4">
        We are the leading providers of obfuscated solutions.
      </p>
      <div className="bg-yellow-100 p-4 border-l-4 border-yellow-500 text-yellow-700">
        <p className="font-bold">Maintenance Note:</p>
        <p ref={containerRef}>
          Please do not inspect the source code of this page. It is trade
          secret.
        </p>
      </div>
    </div>
  );
};

const PageLevel2 = () => {
  return (
    <div className="h-full bg-white p-8">
      <h1 className="text-3xl font-bold mb-4">The "Empty" Page</h1>
      <p>There is nothing to see here.</p>
      <br />
      <div className="bg-black p-10 mt-10 relative select-none">
        <p className="text-white mb-4">Dark Mode Enabled.</p>
        <p className="text-black select-text selection:bg-white selection:text-black">
          {"flag{contrast_is_key}"}
        </p>
      </div>
      <p className="text-sm text-gray-400 mt-2">
        Tip: Try selecting the text in the black box.
      </p>
    </div>
  );
};

const PageLevel3 = () => {
  useEffect(() => {
    console.log("%c STOP!", "color: red; font-size: 30px; font-weight: bold;");
    console.log(
      "If someone told you to paste code here, they are hacking you.",
    );
    console.log(
      "But since you are the admin... here is the backup code: flag{console_log_master}",
    );
  }, []);

  return (
    <div className="p-8 text-center mt-20">
      <h1 className="text-4xl">System Console</h1>
      <p className="mt-4 text-gray-600">
        Please open your Developer Tools (F12) to view system logs.
      </p>
      <button className="mt-8 bg-blue-600 text-white px-6 py-2 rounded shadow">
        View Logs
      </button>
    </div>
  );
};

// --- BROWSER SHELL WITH LOCKING LOGIC ---

export default function Browser({ onClose }) {
  const { user } = useAuth();
  const [url, setUrl] = useState("https://corpnet.internal/home");
  const [history, setHistory] = useState(["https://corpnet.internal/home"]);

  // State to track what the user has unlocked
  const [solvedIds, setSolvedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Solved Puzzles on Mount
  useEffect(() => {
    async function fetchProgress() {
      if (!user) return;
      const { data, error } = await supabase
        .from("solved_puzzles")
        .select("puzzle_id")
        .eq("user_id", user.id);

      if (data) {
        // Convert to simple array: ['level-01', 'level-02']
        setSolvedIds(data.map((row) => row.puzzle_id));
      }
      setLoading(false);
    }
    fetchProgress();
  }, [user]);

  const navigate = (newUrl) => {
    setUrl(newUrl);
    setHistory([...history, newUrl]);
  };

  // 2. The Logic: Is a level locked?
  // Level 1: Always Open
  // Level 2: Requires 'level-01' solved
  // Level 3: Requires 'level-02' solved
  const isLevel1Solved = solvedIds.includes("level-01");
  const isLevel2Solved = solvedIds.includes("level-02");
  const isLevel3Solved = solvedIds.includes("level-03");

  const renderContent = () => {
    switch (url) {
      case "https://corpnet.internal/home":
        return (
          <div className="p-10 grid gap-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Internal Bookmarks</h1>

            {/* LINK 1: DEV NOTES (Always Open) */}
            <div
              onClick={() => navigate("https://corpnet.internal/dev-notes")}
              className="group p-4 border rounded-xl cursor-pointer hover:shadow-md bg-white transition-all flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-blue-600 group-hover:underline flex items-center gap-2">
                  Dev Team Notes{" "}
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                    Level 1
                  </span>
                </h3>
                <p className="text-sm text-gray-500">
                  HTML Source Code Inspection
                </p>
              </div>
              {isLevel1Solved ? (
                <div className="text-green-500 font-bold text-xs">SOLVED ✓</div>
              ) : (
                <ExternalLink size={16} className="text-gray-400" />
              )}
            </div>

            {/* LINK 2: DESIGN SYSTEM (Locked until L1 Solved) */}
            <div
              onClick={() =>
                isLevel1Solved
                  ? navigate("https://corpnet.internal/design-v2")
                  : null
              }
              className={`p-4 border rounded-xl transition-all flex justify-between items-center ${
                isLevel1Solved
                  ? "cursor-pointer hover:shadow-md bg-white"
                  : "cursor-not-allowed bg-gray-100 opacity-60"
              }`}
            >
              <div>
                <h3 className="font-bold text-blue-600 flex items-center gap-2">
                  Design System V2{" "}
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                    Level 2
                  </span>
                </h3>
                <p className="text-sm text-gray-500">
                  Contrast & Selection Tests
                </p>
              </div>
              {/* Show Lock or Unlock icon based on status */}
              {isLevel1Solved ? (
                isLevel2Solved ? (
                  <div className="text-green-500 font-bold text-xs">
                    SOLVED ✓
                  </div>
                ) : (
                  <ExternalLink size={16} className="text-gray-400" />
                )
              ) : (
                <Lock size={16} className="text-red-400" />
              )}
            </div>
            {/* LINK 3: SYSTEM LOGS (Locked until L2 Solved) */}
            <div
              onClick={() =>
                isLevel2Solved || isLevel3Solved
                  ? navigate("https://corpnet.internal/logs")
                  : null
              }
              className={`p-4 border rounded-xl transition-all flex justify-between items-center ${
                isLevel2Solved || isLevel3Solved
                  ? "cursor-pointer hover:shadow-md bg-white"
                  : "cursor-not-allowed bg-gray-100 opacity-60"
              }`}
            >
              <div>
                <h3 className="font-bold text-blue-600 flex items-center gap-2">
                  System Logs{" "}
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                    Level 3
                  </span>
                </h3>
                <p className="text-sm text-gray-500">Console Debugging</p>
              </div>

              {/* VISUAL LOGIC: Solved? -> Show Check. Open? -> Show Arrow. Locked? -> Show Lock. */}
              {isLevel3Solved ? (
                <div className="text-green-500 font-bold text-xs">SOLVED ✓</div>
              ) : isLevel2Solved ? (
                <ExternalLink size={16} className="text-gray-400" />
              ) : (
                <Lock size={16} className="text-red-400" />
              )}
            </div>
          </div>
        );
      case "https://corpnet.internal/dev-notes":
        return <PageLevel1 />;
      case "https://corpnet.internal/design-v2":
        return <PageLevel2 />;
      case "https://corpnet.internal/logs":
        return <PageLevel3 />;
      default:
        return (
          <div className="p-10 text-center text-4xl text-gray-400">
            404 Not Found
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-gray-50 text-black flex flex-col font-sans">
      {/* Browser Toolbar */}
      <div className="bg-white p-2 flex gap-2 items-center border-b border-gray-300 shadow-sm shrink-0">
        <div className="flex gap-1">
          <div
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer"
            onClick={onClose}
          ></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        <div className="flex gap-2 text-gray-400 ml-2">
          <ArrowLeft
            size={16}
            className="cursor-pointer hover:text-black"
            onClick={() => navigate("https://corpnet.internal/home")}
          />
          <ArrowRight size={16} />
          <RefreshCw size={14} />
        </div>

        <div className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-600 flex items-center gap-2 border border-gray-200">
          <Lock size={10} className="text-green-600" />
          <input
            type="text"
            value={url}
            readOnly
            className="bg-transparent w-full outline-none"
          />
        </div>

        <Home
          size={18}
          className="text-gray-500 cursor-pointer hover:text-blue-500"
          onClick={() => navigate("https://corpnet.internal/home")}
        />
      </div>

      {/* Website Content */}
      <div className="flex-1 overflow-y-auto bg-white relative">
        {loading && url === "https://corpnet.internal/home" && (
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-100 overflow-hidden">
            <div className="w-full h-full bg-blue-500 animate-pulse"></div>
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
}
