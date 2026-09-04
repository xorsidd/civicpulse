import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { LoadingSpinner, Modal } from '../components/UIElements';
import { Tags, Plus } from 'lucide-react';

export const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [mainCategory, setMainCategory] = useState('ROAD');
  const [defaultSeverity, setDefaultSeverity] = useState('MEDIUM');
  const [description, setDescription] = useState('');

  const fetchCats = () => {
    API.get('/admin/categories')
      .then((res) => {
        if (res.success) setCategories(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/categories', { code, name, mainCategory, defaultSeverity, description });
      if (res.success) {
        setModalOpen(false);
        setCode('');
        setName('');
        setDescription('');
        fetchCats();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Categories..." />;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
            <Tags className="w-6 h-6 text-purple-400" /> Configurable Issue Categories
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage issue category rules, default severity levels, & AI classification labels
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-mono text-[10px] uppercase">
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Main Domain</th>
              <th className="py-3 px-4">Default Severity</th>
              <th className="py-3 px-4">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-cyan-400">{c.code}</td>
                <td className="py-3 px-4 font-bold text-slate-100">{c.name}</td>
                <td className="py-3 px-4 font-semibold text-slate-300">{c.mainCategory}</td>
                <td className="py-3 px-4 font-mono text-amber-400">{c.defaultSeverity}</td>
                <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{c.description || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE CATEGORY MODAL */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Issue Category">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Category Code</label>
            <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. POTHOLE" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Category Name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pothole" className="w-full px-3 py-2 rounded-xl glass-input text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Main Domain</label>
            <select value={mainCategory} onChange={(e) => setMainCategory(e.target.value)} className="w-full px-3 py-2 rounded-xl glass-input text-xs">
              <option value="ROAD" className="bg-slate-900 text-white">ROAD</option>
              <option value="WASTE" className="bg-slate-900 text-white">WASTE</option>
              <option value="WATER" className="bg-slate-900 text-white">WATER</option>
              <option value="ELECTRICITY" className="bg-slate-900 text-white">ELECTRICITY</option>
              <option value="DRAINAGE" className="bg-slate-900 text-white">DRAINAGE</option>
              <option value="PUBLIC_INFRASTRUCTURE" className="bg-slate-900 text-white">PUBLIC INFRA</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Default Severity</label>
            <select value={defaultSeverity} onChange={(e) => setDefaultSeverity(e.target.value)} className="w-full px-3 py-2 rounded-xl glass-input text-xs">
              <option value="LOW" className="bg-slate-900 text-white">LOW</option>
              <option value="MEDIUM" className="bg-slate-900 text-white">MEDIUM</option>
              <option value="HIGH" className="bg-slate-900 text-white">HIGH</option>
              <option value="CRITICAL" className="bg-slate-900 text-white">CRITICAL</option>
            </select>
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg">Save Category</button>
        </form>
      </Modal>

    </div>
  );
};
