import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { ProjectItem } from './SelectedWorks';
import { useLanguage } from '../context/LanguageContext';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {project && (
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
            className="relative w-full max-w-4xl bg-surface border border-stroke rounded-3xl overflow-hidden shadow-2xl z-10 my-auto max-h-[90vh] flex flex-col cursor-default"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stroke bg-surface/85 backdrop-blur-sm sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-mono tracking-widest text-muted">
                  {isAr ? 'تفاصيل المشروع' : 'Case Study'}
                </span>
                <span className="text-muted/40">•</span>
                <span className="text-xs text-muted font-mono">{project.year}</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stroke/40 hover:bg-stroke text-muted hover:text-text-primary flex items-center justify-center transition-colors text-sm cursor-pointer"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 sm:p-10 space-y-8">
              {/* Hero Imagery */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-stroke shadow-xl">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted block mb-2">
                    {project.category}
                  </span>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display italic text-text-primary font-semibold">
                    {project.title}
                  </h2>
                </div>
              </div>

              {/* Specs & Client Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-stroke/60 text-xs">
                <div>
                  <span className="text-muted block uppercase tracking-wider mb-1 font-mono">
                    {isAr ? 'العميل / المشروع' : 'Client'}
                  </span>
                  <span className="text-text-primary font-medium">{project.client}</span>
                </div>
                <div>
                  <span className="text-muted block uppercase tracking-wider mb-1 font-mono">
                    {isAr ? 'السنة' : 'Year'}
                  </span>
                  <span className="text-text-primary font-medium font-mono">{project.year}</span>
                </div>
                <div>
                  <span className="text-muted block uppercase tracking-wider mb-1 font-mono">
                    {isAr ? 'المجال' : 'Discipline'}
                  </span>
                  <span className="text-text-primary font-medium">Full-Stack &amp; UI/UX</span>
                </div>
                <div>
                  <span className="text-muted block uppercase tracking-wider mb-1 font-mono">
                    {isAr ? 'الحالة' : 'Status'}
                  </span>
                  <span className="text-[#89AACC] font-medium">
                    {project.stats || (isAr ? 'مكتمل وجاهز للإنتاج' : 'Production Ready')}
                  </span>
                </div>
              </div>

              {/* Narrative Content */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-muted font-mono font-medium">
                  {isAr ? 'فكرة ونطاق العمل' : 'Concept & Scope'}
                </h3>
                <p className="text-text-primary/90 leading-relaxed text-sm sm:text-base">
                  {project.summary}
                </p>
                <p className="text-text-primary/75 leading-relaxed text-xs sm:text-sm">
                  {isAr
                    ? 'تم الالتزام بأعلى معايير جودة الكود، وتنظيم المعمارية البرمجية إلى مكونات معيارية قابلة لإعادة الاستخدام، وتحقيق أقصى درجات التوافق مع مختلف أحجام الشاشات وتجربة الاستخدام السريعة.'
                    : 'Engineered with modular architectural patterns, full responsive fluid layout systems, strict type safety, and optimized load times across desktop and mobile devices.'}
                </p>
              </div>

              {/* Tech Stack Tags */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-muted font-mono font-medium mb-3">
                  {isAr ? 'التقنيات المستخدمة' : 'Technologies Used'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-stroke/30 text-xs text-text-primary border border-stroke font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Card */}
              <div className="p-6 rounded-2xl bg-surface/80 border border-stroke flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">
                    {isAr ? 'مشاركة رابط المشروع' : 'Project Showcase'}
                  </h4>
                  <p className="text-xs text-muted mt-0.5">
                    {isAr
                      ? 'يمكنك نسخ الرابط أو الاطلاع على تفاصيل الكود والواجهات'
                      : 'Copy link or review architecture details.'}
                  </p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="group relative rounded-full text-xs uppercase tracking-[0.2em] font-medium cursor-pointer p-[1.5px] transition-all duration-300 hover:scale-[1.03]"
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
                    aria-hidden="true"
                  />
                  <span className="flex items-center gap-2 bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary rounded-full px-6 py-3 transition-colors">
                    <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy Link')}</span>
                    <span className="text-xs">📋</span>
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
