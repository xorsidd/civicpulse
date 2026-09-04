import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/UIElements';
import { AlertOctagon, CheckCircle2, ShieldAlert, UserCheck } from 'lucide-react';

export const FraudManagementPage = () => {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlags = () => {
    API.get('/admin/fraud')
      .then((res) => {
        if (res.success) setFlags(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleResolve = async (id, action) => {
    try {
      const res = await API.put(`/admin/fraud/${id}/resolve?action=${encodeURIComponent(action)}`);
      if (res.success) {
        fetchFlags();
      }
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Fraud Detection Console..." />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
          <AlertOctagon className="w-6 h-6 text-rose-400" /> Anti-Spam & Fraud Detection Oversight
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review automated risk flags (rapid rate limit breaches, non-civic photos, impossible GPS patterns)
        </p>
      </div>

      {flags.length === 0 ? (
        <EmptyState title="No Suspicious Activities Flagged" message="All citizen reports are clean and compliant." />
      ) : (
        <div className="space-y-4">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className={`glass-panel p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                flag.isResolved
                  ? 'border-slate-800 opacity-60'
                  : 'border-rose-500/50 bg-rose-950/20'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                    Risk Score: {flag.riskScore}/100
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">User: {flag.userName} ({flag.userEmail})</span>
                  {flag.isResolved && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 font-bold border border-emerald-700">
                      RESOLVED
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" /> {flag.reason}
                </h3>

                <div className="text-[11px] text-slate-400 font-mono">
                  Report ID #{flag.reportId || 'N/A'} &bull; Flagged on {new Date(flag.createdAt).toLocaleString()}
                </div>

                {flag.adminActionTaken && (
                  <div className="text-xs text-emerald-300 font-medium pt-1">
                    Action Taken: {flag.adminActionTaken}
                  </div>
                )}
              </div>

              {!flag.isResolved && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleResolve(flag.id, 'Reviewed & Verified Authentic')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Report
                  </button>
                  <button
                    onClick={() => handleResolve(flag.id, 'Dismissed as Spam')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Dismiss Flag
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
