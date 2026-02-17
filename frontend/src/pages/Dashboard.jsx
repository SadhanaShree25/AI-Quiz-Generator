import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import SettingsSection from "../components/SettingsSection";
import MyQuizzesSection from "../components/MyQuizzesSection";
import QuizForm from "../pages/QuizForm";
import QuizPlayer from "../components/QuizPlayer";
import { useTheme } from "../context/ThemeContext";

const AdvancedDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [activeQuiz, setActiveQuiz] = useState(null);

  const [data, setData] = useState({
    user: null,
    stats: { totalQuizzes: 0, totalAttempts: 0, lastTopic: "None" },
    history: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [userRes, statsRes, historyRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/quiz/stats"),
        api.get("/quiz/history"),
      ]);

      setData({
        user: userRes.data,
        stats: statsRes.data,
        history: historyRes.data,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className={`flex h-screen items-center justify-center ${theme === 'dark' ? 'bg-[#0f0f14]' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-indigo-400 font-bold uppercase tracking-widest">
            Loading AI Workspace...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-[#0f0f14]' : 'bg-gray-50'}`}>
      {/* SIDEBAR */}
      <aside className={`w-72 ${theme === 'dark' ? 'bg-[#18181f] border-zinc-800' : 'bg-white border-gray-200'} border-r flex flex-col fixed h-full`}>
        <div className={`p-8 text-3xl font-black italic tracking-tighter ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
          QUIZ.AI
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem
            active={currentTab === "dashboard"}
            label="Dashboard"
            icon="🏠"
            onClick={() => setCurrentTab("dashboard")}
            theme={theme}
          />
          <SidebarItem
            active={currentTab === "quizzes"}
            label="My Quizzes"
            icon="📝"
            onClick={() => setCurrentTab("quizzes")}
            theme={theme}
          />
          <SidebarItem
            active={currentTab === "profile"}
            label="Profile"
            icon="👤"
            onClick={() => setCurrentTab("profile")}
            theme={theme}
          />
          <SidebarItem
            active={currentTab === "settings"}
            label="Settings"
            icon="⚙️"
            onClick={() => setCurrentTab("settings")}
            theme={theme}
          />
        </nav>

        <div className="p-6">
          <button
            onClick={handleLogout}
            className={`w-full py-3 rounded-2xl font-bold transition-all ${
              theme === 'dark'
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white'
                : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
            }`}
          >
            Logout 🚪
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 ml-72">
        <header className={`${theme === 'dark' ? 'bg-[#18181f] border-zinc-800' : 'bg-white border-gray-200'} h-20 px-10 flex justify-between items-center border-b`}>
          <h2 className={`text-xl font-bold capitalize ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
            {currentTab}
          </h2>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition ${
                theme === 'dark' 
                  ? 'border-zinc-700 text-zinc-300 hover:border-indigo-500 hover:text-indigo-400 bg-zinc-800/50' 
                  : 'border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600 bg-gray-100'
              }`}
            >
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>

            <div
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => setCurrentTab("profile")}
            >
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'} group-hover:text-indigo-500 transition`}>
                  {data.user?.name}
                </p>
                <p className={`text-[10px] uppercase font-black ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
                  {data.stats?.totalQuizzes || 0} Quizzes
                </p>
              </div>

              <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                {data.user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {currentTab === "dashboard" && (
            <OverviewSection
              stats={data.stats}
              history={data.history}
              onStart={() => setCurrentTab("create")}
              theme={theme}
            />
          )}

          {currentTab === "quizzes" && (
            <MyQuizzesSection
              history={data.history}
              onUpdate={fetchDashboardData}
            />
          )}

          {currentTab === "profile" && (
            <ProfileSection
              user={data.user}
              stats={data.stats}
              history={data.history}
              theme={theme}
            />
          )}

          {currentTab === "settings" && (
            <SettingsSection
              user={data.user}
              onUpdate={fetchDashboardData}
            />
          )}

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
        </div>
      </main>
    </div>
  );
};

const OverviewSection = ({ stats, history, onStart, theme = 'dark' }) => (
  <div className="space-y-8">
    {/* Welcome Heading */}
    <div className="space-y-3">
      <h1 className={`text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight`}>
        Welcome to AI Quiz Generator
      </h1>
      <p className={`text-lg max-w-2xl leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>
        Create intelligent, personalized quizzes on any topic using advanced AI. 
        Track your progress, review your answers, and master new subjects effortlessly.
      </p>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <StatCard
        label="Total Quizzes"
        value={stats.totalQuizzes || 0}
        icon="📝"
        description="Quizzes completed"
        theme={theme}
      />
      <StatCard
        label="Total Attempts"
        value={stats.totalAttempts || 0}
        icon="🎯"
        description="Times practiced"
        theme={theme}
      />
      <StatCard
        label="Last Topic"
        value={stats.lastTopic || "None"}
        icon="🤖"
        description="Recent subject"
        theme={theme}
      />
    </div>

    {/* Generate Section */}
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-10 rounded-2xl text-white flex flex-col justify-between min-h-[280px] shadow-xl border border-indigo-500/20">
      <div>
        <h3 className="text-3xl font-black mb-3">
          Start Generating Smart Quizzes
        </h3>
        <p className="text-indigo-100 text-base leading-relaxed">
          Generate topic-based quizzes powered by AI in seconds. Choose any subject, 
          set difficulty level, and get instant questions with explanations.
        </p>
      </div>

      <button
        onClick={onStart}
        className="mt-8 bg-white text-indigo-600 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition shadow-lg hover:shadow-xl"
      >
        GENERATE QUIZ 🚀
      </button>
    </div>

    {/* Recent Quizzes */}
    <div className={`${theme === 'dark' ? 'bg-[#18181f] border-zinc-800' : 'bg-white border-gray-200'} p-8 rounded-2xl border shadow-sm`}>
      <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
        Recent Quizzes
      </h3>

      <div className="space-y-3">
        {history.length > 0 ? (
          history.slice(0, 4).map((q, i) => (
            <div
              key={i}
              className={`flex justify-between items-center p-4 ${theme === 'dark' ? 'bg-[#1e1e28]' : 'bg-gray-50'} rounded-xl border ${theme === 'dark' ? 'border-zinc-800' : 'border-gray-200'} hover:border-indigo-500/30 transition-colors`}
            >
              <div>
                <p className={`font-bold text-sm ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
                  {q.topic}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
                  {new Date(q.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-lg text-sm font-bold">
                {q.totalQuestions
                  ? Math.round((q.score / q.totalQuestions) * 100)
                  : 0}
                %
              </span>
            </div>
          ))
        ) : (
          <p className={`italic text-center py-6 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
            No quizzes yet. Generate your first AI quiz!
          </p>
        )}
      </div>
    </div>
  </div>
);

const SidebarItem = ({ active, label, icon, onClick, theme = 'dark' }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-xl font-bold transition ${
      active
        ? "bg-indigo-600 text-white shadow-lg"
        : theme === 'dark'
        ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    <span>{icon}</span> {label}
  </button>
);

const StatCard = ({ label, value, icon, description, theme = 'dark' }) => (
  <div className={`${theme === 'dark' ? 'bg-[#18181f] border-zinc-800' : 'bg-white border-gray-200'} p-6 rounded-2xl border hover:border-indigo-500/30 transition-all group shadow-sm`}>
    <div className="flex items-start justify-between mb-4">
      <div className="text-3xl">{icon}</div>
      <div className="h-2 w-2 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    <p className={`text-xs uppercase font-bold tracking-widest mb-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
      {label}
    </p>
    <p className={`text-3xl font-black mb-1 ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
      {value}
    </p>
    {description && (
      <p className={`text-xs ${theme === 'dark' ? 'text-zinc-600' : 'text-gray-500'}`}>
        {description}
      </p>
    )}
  </div>
);

const ProfileSection = ({ user, stats, history, theme = 'dark' }) => {
  const lastQuiz = history[0];
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-3">
        <h1 className={`text-4xl font-black tracking-tight ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
          Your Profile
        </h1>
        <p className={theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}>
          View your account information and quiz activity history.
        </p>
      </div>

      <div className={`${theme === 'dark' ? 'bg-[#18181f] border-zinc-800' : 'bg-white border-gray-200'} p-10 rounded-3xl border shadow-sm`}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="h-32 w-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-5xl text-white font-black shadow-xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className={`text-4xl font-black tracking-tight mb-2 ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
              {user?.name}
            </h2>
            <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>
              {user?.email}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className={`${theme === 'dark' ? 'bg-[#1e1e28] border-zinc-800' : 'bg-gray-50 border-gray-200'} px-6 py-3 rounded-xl border`}>
                <span className="text-2xl font-black text-indigo-400">{stats.totalQuizzes || 0}</span>
                <span className={`text-sm ml-2 font-bold ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-600'}`}>Total Quizzes</span>
              </div>
              {lastQuiz && (
                <div className={`${theme === 'dark' ? 'bg-[#1e1e28] border-zinc-800' : 'bg-gray-50 border-gray-200'} px-6 py-3 rounded-xl border`}>
                  <span className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>Last Topic:</span>
                  <span className={`block font-bold mt-1 ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>{lastQuiz.topic}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`${theme === 'dark' ? 'bg-[#18181f] border-zinc-800' : 'bg-white border-gray-200'} p-8 rounded-3xl border shadow-sm`}>
        <h3 className={`text-xl font-bold mb-6 ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>
          Recent Quiz Activity
        </h3>
        {history.length === 0 ? (
          <p className={`text-center py-8 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
            You haven't completed any quizzes yet. Generate your first AI quiz from the dashboard!
          </p>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 8).map((q) => (
              <div
                key={q._id}
                className={`flex justify-between items-center p-4 ${theme === 'dark' ? 'bg-[#1e1e28] border-zinc-800' : 'bg-gray-50 border-gray-200'} rounded-xl border hover:border-indigo-500/30 transition-colors`}
              >
                <div>
                  <p className={`font-semibold ${theme === 'dark' ? 'text-zinc-100' : 'text-gray-900'}`}>{q.topic}</p>
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
                    {q.difficulty} • {new Date(q.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-emerald-400 font-bold">
                  {q.totalQuestions
                    ? Math.round((q.score / q.totalQuestions) * 100)
                    : q.score}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedDashboard;
