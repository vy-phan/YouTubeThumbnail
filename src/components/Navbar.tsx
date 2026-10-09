import React from 'react';
import { ExternalLink } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  hasData: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, hasData }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo and Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm group-hover:opacity-90 transition-opacity">
            <img src="/assets/ytb.png" alt="YouTube" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
            YouTube Thumbnail
          </h1>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasData && (
            <button
              onClick={onReset}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              Làm mới
            </button>
          )}

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
          >
            <span>Mở YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};
