import React, { useState } from "react";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

export default function QuizForm({ onQuizGenerated, defaultTopic = "" }) {
  const { theme } = useTheme();
  const [topic, setTopic] = useState(defaultTopic);
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState("5");
  const [quizType, setQuizType] = useState("Multiple Choice");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      alert("Please enter a topic to start.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/quiz/generate-quiz", {
        topic: topic.trim(),
        difficulty,
        numQuestions: Number(numQuestions),
        quizType,
      });

      if (Array.isArray(res.data) && res.data.length > 0) {
        onQuizGenerated({ 
          questions: res.data, 
          topic: topic.trim(), 
          difficulty,
          quizType 
        });
      } else if (res.data?.questions && Array.isArray(res.data.questions)) {
        onQuizGenerated({
          questions: res.data.questions,
          topic: topic.trim(),
          difficulty,
          quizType
        });
      } else {
        alert("No structured questions received from the AI engine.");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Quiz generation failed.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* LOADING OVERLAY STATE WITH ANIMATED PROGRESS TRACK */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0f]/90 backdrop-blur-xl">
          <div className="relative flex items-center justify-center h-32 w-32 mb-8">
            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full animate-ping duration-1000" />
            <div className="absolute inset-2 border-4 border-indigo-500/30 rounded-full animate-pulse" />
            <div className="h-16 w-16 border-4 border-t-transparent border-b-transparent border-indigo-400 rounded-full animate-spin duration-700" />
            <span className="absolute text-2xl">🧠</span>
          </div>
          
          <h3 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent mb-2">
            AI is generating your quiz...
          </h3>
          <p className="text-zinc-500 text-sm tracking-wide max-w-xs text-center animate-pulse">
            Formulating complex evaluation parameters, processing contextual logic steps, and composing explanations.
          </p>
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden mt-6">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-infinite-loading" />
          </div>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="text-center mb-10 space-y-2">
        <h1 className={`text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r tracking-tight ${
          theme === "dark" ? "from-white via-zinc-200 to-zinc-400" : "from-gray-900 via-gray-700 to-gray-500"
        }`}>
          Generate Quiz
        </h1>
        <p className={`text-sm sm:text-base max-w-md mx-auto leading-relaxed ${
          theme === "dark" ? "text-zinc-400" : "text-gray-500"
        }`}>
          Create personalized AI-generated quizzes from any topic.
        </p>
      </div>

      {/* CENTERED GLASSMORPHISM FORM CARD */}
      <div className={`rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden border ${
        theme === "dark" ? "bg-[#11111a]/60 border-zinc-800/80" : "bg-white border-gray-200"
      }`}>
        {/* Abstract background ambient mesh gradient flare */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          {/* FIELD 1: TOPIC INPUT */}
          <div className="space-y-3">
            <label className={`block text-xs font-black uppercase tracking-widest ${
              theme === "dark" ? "text-zinc-500" : "text-gray-500"
            }`}>
              Topic Scope
            </label>
            <input
              type="text"
              placeholder="Enter a topic (e.g., JavaScript, React, DSA)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={`w-full p-4 rounded-xl border focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all text-base font-medium shadow-inner ${
                theme === "dark"
                  ? "bg-[#0a0a0f]/80 border-zinc-800 text-zinc-100 placeholder-zinc-600"
                  : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
              }`}
            />
          </div>

          {/* GRID SPLIT FOR NUM QUESTIONS & QUIZ TYPE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* FIELD 3: NUMBER OF QUESTIONS */}
            <div className="space-y-3">
              <label className={`block text-xs font-black uppercase tracking-widest ${
                theme === "dark" ? "text-zinc-500" : "text-gray-500"
              }`}>
                Number of Questions
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className={`w-full p-4 border rounded-xl focus:border-indigo-500/60 focus:outline-none text-sm font-semibold appearance-none cursor-pointer tracking-wide ${
                  theme === "dark"
                    ? "bg-[#0a0a0f]/80 border-zinc-800 text-zinc-200"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
              </select>
            </div>

            {/* FIELD 4: QUIZ TYPE VARIATION */}
            <div className="space-y-3">
              <label className={`block text-xs font-black uppercase tracking-widest ${
                theme === "dark" ? "text-zinc-500" : "text-gray-500"
              }`}>
                Question Blueprint
              </label>
              <select
                value={quizType}
                onChange={(e) => setQuizType(e.target.value)}
                className={`w-full p-4 border rounded-xl focus:border-indigo-500/60 focus:outline-none text-sm font-semibold appearance-none cursor-pointer tracking-wide ${
                  theme === "dark"
                    ? "bg-[#0a0a0f]/80 border-zinc-800 text-zinc-200"
                    : "bg-gray-50 border-gray-200 text-gray-700"
                }`}
              >
                <option value="Multiple Choice">Multiple Choice (MCQ)</option>
                <option value="True/False">True / False</option>
                <option value="Mixed">Mixed Structuring</option>
              </select>
            </div>
          </div>

          {/* FIELD 2: DIFFICULTY SELECTION (PILL SELECTION) */}
          <div className="space-y-3">
            <label className={`block text-xs font-black uppercase tracking-widest ${
              theme === "dark" ? "text-zinc-500" : "text-gray-500"
            }`}>
              Difficulty Tier
            </label>
            <div className={`grid grid-cols-3 gap-3 p-1.5 border rounded-2xl ${
              theme === "dark" ? "bg-[#0a0a0f]/90 border-zinc-800" : "bg-gray-100 border-gray-200"
            }`}>
              {["easy", "medium", "hard"].map((level) => {
                const isActive = difficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-3 px-4 rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all duration-300 transform select-none ${
                      isActive
                        ? level === "easy"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-inner"
                          : level === "medium"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-inner"
                          : "bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-inner"
                        : theme === "dark"
                        ? "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 border border-transparent"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200 border border-transparent"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUBMIT/GENERATE ACTION BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white py-4 sm:py-5 rounded-2xl font-black text-sm tracking-widest uppercase transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-indigo-600/20"
            >
              Generate Quiz 🚀
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}