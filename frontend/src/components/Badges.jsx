import React from 'react';
import { AlertTriangle, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const PriorityBadge = ({ level, score }) => {
  let bg = 'bg-slate-800 text-slate-300 border-slate-700';
  let icon = <AlertCircle className="w-3.5 h-3.5" />;

  switch (level) {
    case 'CRITICAL':
      bg = 'bg-rose-950/80 text-rose-300 border-rose-700/50 shadow-lg shadow-rose-950/50 pulse-glow';
      icon = <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
      break;
    case 'HIGH':
      bg = 'bg-amber-950/80 text-amber-300 border-amber-700/50';
      icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      break;
    case 'MEDIUM':
      bg = 'bg-cyan-950/80 text-cyan-300 border-cyan-700/50';
      icon = <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />;
      break;
    case 'LOW':
      bg = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50';
      icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bg}`}>
      {icon}
      <span>{level || 'MEDIUM'}</span>
      {score !== undefined && score !== null && (
        <span className="opacity-75 font-mono text-[10px] bg-black/40 px-1.5 py-0.5 rounded">
          {score}/100
        </span>
      )}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  let style = 'bg-slate-800 text-slate-300 border-slate-700';

  switch (status) {
    case 'REPORTED':
      style = 'bg-blue-950/80 text-blue-300 border-blue-700/50';
      break;
    case 'AI_VERIFIED':
      style = 'bg-purple-950/80 text-purple-300 border-purple-700/50';
      break;
    case 'ASSIGNED':
      style = 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50';
      break;
    case 'IN_PROGRESS':
      style = 'bg-amber-950/80 text-amber-300 border-amber-700/50 pulse-glow';
      break;
    case 'RESOLVED':
      style = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50';
      break;
    case 'CITIZEN_VERIFIED':
      style = 'bg-emerald-900 text-emerald-200 border-emerald-500/60 font-bold';
      break;
    case 'CLOSED':
      style = 'bg-slate-900 text-slate-400 border-slate-700';
      break;
    case 'REOPENED':
      style = 'bg-rose-950 text-rose-300 border-rose-600 font-bold pulse-glow';
      break;
    default:
      break;
  }

  const formatText = (st) => {
    if (!st) return 'REPORTED';
    return st.replace('_', ' ');
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${style}`}>
      {formatText(status)}
    </span>
  );
};

export const SeverityBadge = ({ severity }) => {
  let color = 'text-slate-400';
  if (severity === 'CRITICAL') color = 'text-rose-400 font-bold';
  if (severity === 'HIGH') color = 'text-amber-400 font-semibold';
  if (severity === 'MEDIUM') color = 'text-cyan-400';
  if (severity === 'LOW') color = 'text-emerald-400';

  return (
    <span className={`text-xs ${color}`}>
      {severity || 'MEDIUM'}
    </span>
  );
};
