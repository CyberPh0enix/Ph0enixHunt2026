import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { PUZZLE_CONFIG } from "../../data/puzzles";
import { SYSTEM_DATA } from "../../config/build.prop";
import {
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Home,
  Lock,
  Search,
  ShieldAlert,
  FileQuestion,
  X,
} from "lucide-react";

import DarkMarket from "./DarkMarket";

// --- ERROR COMPONENTS ---

const Error403 = ({ url }) => (
  <div className="flex flex-col items-center justify-center min-h-full bg-white text-gray-800 p-8 text-center font-sans animate-in fade-in duration-300">
    <ShieldAlert size={64} className="text-red-600 mb-6" />
    <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
    <p className="max-w-md text-gray-600 mb-8 leading-relaxed text-sm">
      You do not have the required security clearance for <br />
      <code className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs mt-2 inline-block">
        {url}
      </code>
    </p>
    <div className="text-[10px] text-gray-400 font-mono border-t pt-4 w-full max-w-xs mx-auto">
      ERR_BLOCKED_BY_ADMIN
      <br />
      Ref: {Math.random().toString(36).substring(7).toUpperCase()}
    </div>
  </div>
);

const Error404 = ({ url }) => (
  <div className="flex flex-col items-center justify-center min-h-full bg-white text-gray-800 p-8 text-center font-sans animate-in fade-in duration-300">
    <FileQuestion size={64} className="text-amber-500 mb-6" />
    <h1 className="text-3xl font-bold text-gray-900 mb-2">
      Resource Not Found
    </h1>

    <div className="w-16 h-1 bg-amber-500 mb-6 rounded-full"></div>

    <p className="max-w-md text-gray-600 mb-8 leading-relaxed text-sm">
      The server could not locate the requested file directory:
      <br />
      <code className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs mt-2 inline-block border border-amber-100">
        {url}
      </code>
    </p>

    <div className="text-[10px] text-gray-400 font-mono border-t pt-4 w-full max-w-xs mx-auto">
      ERR_FILE_NOT_FOUND
      <br />
      Gateway: {SYSTEM_DATA.gatewayId}
    </div>
  </div>
);

