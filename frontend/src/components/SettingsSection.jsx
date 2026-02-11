import React from 'react';
import api from '../services/api';
import { User, Shield, Trash2, Mail, Lock } from 'lucide-react';

const SettingsSection = ({ user, onUpdate }) => {
  
  const handleClearHistory = async () => {
    if (window.confirm("⚠️ DANGER: This will permanently delete all your quiz records. This action cannot be undone. Proceed?")) {
      try {
        await api.delete("/quiz/history/all");
        alert("All history has been wiped.");
        if (onUpdate) onUpdate(); // Refresh the dashboard data
      } catch (err) {
        console.error("Failed to clear history:", err);
        alert("Error clearing history. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500 pb-20">
      
      {/* 👤 Profile Header */}
      <div className="flex items-center gap-6 mb-4">
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
          <Shield className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Settings</h2>
          <p className="text-slate-400 font-medium">Manage your account and data preferences</p>
        </div>
      </div>

      {/* 📝 Account Information Card */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-8">
          <User size={20} className="text-indigo-600" />
          <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1">
              <User size={12} /> Full Name
            </label>
            <div className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-700 font-bold">
              {user?.name || "User"}
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1">
              <Mail size={12} /> Email Address
            </label>
            <div className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl text-slate-700 font-bold">
              {user?.email || "email@example.com"}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-3 text-slate-400">
          <Lock size={16} />
          <p className="text-xs font-medium italic">Account details are currently read-only. Contact support to change your email.</p>
        </div>
      </div>

      {/* 🧨 Danger Zone Card */}
      <div className="bg-rose-50/50 p-10 rounded-[2.5rem] border border-rose-100 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Trash2 size={120} className="text-rose-900" />
        </div>

        <div className="relative z-10">
          <h3 className="text-xl font-bold text-rose-800 mb-2 flex items-center gap-2">
            <Trash2 size={20} /> Danger Zone
          </h3>
          <p className="text-rose-600/70 text-sm font-medium mb-8 max-w-md">
            The following actions are destructive and cannot be reversed. Please be absolutely certain before clicking.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white rounded-3xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="font-bold text-slate-800">Wipe Quiz History</p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                Removes all scores, charts, and activity data.
              </p>
            </div>
            <button 
              onClick={handleClearHistory}
              className="w-full md:w-auto px-8 py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Clear All Records
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-slate-300 text-[10px] font-bold uppercase tracking-[0.3em]">
        Quiz AI • Version 1.0.0 Stable
      </div>
    </div>
  );
};

export default SettingsSection;