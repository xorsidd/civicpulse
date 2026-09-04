import React from 'react';
import { Link } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from './Badges';
import { MapPin, ThumbsUp, Layers, Building, Calendar, ArrowRight } from 'lucide-react';

export const IssueCard = ({ issue, onSupport, currentUser }) => {
  if (!issue) return null;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between">
      <div>
        {/* Top Image Preview & Badges overlay */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
          <img
            src={issue.primaryImageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-transparent to-black/40" />

          {/* Code & Category Tag */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-cyan-300 border border-cyan-500/40">
              {issue.clusterCode}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-slate-200 border border-slate-700">
              {issue.mainCategory || 'CIVIC'}
            </span>
          </div>

          {/* Priority & Status Badges */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            <PriorityBadge level={issue.priorityLevel} score={issue.priorityScore} />
            <StatusBadge status={issue.status} />
          </div>

          {/* Supporter Pill */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-semibold text-white bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{issue.reportCount || 1} Reports</span>
            <span className="text-slate-400">•</span>
            <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>{issue.supporterCount || 0} Supporters</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2.5">
          <h3 className="font-bold text-base text-slate-100 line-clamp-1 group-hover:text-cyan-300 transition-colors">
            {issue.title}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>

          <div className="space-y-1.5 pt-1 text-xs text-slate-400">
            {issue.address && (
              <div className="flex items-center gap-1.5 line-clamp-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">{issue.address}</span>
              </div>
            )}
            {issue.departmentName && (
              <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-medium">
                <Building className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{issue.departmentName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
        {onSupport && currentUser?.role === 'CITIZEN' ? (
          <button
            onClick={() => onSupport(issue.id)}
            disabled={issue.currentUserSupported}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              issue.currentUserSupported
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            {issue.currentUserSupported ? 'Supported' : 'Support Issue'}
          </button>
        ) : (
          <span />
        )}

        <Link
          to={`/citizen/issues/${issue.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors ml-auto"
        >
          View Intelligence <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
