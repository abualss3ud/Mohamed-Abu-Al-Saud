import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemTitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  itemTitle,
  onConfirm,
  onCancel,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={onCancel}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-surface border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
          >
            {/* Close Button */}
            <button
              onClick={onCancel}
              className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-muted hover:text-text-primary p-1 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="min-w-0 pr-6 rtl:pr-0 rtl:pl-6">
                <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
                <p className="text-xs text-muted leading-relaxed">{message}</p>
                {itemTitle && (
                  <div className="mt-2.5 px-3 py-1.5 rounded-xl bg-bg border border-stroke text-xs font-mono text-rose-300 truncate">
                    {itemTitle}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stroke/40">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-xs font-medium text-text-primary transition-colors cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-900/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isAr ? 'تأكيد الحذف' : 'Confirm Delete'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
