import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(formData);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f14] p-6 font-sans">
      <div className="w-full max-w-md bg-[#18181f] p-12 rounded-[3rem] border border-zinc-800 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-black text-indigo-400 italic tracking-tighter">QUIZ.AI</Link>
          <h2 className="text-2xl font-bold text-zinc-100 mt-6 tracking-tight">Create Account</h2>
          <p className="text-zinc-500 font-medium text-sm mt-1">Start your AI learning journey today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
            <input
              type="text" required value={formData.name}
              className="w-full p-4 bg-[#1e1e28] border border-zinc-800 rounded-2xl focus:border-indigo-500 transition-all outline-none font-medium text-zinc-100 placeholder-zinc-500"
              placeholder="John Doe"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email" required value={formData.email}
              className="w-full p-4 bg-[#1e1e28] border border-zinc-800 rounded-2xl focus:border-indigo-500 transition-all outline-none font-medium text-zinc-100 placeholder-zinc-500"
              placeholder="john@example.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password" required value={formData.password}
              className="w-full p-4 bg-[#1e1e28] border border-zinc-800 rounded-2xl focus:border-indigo-500 transition-all outline-none font-medium text-zinc-100 placeholder-zinc-500"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl  hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? "CREATING ACCOUNT..." : "JOIN QUIZ.AI"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500 font-medium">
          Already a member?{" "}
          <Link to="/login" className="text-indigo-400 font-bold hover:underline">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;