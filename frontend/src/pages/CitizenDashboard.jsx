import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { IssueCard } from '../components/IssueCard';
import { LoadingSpinner, EmptyState } from '../components/UIElements';
import { PlusCircle, MapPin, FileText, Bell, ThumbsUp, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/reports/my').catch(() => ({ data: [] })),
      API.get('/issues').catch(() => ({ data: [] }))
    ]).then(([repRes, issRes]) => {
      setReports(repRes.data || []);
      setIssues(issRes.data || []);
      setLoading(false);
    });
  }, []);

  const handleSupport = async (clusterId) => {
    try {
      const res = await API.post(`/issues/${clusterId}/support`);
      if (res.success) {
        setIssues((prev) =>
          prev.map((item) => (item.id === clusterId ? res.data : item))
        );
      }
    } catch (err) {
      alert(err.message || 'Support action failed');
    }
  };

  const openCount = reports.filter((r) => r.status !== 'RESOLVED' && r.status !== 'CLOSED').length;
  const resolvedCount = reports.filter((r) => r.status === 'RESOLVED' || r.status === 'CITIZEN_VERIFIED' || r.status === 'CLOSED').length;
  const supportedCount = issues.filter((i) => i.currentUserSupported).length;

  if (loading) return <LoadingSpinner label="Loading Citizen Dashboard..." />;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#131F37] to-cyan-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Track your submitted infrastructure reports and support community issues near you.
          </p>
        </div>
        <Link
          to="/citizen/report"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-cyan-950 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Report New Problem
        </Link>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Reports" value={reports.length} icon={FileText} color="cyan" trend="Submitted by you" />
        <StatCard title="Active Issues" value={openCount} icon={Activity} color="amber" trend="Under investigation" />
        <StatCard title="Resolved" value={resolvedCount} icon={CheckCircle2} color="emerald" trend="Fixed by authority" />
        <StatCard title="Supported" value={supportedCount} icon={ThumbsUp} color="purple" trend="Community reports" />
      </div>

      {/* QUICK ACTION BUTTONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link
          to="/citizen/report"
          className="p-4 rounded-xl glass-panel hover:bg-slate-800/80 border border-slate-800 flex items-center gap-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">Report Problem</div>
            <div className="text-[10px] text-slate-400">4-Step AI scan</div>
          </div>
        </Link>

        <Link
          to="/citizen/nearby"
          className="p-4 rounded-xl glass-panel hover:bg-slate-800/80 border border-slate-800 flex items-center gap-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">Nearby Issues</div>
            <div className="text-[10px] text-slate-400">Support local fixes</div>
          </div>
        </Link>

        <Link
          to="/citizen/issues"
          className="p-4 rounded-xl glass-panel hover:bg-slate-800/80 border border-slate-800 flex items-center gap-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">My Reports</div>
            <div className="text-[10px] text-slate-400">Track status timeline</div>
          </div>
        </Link>

        <Link
          to="/citizen/profile"
          className="p-4 rounded-xl glass-panel hover:bg-slate-800/80 border border-slate-800 flex items-center gap-3 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">Profile & Alerts</div>
            <div className="text-[10px] text-slate-400">Notification settings</div>
          </div>
        </Link>
      </div>

      {/* TOP PRIORITY CIVIC ISSUES NEARBY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" /> High-Priority Community Issues
          </h2>
          <Link to="/citizen/nearby" className="text-xs text-cyan-400 hover:underline font-semibold">
            View Map &rarr;
          </Link>
        </div>

        {issues.length === 0 ? (
          <EmptyState title="No Issues Available" message="No active civic issues reported yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {issues.slice(0, 3).map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onSupport={handleSupport}
                currentUser={user}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
