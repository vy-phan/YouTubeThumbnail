import React from 'react';
import { History, Trash2, ArrowRight, ExternalLink, Clock, FileJson, FileSpreadsheet } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onExportHistoryJSON: () => void;
  onExportHistoryCSV: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelect,
  onClear,
  onExportHistoryJSON,
  onExportHistoryCSV,
}) => {
  if (history.length === 0) return null;

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
          <History className="w-5 h-5 text-slate-600" />
          <h2>Lịch sử tra cứu gần đây</h2>
          <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full font-semibold border border-slate-200">
            {history.length}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <button
              onClick={onExportHistoryJSON}
              className="flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
              title="Xuất toàn bộ lịch sử ra file JSON"
            >
              <FileJson className="w-3.5 h-3.5 text-slate-600" />
              <span>Xuất JSON</span>
            </button>
            <button
              onClick={onExportHistoryCSV}
              className="flex items-center gap-1 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
              title="Xuất toàn bộ lịch sử ra file CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Xuất CSV</span>
            </button>
          </div>

          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-medium px-2.5 py-1.5 hover:bg-rose-50 rounded-lg transition-colors ml-auto sm:ml-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa lịch sử</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.map((item) => (
          <div
            key={item.id + item.extractedAt}
            onClick={() => onSelect(item)}
            className="group flex gap-3 p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl cursor-pointer transition-all hover:border-slate-300"
          >
            {/* Thumbnail preview */}
            <div className="w-24 aspect-video rounded-lg overflow-hidden bg-slate-900 shrink-0 relative">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>

            {/* Title & info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <p className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-red-700 transition-colors">
                {item.title}
              </p>

              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(item.extractedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
