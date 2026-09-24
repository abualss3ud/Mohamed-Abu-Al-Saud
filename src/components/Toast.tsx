import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = usePortfolio();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isDestructive = toast.type === 'destructive';

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            role="status"
            className="pointer-events-auto flex items-center justify-between p-4 bg-[#151A1D] border border-[#302C28] rounded-[8px] text-[#F3ECE3] text-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-opacity duration-200"
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#3F6E4E] shrink-0" strokeWidth={1.5} />}
              {isWarning && <AlertCircle className="w-4 h-4 text-[#C08B3E] shrink-0" strokeWidth={1.5} />}
              {isDestructive && <AlertCircle className="w-4 h-4 text-[#A84B42] shrink-0" strokeWidth={1.5} />}
              {!isSuccess && !isWarning && !isDestructive && (
                <Info className="w-4 h-4 text-[#C4875B] shrink-0" strokeWidth={1.5} />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              id={`close-toast-${toast.id}`}
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
              className="text-[#827970] hover:text-[#F3ECE3] ml-3 transition-colors duration-150"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
