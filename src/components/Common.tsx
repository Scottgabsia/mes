import React from 'react';

export const ProgressBar = ({ label, value, colorClass = "bg-blue-500" }: { label: string; value: string; colorClass?: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="font-fira text-xs text-white">{label}</span>
      <span className={`font-fira text-xs ${colorClass.replace('bg-', 'text-')}`}>{value}</span>
    </div>
    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${colorClass}`} style={{ width: value }}></div>
    </div>
  </div>
);

export const ForensicAgent = ({ name, role, tags, img }: { name: string; role: string; tags: string[]; img: string }) => (
  <div className="glass-panel p-6 rounded-sm border border-white/5 hover:border-blue-500/30 transition-all group">
    <div className="relative mb-4 w-16 h-16">
      <img 
        src={img} 
        alt={name} 
        referrerPolicy="no-referrer"
        className="w-full h-full rounded-sm object-cover filter grayscale group-hover:grayscale-0 transition-all" 
      />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
    </div>
    <p className="text-white font-bold text-sm tracking-tight mb-1">{name}</p>
    <p className="font-fira text-[10px] text-blue-500 mb-4 tracking-tighter">{role}</p>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, idx) => (
        <span key={idx} className="bg-white/5 px-2 py-0.5 text-[8px] text-slate-500 font-fira border border-white/5">
          {tag}
        </span>
      ))}
    </div>
  </div>
);
