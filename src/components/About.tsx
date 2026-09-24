import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../translations';

interface AboutProps {
  onOpenResume?: () => void;
  onOpenContact?: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenResume, onOpenContact }) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language].about;

  return (
    <section id="about" className="bg-bg py-16 md:py-24 border-t border-stroke/40">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait and visual card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-surface border border-stroke shadow-2xl group">
              <img
                src="https://res.cloudinary.com/oe19gniu/image/upload/v1790271150/WhatsApp_Image_2026-09-22_at_5.36.09_PM.jpg"
                alt={language === 'ar' ? 'محمد أبو السعود' : 'Mohamed Abu Al-Saud'}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              />
              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-85" />

              <div className="absolute bottom-6 inset-x-6">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted block mb-1">
                  {language === 'ar' ? 'مطور Full-Stack & مصمم UI/UX' : 'Full-Stack Developer & UI/UX'}
                </span>
                <div className="text-2xl sm:text-3xl font-display italic text-text-primary font-semibold">
                  {language === 'ar' ? 'محمد أبو السعود' : 'Mohamed Abu Al-Saud'}
                </div>
              </div>
            </div>

            {/* Accent location badge */}
            <div className="absolute -bottom-3 -right-3 rtl:-right-auto rtl:-left-3 p-[1.5px] rounded-2xl accent-gradient shadow-xl hidden sm:block">
              <div className="bg-bg px-4 py-2 rounded-2xl flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-text-primary font-medium font-mono">
                  {language === 'ar' ? 'قنا، مصر' : 'Qena, Egypt'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio & Narrative */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.25em] font-medium">
                {t.eyebrow}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight font-light mb-6 leading-tight">
              {t.headingMain}
              <span className="font-display italic text-text-primary">
                {t.headingItalic}
              </span>
            </h2>

            <p className="text-base sm:text-lg text-text-primary/90 font-light leading-relaxed mb-4">
              {t.bio1}
            </p>

            <p className="text-sm sm:text-base text-muted leading-relaxed mb-8">
              {t.bio2}
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-stroke/40">
              {onOpenResume && (
                <button
                  onClick={onOpenResume}
                  className="group relative rounded-full text-xs uppercase tracking-[0.2em] font-medium cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] p-[1.5px]"
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
                    aria-hidden="true"
                  />
                  <span className="flex items-center gap-2 bg-surface border border-stroke group-hover:border-transparent rounded-full px-6 py-3 text-text-primary transition-all">
                    <span>{language === 'ar' ? 'السيرة الذاتية' : 'Curriculum Vitae'}</span>
                    <span className="rtl-arrow-diag">↗</span>
                  </span>
                </button>
              )}

              {onOpenContact && (
                <button
                  onClick={onOpenContact}
                  className="text-xs uppercase tracking-[0.2em] text-muted hover:text-text-primary px-4 py-3 rounded-full hover:bg-surface/50 transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'ابدأ مشروعاً' : 'Start a Project'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
