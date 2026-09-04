import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Shield, Activity, LogOut, User as UserIcon, PlusCircle, UserCheck, Building2 } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-[#0B132B]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent font-['Outfit']">
              CivicPulse
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              AI Intelligence
            </span>
          </div>
        </Link>

        {/* Portal Entry Navigation Links for Guest Visitors */}
        {!user && (
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/login?role=CITIZEN"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Citizen Portal
            </Link>

            <Link
              to="/login?role=AUTHORITY"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" /> Authority Portal
            </Link>

            <Link
              to="/login?role=ADMIN"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-rose-400" /> Admin Portal
            </Link>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Report Problem Quick CTA for Citizens */}
              {user.role === 'CITIZEN' && (
                <Link
                  to="/citizen/report"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-xs font-semibold shadow-md hover:brightness-110 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Report Issue
                </Link>
              )}

              <NotificationDropdown />

              {/* User Dropdown */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-100">{user.name}</div>
                  <div className="text-[10px] text-cyan-400 font-mono font-medium">{user.role}</div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
