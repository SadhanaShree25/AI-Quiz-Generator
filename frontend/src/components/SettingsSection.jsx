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
      
      <div className="flex items-center gap-6 mb-4">
        <div className="bg-indigo-600 p-3 rounded-2xl">
          <Shield className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-zinc-100 tracking-tight">Settings</h2>
          <p className="text-zinc-500 font-medium">Manage your account and data preferences</p>
        </div>
      </div>

      <div className="bg-[#18181f] p-10 rounded-[2.5rem] border border-zinc-800">
        <div className="flex items-center gap-2 mb-8">
          <User size={20} className="text-indigo-400" />
          <h3 className="text-xl font-bold text-zinc-100">Personal Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-1">
              <User size={12} /> Full Name
            </label>
            <div className="w-full p-4 bg-[#1e1e28] border border-zinc-800 rounded-2xl text-zinc-200 font-bold">
              {user?.name || "User"}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-1">
              <Mail size={12} /> Email Address
            </label>
            <div className="w-full p-4 bg-[#1e1e28] border border-zinc-800 rounded-2xl text-zinc-200 font-bold">
              {user?.email || "email@example.com"}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 flex items-center gap-3 text-zinc-500">
          <Lock size={16} />
          <p className="text-xs font-medium italic">Account details are read-only.</p>
        </div>
      </div>

      <div className="bg-rose-500/10 p-10 rounded-[2.5rem] border border-rose-500/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <Trash2 size={120} className="text-rose-400" />
        </div>

        <div className="relative z-10">
          <h3 className="text-xl font-bold text-rose-400 mb-2 flex items-center gap-2">
            <Trash2 size={20} /> Danger Zone
          </h3>
          <p className="text-rose-400/70 text-sm font-medium mb-8 max-w-md">
            The following actions are destructive and cannot be reversed.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-[#1e1e28] rounded-3xl border border-zinc-800 hover:border-rose-500/30 transition-colors">
            <div>
              <p className="font-bold text-zinc-200">Clear Quiz History</p>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">
                Removes all quiz records and activity data.
              </p>
            </div>
            <button 
              onClick={handleClearHistory}
              className="w-full md:w-auto px-8 py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Clear All Records
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">
        AI Quiz Generator • Version 1.0
      </div>
    </div>
  );
};

export default SettingsSection;