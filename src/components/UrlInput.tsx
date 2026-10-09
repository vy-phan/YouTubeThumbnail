import React, { useState } from 'react';
import { Search, Clipboard, X, ArrowRight, AlertCircle, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UrlInputProps {
  onExtract: (url: string) => void;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}


export const UrlInput: React.FC<UrlInputProps> = ({
  onExtract,
  isLoading,
  error,
  onClearError,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus shortcut listener (Ctrl+K or '/')
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Focus search box on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onExtract(inputUrl.trim());
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputUrl(text.trim());
        onExtract(text.trim());
      }
    } catch {
      // If clipboard permission is blocked, focus the input
      const el = document.getElementById('youtube-url-input');
      if (el) el.focus();
    }
  };

  const handleClear = () => {
    setInputUrl('');
    onClearError();
  };

  const handleSampleClick = (url: string) => {
    setInputUrl(url);
    onExtract(url);
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor="youtube-url-input" className="block text-sm font-semibold text-slate-800">
          Nhập đường dẫn URL video YouTube
        </label>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <kbd className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">Ctrl + K</kbd>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef}
            id="youtube-url-input"
            type="text"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              if (error) onClearError();
            }}
            placeholder="Ví dụ: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className={`w-full pl-11 pr-28 sm:pr-36 py-3.5 bg-slate-50 text-slate-900 placeholder-slate-400 border text-sm sm:text-base rounded-xl focus:outline-none transition-all ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                : 'border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-100'
            }`}
          />

          <div className="absolute right-2 flex items-center gap-1">
            {inputUrl && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                title="Xóa ô nhập"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handlePaste}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
              title="Dán từ bộ nhớ tạm"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Dán</span>
            </button>

            <button
              type="submit"
              disabled={isLoading || !inputUrl.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-medium text-sm rounded-lg transition-colors shadow-sm disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Lấy dữ liệu</span>
                  <kbd className="hidden md:inline-block px-1 py-0.2 text-[10px] bg-red-700 text-red-100 rounded font-mono group-hover:bg-red-800">
                    ↵ Enter
                  </kbd>
                  <ArrowRight className="w-4 h-4 md:hidden" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Progress Bar */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1.5 overflow-hidden pt-1"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                <span className="flex items-center gap-1.5 text-red-600 font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                  </span>
                  Đang phân tích & trích xuất metadata video...
                </span>
                <span className="font-mono text-[11px] text-slate-400">Loading...</span>
              </div>

              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 via-rose-500 to-red-600 rounded-full"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: 'easeInOut',
                  }}
                  style={{ width: '60%' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error notification */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="flex-1">{error}</span>
            <button
              type="button"
              onClick={onClearError}
              className="text-rose-600 hover:text-rose-800 text-xs font-semibold underline"
            >
              Đóng
            </button>
          </div>
        )}
      </form>

    </div>
  );
};
