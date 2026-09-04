import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapView } from '../components/MapView';
import { IssueCard } from '../components/IssueCard';
import { LoadingSpinner, EmptyState } from '../components/UIElements';
import { MapPin, Filter, Search } from 'lucide-react';

export const NearbyIssuesPage = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    API.get('/issues')
      .then((res) => {
        if (res.success) {
          setIssues(res.data || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSupport = async (clusterId) => {
    try {
      const res = await API.post(`/issues/${clusterId}/support`);
      if (res.success) {
        setIssues((prev) =>
          prev.map((item) => (item.id === clusterId ? res.data : item))
        );
      }
    } catch (err) {
      alert(err.message || 'Support action failed');
    }
  };

  const filteredIssues = issues.filter((i) => {
    if (categoryFilter && i.mainCategory !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        i.title.toLowerCase().contains(q) ||
        (i.address && i.address.toLowerCase().contains(q)) ||
        (i.clusterCode && i.clusterCode.toLowerCase().contains(q))
      );
    }
    return true;
  });

  if (loading) return <LoadingSpinner label="Loading nearby civic issues..." />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
          Nearby Civic Issues & Priority Map
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore public infrastructure problems near you and support community resolution
        </p>
      </div>

      {/* Interactive Map */}
      <MapView issues={filteredIssues} height="400px" />

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location address, or code (e.g. C-101)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs w-full sm:w-auto"
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

      {/* Issues Grid */}
      {filteredIssues.length === 0 ? (
        <EmptyState title="No Issues Found" message="No civic issues match your search or filter." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onSupport={handleSupport}
              currentUser={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};
