import React from 'react';
import { useApp } from '../AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500" />;
      default:
        return <Info className="w-5 h-5 text-teal-500" />;
    }
  };

  const getBgClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-emerald-500 bg-white dark:bg-slate-900 shadow-xl';
      case 'warning':
        return 'border-l-4 border-amber-500 bg-white dark:bg-slate-900 shadow-xl';
      case 'error':
        return 'border-l-4 border-rose-500 bg-white dark:bg-slate-900 shadow-xl';
      default:
        return 'border-l-4 border-teal-500 bg-white dark:bg-slate-900 shadow-xl';
    }
  };

  return (
    <div id="toast-root" className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            layout
            className={`p-4 rounded-lg shadow-lg flex items-start gap-3 pointer-events-auto border border-gray-100 dark:border-slate-800 transition-all ${getBgClass(toast.type)}`}
          >
            <div className="mt-0.5 flex-shrink-0">{getIcon(toast.type)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {toast.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-normal">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