// --- NEW TAB PAGE (Native Feel) ---
const IntranetHome = ({ onNavigate, browserPuzzles }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      if (searchTerm.startsWith("/") || searchTerm.startsWith("http")) {
        onNavigate(searchTerm);
      } else {
        onNavigate(`${SYSTEM_DATA.website}/${searchTerm}`);
      }
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 bg-white animate-in fade-in zoom-in duration-300">
      <div className="flex-1 max-h-32 hidden sm:block"></div>

      {/* Dynamic Brand */}
      <div className="flex flex-col items-center mb-8 sm:mb-12">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 sm:mb-6 transform transition-transform hover:scale-105 hover:rotate-3">
          <span className="text-white text-3xl sm:text-4xl font-bold tracking-tighter">
            {SYSTEM_DATA.orgShort}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
          {SYSTEM_DATA.intranetTitle}
        </h1>
        <p className="text-gray-400 mt-1 text-xs sm:text-sm font-medium">
          {SYSTEM_DATA.intranetSubtitle}
        </p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-lg relative mb-10 group z-10">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search
            size={18}
            className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
          />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
          placeholder={`Search ${SYSTEM_DATA.orgName} docs or enter URL...`}
          className="w-full py-3 sm:py-4 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-full text-gray-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all shadow-sm text-sm sm:text-base"
          autoFocus
        />
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-3xl px-2">
        {browserPuzzles.map((puzzle) => (
          <button
            key={puzzle.id}
            onClick={() => onNavigate(`${SYSTEM_DATA.website}/${puzzle.path}`)}
            className="flex flex-col items-center gap-3 group p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors active:scale-95"
          >
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110 ${puzzle.color.split(" ")[0].replace("bg-", "bg-opacity-90 bg-") || "bg-gray-500"}`}
            >
              <span className="font-bold text-base sm:text-lg">
                {puzzle.title.charAt(0)}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-blue-600 text-center leading-tight">
              {puzzle.title}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1"></div>

      {/* Dynamic Footer */}
      <div className="py-6 text-[10px] text-gray-300 font-mono uppercase tracking-widest text-center">
        &copy; 2026 {SYSTEM_DATA.orgName} Systems. Restricted Access.
      </div>
    </div>
  );
};

// --- MAIN BROWSER ---

export default function Browser({ onClose }) {
  const { user } = useAuth();

  const BASE_URL = SYSTEM_DATA.website;
  const HOME_URL = `${BASE_URL}/home`;

  const [url, setUrl] = useState(HOME_URL);
  const [history, setHistory] = useState([HOME_URL]);
  const [solvedIds, setSolvedIds] = useState([]);

  const [initialLoad, setInitialLoad] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    async function fetchProgress() {
      if (!user) return;
      const { data } = await supabase
        .from("solved_puzzles")
        .select("puzzle_id")
        .eq("user_id", user.id);
      if (data) setSolvedIds(data.map((row) => row.puzzle_id));
      setInitialLoad(false);
    }
    fetchProgress();
  }, [user]);

  const navigate = (input) => {
    let target = input.toLowerCase().trim(); // Normalize input
    if (
      target.includes(".onion") ||
      target.includes("tor://") ||
      target === "market"
    ) {
      target = "tor://market.onion";
    } else if (input.startsWith("/")) {
      target = `${BASE_URL}${input}`;
    } else if (!input.startsWith("http") && !input.startsWith("https")) {
      target = `https://${input}`;
    }

    setIsNavigating(true);
    setUrl(target);

    setTimeout(() => {
      setHistory((prev) => [...prev, target]);
      setIsNavigating(false);
    }, 800);
  };

  const browserPuzzles = PUZZLE_CONFIG.filter((p) => p.type === "browser");

  const renderContent = () => {
    if (url === "tor://market.onion") {
      return <DarkMarket />;
    }
    if (url === HOME_URL || url === BASE_URL || url === `${BASE_URL}/`) {
      return (
        <IntranetHome onNavigate={navigate} browserPuzzles={browserPuzzles} />
      );
    }

    const puzzle = browserPuzzles.find((p) => url === `${BASE_URL}/${p.path}`);

    if (!puzzle) return <Error404 url={url} />;
    if (puzzle.requires && !solvedIds.includes(puzzle.requires))
      return <Error403 url={url} />;

    const Component = puzzle.component;
    return <Component />;
  };

  return (
    <div className="h-full bg-white text-black flex flex-col font-sans overflow-hidden relative">
      {isNavigating && (
        <div className="absolute top-[52px] left-0 w-full h-0.5 bg-gray-100 z-50">
          <div className="h-full bg-blue-500 animate-progress shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
        </div>
      )}

      {/* TOOLBAR */}
      <div className="bg-white p-2 flex gap-2 items-center border-b border-gray-200 shadow-sm shrink-0 z-40 relative">
        <div className="hidden sm:flex gap-1.5 ml-1 mr-2">
          <div
            className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 cursor-pointer transition-colors"
            onClick={onClose}
          ></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>

        <div className="flex gap-1 sm:gap-2 text-gray-500 px-1 sm:px-2">
          <button
            onClick={() => url !== HOME_URL && navigate(HOME_URL)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <button
            className="p-1 rounded hover:bg-gray-100 transition-colors hidden sm:block disabled:opacity-30"
            disabled
          >
            <ArrowRight size={18} className="text-gray-700" />
          </button>
          <button
            onClick={() => navigate(url)}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <RefreshCw
              size={16}
              className={`text-gray-700 ${isNavigating ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* DYNAMIC URL BAR: Red for Tor, Blue for Intranet */}
        <div
          className={`flex-1 rounded-full px-4 py-1.5 text-xs sm:text-sm flex items-center gap-2 border transition-all min-w-0
            ${
              url === "tor://market.onion"
                ? "bg-red-950/20 border-red-900/50 text-red-500 focus-within:border-red-500 focus-within:shadow-[0_0_10px_rgba(255,0,0,0.2)]"
                : "bg-gray-100 border-transparent text-gray-600 focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-sm"
            }`}
        >
          {url === "tor://market.onion" ? (
            <ShieldAlert size={12} className="text-red-600 shrink-0" />
          ) : (
            <Lock size={12} className="text-green-600 shrink-0" />
          )}

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && navigate(url)}
            className={`bg-transparent w-full outline-none truncate ${url === "tor://market.onion" ? "text-red-500 font-mono" : "font-sans text-gray-700"}`}
            spellCheck="false"
          />
          {url && (
            <X
              size={12}
              className={`${url === "tor://market.onion" ? "text-red-900 hover:text-red-500" : "text-gray-400 hover:text-gray-600"} cursor-pointer`}
              onClick={() => setUrl("")}
            />
          )}
        </div>

        <Home
          size={20}
          className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors mr-2 shrink-0"
          onClick={() => navigate(HOME_URL)}
        />
      </div>

      <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-white">
        {initialLoad ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-gray-400 tracking-widest animate-pulse">
                ESTABLISHING UPLINK...
              </span>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}
