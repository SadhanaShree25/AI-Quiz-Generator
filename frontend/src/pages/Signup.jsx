import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try a different email configuration key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Ambient background blur elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#11111a]/60 p-8 sm:p-12 rounded-3xl border border-zinc-800/80 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-500 relative z-10">
        
        {/* LOGO & AUTH TITLE HEAD */}
        <div className="text-center mb-10">
          <Link to="/" className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            QUIZ.AI
          </Link>
          <h2 className="text-2xl font-black text-zinc-100 mt-6 tracking-tight">Create Account</h2>
          <p className="text-zinc-500 font-medium text-xs mt-1">Initialize your system access key array pipeline module.</p>
        </div>

        {/* EXCEPTION DOCK DRAWER ERROR HANDLER */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/5 text-rose-400 rounded-2xl text-xs font-bold border border-rose-500/20 animate-in shake duration-300">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Identity Tag (Name)</label>
            <input
              type="text" 
              required 
              value={formData.name}
              className="w-full p-4 bg-[#0a0a0f]/80 border border-zinc-800 rounded-xl focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all font-medium text-sm text-zinc-100 placeholder-zinc-600 shadow-inner"
              placeholder="John Doe"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Email Core Mapping</label>
            <input
              type="email" 
              required 
              value={formData.email}
              className="w-full p-4 bg-[#0a0a0f]/80 border border-zinc-800 rounded-xl focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all font-medium text-sm text-zinc-100 placeholder-zinc-600 shadow-inner"
              placeholder="john@example.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Password Layer Setup</label>
            <input
              type="password" 
              required 
              value={formData.password}
              className="w-full p-4 bg-[#0a0a0f]/80 border border-zinc-800 rounded-xl focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-all font-medium text-sm text-zinc-100 placeholder-zinc-600 shadow-inner"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-xl font-black text-xs tracking-widest uppercase shadow-xl shadow-indigo-600/10 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Deploying User Space Data..." : "Create Free Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-zinc-500 font-medium">
          Already structural user?{" "}
          <Link to="/login" className="text-indigo-400 font-bold hover:underline ml-0.5">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;