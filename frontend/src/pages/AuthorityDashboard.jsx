import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { PriorityBadge, StatusBadge } from '../components/Badges';
import { LoadingSpinner } from '../components/UIElements';
import { Shield, AlertTriangle, Layers, CheckCircle2, Clock, MapPin, ArrowRight, Building } from 'lucide-react';

export const AuthorityDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [priorityQueue, setPriorityQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/authority/dashboard').catch(() => ({ data: null })),
      API.get('/authority/issues').catch(() => ({ data: [] }))
    ]).then(([statRes, issRes]) => {
      setStats(statRes.data);
      setPriorityQueue(issRes.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner label="Loading Authority Priority Queue..." />;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#131F37] to-amber-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              Authority Operations Dashboard & Priority Queue
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Logged in as <strong className="text-white">{user?.name}</strong> ({user?.departmentName || 'All Departments'})
          </p>
        </div>
        <Link
          to="/authority/map"
          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 shrink-0"
        >
          <MapPin className="w-4 h-4" /> Open Authority Map
        </Link>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Issues" value={stats?.totalClusters || priorityQueue.length} icon={Layers} color="cyan" trend="Across all zones" />
        <StatCard title="Critical Priority" value={stats?.criticalIssues || 0} icon={AlertTriangle} color="rose" trend="Immediate action required" />
        <StatCard title="In Progress" value={stats?.inProgressIssues || 0} icon={Clock} color="amber" trend="Assigned work orders" />
        <StatCard title="Resolved" value={stats?.resolvedIssues || 0} icon={CheckCircle2} color="emerald" trend="Evidence uploaded" />
      </div>

      {/* AUTOMATIC PRIORITY QUEUE TABLE (PROMPT SECTION 21) */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" /> Dispatch Priority Queue (Sorted by Priority Score Descending)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked automatically using severity, citizen impact, and high-risk location proximity
            </p>
          </div>
          <Link to="/authority/issues" className="text-xs font-semibold text-cyan-400 hover:underline">
            View All Issues &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                <th className="pb-3 px-3">Rank</th>
                <th className="pb-3 px-3">Issue Code</th>
                <th className="pb-3 px-3">Title & Category</th>
                <th className="pb-3 px-3">Priority Score</th>
                <th className="pb-3 px-3">Impact</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {priorityQueue.slice(0, 10).map((issue, index) => (
                <tr key={issue.id} className="hover:bg-slate-900/60 transition-colors group">
                  <td className="py-3 px-3 font-mono font-bold text-slate-400">
                    #{index + 1}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400">
                    {issue.clusterCode}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {issue.title}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {issue.mainCategory} &bull; {issue.address}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} />
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {issue.reportCount} Reports / {issue.supporterCount} Votes
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to={`/authority/issues/${issue.id}`}
                      className="px-3 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[11px] font-semibold inline-flex items-center gap-1"
                    >
                      Manage <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
