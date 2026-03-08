import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f14] text-zinc-100 font-sans">
      <nav className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4 sm:py-6 bg-[#0f0f14]/95 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
        <div className="text-2xl font-black italic tracking-tighter text-indigo-400">QUIZ.AI</div>
        <div className="hidden md:flex gap-8 font-bold text-zinc-500 text-sm uppercase tracking-widest">
          <a href="#features" className="hover:text-indigo-400 transition">Features</a>
        </div>
        <div className="flex gap-2 sm:gap-4 items-center">
          <Link to="/login" className="px-3 sm:px-6 py-2 font-bold text-zinc-400 hover:text-indigo-400 transition text-sm sm:text-base">Login</Link>
          <Link to="/signup" className="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition active:scale-95 text-sm sm:text-base">Sign Up</Link>
        </div>
      </nav>

      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24 flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div className="flex-1 space-y-6 sm:space-y-8 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-zinc-100">
            Learn Smarter, <br />
            <span className="text-indigo-400">Quiz Smarter.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-500 font-medium max-w-xl mx-auto md:mx-0 leading-relaxed">
            Generate custom AI quizzes on any topic. Track your progress and master what you learn.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center md:justify-start w-full sm:w-auto px-4 sm:px-0">
            <Link to="/signup" className="w-full sm:w-auto text-center px-6 sm:px-8 lg:px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-base sm:text-lg hover:bg-indigo-500 transition active:scale-95">GET STARTED FREE</Link>
            <Link to="/login" className="w-full sm:w-auto text-center px-6 sm:px-8 lg:px-10 py-4 bg-[#18181f] border border-zinc-800 text-zinc-200 rounded-2xl font-black text-base sm:text-lg hover:border-indigo-500/50 transition">LOG IN</Link>
          </div>
        </div>
        <div className="flex-1 relative mt-12 sm:mt-10 md:mt-0 w-full max-w-[280px] sm:max-w-md md:max-w-none mx-auto">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] sm:rounded-[2.5rem] h-[260px] sm:h-[320px] md:h-[420px] w-full flex items-center justify-center text-[6rem] sm:text-[7rem] md:text-[9rem] border border-indigo-500/20 shadow-2xl">
            🤖
          </div>
          <div className="absolute -bottom-5 sm:-bottom-6 -right-4 sm:-left-6 sm:right-auto bg-[#18181f] px-5 py-3 sm:p-6 rounded-2xl border border-zinc-800 shadow-xl">
            <span className="text-lg sm:text-2xl font-black text-indigo-400">AI-Powered 🎯</span>
          </div>
        </div>
      </header>

      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10">
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

      <footer className="bg-[#18181f] border-t border-zinc-800 text-zinc-400 py-10 sm:py-16 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-3xl font-black italic text-indigo-400">QUIZ.AI</div>
          <div className="text-zinc-600 text-sm">© 2026 AI Quiz Generator. Built with CODE </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-[#18181f] border border-zinc-800 hover:border-indigo-500/30 transition-all group">
    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-zinc-100">{title}</h3>
    <p className="text-zinc-500 text-sm font-medium leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;