import React from 'react';
import { CheckCircle } from 'lucide-react';

export const FormatGuide: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3 text-xs text-slate-600">
      <h3 className="font-bold text-slate-800 text-sm">Định dạng URL hỗ trợ</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 font-mono text-[11px]">
        <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5 border border-slate-100">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>youtube.com/watch?v=...</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5 border border-slate-100">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>youtu.be/... (Rút gọn)</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5 border border-slate-100">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>youtube.com/shorts/...</span>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg flex items-center gap-1.5 border border-slate-100">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>music.youtube.com/...</span>
        </div>
      </div>
    </div>
  );
};
