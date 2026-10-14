import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'rose', description }) {
  const colorMap = {
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
    },
  };

  const selectedColor = colorMap[color] || colorMap.rose;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-extrabold text-slate-900">{value}</h3>
        {description && (
          <p className="text-[11px] text-slate-400 mt-1 font-medium">{description}</p>
        )}
      </div>

      <div
        className={`w-12 h-12 rounded-2xl ${selectedColor.bg} ${selectedColor.border} border flex items-center justify-center ${selectedColor.text} shadow-inner`}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
