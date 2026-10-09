import React, { useState } from 'react';
import { Download, Copy, Check, Eye, Link2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { ThumbnailOption } from '../types';

interface ThumbnailCardProps {
  thumbnail: ThumbnailOption;
  videoId: string;
  videoTitle: string;
  onDownload: (url: string, filename: string) => void;
  onCopyImage: (url: string) => void;
  onCopyUrl: (url: string) => void;
  onPreview: (thumbnail: ThumbnailOption) => void;
  isPrimary?: boolean;
}

export const ThumbnailCard: React.FC<ThumbnailCardProps> = ({
  thumbnail,
  videoId,
  videoTitle,
  onDownload,
  onCopyImage,
  onCopyUrl,
  onPreview,
  isPrimary = false,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopyUrl = () => {
    onCopyUrl(thumbnail.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyImage = () => {
    onCopyImage(thumbnail.url);
    setCopiedImage(true);
    setTimeout(() => setCopiedImage(false), 2000);
  };

  const filename = `youtube_${videoId}_${thumbnail.quality}.jpg`;

  return (
    <div
      className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-sm ${
        isPrimary
          ? 'border-slate-800 ring-2 ring-slate-800/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Thumbnail Header Info */}
      <div className="p-4 pb-3 flex items-center justify-between gap-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-sm">{thumbnail.label}</h3>
            {isPrimary && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white rounded">
                Khuyên dùng
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{thumbnail.recommendedFor}</p>
        </div>
        <span className="shrink-0 px-2.5 py-1 text-xs font-mono font-semibold bg-slate-100 text-slate-700 rounded-md border border-slate-200">
          {thumbnail.resolution}
        </span>
      </div>

      {/* Image Preview Box */}
      <div className="relative group bg-slate-950 aspect-video flex items-center justify-center overflow-hidden">
        {imgError ? (
          <div className="p-6 text-center text-slate-400 space-y-2">
            <ImageIcon className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-xs">Chất lượng này không khả dụng cho video này</p>
            <p className="text-[11px] text-slate-500">Vui lòng chọn độ phân giải HD hoặc thấp hơn</p>
          </div>
        ) : (
          <>
            <img
              src={thumbnail.url}
              alt={`${videoTitle} - ${thumbnail.label}`}
              onError={() => setImgError(true)}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            {/* Hover overlay for quick actions */}
            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
              <button
                onClick={() => onPreview(thumbnail)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-slate-900 font-semibold text-xs rounded-xl shadow hover:bg-slate-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Xem lớn</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-slate-50/50 space-y-2 border-t border-slate-100">
        <button
          onClick={() => onDownload(thumbnail.url, filename)}
          disabled={imgError}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 font-semibold text-sm rounded-xl transition-colors shadow-sm ${
            isPrimary
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Download className="w-4 h-4" />
          <span>Tải về máy ({thumbnail.resolution.split(' ')[0]}p)</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopyImage}
            disabled={imgError}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-lg border border-slate-200 transition-colors disabled:opacity-50"
            title="Sao chép hình ảnh vào bộ nhớ tạm"
          >
            {copiedImage ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Chép ảnh</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyUrl}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-lg border border-slate-200 transition-colors"
            title="Sao chép đường dẫn hình ảnh"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Đã chép</span>
              </>
            ) : (
              <>
                <Link2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Chép Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
