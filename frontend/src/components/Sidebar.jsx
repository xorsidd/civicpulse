import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  MapPin,
  User,
  Shield,
  Layers,
  Map as MapIcon,
  Users,
  Building2,
  Tags,
  AlertOctagon
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const citizenLinks = [
    { to: '/citizen/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/citizen/report', label: 'Report Problem', icon: <PlusCircle className="w-4 h-4 text-cyan-400" /> },
    { to: '/citizen/issues', label: 'My Reports', icon: <FileText className="w-4 h-4" /> },
    { to: '/citizen/nearby', label: 'Nearby Issues', icon: <MapPin className="w-4 h-4" /> },
    { to: '/citizen/profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
  ];

  const authorityLinks = [
    { to: '/authority/dashboard', label: 'Priority Queue', icon: <Shield className="w-4 h-4 text-amber-400" /> },
    { to: '/authority/issues', label: 'All Issues', icon: <Layers className="w-4 h-4" /> },
    { to: '/authority/map', label: 'Authority Map', icon: <MapIcon className="w-4 h-4 text-cyan-400" /> },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'System Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/admin/users', label: 'Manage Users', icon: <Users className="w-4 h-4" /> },
    { to: '/admin/departments', label: 'Departments', icon: <Building2 className="w-4 h-4" /> },
    { to: '/admin/categories', label: 'Categories', icon: <Tags className="w-4 h-4" /> },
    { to: '/admin/zones', label: 'Zones & Risk', icon: <MapPin className="w-4 h-4" /> },
    { to: '/admin/fraud', label: 'Fraud Detection', icon: <AlertOctagon className="w-4 h-4 text-rose-400" /> },
  ];

  const links =
    user.role === 'ADMIN'
      ? adminLinks
      : user.role === 'AUTHORITY'
      ? authorityLinks
      : citizenLinks;

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-20 glass-panel rounded-2xl p-4 border border-slate-800/80 space-y-6">
        
        {/* Role Badge Header */}
        <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Active Role</div>
            <div className="text-sm font-bold text-slate-100">{user.role}</div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-950/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer help widget */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-900/40 text-xs">
          <div className="font-semibold text-cyan-300 mb-1">CivicPulse Engine</div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            AI Vision + Multi-signal Duplicate Clustering + Priority Score System.
          </p>
        </div>

      </div>
    </aside>
  );
};
