import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { MapView } from '../components/MapView';
import { LoadingSpinner } from '../components/UIElements';
import { Shield, Filter } from 'lucide-react';

export const AuthorityMapView = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState('');

  useEffect(() => {
    API.get('/authority/issues')
      .then((res) => {
        if (res.success) {
          setIssues(res.data || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = issues.filter((i) => !catFilter || i.mainCategory === catFilter);

  if (loading) return <LoadingSpinner label="Loading Authority Priority Map..." />;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-400" /> Municipal Authority Spatial Priority Map
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Red = Critical Priority (Score 76–100), Orange = High (56–75), Cyan = Medium (31–55), Green = Low (0–30)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs"
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
      </div>

      <MapView issues={filtered} height="600px" zoom={13} />
    </div>
  );
};
