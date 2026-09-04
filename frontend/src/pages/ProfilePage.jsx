import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Phone, Building } from 'lucide-react';

export const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-['Outfit']">User Profile & Account</h1>
        <p className="text-xs text-slate-400 mt-1">Your registered CivicPulse account details</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-cyan-950 font-['Outfit']">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 mt-1">
              <Shield className="w-3.5 h-3.5" /> {user.role}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono flex items-center gap-1">
              <Mail className="w-3 h-3 text-cyan-400" /> Email Address
            </span>
            <div className="font-bold text-slate-100 font-mono">{user.email}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-mono flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-400" /> Phone Number
            </span>
            <div className="font-bold text-slate-100 font-mono">{user.phoneNumber || '—'}</div>
          </div>

          {user.departmentName && (
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 col-span-2">
              <span className="text-slate-400 text-[10px] uppercase font-mono flex items-center gap-1">
                <Building className="w-3 h-3 text-amber-400" /> Department Assignment
              </span>
              <div className="font-bold text-slate-100">{user.departmentName}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
