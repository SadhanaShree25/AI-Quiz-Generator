import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f14] p-6">
      <div className="w-full max-w-md bg-[#18181f] p-10 rounded-[3rem] border border-zinc-800 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-black text-indigo-400 italic tracking-tighter">QUIZ.AI</Link>
          <h2 className="text-2xl font-bold text-zinc-100 mt-6">Welcome Back</h2>
          <p className="text-zinc-500 font-medium text-sm">Enter your details to access your dashboard</p>
        </div>

        {error && <div className="mb-6 p-4 bg-rose-500/10 text-rose-400 rounded-2xl text-sm font-bold border border-rose-500/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              className="w-full p-4 bg-[#1e1e28] border border-zinc-800 rounded-2xl focus:border-indigo-500 transition-all outline-none font-medium text-zinc-100 placeholder-zinc-500"
              placeholder="name@example.com"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              className="w-full p-4 bg-[#1e1e28] border border-zinc-800 rounded-2xl focus:border-indigo-500 transition-all outline-none font-medium text-zinc-100 placeholder-zinc-500"
              placeholder="••••••••"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? "AUTHENTICATING..." : "LOG IN"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500 font-medium">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-400 font-bold hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;