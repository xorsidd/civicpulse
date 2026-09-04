import React from 'react';

export const StatCard = ({ title, value, icon: Icon, trend, color = 'cyan' }) => {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
    amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
    rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-400',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
  };

  const selectedColor = colorMap[color] || colorMap.cyan;

  return (
    <div className={`glass-panel p-5 rounded-2xl border bg-gradient-to-br ${selectedColor} relative overflow-hidden group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 font-['Outfit']">{value}</h3>
          {trend && (
            <p className="text-[11px] text-slate-400 mt-1 font-medium">{trend}</p>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
