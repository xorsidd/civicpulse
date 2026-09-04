import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { PriorityBadge, StatusBadge } from '../components/Badges';
import { MapView } from '../components/MapView';
import { LoadingSpinner } from '../components/UIElements';
import {
  Shield,
  Building,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Layers,
  FileText,
  Clock
} from 'lucide-react';

export const AuthorityIssueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [internalNote, setInternalNote] = useState('');

  const [resolutionFile, setResolutionFile] = useState(null);
  const [resolutionDesc, setResolutionDesc] = useState('');
  const [uploadingResolution, setUploadingResolution] = useState(false);

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const fetchDetail = () => {
    Promise.all([
      API.get(`/issues/${id}`),
      API.get('/admin/departments').catch(() => ({ data: [] }))
    ]).then(([issRes, deptRes]) => {
      if (issRes.success) {
        setDetail(issRes.data);
        if (issRes.data.cluster?.departmentId) {
          setSelectedDeptId(issRes.data.cluster.departmentId.toString());
        }
        if (issRes.data.cluster?.status) {
          setSelectedStatus(issRes.data.cluster.status);
        }
      }
      setDepartments(deptRes.data || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleAssignDepartment = async () => {
    setErr('');
    try {
      const res = await API.put(`/authority/issues/${id}/assign`, {
        departmentId: Number(selectedDeptId),
        notes: internalNote,
      });
      if (res.success) {
        setMsg('Department assigned successfully!');
        fetchDetail();
      }
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleUpdateStatus = async () => {
    setErr('');
    try {
      const res = await API.put(`/authority/issues/${id}/status`, {
        status: selectedStatus,
        notes: internalNote,
      });
      if (res.success) {
        setMsg('Issue status updated successfully!');
        fetchDetail();
      }
    } catch (e) {
      setErr(e.message);
    }
  };

  const handleUploadResolution = async (e) => {
    e.preventDefault();
    if (!resolutionFile) {
      setErr('Please select a repair resolution evidence image file.');
      return;
    }

    setUploadingResolution(true);
    setErr('');

    const formData = new FormData();
    formData.append('image', resolutionFile);
    if (resolutionDesc) formData.append('description', resolutionDesc);

    try {
      const res = await API.post(`/issues/${id}/resolution`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.success) {
        setMsg('Resolution evidence uploaded! Issue marked as RESOLVED.');
        fetchDetail();
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setUploadingResolution(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Authority Console..." />;
  if (!detail || !detail.cluster) return <div className="p-8 text-center text-slate-400">Issue not found.</div>;

  const { cluster, reports, statusHistory, resolutionEvidence, primaryAiAnalysis } = detail;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/authority/issues')}
          className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Queue
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

      {err && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-700/50 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{err}</span>
        </div>
      )}

      {/* HEADER CARD */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {cluster.mainCategory} &bull; {cluster.categoryName || cluster.categoryCode}
            </span>
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">{cluster.title}</h1>
            <p className="text-xs text-slate-400 mt-1">{cluster.address}</p>
          </div>

          <PriorityBadge level={cluster.priorityLevel} score={cluster.priorityScore} />
        </div>
      </div>

      {/* AUTHORITY CONTROL ACTIONS (DEPARTMENT & STATUS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Department Routing Box */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 font-['Outfit']">
            <Building className="w-4 h-4 text-cyan-400" /> Department Routing
          </h3>

          <div className="space-y-3">
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
            >
              <option value="" className="bg-slate-900 text-white">Select Department...</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                  {d.name} ({d.code})
                </option>
              ))}
            </select>

            <button
              onClick={handleAssignDepartment}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md"
            >
              Assign Department & Set Status ASSIGNED
            </button>
          </div>
        </div>

        {/* Status Lifecycle Manager Box */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 font-['Outfit']">
            <Clock className="w-4 h-4 text-amber-400" /> Update Work Order Status
          </h3>

          <div className="space-y-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl glass-input text-xs"
            >
              <option value="ASSIGNED" className="bg-slate-900 text-white">ASSIGNED</option>
              <option value="IN_PROGRESS" className="bg-slate-900 text-white">IN_PROGRESS (Work Order Active)</option>
              <option value="REJECTED" className="bg-slate-900 text-white">REJECTED (Invalid / Duplicate)</option>
            </select>

            <input
              type="text"
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Internal authority note / work order details..."
              className="w-full px-3 py-2 rounded-xl glass-input text-xs"
            />

            <button
              onClick={handleUpdateStatus}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md"
            >
              Update Status
            </button>
          </div>
        </div>

      </div>

      {/* RESOLUTION EVIDENCE UPLOADER (PROMPT SECTION 27) */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/50 bg-emerald-950/20 space-y-4">
        <h3 className="font-bold text-base text-emerald-300 flex items-center gap-2 font-['Outfit']">
          <Upload className="w-5 h-5 text-emerald-400" /> Upload Repair Evidence & Mark RESOLVED
        </h3>
        <p className="text-xs text-slate-300">
          Authority must upload evidence photo of completed repair before marking issue resolved.
        </p>

        <form onSubmit={handleUploadResolution} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setResolutionFile(e.target.files[0])}
              className="px-3 py-2 rounded-xl glass-input text-xs file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white"
            />
            <input
              type="text"
              value={resolutionDesc}
              onChange={(e) => setResolutionDesc(e.target.value)}
              placeholder="Description of repair work completed..."
              className="px-3 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={uploadingResolution}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            {uploadingResolution ? 'Uploading Evidence...' : 'Upload Repair Evidence & Set RESOLVED'}
          </button>
        </form>
      </div>

      {/* LINKED CITIZEN REPORTS & IMAGES */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 font-['Outfit']">
          <Layers className="w-4 h-4 text-cyan-400" /> Linked Citizen Reports in Cluster ({reports.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {reports.map((r) => (
            <div key={r.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <img
                src={r.imageUrl}
                alt="Report Photo"
                className="w-full h-32 object-cover rounded-lg bg-black"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <div className="font-semibold text-slate-200">Report #{r.id} by {r.userName}</div>
              <p className="text-[11px] text-slate-400 line-clamp-2">{r.description || 'No text description'}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
