import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { PriorityBadge, StatusBadge, SeverityBadge } from '../components/Badges';
import { LoadingSpinner, EmptyState } from '../components/UIElements';
import { Filter, Search, Shield, Building, MapPin, ArrowRight } from 'lucide-react';

export const AuthorityIssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([
      API.get('/authority/issues').catch(() => ({ data: [] })),
      API.get('/admin/departments').catch(() => ({ data: [] }))
    ]).then(([issRes, deptRes]) => {
      setIssues(issRes.data || []);
      setDepartments(deptRes.data || []);
      setLoading(false);
    });
  }, []);

  const filteredIssues = issues.filter((i) => {
    if (statusFilter && i.status !== statusFilter) return false;
    if (deptFilter && i.departmentId !== Number(deptFilter)) return false;
    if (catFilter && i.mainCategory !== catFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        i.title.toLowerCase().contains(q) ||
        i.clusterCode.toLowerCase().contains(q) ||
        (i.address && i.address.toLowerCase().contains(q))
      );
    }
    return true;
  });

  if (loading) return <LoadingSpinner label="Loading Authority Issues..." />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
          <Shield className="w-6 h-6 text-amber-400" /> Municipal Issue Management Queue
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review AI vision findings, assign responsible departments, & update resolution status
        </p>
      </div>

      {/* FILTER CONTROLS */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative col-span-1 sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location, or issue code (e.g. C-101)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl glass-input text-xs"
        >
          <option value="" className="bg-slate-900 text-white">All Statuses</option>
          <option value="REPORTED" className="bg-slate-900 text-white">REPORTED</option>
          <option value="AI_VERIFIED" className="bg-slate-900 text-white">AI VERIFIED</option>
          <option value="ASSIGNED" className="bg-slate-900 text-white">ASSIGNED</option>
          <option value="IN_PROGRESS" className="bg-slate-900 text-white">IN PROGRESS</option>
          <option value="RESOLVED" className="bg-slate-900 text-white">RESOLVED</option>
          <option value="REOPENED" className="bg-slate-900 text-white">REOPENED</option>
        </select>

        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl glass-input text-xs"
        >
          <option value="" className="bg-slate-900 text-white">All Categories</option>
          <option value="ROAD" className="bg-slate-900 text-white">ROAD</option>
          <option value="WASTE" className="bg-slate-900 text-white">WASTE</option>
          <option value="WATER" className="bg-slate-900 text-white">WATER</option>
          <option value="ELECTRICITY" className="bg-slate-900 text-white">ELECTRICITY</option>
          <option value="DRAINAGE" className="bg-slate-900 text-white">DRAINAGE</option>
          <option value="PUBLIC_INFRASTRUCTURE" className="bg-slate-900 text-white">PUBLIC INFRA</option>
        </select>
      </div>

      {/* ISSUES TABLE */}
      {filteredIssues.length === 0 ? (
        <EmptyState title="No Issues Match Criteria" message="Try adjusting search or status filters." />
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-mono text-[10px] uppercase">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Issue Title & Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Priority Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                    {issue.clusterCode}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-bold text-slate-100 truncate">{issue.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{issue.address}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold uppercase text-slate-300">
                    {issue.mainCategory}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {issue.departmentName || 'Unassigned'}
                  </td>
                  <td className="py-3 px-4">
                    <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} />
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/authority/issues/${issue.id}`}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs inline-flex items-center gap-1 shadow-md shadow-cyan-950"
                    >
                      Manage <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
