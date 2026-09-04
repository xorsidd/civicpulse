import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { LoadingSpinner, Modal } from '../components/UIElements';
import { MapPin, Plus } from 'lucide-react';

export const ManageZonesPage = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [riskMultiplier, setRiskMultiplier] = useState('1.2');
  const [description, setDescription] = useState('');

  const fetchZones = () => {
    API.get('/admin/zones')
      .then((res) => {
        if (res.success) setZones(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/zones', { name, code, riskMultiplier: parseFloat(riskMultiplier), description });
      if (res.success) {
        setModalOpen(false);
        setName('');
        setCode('');
        fetchZones();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Zones..." />;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-400" /> Geographic Zones & Risk Multipliers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure urban zones and spatial risk weighting factors
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Zone
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((z) => (
          <div key={z.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                {z.code}
              </span>
              <span className="text-xs font-mono text-cyan-300 font-bold bg-slate-900 px-2.5 py-1 rounded">
                Risk Multiplier: {z.riskMultiplier}x
              </span>
            </div>
            <h3 className="font-bold text-base text-white">{z.name}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{z.description || 'No zone description provided.'}</p>
          </div>
        ))}
      </div>

      {/* CREATE ZONE MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Geographic Zone">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Zone Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Zone 1 - Central Academic" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Zone Code</label>
            <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. ZONE-1" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Risk Multiplier Factor</label>
            <input type="number" step="0.1" required value={riskMultiplier} onChange={(e) => setRiskMultiplier(e.target.value)} placeholder="1.2" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg">Save Zone</button>
        </form>
      </Modal>

    </div>
  );
};
