import React, { useEffect, useState } from "react";
import api from "../services/api";

const LeaderboardSection = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get("/quiz/leaderboard");
        setLeaders(res.data);
      } catch (err) {
        console.error("Error fetching leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return (
    <div className="p-20 text-center">
      <div className="animate-bounce text-indigo-400 font-black text-2xl">🏆 Loading leaderboard...</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center">
        <h2 className="text-5xl font-black text-zinc-100 mb-3 tracking-tight">Leaderboard</h2>
        <p className="text-zinc-500 font-medium text-lg">Top performers across the platform.</p>
      </div>

      <div className="flex justify-center items-end gap-6 mb-12 pt-10">
        {leaders[1] && (
          <div className="flex flex-col items-center">
            <div className="mb-2 font-bold text-zinc-400">#2</div>
            <div className="h-16 w-16 bg-zinc-700 rounded-2xl mb-3 flex items-center justify-center font-bold text-zinc-200 border-4 border-zinc-600">
              {leaders[1].name?.charAt(0)}
            </div>
            <div className="bg-zinc-700 w-24 h-32 rounded-t-3xl flex flex-col items-center pt-4">
              <span className="text-white font-black text-xl">{Math.round(leaders[1].avgScore || 0)}%</span>
            </div>
          </div>
        )}

        {leaders[0] && (
          <div className="flex flex-col items-center scale-110">
            <div className="mb-2 font-black text-amber-400 text-xl">👑 #1</div>
            <div className="h-20 w-20 bg-amber-500/30 rounded-2xl mb-3 flex items-center justify-center font-bold text-amber-400 border-4 border-amber-500/50">
              {leaders[0].name?.charAt(0)}
            </div>
            <div className="bg-amber-500 w-28 h-48 rounded-t-3xl flex flex-col items-center pt-6">
              <span className="text-white font-black text-2xl">{Math.round(leaders[0].avgScore || 0)}%</span>
            </div>
          </div>
        )}

        {leaders[2] && (
          <div className="flex flex-col items-center">
            <div className="mb-2 font-bold text-orange-400">#3</div>
            <div className="h-14 w-14 bg-orange-500/30 rounded-2xl mb-3 flex items-center justify-center font-bold text-orange-400 border-4 border-orange-500/50">
              {leaders[2].name?.charAt(0)}
            </div>
            <div className="bg-orange-500/50 w-24 h-24 rounded-t-3xl flex flex-col items-center pt-4">
              <span className="text-white font-black text-xl">{Math.round(leaders[2].avgScore || 0)}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#18181f] rounded-[3rem] border border-zinc-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1e1e28] border-b border-zinc-800">
            <tr>
              <th className="px-10 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">Rank</th>
              <th className="px-10 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">User</th>
              <th className="px-10 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest text-center">Avg Score</th>
              <th className="px-10 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">Quizzes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {leaders.length > 3 ? (
              leaders.slice(3).map((user, index) => (
                <tr key={user._id} className="hover:bg-[#1e1e28]/50 transition-colors">
                  <td className="px-10 py-6 font-black text-zinc-400">#{index + 4}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center font-bold">
                        {user.name?.charAt(0)}
                      </div>
                      <span className="font-bold text-zinc-200">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-black text-sm">
                      {Math.round(user.avgScore || 0)}%
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right font-bold text-zinc-500">{user.totalQuizzes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-zinc-500 italic">No more rankings yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardSection;