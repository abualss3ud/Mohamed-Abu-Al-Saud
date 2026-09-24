import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { JournalEntry } from './Journal';
import { useLanguage } from '../context/LanguageContext';

interface ArticleModalProps {
  entry: JournalEntry | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ entry, onClose }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (entry) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [entry, onClose]);

  return (
    <AnimatePresence>
      {entry && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={onClose}
          className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto cursor-zoom-out"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md -z-10"
          />

          {/* Floating prominent Top-Corner Close Button */}
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="fixed top-4 right-4 rtl:right-auto rtl:left-4 z-[10000] flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 backdrop-blur-xl shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-xs sm:text-sm font-medium"
            title={isAr ? 'إغلاق (Esc)' : 'Close (Esc)'}
            aria-label={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
            <span>{isAr ? 'إغلاق (Esc)' : 'Close (Esc)'}</span>
          </motion.button>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-surface border border-stroke rounded-3xl overflow-hidden shadow-2xl z-10 my-auto max-h-[90vh] flex flex-col cursor-default"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stroke bg-surface/85 backdrop-blur-sm sticky top-0 z-20">
              <div className="flex items-center gap-3 text-xs font-mono text-muted">
                <span>{entry.readTime}</span>
                <span>•</span>
                <span>{entry.date}</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stroke/40 hover:bg-stroke text-muted hover:text-text-primary flex items-center justify-center transition-colors text-sm cursor-pointer"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                ✕
              </button>
            </div>

            {/* Content Area */}
            <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
              <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-stroke mb-6">
                <img
                  src={entry.image}
                  alt={entry.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-transparent to-transparent" />
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display italic text-text-primary leading-tight font-semibold">
                {entry.title}
              </h2>

              <p className="text-base text-text-primary/90 font-medium italic border-l-2 border-[#4E85BF] pl-4 my-6 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
                &ldquo;{entry.excerpt}&rdquo;
              </p>

              <div className="space-y-4 text-text-primary/80 leading-relaxed text-sm sm:text-base">
                {entry.content && entry.content.length > 0 ? (
                  entry.content.map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                ) : (
                  <p>{entry.excerpt}</p>
                )}
              </div>

              <div className="pt-8 border-t border-stroke flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-mono text-muted">
                  {isAr
                    ? 'كتابة: محمد أبو السعود · Full-Stack & UI/UX'
                    : 'Written by Mohamed Abu Al-Saud · Full-Stack & UI/UX'}
                </span>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-full bg-stroke/40 hover:bg-stroke text-text-primary text-xs font-medium transition-colors cursor-pointer"
                >
                  {isAr ? 'إغلاق المقال' : 'Close Article'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
