import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-full max-w-3xl bg-surface border border-stroke rounded-3xl p-6 sm:p-10 shadow-2xl z-10 my-auto max-h-[90vh] overflow-y-auto text-text-primary"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b border-stroke gap-4">
              <div>
                <span className="text-xs text-muted uppercase tracking-[0.25em] font-mono block mb-1">
                  {isAr ? 'السيرة الذاتية المهنية' : 'Curriculum Vitae'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-display italic text-text-primary font-semibold">
                  {isAr ? 'محمد أبو السعود' : 'Mohamed Abu Al-Saud'}
                </h2>
                <p className="text-xs sm:text-sm text-muted mt-1 font-medium leading-relaxed">
                  {isAr
                    ? 'مطور Full-Stack JavaScript | مصمم واجهات وتجربة مستخدم (UI/UX) · قنا، مصر'
                    : 'Full-Stack JavaScript Developer | UI/UX Designer · Qena, Egypt'}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs font-mono text-[#89AACC]">
                  <a href="mailto:abualss3ud@gmail.com" className="hover:underline">
                    abualss3ud@gmail.com
                  </a>
                  <span>•</span>
                  <span>📍 {isAr ? 'قنا، مصر' : 'Qena, Egypt'}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stroke/40 hover:bg-stroke text-muted hover:text-text-primary flex items-center justify-center transition-colors cursor-pointer text-base shrink-0"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="py-6 space-y-8 text-sm">
              {/* Profile Summary */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-muted mb-2 font-medium font-mono">
                  {isAr ? 'الملف المهني' : 'Professional Profile'}
                </h3>
                <p className="text-text-primary/90 leading-relaxed text-xs sm:text-sm">
                  {isAr
                    ? 'مطور Full-Stack JavaScript متخصص في بناء تطبيقات ويب حديثة وقابلة للتوسع باستخدام تقنيات JavaScript الحديثة. أعمل على تطوير حلول متكاملة تبدأ من تصميم واجهة المستخدم وتجربة الاستخدام (UI/UX)، مروراً ببناء واجهات Front-End تفاعلية، وتطوير Back-End وREST APIs، وصولاً إلى قواعد البيانات والمصادقة والاختبار والنشر السحابي.'
                    : 'Full-Stack JavaScript Developer specialized in engineering modern, scalable web applications with modern JS/TS ecosystems. Covering the full delivery cycle from UI/UX wireframing and responsive front-ends, to RESTful APIs, relational databases, authentication, testing, and cloud deployment.'}
                </p>
              </div>

              {/* Technical Skills */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-muted mb-4 font-medium font-mono">
                  {isAr ? 'المهارات والتقنيات الأساسية' : 'Technical Skills'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-bg border border-stroke/60">
                    <h4 className="text-xs font-mono text-[#89AACC] uppercase mb-2 font-semibold">
                      Front-End &amp; UI
                    </h4>
                    <p className="text-xs text-muted leading-relaxed">
                      React, Next.js, TypeScript, JavaScript, Tailwind CSS, HTML5, CSS3, Responsive Web Architecture.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-bg border border-stroke/60">
                    <h4 className="text-xs font-mono text-[#89AACC] uppercase mb-2 font-semibold">
                      Back-End &amp; Database
                    </h4>
                    <p className="text-xs text-muted leading-relaxed">
                      Node.js, Express.js, REST APIs, Authentication &amp; JWT, PostgreSQL, Prisma ORM.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-bg border border-stroke/60">
                    <h4 className="text-xs font-mono text-[#89AACC] uppercase mb-2 font-semibold">
                      UI/UX Design
                    </h4>
                    <p className="text-xs text-muted leading-relaxed">
                      Figma, Adobe Photoshop, Illustrator, InDesign, Wireframing, Design Systems, Typography &amp; Color Systems.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-bg border border-stroke/60">
                    <h4 className="text-xs font-mono text-[#89AACC] uppercase mb-2 font-semibold">
                      DevOps &amp; Workflow
                    </h4>
                    <p className="text-xs text-muted leading-relaxed">
                      Docker, CI/CD, Git, GitHub, Automated Testing &amp; Debugging, Cloud Production Deployment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Projects */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-muted mb-4 font-medium font-mono">
                  {isAr ? 'أبرز المشاريع المنفذة' : 'Selected Projects'}
                </h3>
                <div className="space-y-4">
                  <div className="border-l-2 rtl:border-l-0 rtl:border-r-2 border-stroke pl-4 rtl:pl-0 rtl:pr-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-sm font-medium text-text-primary">
                        DevRopix — Software Company Platform
                      </h4>
                      <span className="text-xs font-mono text-muted">Full-Stack App</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {isAr
                        ? 'منصة رقمية متكاملة لشركة برمجيات تدعم العربية والإنجليزية وRTL مع لوحة تحكم إدارية ومصادقة وقاعدة بيانات PostgreSQL عبر Prisma.'
                        : 'Full-stack platform with bilingual AR/EN support, RTL layout, admin CMS, authentication, and PostgreSQL database via Prisma.'}
                    </p>
                  </div>

                  <div className="border-l-2 rtl:border-l-0 rtl:border-r-2 border-stroke pl-4 rtl:pl-0 rtl:pr-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-sm font-medium text-text-primary">
                        Foodi — Restaurant Web Application
                      </h4>
                      <span className="text-xs font-mono text-muted">Front-End App</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {isAr
                        ? 'تطبيق ويب لمطعم بتصميم عصري ومتجاوب بالكامل، مكونات UI قابلة لإعادة الاستخدام واهتمام فائق بالتايبوغرافي والمسافات.'
                        : 'Modern restaurant web app emphasizing modular UI components, semantic HTML, responsive layout, and refined typography.'}
                    </p>
                  </div>

                  <div className="border-l-2 rtl:border-l-0 rtl:border-r-2 border-stroke pl-4 rtl:pl-0 rtl:pr-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-sm font-medium text-text-primary">
                        Personal Portfolio &amp; CMS
                      </h4>
                      <span className="text-xs font-mono text-muted">Full-Stack</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {isAr
                        ? 'موقع شخصي لعرض المهارات والمشاريع والخدمات مع نظام إدارة محتوى وبنية مهيأة لمحركات البحث SEO والنشر السحابي.'
                        : 'Custom portfolio web platform engineered with Next.js, TypeScript, and Prisma with automated deployment workflows.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Education & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-bg border border-stroke/60">
                  <h4 className="text-xs font-mono text-muted uppercase mb-1">
                    {isAr ? 'التعليم الأكاديمي' : 'Education'}
                  </h4>
                  <div className="text-sm font-medium text-text-primary">
                    {isAr ? 'نظم المعلومات (Information Systems)' : 'Information Systems'}
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    {isAr
                      ? 'دراسة نظم المعلومات والبرمجة وتطوير الأنظمة وقواعد البيانات وبناء الحلول الرقمية.'
                      : 'Specialized study in systems development, databases, programming, and digital architectures.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-bg border border-stroke/60">
                  <h4 className="text-xs font-mono text-muted uppercase mb-1">
                    {isAr ? 'اللغات' : 'Languages'}
                  </h4>
                  <div className="text-xs text-text-primary space-y-1 mt-2">
                    <div className="flex justify-between">
                      <span>{isAr ? 'العربية' : 'Arabic'}:</span>
                      <span className="text-muted">{isAr ? 'اللغة الأم (Native)' : 'Native'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isAr ? 'الإنجليزية' : 'English'}:</span>
                      <span className="text-muted">{isAr ? 'مستوى مهني وتقني' : 'Professional Working'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="pt-6 border-t border-stroke flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-muted font-mono">
                {isAr ? 'مُحدّث ٢٠٢٦ · محمد أبو السعود' : 'Updated 2026 · Mohamed Abu Al-Saud'}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-full border border-stroke text-xs text-text-primary hover:bg-stroke/40 transition-colors cursor-pointer"
                >
                  {isAr ? 'طباعة / PDF' : 'Print / PDF'}
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-full bg-text-primary text-bg font-medium text-xs hover:bg-white transition-colors cursor-pointer"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
