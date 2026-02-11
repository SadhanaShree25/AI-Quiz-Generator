import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Component Imports
import SettingsSection from "../components/SettingsSection";
import LeaderboardSection from "../components/LeaderboardSection"; 
import MyQuizzesSection from "../components/MyQuizzesSection";
import QuizForm from "../pages/QuizForm";
import QuizPlayer from "../components/QuizPlayer";

const AdvancedDashboard = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('dashboard'); 
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [data, setData] = useState({ 
    user: null, 
    stats: { totalQuizzes: 0, accuracy: 0, avgScore: 0, streak: 0 }, 
    history: [] 
  });
  const [loading, setLoading] = useState(true);

  // Memoized fetch function to reuse after quiz completion or deletion
  const fetchDashboardData = useCallback(async () => {
    try {
      const [userRes, statsRes, historyRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/quiz/stats"),
        api.get("/quiz/history"),
      ]);
      setData({ user: userRes.data, stats: statsRes.data, history: historyRes.data });
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

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="animate-pulse text-indigo-600 font-bold text-xl uppercase tracking-widest">
          AI Quiz Master Loading...
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#1E1B4B] text-white flex flex-col shadow-2xl fixed h-full">
        <div className="p-8 text-3xl font-black italic tracking-tighter text-indigo-400">QUIZ.AI</div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <SidebarItem active={currentTab === 'dashboard'} label="Dashboard" icon="🏠" onClick={() => setCurrentTab('dashboard')} />
          <SidebarItem active={currentTab === 'quizzes'} label="My Quizzes" icon="🚀" onClick={() => setCurrentTab('quizzes')} />
          <SidebarItem active={currentTab === 'leaderboard'} label="Leaderboard" icon="🥇" onClick={() => setCurrentTab('leaderboard')} />
          <div className="border-t border-slate-700 my-4 pt-4">
              <SidebarItem active={currentTab === 'settings'} label="Settings" icon="⚙️" onClick={() => setCurrentTab('settings')} />
          </div>
        </nav>
        <div className="p-6">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500/10 text-red-500 py-3 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            Logout <span>🚪</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA (Offset by Sidebar width) */}
      <main className="flex-1 ml-72">
        <header className="bg-white h-20 px-10 flex justify-between items-center sticky top-0 z-10 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 capitalize tracking-tight">{currentTab}</h2>
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setCurrentTab('profile')}>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold group-hover:text-indigo-600 transition">{data.user?.name}</p>
              <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase bg-slate-50 px-2 py-0.5 rounded">Elite Learner</p>
            </div>
            <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg group-hover:rotate-3 transition-transform">
              {data.user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {currentTab === 'dashboard' && (
            <OverviewSection stats={data.stats} history={data.history} onStart={() => setCurrentTab('create')} />
          )}

          {currentTab === 'profile' && <ProfileSection user={data.user} stats={data.stats} history={data.history} />}
          {currentTab === 'leaderboard' && <LeaderboardSection />}
          
          {currentTab === 'quizzes' && (
            <MyQuizzesSection history={data.history} onUpdate={fetchDashboardData} />
          )}

          {currentTab === 'settings' && (
            <SettingsSection user={data.user} onUpdate={fetchDashboardData} />
          )}

          {currentTab === 'create' && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              {!activeQuiz ? (
                <QuizForm onQuizGenerated={(quiz) => setActiveQuiz(quiz)} />
              ) : (
                <QuizPlayer 
                  quizData={activeQuiz} 
                  onComplete={() => {
                    setActiveQuiz(null);
                    setCurrentTab('dashboard');
                    fetchDashboardData(); 
                  }} 
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const OverviewSection = ({ stats, history, onStart }) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Quizzes" value={stats.totalQuizzes || 0} icon="📝" />
      <StatCard label="Avg Score" value={(stats.avgScore || 0) + "%"} icon="📊" />
      <StatCard label="Accuracy" value={(stats.accuracy || 0) + "%"} icon="🎯" />
      <StatCard label="Streak" value={(stats.streak || 0) + " Days 🔥"} icon="⚡" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white flex flex-col justify-between shadow-2xl min-h-[320px]">
        <div>
            <h3 className="text-3xl font-black mb-2 italic tracking-tight">Ready for a challenge?</h3>
            <p className="text-indigo-100 text-sm">AI Recommendation: <span className="underline decoration-white/40 font-bold">{stats.recommendedTopic || "General Knowledge"}</span></p>
        </div>
        <button onClick={onStart} className="mt-8 bg-white text-indigo-600 py-5 rounded-2xl font-black text-xl hover:shadow-xl transition-all active:scale-95">
          GENERATE QUIZ 🚀
        </button>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold mb-6 text-slate-800">Recent Activity</h3>
        <div className="space-y-4">
          {history.length > 0 ? history.slice(0, 4).map((q, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
              <div>
                <p className="font-bold text-slate-800 text-sm">{q.topic}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{new Date(q.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg font-black text-sm">{q.score}%</span>
            </div>
          )) : <p className="text-slate-400 italic text-center py-10">Start a quiz to see your activity!</p>}
        </div>
      </div>
    </div>
  </div>
);

const ProfileSection = ({ user, stats, history }) => (
  <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
        <div className="h-40 w-40 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-6xl text-white font-black shadow-xl">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-5xl font-black text-slate-800 tracking-tight">{user?.name}</h2>
          <p className="text-slate-400 text-lg font-medium italic">{user?.email}</p>
        </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm min-h-[400px]">
          <h3 className="text-xl font-bold mb-8 text-slate-800">Performance Trend</h3>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...history].reverse()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="createdAt" hide />
                <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94A3B8'}} />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={5} dot={{ r: 6, fill: '#4F46E5', strokeWidth: 3, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
       </div>
       <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold mb-8 text-slate-800">Learning Progress</h3>
          <SkillBar title="Quiz Novice" icon="🧠" progress={Math.min(100, (stats.totalQuizzes / 5) * 100)} target="5 Quizzes" />
          <SkillBar title="Accuracy Ace" icon="🎯" progress={stats.accuracy || 0} target="90%+ Accuracy" />
          <SkillBar title="Speedster" icon="⚡" progress={45} target="Top 10% Speed" />
       </div>
    </div>
  </div>
);

// --- HELPER COMPONENTS ---
const SidebarItem = ({ active, label, icon, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40 translate-x-1' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
    <span className="text-xl">{icon}</span> {label}
  </button>
);

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-indigo-100 transition-colors">
    <div className="text-2xl mb-4 bg-slate-50 w-12 h-12 flex items-center justify-center rounded-xl shadow-inner group-hover:scale-110 transition-transform">{icon}</div>
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-slate-800 tracking-tighter">{value}</p>
  </div>
);

const SkillBar = ({ title, icon, progress, target }) => (
  <div className="mb-8 last:mb-0">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2 font-bold text-slate-700 text-sm"><span>{icon}</span> {title}</div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{target}</span>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

export default AdvancedDashboard;