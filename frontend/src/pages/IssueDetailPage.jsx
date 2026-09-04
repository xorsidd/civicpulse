import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PriorityBadge, StatusBadge, SeverityBadge } from '../components/Badges';
import { MapView } from '../components/MapView';
import { LoadingSpinner } from '../components/UIElements';
import {
  ShieldAlert,
  MapPin,
  ThumbsUp,
  Building,
  Calendar,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Layers,
  FileCheck,
  User,
  ArrowLeft
} from 'lucide-react';

export const IssueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [msg, setMsg] = useState('');

  const fetchDetail = () => {
    setLoading(true);
    API.get(`/issues/${id}`)
      .then((res) => {
        if (res.success) {
          setDetail(res.data);
        }
      })
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleSupport = async () => {
    try {
      const res = await API.post(`/issues/${id}/support`);
      if (res.success) {
        setDetail((prev) => ({
          ...prev,
          cluster: res.data,
        }));
        setMsg('Support vote recorded successfully!');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleVerification = async (isFixed) => {
    setVerifying(true);
    try {
      const res = await API.post(`/issues/${id}/verify-resolution`, {
        isFixed,
        feedbackNotes,
      });
      if (res.success) {
        setMsg(isFixed ? 'Thank you! Issue resolution verified.' : 'Issue reopened and priority escalated.');
        fetchDetail();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Issue Intelligence..." />;
  if (!detail || !detail.cluster) return <div className="p-8 text-center text-slate-400">Issue not found.</div>;

  const { cluster, reports, statusHistory, resolutionEvidence, supporters, primaryAiAnalysis } = detail;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
            {cluster.clusterCode}
          </span>
          <StatusBadge status={cluster.status} />
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {cluster.mainCategory} &bull; {cluster.categoryName || cluster.categoryCode}
            </span>
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              {cluster.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{cluster.address}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <PriorityBadge level={cluster.priorityLevel} score={cluster.priorityScore} />
            <div className="text-xs text-slate-400">
              Severity: <SeverityBadge severity={cluster.severity} />
            </div>
          </div>
        </div>

        {/* Support & Action Button */}
        {user?.role === 'CITIZEN' && (
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-300 flex items-center gap-3">
              <span><strong className="text-white">{cluster.reportCount}</strong> Linked Reports</span>
              <span>•</span>
              <span><strong className="text-white">{cluster.supporterCount}</strong> Citizen Supporters</span>
            </div>

            <button
              onClick={handleSupport}
              disabled={cluster.currentUserSupported}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                cluster.currentUserSupported
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              {cluster.currentUserSupported ? 'Supported' : 'Support Issue (+1 Vote)'}
            </button>
          </div>
        )}
      </div>

      {/* CITIZEN RESOLUTION VERIFICATION BOX (PROMPT SECTION 28) */}
      {cluster.status === 'RESOLVED' && user?.role === 'CITIZEN' && (
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/50 bg-amber-950/20 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-base font-['Outfit']">
            <FileCheck className="w-6 h-6 text-amber-400" />
            <span>Citizen Verification Request: Has this issue actually been fixed?</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The municipal authority has uploaded repair evidence and marked this issue as RESOLVED. Please verify if the problem on the ground has been completely fixed.
          </p>

          <div className="space-y-2">
            <textarea
              rows={2}
              value={feedbackNotes}
              onChange={(e) => setFeedbackNotes(e.target.value)}
              placeholder="Optional feedback notes for municipal authority..."
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleVerification(true)}
              disabled={verifying}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" /> YES, FIXED (Confirm Resolution)
            </button>

            <button
              onClick={() => handleVerification(false)}
              disabled={verifying}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" /> STILL A PROBLEM (Reopen Issue)
            </button>
          </div>
        </div>
      )}

      {/* RESOLUTION EVIDENCE CARD */}
      {resolutionEvidence && (
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Authority Resolution Evidence
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Resolved on {new Date(resolutionEvidence.resolvedAt).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <img
              src={resolutionEvidence.imageUrl}
              alt="Repair Evidence"
              className="w-full h-52 object-cover rounded-xl bg-slate-900 border border-slate-800"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80';
              }}
            />
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[10px] font-mono">AUTHORITY NOTES</span>
                <p className="text-slate-200 mt-1 font-medium">{resolutionEvidence.description}</p>
              </div>
              {resolutionEvidence.aiValidScore && (
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-cyan-300 font-mono">
                  AI Pre-Verification Score: <strong>{resolutionEvidence.aiValidScore}%</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI VISION BREAKDOWN & MAP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Primary Image & AI Vision Panel */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 font-['Outfit']">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Vision AI Intelligence & Photo
          </h3>

          <div className="h-48 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
            <img
              src={cluster.primaryImageUrl}
              alt="Primary Issue"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {primaryAiAnalysis && (
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[10px]">AI CONFIDENCE</span>
                <div className="text-cyan-400 font-bold">{Math.round(primaryAiAnalysis.confidence * 100)}%</div>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[10px]">HAZARD DETECTED</span>
                <div className="text-amber-400 font-bold">{primaryAiAnalysis.visibleHazard ? 'YES' : 'NO'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Location Map */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 font-['Outfit']">
            <MapPin className="w-4 h-4 text-rose-400" /> Geolocation & Risk Zone
          </h3>
          <MapView issues={[cluster]} height="250px" center={[cluster.latitude, cluster.longitude]} zoom={15} />
        </div>

      </div>

      {/* STATUS HISTORY TIMELINE */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 font-['Outfit']">
          <Layers className="w-4 h-4 text-purple-400" /> Status Lifecycle History
        </h3>

        <div className="space-y-3 relative pl-4 border-l-2 border-slate-800">
          {statusHistory.map((h, idx) => (
            <div key={idx} className="relative pl-4 space-y-1">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-[#0B132B]" />
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <StatusBadge status={h.newStatus} />
                  {h.changedByUserName && (
                    <span className="text-slate-400 text-[11px]">by {h.changedByUserName}</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(h.changedAt).toLocaleString()}
                </span>
              </div>
              {h.notes && <p className="text-xs text-slate-300">{h.notes}</p>}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
