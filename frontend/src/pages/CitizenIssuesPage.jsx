import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { StatusBadge } from '../components/Badges';
import { LoadingSpinner, EmptyState } from '../components/UIElements';
import { FileText, MapPin, Calendar, ArrowRight, ExternalLink } from 'lucide-react';

export const CitizenIssuesPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/reports/my')
      .then((res) => {
        if (res.success) {
          setReports(res.data || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading your reports..." />;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
            My Submitted Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track real-time resolution status and AI analysis of your reported issues
          </p>
        </div>
        <Link
          to="/citizen/report"
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-950"
        >
          + Report New Issue
        </Link>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          title="No Reports Submitted Yet"
          message="You haven't submitted any civic issue reports. Report a pothole or garbage accumulation to start!"
          action={
            <Link
              to="/citizen/report"
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs inline-block"
            >
              Report First Issue
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between group hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={report.imageUrl}
                  alt="Report Thumbnail"
                  className="w-20 h-20 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80';
                  }}
                />

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      Report #{report.id}
                    </span>
                    <StatusBadge status={report.status} />
                    {report.aiAnalysis?.category && (
                      <span className="text-[10px] uppercase font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                        {report.aiAnalysis.category}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                    {report.description || 'Civic infrastructure report'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" /> {report.address}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />{' '}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {report.clusterId && (
                <Link
                  to={`/citizen/issues/${report.clusterId}`}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 shrink-0 border border-slate-700"
                >
                  Track Cluster <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
