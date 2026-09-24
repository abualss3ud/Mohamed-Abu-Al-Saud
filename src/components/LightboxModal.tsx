import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink } from 'lucide-react';
import { ExplorationItem } from './Explorations';
import { useLanguage } from '../context/LanguageContext';

interface LightboxModalProps {
  item: ExplorationItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (item) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [item, onClose]);

  const displayTitle = (isAr ? item?.titleAr : item?.titleEn) || item?.title || '';
  const displayMedium = (isAr ? item?.mediumAr : item?.mediumEn) || item?.medium || '';
  const displayDesc = (isAr ? item?.descAr : item?.descEn) || item?.desc || '';

  return (
    <AnimatePresence>
      {item && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={displayTitle}
          onClick={onClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 md:p-10 overflow-y-auto cursor-zoom-out"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md -z-10"
          />

          {/* Clean Floating Close Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="fixed top-4 right-4 rtl:right-auto rtl:left-4 z-[10000] p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg"
            title={isAr ? 'إغلاق (Esc)' : 'Close (Esc)'}
            aria-label={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-surface border border-stroke rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[90vh] cursor-default"
          >
            {/* Top Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-stroke bg-surface/95 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#89AACC] shrink-0" />
                <span className="text-xs font-mono text-muted uppercase tracking-wider truncate">
                  {displayMedium}
                </span>
              </div>

              {/* In-Card Close Button */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stroke/50 hover:bg-stroke text-text-primary flex items-center justify-center transition-all duration-200 cursor-pointer"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Canvas */}
            <div className="relative w-full max-h-[50vh] min-h-[240px] bg-black/80 flex items-center justify-center overflow-hidden">
              <img
                src={item.image}
                alt={displayTitle}
                className="w-full h-full max-h-[50vh] object-contain sm:object-cover"
              />
            </div>

            {/* Card Content & Action Buttons */}
            <div className="p-5 sm:p-6 bg-surface border-t border-stroke flex flex-col gap-4 shrink-0">
              <div>
                <h3 className="text-lg sm:text-xl font-display italic text-text-primary">
                  {displayTitle}
                </h3>
                {displayDesc && (
                  <p className="text-xs sm:text-sm text-muted mt-1.5 leading-relaxed">
                    {displayDesc}
                  </p>
                )}
              </div>

              {/* External Links Bar: GitHub Code & Live Demo */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-stroke/40">
                <a
                  href={item.githubUrl || 'https://github.com/abualss3ud'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                  <span>{isAr ? 'عرض الكود على GitHub' : 'View Code on GitHub'}</span>
                </a>

                <a
                  href={item.demoUrl || item.githubUrl || 'https://github.com/abualss3ud'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-text-primary text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isAr ? 'المعاينة الحية' : 'Live Interactive Demo'}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
