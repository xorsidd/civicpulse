import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { LoadingSpinner, Modal } from '../components/UIElements';
import { Building2, Plus, Mail, Phone } from 'lucide-react';

export const ManageDepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  const fetchDepts = () => {
    API.get('/admin/departments')
      .then((res) => {
        if (res.success) setDepartments(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/departments', { name, code, contactEmail: email, contactPhone: phone, description });
      if (res.success) {
        setModalOpen(false);
        setName('');
        setCode('');
        setEmail('');
        setPhone('');
        setDescription('');
        fetchDepts();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Departments..." />;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-400" /> Municipal Departments
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure municipal department routing and contact details
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((d) => (
          <div key={d.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-800">
                {d.code}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">ID #{d.id}</span>
            </div>
            <h3 className="font-bold text-base text-white">{d.name}</h3>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{d.description || 'No description provided.'}</p>
            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-cyan-400" /> {d.contactEmail || 'N/A'}</div>
              <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {d.contactPhone || 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE DEPARTMENT MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Municipal Department">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Department Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Roads & Infrastructure Dept" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Department Code</label>
            <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. ROADS" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Contact Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="roads@civicpulse.gov" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Contact Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91-9876543210" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Description</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Responsibilities..." className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg">Save Department</button>
        </form>
      </Modal>

    </div>
  );
};
