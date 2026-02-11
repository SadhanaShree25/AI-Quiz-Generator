import React from "react";

const MyQuizzesSection = ({ history }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Quiz History</h2>
          <p className="text-slate-500 font-medium">A detailed log of all your AI-generated challenges</p>
        </div>
        <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100">
          <span className="text-indigo-600 font-black text-xl">{history?.length || 0}</span>
          <span className="text-indigo-400 font-bold text-sm ml-2 uppercase tracking-widest">Total Attempts</span>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Topic</th>
              <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Difficulty</th>
              <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
              <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {history?.length > 0 ? (
              history.map((quiz, index) => (
                <tr key={quiz._id || index} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-6 text-slate-500 font-medium">
                    {new Date(quiz.createdAt).toLocaleDateString(undefined, { 
                      year: 'numeric', month: 'short', day: 'numeric' 
                    })}
                  </td>
                  <td className="px-10 py-6">
                    <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition">
                      {quiz.topic}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      quiz.difficulty === 'hard' ? 'bg-rose-100 text-rose-600' :
                      quiz.difficulty === 'medium' ? 'bg-amber-100 text-amber-600' : 
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {quiz.difficulty || 'Medium'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="inline-flex items-center justify-center h-10 w-20 bg-slate-100 rounded-xl font-black text-slate-700">
                      {quiz.score}%
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    {quiz.score >= 70 ? (
                      <span className="text-emerald-500 font-bold text-sm">Passed ✨</span>
                    ) : (
                      <span className="text-slate-400 font-bold text-sm">Review Needed</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-6xl mb-4">📭</span>
                    <p className="text-slate-400 font-bold italic text-lg">Your history is a blank canvas.</p>
                    <p className="text-slate-300">Take your first quiz to see it here!</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyQuizzesSection;