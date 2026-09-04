import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/UIElements';
import { Users, Mail, Shield, Phone, Building } from 'lucide-react';

export const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/users')
      .then((res) => {
        if (res.success) setUsers(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading Users..." />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
          <Users className="w-6 h-6 text-cyan-400" /> User Management
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Registered Citizens, Municipal Authorities, and Administrators ({users.length} Total Users)
        </p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-mono text-[10px] uppercase">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-slate-400">#{u.id}</td>
                <td className="py-3 px-4 font-bold text-slate-100">{u.name}</td>
                <td className="py-3 px-4 text-slate-300 font-mono">{u.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    u.role === 'ADMIN' ? 'bg-rose-950 text-rose-300 border border-rose-700' :
                    u.role === 'AUTHORITY' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                    'bg-cyan-950 text-cyan-300 border border-cyan-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-300">{u.departmentName || '—'}</td>
                <td className="py-3 px-4 text-slate-400 font-mono">{u.phoneNumber || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
