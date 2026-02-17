import React from "react";

const MyQuizzesSection = ({ history = [] }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-zinc-100 tracking-tight">
            My Quizzes
          </h2>
          <p className="text-zinc-500 font-medium">
            All your completed AI-generated quizzes
          </p>
        </div>

        <div className="bg-[#1e1e28] px-6 py-3 rounded-2xl border border-zinc-800">
          <span className="text-indigo-400 font-black text-xl">
            {history.length}
          </span>
          <span className="text-zinc-500 font-bold text-sm ml-2 uppercase tracking-widest">
            Total Quizzes
          </span>
        </div>
      </div>

      <div className="bg-[#18181f] rounded-[3rem] border border-zinc-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#1e1e28] border-b border-zinc-800">
            <tr>
              <th className="px-10 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">
                Date
              </th>
              <th className="px-10 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">
                Topic
              </th>
              <th className="px-10 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest">
                Difficulty
              </th>
              <th className="px-10 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest text-center">
                Score
              </th>
              <th className="px-10 py-5 text-xs font-black text-zinc-500 uppercase tracking-widest text-right">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800">
            {history.length > 0 ? (
              history.map((quiz, index) => {
                const rawScore = Number(quiz?.score) || 0;
                const total = Number(quiz?.totalQuestions) || 1;
                const score = total > 0 ? Math.round((rawScore / total) * 100) : 0;
                const createdAt = quiz?.createdAt
                  ? new Date(quiz.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A";

                return (
                  <tr
                    key={quiz?._id || index}
                    className="hover:bg-[#1e1e28]/50 transition-colors group"
                  >
                    <td className="px-10 py-6 text-zinc-500 font-medium">
                      {createdAt}
                    </td>

                    <td className="px-10 py-6">
                      <span className="font-bold text-zinc-200 group-hover:text-indigo-400 transition">
                        {quiz?.topic || "Unknown Topic"}
                      </span>
                    </td>

                    <td className="px-10 py-6">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          quiz?.difficulty === "hard"
                            ? "bg-rose-500/20 text-rose-400"
                            : quiz?.difficulty === "medium"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {quiz?.difficulty || "Medium"}
                      </span>
                    </td>

                    <td className="px-10 py-6 text-center">
                      <div className="inline-flex items-center justify-center h-10 w-20 bg-zinc-800 rounded-xl font-black text-zinc-100">
                        {score}%
                      </div>
                    </td>

                    <td className="px-10 py-6 text-right">
                      {score >= 70 ? (
                        <span className="text-emerald-400 font-bold text-sm">
                          Passed ✨
                        </span>
                      ) : (
                        <span className="text-zinc-500 font-bold text-sm">
                          Review Needed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-6xl mb-4">📝</span>
                    <p className="text-zinc-500 font-bold italic text-lg">
                      No quizzes yet.
                    </p>
                    <p className="text-zinc-600">
                      Generate and complete a quiz to see it here!
                    </p>
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
