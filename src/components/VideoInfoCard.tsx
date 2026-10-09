import React from 'react';
import { Copy, ExternalLink, User, Check, Hash, Clock, Tag, Type, Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { VideoData } from '../types';

interface VideoInfoCardProps {
  videoData: VideoData;
  onCopyTitle: () => void;
  copiedTitle: boolean;
  onExportJSON: () => void;
  onExportCSV: () => void;
}

export const VideoInfoCard: React.FC<VideoInfoCardProps> = ({
  videoData,
  onCopyTitle,
  copiedTitle,
  onExportJSON,
  onExportCSV,
}) => {
  const typeColors = {
    Standard: 'bg-slate-100 text-slate-700 border-slate-200',
    Shorts: 'bg-red-50 text-red-700 border-red-200',
    Live: 'bg-rose-50 text-rose-700 border-rose-200',
    Music: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  const currentType = videoData.videoType || 'Standard';

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5 transition-all">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
        <div className="space-y-3 flex-1">
          {/* Metadata Badges Row */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Video ID */}
            <span className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-mono font-medium border border-slate-200">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              ID: {videoData.id}
            </span>

            {/* Video Format Type */}
            <span
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium border ${typeColors[currentType]}`}
            >
              <Tag className="w-3.5 h-3.5" />
              Loại: {currentType}
            </span>

            {/* Author */}
            {videoData.author && (
              <span className="flex items-center gap-1 bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-medium border border-slate-200">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Kênh: {videoData.author}
              </span>
            )}

            {/* Title Reading Time Utility */}
            {videoData.estimatedReadingTime && !videoData.isLoadingTitle && (
              <span
                className="flex items-center gap-1 bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg font-medium border border-slate-200"
                title="Ước tính thời gian cần để đọc hết tiêu đề"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {videoData.estimatedReadingTime}
              </span>
            )}
          </div>

          {/* Title Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tiêu đề video YouTube chính thức
              </span>
              {!videoData.isLoadingTitle && (
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Type className="w-3 h-3" />
                  {videoData.title.length} ký tự
                </span>
              )}
            </div>

            {videoData.isLoadingTitle ? (
              <div className="h-8 bg-slate-100 rounded-xl animate-pulse w-3/4" />
            ) : (
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug tracking-tight">
                {videoData.title}
              </h2>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2.5 shrink-0 pt-1">
          <button
            onClick={onCopyTitle}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm border ${
              copiedTitle
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-900 active:scale-[0.98]'
            }`}
          >
            {copiedTitle ? (
              <>
                <Check className="w-4 h-4" />
                <span>Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Sao chép tiêu đề</span>
              </>
            )}
          </button>

          <a
            href={videoData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-sm"
          >
            <img src="/assets/ytb.png" alt="YouTube" className="w-4 h-4 object-contain" />
            <span>Xem trên YouTube</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {/* Export Options */}
          <div className="flex items-center gap-1.5 w-full pt-1 border-t border-slate-100">
            <span className="text-[11px] font-medium text-slate-400 mr-1 hidden sm:inline">Xuất dữ liệu:</span>
            <button
              onClick={onExportJSON}
              className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
              title="Xuất metadata & link thumbnails ra file JSON"
            >
              <FileJson className="w-3.5 h-3.5 text-slate-600" />
              <span>JSON</span>
            </button>
            <button
              onClick={onExportCSV}
              className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
              title="Xuất metadata & link thumbnails ra file CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
