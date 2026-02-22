import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import {
  Trophy,
  RefreshCw,
  Users,
  ShieldCheck,
  Search,
  Lock,
} from "lucide-react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState(false);

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const handleAuth = (e) => {
    e.preventDefault();
    if (passcode === import.meta.env.VITE_ADMIN_PASSCODE) {
      setIsAuthenticated(true);
    } else {
      setAuthError(true);
      setPasscode("");
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("score", { ascending: false })
      .order("credits", { ascending: false });

    if (!error && data) setPlayers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeaderboard();
      const interval = setInterval(fetchLeaderboard, 10000); // 10 second live refresh
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen bg-black text-red-500 font-mono flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-red-900 bg-red-950/20 p-8 shadow-[0_0_50px_rgba(220,38,38,0.2)]">
          <div className="text-center mb-8">
            <Lock
              size={48}
              className="mx-auto text-red-600 mb-4 animate-pulse"
            />
            <h1 className="text-2xl font-black tracking-widest uppercase">
              Restricted Access
            </h1>
            <p className="text-xs text-red-800 mt-2">
              CYBERPHOENIX COMMAND NODE
            </p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              placeholder="ENTER MASTER PASSCODE"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-black border border-red-900 p-4 text-center tracking-[0.5em] focus:border-red-500 outline-none transition-colors text-white"
              autoFocus
            />
            {authError && (
              <div className="text-center text-xs font-bold animate-bounce text-red-500">
                ERR: SIGNATURE REJECTED
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-red-900/50 hover:bg-red-700 text-white font-bold py-3 tracking-widest transition-colors border border-red-500"
            >
              AUTHORIZE
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredPlayers = players.filter(
    (p) =>
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.operative_id?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans p-4 md:p-10 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3 text-blue-500 tracking-widest uppercase">
              <ShieldCheck size={32} /> Command Node
            </h1>
            <p className="text-neutral-400 mt-2 font-mono text-sm">
              Live Event Telemetry
            </p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              />
              <input
                type="text"
                placeholder="Search operatives..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              onClick={fetchLeaderboard}
              className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg transition-colors"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <div className="text-2xl font-black">{players.length}</div>
              <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                Active Operatives
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-950/50 border-b border-neutral-800 text-[10px] md:text-xs uppercase tracking-widest text-neutral-400">
                  <th className="p-4 font-bold w-16 text-center">Rank</th>
                  <th className="p-4 font-bold">Operative Identity</th>
                  <th className="p-4 font-bold text-right">Total Score</th>
                  <th className="p-4 font-bold text-right">Wallet (cR)</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs md:text-sm">
                {filteredPlayers.map((player, index) => (
                  <tr
                    key={player.id}
                    className={`border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors ${index < 3 ? "bg-blue-900/10" : ""}`}
                  >
                    <td className="p-4 text-center">
                      {index === 0 ? (
                        <Trophy size={18} className="text-yellow-500 mx-auto" />
                      ) : index === 1 ? (
                        <Trophy size={18} className="text-gray-400 mx-auto" />
                      ) : index === 2 ? (
                        <Trophy size={18} className="text-amber-700 mx-auto" />
                      ) : (
                        <span className="text-neutral-500 font-bold">
                          {index + 1}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white tracking-wide">
                        {player.full_name || "Unknown Identity"}
                      </div>
                      <div className="text-[10px] text-blue-400 mt-0.5">
                        {player.operative_id || "PENDING"}{" "}
                        <span className="text-neutral-600">
                          | {player.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-black text-blue-400">
                      {player.score || 0}
                    </td>
                    <td className="p-4 text-right font-bold text-green-400">
                      {player.credits || 0} cR
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
