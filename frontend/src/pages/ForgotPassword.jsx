import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally call: api.post("/auth/forgot-password", { email })
    setIsSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 text-center">
        {!isSent ? (
          <>
            <div className="text-4xl mb-6">🔑</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Forgot Password?</h2>
            <p className="text-slate-400 font-medium text-sm mb-8 leading-relaxed">
              No worries! Enter your email below and we'll send you a link to reset it.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="email" required
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-indigo-500 outline-none transition-all font-medium text-center"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all">
                SEND RESET LINK
              </button>
            </form>
          </>
        ) : (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="text-5xl mb-6">📧</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Check your inbox</h2>
            <p className="text-slate-400 font-medium text-sm mb-8">
              We've sent recovery instructions to <br />
              <span className="text-indigo-600 font-bold">{email}</span>
            </p>
            <Link to="/login" className="text-sm font-black text-indigo-600 uppercase tracking-widest hover:underline">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;