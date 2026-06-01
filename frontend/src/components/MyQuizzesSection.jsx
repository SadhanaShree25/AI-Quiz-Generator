import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const MyQuizzesSection = ({ history = [] }) => {
  const { theme } = useTheme();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8 max-w-6xl mx-auto">
      
      {/* SECTION HEADER BLOCK */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b ${
        theme === "dark" ? "border-zinc-800/60" : "border-gray-200"
      }`}>
        <div>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${
            theme === "dark" ? "text-zinc-100" : "text-gray-900"
          }`}>
            My Quizzes
          </h2>
          <p className={`font-medium text-sm mt-1 ${
            theme === "dark" ? "text-zinc-500" : "text-gray-500"
          }`}>
            Review historical performance matrixes and active mastery metrics.
          </p>
        </div>

        <div className={`px-5 py-2.5 rounded-2xl border flex items-center gap-3 self-stretch sm:self-auto justify-center ${
          theme === "dark" ? "bg-[#11111a] border-zinc-800/80" : "bg-white border-gray-200 shadow-sm"
        }`}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-black text-2xl">
            {history.length}
          </span>
          <span className={`font-bold text-xs uppercase tracking-widest ${
            theme === "dark" ? "text-zinc-500" : "text-gray-400"
          }`}>
            Total Logs
          </span>
        </div>
      </div>

      {/* RESPONSIVE MOBILE CARDS SETUP (< md) */}
      <div className="md:hidden space-y-4">
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
              <div
                key={quiz?._id || index}
                className={`border rounded-2xl p-5 space-y-4 backdrop-blur-xl ${
                  theme === "dark" ? "bg-[#11111a]/60 border-zinc-800/80 text-zinc-300" : "bg-white border-gray-200 shadow-md text-gray-800"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className={`font-bold text-base leading-tight ${
                      theme === "dark" ? "text-zinc-100" : "text-gray-900"
                    }`}>
                      {quiz?.topic || "Unknown Topic"}
                    </p>
                    <p className={`text-[11px] font-medium tracking-wide ${
                      theme === "dark" ? "text-zinc-500" : "text-gray-400"
                    }`}>{createdAt}</p>
                  </div>
                  <span className={`inline-flex items-center justify-center h-9 px-3 border rounded-xl font-black text-sm text-indigo-400 ${
                    theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-gray-100 border-gray-200"
                  }`}>
                    {score}%
                  </span>
                </div>

                <div className={`flex justify-between items-center pt-3 border-t ${
                  theme === "dark" ? "border-zinc-800/40" : "border-gray-200"
                }`}>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        quiz?.difficulty === "hard"
                          ? "bg-rose-500/5 text-rose-400 border-rose-500/20"
                          : quiz?.difficulty === "medium"
                          ? "bg-amber-500/5 text-amber-400 border-amber-500/20"
                          : "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {quiz?.difficulty || "Medium"}
                    </span>
                    <span className={`text-[10px] font-extrabold tracking-wider ${
                      score >= 70 
                        ? (theme === "dark" ? "text-emerald-400" : "text-emerald-600") 
                        : (theme === "dark" ? "text-zinc-500" : "text-gray-400")
                    }`}>
                      {score >= 70 ? "Passed" : "Review"}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedQuiz(quiz)}
                    className="px-3.5 py-1.5 bg-indigo-600/15 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-500 text-indigo-400 hover:text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all active:scale-95"
                  >
                    Review 📑
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <EmptyHistoryPlaceholder theme={theme} />
        )}
      </div>

      {/* PREMIUM DESKTOP DATA SHEET GRID (>= md) */}
      <div className={`rounded-3xl border overflow-hidden backdrop-blur-xl shadow-2xl ${
        theme === "dark" ? "bg-[#11111a]/40 border-zinc-800/80" : "bg-white border-gray-200"
      }`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b ${theme === "dark" ? "bg-[#11111a] border-zinc-800/80" : "bg-gray-100/50 border-gray-200"}`}>
              <th className={`px-8 py-4.5 text-[11px] font-black uppercase tracking-widest ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Date</th>
              <th className={`px-8 py-4.5 text-[11px] font-black uppercase tracking-widest ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Topic Scope</th>
              <th className={`px-8 py-4.5 text-[11px] font-black uppercase tracking-widest ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Difficulty Tier</th>
              <th className={`px-8 py-4.5 text-[11px] font-black uppercase tracking-widest text-center ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Score Evaluation</th>
              <th className={`px-8 py-4.5 text-[11px] font-black uppercase tracking-widest text-right ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Status</th>
              <th className={`px-8 py-4.5 text-[11px] font-black uppercase tracking-widest text-right ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>Action</th>
            </tr>
          </thead>

          <tbody className={`divide-y ${theme === "dark" ? "divide-zinc-800/40" : "divide-gray-100"}`}>
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
                    className={`transition-colors group ${theme === "dark" ? "hover:bg-zinc-900/30" : "hover:bg-gray-50"}`}
                  >
                    <td className={`px-8 py-5 font-semibold text-sm tracking-wide ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
                      {createdAt}
                    </td>

                    <td className="px-8 py-5">
                      <span className={`font-bold transition text-sm ${
                        theme === "dark" ? "text-zinc-200 group-hover:text-indigo-400" : "text-gray-800 group-hover:text-indigo-600"
                      }`}>
                        {quiz?.topic || "Unknown Topic"}
                      </span>
                    </td>

                    <td className="px-8 py-5">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                          quiz?.difficulty === "hard"
                            ? "bg-rose-500/5 text-rose-400 border-rose-500/20"
                            : quiz?.difficulty === "medium"
                            ? "bg-amber-500/5 text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {quiz?.difficulty || "Medium"}
                      </span>
                    </td>

                    <td className="px-8 py-5 text-center">
                      <div className={`inline-flex items-center justify-center h-9 w-20 border rounded-xl font-black text-xs shadow-inner group-hover:border-indigo-500/20 transition-all ${
                        theme === "dark" ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-gray-100 border-gray-200 text-gray-700"
                      }`}>
                        {score}%
                      </div>
                    </td>

                    <td className="px-8 py-5 text-right">
                      {score >= 70 ? (
                        <span className={`inline-flex items-center gap-1.5 font-extrabold text-xs tracking-wide ${
                          theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                        }`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Passed ✨
                        </span>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 font-bold text-xs tracking-wide ${
                          theme === "dark" ? "text-zinc-500" : "text-gray-400"
                        }`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" /> Review Needed
                        </span>
                      )}
                    </td>

                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => setSelectedQuiz(quiz)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600 hover:to-indigo-600 border border-indigo-500/20 hover:border-indigo-500 text-indigo-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
                      >
                        Review Questions 📑
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="py-20 text-center">
                  <EmptyHistoryPlaceholder theme={theme} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* REVISION MODAL OVERLAY */}
      {selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className={`border rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 ${
            theme === "dark" ? "bg-[#11111a] border-zinc-800/80" : "bg-white border-gray-200"
          }`}>
            
            {/* MODAL HEADER */}
            <div className={`px-8 py-6 border-b flex justify-between items-center bg-opacity-80 backdrop-blur-md ${
              theme === "dark" ? "bg-[#11111a] border-zinc-800/60" : "bg-white border-gray-200"
            }`}>
              <div className="space-y-1">
                <h3 className={`text-xl font-black tracking-tight ${
                  theme === "dark" ? "text-zinc-100" : "text-gray-900"
                }`}>
                  Revision Review: {selectedQuiz.topic}
                </h3>
                <p className={`text-xs font-bold uppercase tracking-wider ${
                  theme === "dark" ? "text-zinc-500" : "text-gray-500"
                }`}>
                  Difficulty: <span className="text-indigo-500 font-extrabold">{selectedQuiz.difficulty}</span> | Score: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-black">{selectedQuiz.score} / {selectedQuiz.totalQuestions} ({Math.round((selectedQuiz.score / (selectedQuiz.totalQuestions || 1)) * 100)}%)</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedQuiz(null)}
                className={`h-10 w-10 flex items-center justify-center border rounded-xl transition-colors ${
                  theme === "dark"
                    ? "bg-zinc-900/60 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-500 hover:text-gray-700"
                }`}
              >
                ✕
              </button>
            </div>

            {/* MODAL BODY (SCROLLABLE LIST) */}
            <div className="p-8 overflow-y-auto space-y-6 flex-1 scrollbar-thin scrollbar-thumb-zinc-800 pr-4">
              {!selectedQuiz.questions || selectedQuiz.questions.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="text-3xl">⚠️</div>
                  <p className={`font-bold ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>No question history available</p>
                  <p className={`text-xs max-w-xs mx-auto ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`}>
                    Detailed question and answer history is only saved for quizzes completed after this update.
                  </p>
                </div>
              ) : (
                selectedQuiz.questions.map((q, qIndex) => {
                  const isCorrect = q.userAnswer && String(q.userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();

                  return (
                    <div
                      key={qIndex}
                      className={`border rounded-2xl p-6 space-y-4 transition-colors ${
                        theme === "dark" ? "bg-[#0a0a0f]/60 border-zinc-800/60 hover:border-zinc-800" : "bg-gray-50 border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <h4 className={`font-bold text-base leading-snug ${
                          theme === "dark" ? "text-zinc-200" : "text-gray-800"
                        }`}>
                          {qIndex + 1}. {q.question}
                        </h4>
                        <span className={`px-2.5 py-0.5 rounded text-[9px] uppercase tracking-widest font-black shrink-0 border ${
                          isCorrect 
                            ? (theme === "dark" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-100 text-emerald-700 border-emerald-200") 
                            : q.userAnswer 
                            ? (theme === "dark" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-rose-100 text-rose-700 border-rose-200")
                            : (theme === "dark" ? "bg-zinc-800 text-zinc-400 border-transparent" : "bg-gray-200 text-gray-600 border-transparent")
                        }`}>
                          {isCorrect ? "Correct" : q.userAnswer ? "Incorrect" : "Skipped"}
                        </span>
                      </div>

                      {/* OPTIONS STACK */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, optIndex) => {
                          const isOptCorrect = String(opt).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase();
                          const isOptUserAnswer = q.userAnswer && String(opt).trim().toLowerCase() === String(q.userAnswer).trim().toLowerCase();

                          let optStyle = theme === "dark" ? "bg-zinc-900/20 border-zinc-800/40 text-zinc-400" : "bg-white border-gray-200 text-gray-600";
                          let prefix = "○";

                          if (isOptCorrect) {
                            optStyle = theme === "dark"
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold"
                              : "bg-emerald-100 border-emerald-300 text-emerald-700 font-bold";
                            prefix = "✓";
                          } else if (isOptUserAnswer) {
                            optStyle = theme === "dark"
                              ? "bg-rose-500/10 border-rose-500/40 text-rose-400 font-bold"
                              : "bg-rose-100 border-rose-300 text-rose-700 font-bold";
                            prefix = "❌";
                          }

                          return (
                            <div
                              key={optIndex}
                              className={`p-3.5 border rounded-xl text-xs sm:text-sm flex items-center gap-3 transition-colors ${optStyle}`}
                            >
                              <span className="text-sm">{prefix}</span>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* EXPLANATION */}
                      {q.explanation && (
                        <div className={`p-4 border rounded-xl space-y-1 text-xs leading-relaxed ${
                          theme === "dark" ? "bg-zinc-900/40 border-zinc-800/40 text-zinc-400" : "bg-gray-100 border-gray-200 text-gray-600"
                        }`}>
                          <span className={`font-extrabold uppercase tracking-widest text-[9px] block ${
                            theme === "dark" ? "text-zinc-500" : "text-gray-500"
                          }`}>
                            Easy Explanation
                          </span>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className={`px-8 py-5 border-t flex justify-end bg-opacity-80 backdrop-blur-md ${
              theme === "dark" ? "bg-[#11111a] border-zinc-800/60" : "bg-white border-gray-200"
            }`}>
              <button
                onClick={() => setSelectedQuiz(null)}
                className={`px-6 py-2.5 border rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
                  theme === "dark"
                    ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                    : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-500 hover:text-gray-700"
                }`}
              >
                Close Revision
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

/* INNER CORE ABSTRACT LAYOUT FOR MISSING RUN RECORDS */
const EmptyHistoryPlaceholder = ({ theme }) => (
  <div className="flex flex-col items-center justify-center p-10 text-center space-y-3">
    <div className={`h-14 w-14 border rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
      theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-gray-100 border-gray-200"
    }`}>
      📋
    </div>
    <div className="space-y-1">
      <p className={`font-bold text-base ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>No active quiz metrics stored yet</p>
      <p className={`text-xs max-w-xs mx-auto ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`}>
        Complete an evaluation sequence through your main generation card workspace dashboard to track analytical progress markers.
      </p>
    </div>
  </div>
);

export default MyQuizzesSection;