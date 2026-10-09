import React from 'react';
import { X, Download, Copy, ExternalLink, Check } from 'lucide-react';
import { ThumbnailOption } from '../types';

interface ThumbnailModalProps {
  thumbnail: ThumbnailOption | null;
  videoId: string;
  videoTitle: string;
  onClose: () => void;
  onDownload: (url: string, filename: string) => void;
  onCopyImage: (url: string) => void;
}

export const ThumbnailModal: React.FC<ThumbnailModalProps> = ({
  thumbnail,
  videoId,
  videoTitle,
  onClose,
  onDownload,
  onCopyImage,
}) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!thumbnail) return null;

  const filename = `youtube_${videoId}_${thumbnail.quality}.jpg`;

  const handleCopy = () => {
    onCopyImage(thumbnail.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 bg-slate-900">
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg line-clamp-1">
              {videoTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {thumbnail.label} • Độ phân giải {thumbnail.resolution}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
              Esc
            </span>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Đóng (phím Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display */}
        <div className="flex-1 bg-black p-4 flex items-center justify-center overflow-auto min-h-[250px]">
          <img
            src={thumbnail.url}
            alt={videoTitle}
            className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono">
            URL: <span className="text-slate-300 select-all">{thumbnail.url}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-xl transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép ảnh'}</span>
            </button>

            <button
              onClick={() => onDownload(thumbnail.url, filename)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors shadow"
            >
              <Download className="w-4 h-4" />
              <span>Tải về ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
