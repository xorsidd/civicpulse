import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { StatCard } from '../components/StatCard';
import { LoadingSpinner } from '../components/UIElements';
import { Shield, Users, Layers, CheckCircle2, AlertOctagon, Activity, Building, Tags } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard')
      .then((res) => {
        if (res.success) setStats(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading System Analytics..." />;

  const catData = stats?.categoryBreakdown
    ? Object.entries(stats.categoryBreakdown).map(([name, value]) => ({
        name,
        count: value,
      }))
    : [];

  const COLORS = ['#06B6D4', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EC4899'];

  return (
    <div className="space-y-8 pb-12">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#131F37] to-rose-950/30 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
            <Shield className="w-6 h-6 text-rose-400" /> CivicPulse System Administration
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Global system statistics, municipal departments, category rules, and fraud oversight
          </p>
        </div>
      </div>

      {/* SYSTEM STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="cyan" trend={`${stats?.totalCitizens || 0} Citizens / ${stats?.totalAuthorities || 0} Auth`} />
        <StatCard title="Total Reports" value={stats?.totalReports || 0} icon={Activity} color="purple" trend="Individual submissions" />
        <StatCard title="Issue Clusters" value={stats?.totalClusters || 0} icon={Layers} color="amber" trend={`${stats?.criticalIssues || 0} Critical`} />
        <StatCard title="Suspicious Activity" value={stats?.suspiciousFlagsCount || 0} icon={AlertOctagon} color="rose" trend="Requires admin review" />
      </div>

      {/* CATEGORY DISTRIBUTION CHART */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-base text-white font-['Outfit'] flex items-center gap-2">
          <Tags className="w-5 h-5 text-cyan-400" /> Issue Distribution by Category
        </h3>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={catData}>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
              <YAxis stroke="#94A3B8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E2D4A', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {catData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
