import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const bgColors = {
    success: 'bg-emerald-800 text-emerald-50 border-emerald-700',
    error: 'bg-rose-800 text-rose-50 border-rose-700',
    info: 'bg-slate-800 text-slate-50 border-slate-700',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-300 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short max-w-sm">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${bgColors[toast.type]} font-medium text-sm`}
      >
        {icons[toast.type]}
        <span className="flex-1">{toast.message}</span>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-white/10 transition-colors text-white/80 hover:text-white"
          aria-label="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
