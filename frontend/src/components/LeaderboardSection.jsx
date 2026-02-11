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
      <div className="animate-bounce text-indigo-600 font-black text-2xl">🏆 RANKING MASTERS...</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center">
        <h2 className="text-5xl font-black text-slate-900 mb-3 tracking-tight">Global Leaderboard</h2>
        <p className="text-slate-500 font-medium text-lg">See how you stack up against the best minds.</p>
      </div>

      <div className="flex justify-center items-end gap-6 mb-12 pt-10">
        {leaders[1] && (
          <div className="flex flex-col items-center">
            <div className="mb-2 font-bold text-slate-400">#2</div>
            <div className="h-16 w-16 bg-slate-200 rounded-2xl mb-3 flex items-center justify-center font-bold text-slate-600 border-4 border-white shadow-lg">
              {leaders[1].name.charAt(0)}
            </div>
            <div className="bg-slate-300 w-24 h-32 rounded-t-3xl shadow-lg flex flex-col items-center pt-4">
              <span className="text-white font-black text-xl">{Math.round(leaders[1].avgScore)}%</span>
            </div>
          </div>
        )}

        {leaders[0] && (
          <div className="flex flex-col items-center scale-110">
            <div className="mb-2 font-black text-amber-500 text-xl">👑 #1</div>
            <div className="h-20 w-20 bg-amber-100 rounded-2xl mb-3 flex items-center justify-center font-bold text-amber-700 border-4 border-amber-400 shadow-xl">
              {leaders[0].name.charAt(0)}
            </div>
            <div className="bg-amber-400 w-28 h-48 rounded-t-3xl shadow-2xl flex flex-col items-center pt-6">
              <span className="text-white font-black text-2xl">{Math.round(leaders[0].avgScore)}%</span>
            </div>
          </div>
        )}

        {leaders[2] && (
          <div className="flex flex-col items-center">
            <div className="mb-2 font-bold text-orange-400">#3</div>
            <div className="h-14 w-14 bg-orange-100 rounded-2xl mb-3 flex items-center justify-center font-bold text-orange-700 border-4 border-white shadow-lg">
              {leaders[2].name.charAt(0)}
            </div>
            <div className="bg-orange-300 w-24 h-24 rounded-t-3xl shadow-lg flex flex-col items-center pt-4">
              <span className="text-white font-black text-xl">{Math.round(leaders[2].avgScore)}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Rank</th>
              <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
              <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Avg Score</th>
              <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Quizzes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leaders.length > 3 ? (
              leaders.slice(3).map((user, index) => (
                <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-10 py-6 font-black text-slate-300">#{index + 4}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-700">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-black text-sm">
                      {Math.round(user.avgScore)}%
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right font-bold text-slate-400">{user.totalQuizzes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-400 italic">No more rankings available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardSection;