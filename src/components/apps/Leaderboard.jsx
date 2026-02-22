import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { Trophy, RefreshCw, Crown } from "lucide-react";
import AppHeader from "../ui/AppHeader";

export default function Leaderboard({ onClose }) {
  const { user } = useAuth();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("operative_id, full_name, score, id")
      .order("score", { ascending: false })
      .limit(50);

    if (!error) setPlayers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="h-full bg-neutral-900 text-white flex flex-col font-mono animate-in slide-in-from-bottom duration-300">
      <AppHeader
        title="Global Rankings"
        icon={Trophy}
        onClose={onClose}
        extra={
          <button
            onClick={fetchLeaderboard}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-yellow-500"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {loading ? (
          <div className="text-center p-10 text-neutral-500 animate-pulse">
            Fetching satellite data...
          </div>
        ) : (
          players.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                player.id === user?.id
                  ? "bg-green-900/20 border-green-500/50"
                  : "bg-white/5 border-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 flex items-center justify-center font-bold text-xs rounded-full ${
                    index === 0
                      ? "bg-yellow-500 text-black"
                      : index === 1
                        ? "bg-neutral-400 text-black"
                        : index === 2
                          ? "bg-orange-700 text-white"
                          : "text-neutral-500"
                  }`}
                >
                  {index === 0 ? <Crown size={12} /> : index + 1}
                </span>
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-bold ${player.id === user?.id ? "text-green-400" : "text-neutral-200"}`}
                  >
                    {player.operative_id || "Unknown Agent"}
                  </span>
                  <span className="text-[10px] text-neutral-500 truncate max-w-[120px]">
                    {player.full_name}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-yellow-500 font-bold font-mono text-sm">
                  {player.score}
                </span>
                <span className="text-[10px] text-neutral-500 block">PTS</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
