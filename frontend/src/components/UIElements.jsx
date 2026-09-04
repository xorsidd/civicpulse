import React from 'react';
import { Loader2, Activity } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Analyzing Civic Intelligence...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-cyan-400 animate-spin" />
        <Activity className="w-5 h-5 text-cyan-400 absolute inset-0 m-auto" />
      </div>
      <p className="text-xs font-semibold text-slate-300 tracking-wide font-mono animate-pulse">
        {label}
      </p>
    </div>
  );
};

export const EmptyState = ({ title = 'No Civic Issues Found', message = 'No reports or issue clusters match your search criteria.', action = null }) => {
  return (
    <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
        <Activity className="w-7 h-7" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-100">{title}</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">{message}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel rounded-2xl max-w-xl w-full border border-slate-700/80 shadow-2xl overflow-hidden animate-scaleUp">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <h3 className="font-bold text-base text-slate-100 font-['Outfit']">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
