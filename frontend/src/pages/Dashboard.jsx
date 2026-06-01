import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import MyQuizzesSection from "../components/MyQuizzesSection";
import QuizForm from "../pages/QuizForm";
import PdfQuizForm from "./PdfQuizForm";
import QuizPlayer from "../components/QuizPlayer";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const AdvancedDashboard = () => {
  const { user: authUser, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [data, setData] = useState({
    stats: { totalQuizzes: 0, totalAttempts: 0, lastTopic: "None", streak: 0, avgScore: 0 },
    history: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setData({
        stats: { totalQuizzes: 0, totalAttempts: 0, lastTopic: "None", streak: 0, avgScore: 0 },
        history: [],
      });
      setLoading(false);
      return;
    }
    try {
      const [statsRes, historyRes] = await Promise.all([
        api.get("/quiz/stats"),
        api.get("/quiz/history"),
      ]);

      setData({
        stats: {
          totalQuizzes: statsRes.data.totalQuizzes || 0,
          totalAttempts: statsRes.data.totalAttempts || 0,
          lastTopic: statsRes.data.lastTopic || "None",
          streak: statsRes.data.streak || 0,
          avgScore: statsRes.data.avgScore || 0,
        },
        history: historyRes.data || [],
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    authLogout();
    navigate("/login");
  };

  const verifyAuthAndExecute = (actionCallback) => {
    const token = localStorage.getItem("token");
    if (!token || !authUser) {
      navigate("/login");
    } else {
      actionCallback();
    }
  };

  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center ${theme === "dark" ? "bg-[#0a0a0f]" : "bg-gray-50"}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-indigo-400 font-bold uppercase tracking-widest text-sm animate-pulse">
            Loading AI Engine...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === "dark" ? "bg-[#0a0a0f] text-zinc-100" : "bg-gray-50 text-gray-900"}`}>

      {/* GLOBAL GLASSMORPHISM STICKY NAVBAR */}
      <nav className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all ${theme === "dark" ? "bg-[#0a0a0f]/70 border-zinc-800/80" : "bg-white/70 border-gray-200"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-8">
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent cursor-pointer" onClick={() => setCurrentTab("dashboard")}>
              QUIZ.AI
            </span>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setCurrentTab("dashboard")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${currentTab === "dashboard"
                  ? (theme === "dark" ? "bg-zinc-800 text-white" : "bg-gray-200/80 text-gray-900")
                  : (theme === "dark" ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900")
                  }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => verifyAuthAndExecute(() => setCurrentTab("quizzes"))}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${currentTab === "quizzes"
                  ? (theme === "dark" ? "bg-zinc-800 text-white" : "bg-gray-200/80 text-gray-900")
                  : (theme === "dark" ? "text-zinc-400 hover:text-white" : "text-gray-600 hover:text-gray-900")
                  }`}
              >
                History
              </button>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all ${theme === "dark" ? "border-zinc-800 bg-zinc-900/50 text-amber-400 hover:bg-zinc-800" : "border-gray-200 bg-white text-indigo-600 hover:bg-gray-100"
                }`}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  if (!authUser) {
                    navigate("/login");
                  } else {
                    setIsDropdownOpen(!isDropdownOpen);
                  }
                }}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50 transition"
              >
                <div className="h-9 w-9 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {authUser ? authUser.name?.charAt(0).toUpperCase() : "⚙️"}
                </div>
              </button>

              {isDropdownOpen && authUser && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  <div className={`absolute right-0 mt-3 w-56 rounded-2xl border p-2 shadow-xl z-20 animate-in fade-in slide-in-from-top-3 duration-200 ${theme === "dark" ? "bg-[#12121a] border-zinc-800 text-zinc-200" : "bg-white border-gray-200 text-gray-800"
                    }`}>
                    <div className="px-3 py-2.5 border-b border-zinc-800/10 dark:border-zinc-800/50 mb-1">
                      <p className="text-xs text-zinc-400 font-medium">Signed in as</p>
                      <p className="font-bold truncate text-sm">{authUser?.name}</p>
                    </div>
                    <button onClick={() => { setCurrentTab("profile"); setIsDropdownOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl text-sm hover:bg-indigo-600 hover:text-white transition font-medium">👤 Profile</button>
                    <hr className="my-1 border-zinc-800/10 dark:border-zinc-800/50" />
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition font-bold">Logout 🚪</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* CORE WORKSPACE CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {currentTab === "dashboard" && (
          <div className="space-y-16 animate-in fade-in duration-500">

            {/* HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  ⚡ Next-Gen AI Learning Platform
                </div>
                <h1 className={`text-4xl sm:text-6xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r ${
                  theme === "dark" ? "from-white via-zinc-200 to-zinc-500" : "from-gray-900 via-gray-700 to-gray-500"
                }`}>
                  Welcome to <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                    theme === "dark" ? "from-blue-400 to-purple-500" : "from-blue-600 to-purple-600"
                  }`}>QUIZ.AI</span>
                </h1>
                <p className={`text-base sm:text-lg max-w-xl leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-gray-600"} mx-auto lg:mx-0`}>
                  Create personalized quizzes from any topic or upload study materials and let AI generate intelligent questions instantly.
                </p>

                {/* NEAT CONDITIONAL AUTH BUTTON SYSTEM */}
                {!authUser && (
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                    <Link
                      to="/login"
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Login / Register 🔑
                    </Link>
                  </div>
                )}
              </div>

              {/* Graphic Asset Container */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition duration-700 animate-pulse" />
                  <div className={`w-full h-full border-2 rounded-[2rem] flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-[1.02] ${theme === "dark" ? "bg-zinc-900/40 border-zinc-800 backdrop-blur-xl" : "bg-white border-gray-200 shadow-xl"
                    }`}>
                    <div className="grid grid-cols-2 gap-4 w-full h-full">
                      <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/5 border border-blue-500/20 rounded-2xl flex items-center justify-center text-3xl animate-bounce duration-1000">🤖</div>
                      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/5 border border-purple-500/20 rounded-2xl flex items-center justify-center text-3xl translate-y-4">📝</div>
                      <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-3xl -translate-y-4">🎯</div>
                      <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/5 border border-amber-500/20 rounded-2xl flex items-center justify-center text-3xl">⚡</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DUAL ACTION CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* CARD 1: TOPIC GENERATION */}
              <div className={`p-8 rounded-3xl border group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 ${theme === "dark" ? "bg-gradient-to-b from-[#11111a] to-[#0a0a0f] border-zinc-800/80 hover:border-blue-500/40" : "bg-white border-gray-200 shadow-md hover:border-blue-400"
                }`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="text-4xl mb-4 p-3 bg-blue-500/10 rounded-2xl inline-block text-blue-400">🧠</div>
                <h3 className="text-2xl font-bold mb-2">Generate Quiz</h3>
                <p className={`text-sm leading-relaxed mb-6 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                  Generate AI-powered quizzes from any topic. Select difficulty and number of questions to start learning.
                </p>
                <button
                  onClick={() => verifyAuthAndExecute(() => setCurrentTab("create"))}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-blue-600/20"
                >
                  Start Quiz 🚀
                </button>
              </div>

              {/* CARD 2: STANDALONE PDF GENERATION PORTAL */}
              <div className={`p-8 rounded-3xl border group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/5 ${theme === "dark" ? "bg-gradient-to-b from-[#11111a] to-[#0a0a0f] border-zinc-800/80 hover:border-purple-500/40" : "bg-white border-gray-200 shadow-md hover:border-purple-400"
                }`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="text-4xl mb-4 p-3 bg-purple-500/10 rounded-2xl inline-block text-purple-400">📂</div>
                <h3 className="text-2xl font-bold mb-2">PDF Quiz</h3>
                <p className={`text-sm leading-relaxed mb-6 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                  Upload study materials, notes, or PDFs and let AI create questions directly from your contextual content.
                </p>
                <button
                  onClick={() => verifyAuthAndExecute(() => setCurrentTab("pdf-create"))}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-sm transition-transform active:scale-95 shadow-lg shadow-purple-600/20"
                >
                  Upload PDF 📑
                </button>
              </div>
            </div>

            {/* PERFORMANCE METRICS PANEL */}
            <div className="space-y-6">
              <h3 className="text-xl font-extrabold tracking-tight border-l-4 border-indigo-500 pl-3">Performance Matrix</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <AnalyticsCard label="Total Completed" value={data.stats.totalQuizzes} icon="✅" color="text-blue-400" theme={theme} />
                <AnalyticsCard label="Learning Streak" value={`${data.stats.streak} Days`} icon="🔥" color="text-orange-400" theme={theme} />
                <AnalyticsCard label="Average Score" value={`${data.stats.avgScore}%`} icon="🎯" color="text-emerald-400" theme={theme} />
                <AnalyticsCard label="Topics Learned" value={data.stats.totalQuizzes > 0 ? data.stats.totalQuizzes + 1 : 0} icon="📚" color="text-purple-400" theme={theme} />
              </div>
            </div>

            {/* ABOUT PRODUCT SECTION */}
            <div className={`p-8 sm:p-10 rounded-3xl border ${theme === "dark" ? "bg-gradient-to-r from-zinc-900/50 via-[#11111a] to-zinc-900/50 border-zinc-800/80" : "bg-gray-100/70 border-gray-200"
              }`}>
              <div className="max-w-3xl space-y-4">
                <h3 className="text-2xl font-black tracking-tight">Why QUIZ.AI?</h3>
                <p className={`text-sm sm:text-base leading-relaxed ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                  QUIZ.AI is an intelligent learning platform that helps students practice, revise, and improve their knowledge through AI-generated quizzes. Users can create quizzes from any topic or upload PDFs to generate questions from study materials. The platform provides detailed explanations, tracks progress, and stores quiz history for future revision.
                </p>
              </div>
            </div>

            {/* CAPABILITY SECTIONS */}
            <div className="space-y-6">
              <h4 className={`text-lg font-bold tracking-tight ${theme === "dark" ? "text-zinc-400" : "text-gray-500"}`}>Core Engine Capabilities</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureMetricCard title="Smart Quiz Generation" desc="Generate topic-based structural components instantly using specific rules." theme={theme} />
                <FeatureMetricCard title="PDF Question Generator" desc="Create contextually accurate tracking directly from files." theme={theme} />
                <FeatureMetricCard title="AI Explanations" desc="Get robust detailed analysis insights for failed evaluation questions." theme={theme} />
                <FeatureMetricCard title="Quiz History Logs" desc="Review historical application scores and trace personal mastery milestones." theme={theme} />
              </div>
            </div>

          </div>
        )}

        {/* CONDITIONALLY RENDERED SUB-SECTIONS */}
        {currentTab === "quizzes" && (
          <MyQuizzesSection history={data.history} onUpdate={fetchDashboardData} />
        )}

        {currentTab === "profile" && (
          <ProfileSection user={authUser} stats={data.stats} history={data.history} />
        )}

        {/* STANDARD TOPIC-BASED QUIZ ROUTE */}
        {currentTab === "create" && (
          <>
            {!activeQuiz ? (
              <QuizForm onQuizGenerated={(quiz) => setActiveQuiz(quiz)} />
            ) : (
              <QuizPlayer
                questions={activeQuiz.questions}
                topic={activeQuiz.topic}
                difficulty={activeQuiz.difficulty}
                onBack={() => {
                  setActiveQuiz(null);
                  setCurrentTab("dashboard");
                  fetchDashboardData();
                }}
              />
            )}
          </>
        )}

        {/* STANDALONE PDF GENERATION WORKSPACE TAB CONTAINER */}
        {currentTab === "pdf-create" && (
          <>
            {!activeQuiz ? (
              <PdfQuizForm onQuizGenerated={(quiz) => setActiveQuiz(quiz)} />
            ) : (
              <QuizPlayer
                questions={activeQuiz.questions}
                topic={activeQuiz.topic}
                difficulty={activeQuiz.difficulty}
                onBack={() => {
                  setActiveQuiz(null);
                  setCurrentTab("dashboard");
                  fetchDashboardData();
                }}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

/* INTERNAL SUB-COMPONENTS */
const AnalyticsCard = ({ label, value, icon, color, theme }) => (
  <div className={`p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${theme === "dark" ? "bg-[#11111a] border-zinc-800/80 shadow-black/40" : "bg-white border-gray-200 shadow-sm"
    }`}>
    <div className="flex justify-between items-center mb-3">
      <span className={`text-xs uppercase tracking-wider font-extrabold ${theme === "dark" ? "text-zinc-500" : "text-gray-400"}`}>{label}</span>
      <span className="text-xl">{icon}</span>
    </div>
    <span className={`text-2xl sm:text-3xl font-black ${theme === "dark" ? color : color.replace("400", "600")}`}>{value}</span>
  </div>
);

const FeatureMetricCard = ({ title, desc, theme }) => (
  <div className={`p-5 rounded-2xl border transition-colors ${theme === "dark" ? "bg-zinc-900/30 border-zinc-800/60 hover:bg-zinc-900/60" : "bg-white border-gray-200 shadow-sm hover:bg-gray-50"
    }`}>
    <h5 className="font-bold text-sm mb-1.5">{title}</h5>
    <p className={`text-xs leading-relaxed ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>{desc}</p>
  </div>
);

const ProfileSection = ({ user, stats, history }) => {
  const { theme } = useTheme();
  // Metric Calculations
  const totalGenerated = stats?.totalQuizzes || history?.length || 0;
  const totalAttempted = stats?.totalAttempts || history?.length || 0;
  const avgScore = stats?.avgScore || 0;

  const bestScore = history?.length > 0
    ? Math.max(...history.map(q => Math.round((q.score / (q.totalQuestions || 1)) * 100)))
    : 0;

  const lastActiveDate = history?.length > 0 && history[0].createdAt
    ? new Date(history[0].createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : "Active Today";

  const role = user?.role || "Student"; // Fallback if backend doesn't provide role

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-500">

      {/* HEADER META INTRO */}
      <div className={`pb-4 border-b ${theme === "dark" ? "border-zinc-800/60" : "border-gray-200"}`}>
        <h2 className={`text-3xl font-black tracking-tight ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>My Profile</h2>
        <p className={`${theme === "dark" ? "text-zinc-500" : "text-gray-500"} text-sm mt-1`}>View your identity details and learning intelligence metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: IDENTITY MANAGEMENT SHEET (Basic User Info) */}
        <div className={`lg:col-span-4 rounded-3xl p-8 backdrop-blur-xl flex flex-col items-center text-center shadow-xl space-y-4 border ${
          theme === "dark" ? "bg-[#11111a]/60 border-zinc-800/80" : "bg-white border-gray-200"
        }`}>
          <div className="relative">
            <div className={`h-28 w-28 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-indigo-600/20 border-4 ${
              theme === "dark" ? "border-[#0a0a0f]" : "border-white"
            }`}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "👤"}
            </div>
            <span className={`absolute bottom-0 right-0 h-6 w-6 bg-emerald-500 border-4 rounded-full ${
              theme === "dark" ? "border-[#0a0a0f]" : "border-white"
            }`}></span>
          </div>

          <div className="space-y-1">
            <h3 className={`text-2xl font-black tracking-tight ${theme === "dark" ? "text-zinc-100" : "text-gray-900"}`}>{user?.name || "Guest User"}</h3>
            <p className={`font-medium text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>{user?.email || "guest@quiz.ai"}</p>
          </div>

          <div className="pt-2">
            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-block">
              {role}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: LEARNING / ACTIVITY STATS */}
        <div className={`lg:col-span-8 rounded-3xl p-8 backdrop-blur-xl shadow-xl flex flex-col justify-center border ${
          theme === "dark" ? "bg-[#11111a]/60 border-zinc-800/80" : "bg-white border-gray-200"
        }`}>
          <h4 className={`text-xs font-black uppercase tracking-widest border-l-2 border-purple-500 pl-3 mb-6 ${
            theme === "dark" ? "text-zinc-400" : "text-gray-700"
          }`}>Learning & Activity Stats</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Stat: Total Generated */}
            <div className={`p-5 rounded-2xl flex items-center justify-between group transition-colors border ${
              theme === "dark" ? "bg-[#0a0a0f]/80 border-zinc-800/60 hover:border-indigo-500/30" : "bg-gray-50 border-gray-200 hover:border-indigo-500/30 shadow-inner"
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-black tracking-widest block mb-1 ${
                  theme === "dark" ? "text-zinc-500" : "text-gray-500"
                }`}>Total Quizzes Generated</span>
                <span className={`text-2xl font-black ${
                  theme === "dark" ? "text-zinc-200" : "text-gray-900"
                }`}>{totalGenerated}</span>
              </div>
              <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 text-xl">
                🧠
              </div>
            </div>

            {/* Stat: Total Attempted */}
            <div className={`p-5 rounded-2xl flex items-center justify-between group transition-colors border ${
              theme === "dark" ? "bg-[#0a0a0f]/80 border-zinc-800/60 hover:border-blue-500/30" : "bg-gray-50 border-gray-200 hover:border-blue-500/30 shadow-inner"
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-black tracking-widest block mb-1 ${
                  theme === "dark" ? "text-zinc-500" : "text-gray-500"
                }`}>Total Quizzes Attempted</span>
                <span className={`text-2xl font-black ${
                  theme === "dark" ? "text-zinc-200" : "text-gray-900"
                }`}>{totalAttempted}</span>
              </div>
              <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 text-xl">
                📝
              </div>
            </div>

            {/* Stat: Average Score */}
            <div className={`p-5 rounded-2xl flex items-center justify-between group transition-colors border ${
              theme === "dark" ? "bg-[#0a0a0f]/80 border-zinc-800/60 hover:border-purple-500/30" : "bg-gray-50 border-gray-200 hover:border-purple-500/30 shadow-inner"
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-black tracking-widest block mb-1 ${
                  theme === "dark" ? "text-zinc-500" : "text-gray-500"
                }`}>Average Score</span>
                <span className={`text-2xl font-black ${
                  theme === "dark" ? "text-zinc-200" : "text-gray-900"
                }`}>{avgScore}%</span>
              </div>
              <div className="h-10 w-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 text-xl">
                📊
              </div>
            </div>

            {/* Stat: Best Score */}
            <div className={`p-5 rounded-2xl flex items-center justify-between group transition-colors border ${
              theme === "dark" ? "bg-[#0a0a0f]/80 border-zinc-800/60 hover:border-emerald-500/30" : "bg-gray-50 border-gray-200 hover:border-emerald-500/30 shadow-inner"
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-black tracking-widest block mb-1 ${
                  theme === "dark" ? "text-zinc-500" : "text-gray-500"
                }`}>Best Score</span>
                <span className={`text-2xl font-black ${
                  theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                }`}>{bestScore}%</span>
              </div>
              <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 text-xl">
                🏆
              </div>
            </div>

            {/* Stat: Last Active Date (Full Width) */}
            <div className={`sm:col-span-2 p-5 rounded-2xl flex items-center justify-between group transition-colors border ${
              theme === "dark" ? "bg-[#0a0a0f]/80 border-zinc-800/60 hover:border-amber-500/30" : "bg-gray-50 border-gray-200 hover:border-amber-500/30 shadow-inner"
            }`}>
              <div>
                <span className={`text-[10px] uppercase font-black tracking-widest block mb-1 ${
                  theme === "dark" ? "text-zinc-500" : "text-gray-500"
                }`}>Last Active Date</span>
                <span className={`text-lg font-bold ${
                  theme === "dark" ? "text-zinc-300" : "text-gray-800"
                }`}>{lastActiveDate}</span>
              </div>
              <div className="h-10 w-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400 text-xl">
                📅
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDashboard;