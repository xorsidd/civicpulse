import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { MapView } from '../components/MapView';
import { IssueCard } from '../components/IssueCard';
import { Activity, ShieldAlert, Sparkles, Layers, Cpu, CheckCircle2, ArrowRight, MapPin, ThumbsUp, UserCheck, Shield, Building2 } from 'lucide-react';

export const LandingPage = () => {
  const [topIssues, setTopIssues] = useState([]);

  useEffect(() => {
    API.get('/issues')
      .then((res) => {
        if (res.success) {
          setTopIssues(res.data.slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI-Driven Civic Intelligence Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto font-['Outfit']">
            From Citizen Reports to <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">Actionable Civic Action</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            CivicPulse transforms raw complaints into structured, AI-validated, duplicate-detected, and priority-scored civic intelligence for municipal governance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/citizen/report"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-sm shadow-xl shadow-cyan-950 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Activity className="w-5 h-5" /> Report a Civic Problem
            </Link>
            <Link
              to="/login?role=AUTHORITY"
              className="px-6 py-3.5 rounded-xl glass-panel hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              Access Authority Portal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* DEDICATED PORTAL ENTRY CARDS */}
          <div className="pt-8 max-w-4xl mx-auto text-left">
            <div className="text-center pb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                Select Portal Access Mode
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* CITIZEN PORTAL CARD */}
              <Link
                to="/login?role=CITIZEN"
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-cyan-300 transition-colors">
                    Citizen Portal
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Report infrastructure problems, track status timeline, & verify resolutions.
                  </p>
                </div>
                <div className="text-xs font-bold text-cyan-400 flex items-center gap-1 pt-1">
                  Log In / Register &rarr;
                </div>
              </Link>

              {/* AUTHORITY PORTAL CARD */}
              <Link
                to="/login?role=AUTHORITY"
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 transition-all space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-amber-300 transition-colors">
                    Authority Portal
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Dispatch priority queue, assign departments, & upload repair evidence.
                  </p>
                </div>
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1 pt-1">
                  Authority Sign In &rarr;
                </div>
              </Link>

              {/* ADMIN PORTAL CARD */}
              <Link
                to="/login?role=ADMIN"
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900/80 transition-all space-y-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-rose-300 transition-colors">
                    Admin Portal
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    System controls, user management, department rules, & fraud oversight.
                  </p>
                </div>
                <div className="text-xs font-bold text-rose-400 flex items-center gap-1 pt-1">
                  Admin Sign In &rarr;
                </div>
              </Link>

            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            How CivicPulse Transforms Complaints
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A 5-stage automated pipeline converting noise into prioritized civic work orders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-extrabold">1</div>
            <h4 className="font-bold text-sm text-slate-100">Citizen Report</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Photo upload + automatic GPS capture + optional description.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center font-extrabold">2</div>
            <h4 className="font-bold text-sm text-slate-100">AI Analysis</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Vision AI verifies issue validity, categorizes problem, & measures severity.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center font-extrabold">3</div>
            <h4 className="font-bold text-sm text-slate-100">Duplicate Clustering</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Haversine + AI distance matches nearby reports into single actionable clusters.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center font-extrabold">4</div>
            <h4 className="font-bold text-sm text-slate-100">Priority Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Composite 0-100 priority score factoring severity, location risk, & citizen impact.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-extrabold">5</div>
            <h4 className="font-bold text-sm text-slate-100">Resolution & Verification</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Authority photo evidence + Citizen verification ("YES, FIXED").</p>
          </div>
        </div>
      </section>

      {/* LIVE PRIORITY MAP & RECENT ISSUES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white font-['Outfit']">
              Live Priority Map & Active Intelligence
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time spatial visualization of municipal infrastructure issues
            </p>
          </div>
          <Link
            to="/login?role=AUTHORITY"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            View Full Priority Queue &rarr;
          </Link>
        </div>

        <MapView issues={topIssues} height="420px" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topIssues.slice(0, 3).map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>

    </div>
  );
};
