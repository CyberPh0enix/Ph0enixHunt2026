import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { PUZZLE_CONFIG } from "../../data/puzzles";
import {
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Home,
  Lock,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Browser({ onClose }) {
  const { user } = useAuth();
  const [url, setUrl] = useState("https://corpnet.internal/home");
  const [history, setHistory] = useState(["https://corpnet.internal/home"]);
  const [solvedIds, setSolvedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user progress
  useEffect(() => {
    async function fetchProgress() {
      if (!user) return;
      const { data } = await supabase
        .from("solved_puzzles")
        .select("puzzle_id")
        .eq("user_id", user.id);
      if (data) setSolvedIds(data.map((row) => row.puzzle_id));
      setLoading(false);
    }
    fetchProgress();
  }, [user]);

  const navigate = (newUrl) => {
    setUrl(newUrl);
    setHistory([...history, newUrl]);
  };

  const browserPuzzles = PUZZLE_CONFIG.filter((p) => p.type === "browser");

  // FIND: Only look for browser components matching current URL
  const currentPuzzle = browserPuzzles.find((p) => p.url === url);

  const renderContent = () => {
    // --- HOME PAGE (Bookmarks) ---
    if (url === "https://corpnet.internal/home") {
      return (
        <div className="p-4 sm:p-8 w-full max-w-5xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
            Internal Bookmarks
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {browserPuzzles.map((puzzle) => {
              const isSolved = solvedIds.includes(puzzle.id);
              const isUnlocked =
                !puzzle.requires || solvedIds.includes(puzzle.requires);

              return (
                <div
                  key={puzzle.id}
                  onClick={() =>
                    isUnlocked || isSolved ? navigate(puzzle.url) : null
                  }
                  className={`
                    group relative p-4 border rounded-xl transition-all flex justify-between items-center gap-4
                    ${
                      isUnlocked || isSolved
                        ? "cursor-pointer hover:shadow-md bg-white border-gray-200 hover:border-blue-300"
                        : "cursor-not-allowed bg-gray-50 border-gray-200 opacity-60"
                    }
                  `}
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm sm:text-base mb-1">
                      {puzzle.title}
                      {/* Optional ID Badge */}
                      <span className="hidden sm:inline-block text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                        {puzzle.id}
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {puzzle.desc}
                    </p>
                  </div>

                  {/* Status Icons */}
                  <div className="shrink-0">
                    {isSolved ? (
                      <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                        <CheckCircle size={14} />
                        <span className="text-[10px] font-bold">SOLVED</span>
                      </div>
                    ) : isUnlocked ? (
                      <ExternalLink
                        size={18}
                        className="text-gray-400 group-hover:text-blue-500 transition-colors"
                      />
                    ) : (
                      <div className="flex items-center gap-1 text-red-400 bg-red-50 px-2 py-1 rounded-full border border-red-100">
                        <Lock size={14} />
                        <span className="text-[10px] font-bold">LOCKED</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // --- PUZZLE COMPONENT ---
    if (currentPuzzle) {
      const Component = currentPuzzle.component;
      return <Component />;
    }

    // --- 404 PAGE ---
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-lg">Server Not Found</p>
        <button
          onClick={() => navigate("https://corpnet.internal/home")}
          className="mt-6 text-blue-500 hover:underline"
        >
          Return Home
        </button>
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-50 text-black flex flex-col font-sans overflow-hidden">
      {/* 1. TOOLBAR (Fixed Height) */}
      <div className="bg-white p-2 flex gap-2 items-center border-b border-gray-300 shadow-sm shrink-0 z-10">
        {/* Window Controls (Cosmetic) */}
        <div className="flex gap-1.5 ml-1 mr-2">
          <div
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer"
            onClick={onClose}
          ></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        {/* Nav Controls */}
        <div className="flex gap-2 text-gray-400 px-2">
          <ArrowLeft
            size={18}
            className="cursor-pointer hover:text-black transition-colors"
            onClick={() => {
              if (url !== "https://corpnet.internal/home") {
                navigate("https://corpnet.internal/home");
              }
            }}
          />
          <ArrowRight size={18} className="opacity-50 cursor-not-allowed" />
          <RefreshCw
            size={16}
            className="hover:text-black cursor-pointer transition-colors"
          />
        </div>

        {/* Address Bar */}
        <div className="flex-1 bg-gray-100 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-gray-600 flex items-center gap-2 border border-transparent focus-within:border-blue-400 focus-within:bg-white transition-all">
          <Lock size={12} className="text-green-600" />
          <input
            type="text"
            value={url}
            readOnly
            className="bg-transparent w-full outline-none font-mono text-gray-700"
          />
        </div>

        {/* Home Button */}
        <Home
          size={20}
          className="text-gray-500 cursor-pointer hover:text-blue-500 transition-colors mr-1"
          onClick={() => navigate("https://corpnet.internal/home")}
        />
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
}
