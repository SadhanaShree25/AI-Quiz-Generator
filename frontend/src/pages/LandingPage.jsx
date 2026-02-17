import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f14] text-zinc-100 font-sans">
      <nav className="flex justify-between items-center px-10 py-6 bg-[#0f0f14]/95 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
        <div className="text-2xl font-black italic tracking-tighter text-indigo-400">QUIZ.AI</div>
        <div className="hidden md:flex gap-8 font-bold text-zinc-500 text-sm uppercase tracking-widest">
          <a href="#features" className="hover:text-indigo-400 transition">Features</a>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-6 py-2 font-bold text-zinc-400 hover:text-indigo-400 transition">Login</Link>
          <Link to="/signup" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition active:scale-95">Sign Up</Link>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-10 py-24 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[1.1] text-zinc-100">
            Learn Smarter, <br />
            <span className="text-indigo-400">Quiz Smarter.</span>
          </h1>
          <p className="text-xl text-zinc-500 font-medium max-w-xl leading-relaxed">
            Generate custom AI quizzes on any topic. Track your progress and master what you learn.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Link to="/signup" className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-500 transition active:scale-95">GET STARTED FREE</Link>
            <Link to="/login" className="px-10 py-5 bg-[#18181f] border border-zinc-800 text-zinc-200 rounded-2xl font-black text-lg hover:border-indigo-500/50 transition">LOG IN</Link>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] h-[450px] w-full flex items-center justify-center text-[10rem] border border-indigo-500/20">
            🤖
          </div>
          <div className="absolute -bottom-6 -left-6 bg-[#18181f] p-6 rounded-2xl border border-zinc-800">
            <span className="text-2xl font-black text-indigo-400">AI-Powered 🎯</span>
          </div>
        </div>
      </header>

      <section id="features" className="py-24 px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl font-black mb-16 text-zinc-100">Why <span className="text-indigo-400">AI Quiz Generator</span>?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon="🤖" title="AI Generation" desc="Create quizzes on any topic instantly with AI." />
            <FeatureCard icon="📊" title="Progress Tracking" desc="Track scores and performance over time." />
            <FeatureCard icon="🏆" title="Leaderboard" desc="Compete and see how you rank." />
            <FeatureCard icon="🎨" title="Custom Quizzes" desc="Choose difficulty and number of questions." />
          </div>
        </div>
      </section>

      <footer className="bg-[#18181f] border-t border-zinc-800 text-zinc-400 py-16 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-3xl font-black italic text-indigo-400">QUIZ.AI</div>
          <div className="text-zinc-600 text-sm">© 2026 AI Quiz Generator. Built with AI.</div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-[2.5rem] bg-[#18181f] border border-zinc-800 hover:border-indigo-500/30 transition-all group">
    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-zinc-100">{title}</h3>
    <p className="text-zinc-500 text-sm font-medium leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;