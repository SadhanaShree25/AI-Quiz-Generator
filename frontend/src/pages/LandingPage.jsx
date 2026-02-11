import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {/* HEADER / NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-6 bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="text-2xl font-black italic tracking-tighter text-indigo-600">QUIZ.AI</div>
        <div className="hidden md:flex gap-8 font-bold text-slate-500 text-sm uppercase tracking-widest">
          <a href="#features" className="hover:text-indigo-600 transition">Features</a>
          <a href="#how" className="hover:text-indigo-600 transition">How It Works</a>
          <Link to="/leaderboard" className="hover:text-indigo-600 transition">Leaderboard</Link>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2 font-bold text-slate-600 hover:text-indigo-600 transition">Login</Link>
          <Link to="/signup" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition active:scale-95">Sign Up</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="max-w-7xl mx-auto px-10 py-24 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[1.1] text-slate-900">
            Learn Smarter, <br />
            <span className="text-indigo-600">Play Harder.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-xl leading-relaxed">
            Generate custom AI quizzes instantly on any topic. Track your progress, earn badges, and dominate the leaderboard.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link to="/signup" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 hover:scale-105 transition active:scale-95">GET STARTED FREE</Link>
            <Link to="/login" className="px-10 py-5 bg-white border-2 border-slate-100 rounded-2xl font-black text-lg hover:bg-slate-50 transition">LOGIN TO CONTINUE</Link>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] h-[450px] w-full flex items-center justify-center text-[10rem] shadow-2xl rotate-3">
            🤖
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl animate-bounce">
            <span className="text-2xl font-black text-indigo-600">98% Accuracy! 🎯</span>
          </div>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 bg-white px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl font-black mb-16">Why Choose <span className="text-indigo-600">QUIZ.AI</span>?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon="🤖" title="AI Generation" desc="Create quizzes on any topic instantly using GPT-powered logic." />
            <FeatureCard icon="📊" title="Tracking" desc="Visualise your growth with interactive performance charts." />
            <FeatureCard icon="🏆" title="Leaderboard" desc="Compete with friends and learners globally in real-time." />
            <FeatureCard icon="🎨" title="Custom Focus" desc="Tailor difficulty and length to match your learning speed." />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-16 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-3xl font-black italic">QUIZ.AI</div>
          <div className="flex gap-8 text-slate-400 font-bold">
            <Link to="/about" className="hover:text-white transition">About</Link>
            <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms</Link>
          </div>
          <div className="text-slate-500 text-sm">© 2026 QUIZ.AI. Built with 🧠 and AI.</div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all group">
    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;