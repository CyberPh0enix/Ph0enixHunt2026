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
} from "lucide-react";

export default function Browser({ onClose }) {
  const { user } = useAuth();
  const [url, setUrl] = useState("https://corpnet.internal/home");
  const [history, setHistory] = useState(["https://corpnet.internal/home"]);
  const [solvedIds, setSolvedIds] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // 1. FILTER: Only get Browser Puzzles
  const browserPuzzles = PUZZLE_CONFIG.filter((p) => p.type === "browser");

  // 2. FIND: Only look for browser components
  const currentPuzzle = browserPuzzles.find((p) => p.url === url);

  const renderContent = () => {
    if (url === "https://corpnet.internal/home") {
      return (
        <div className="p-10 grid gap-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Internal Bookmarks</h1>

          {/* Render ONLY Browser Puzzles */}
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
                className={`p-4 border rounded-xl transition-all flex justify-between items-center ${
                  isUnlocked || isSolved
                    ? "cursor-pointer hover:shadow-md bg-white"
                    : "cursor-not-allowed bg-gray-100 opacity-60"
                }`}
              >
                <div>
                  <h3 className="font-bold text-blue-600 flex items-center gap-2">
                    {puzzle.title}
                    <span
                      className={`${puzzle.color} text-xs px-2 py-0.5 rounded-full uppercase`}
                    >
                      {puzzle.id}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-500">{puzzle.desc}</p>
                </div>

                {isSolved ? (
                  <div className="text-green-500 font-bold text-xs">
                    SOLVED ✓
                  </div>
                ) : isUnlocked ? (
                  <ExternalLink size={16} className="text-gray-400" />
                ) : (
                  <div className="flex items-center gap-1 text-red-400 text-xs font-bold">
                    <Lock size={14} /> LOCKED
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (currentPuzzle) {
      const Component = currentPuzzle.component;
      return <Component />;
    }

    return (
      <div className="p-10 text-center text-4xl text-gray-400">
        404 Not Found
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-50 text-black flex flex-col font-sans">
      {/* Toolbar */}
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

      <div className="flex-1 overflow-y-auto bg-white relative">
        {renderContent()}
      </div>
    </div>
  );
}
