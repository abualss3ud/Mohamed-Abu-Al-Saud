import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../translations';

export const Services: React.FC = () => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language].services;

  return (
    <section id="services" className="bg-bg py-16 md:py-24 border-t border-stroke/40">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.25em] font-medium">
                {t.eyebrow}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight font-light leading-tight">
              {t.headingMain}
              <span className="font-display italic text-text-primary">
                {t.headingItalic}
              </span>
            </h2>

            <p className="text-sm md:text-base text-muted mt-3 max-w-lg leading-relaxed">
              {t.subtext}
            </p>
          </div>
        </motion.div>

        {/* Services Grid (4 items) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.items.map((service, index) => (
            <motion.div
              key={service.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.7,
                delay: index * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group relative bg-surface border border-stroke hover:border-stroke/80 rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg"
            >
              {/* Ambient gradient line on top border on hover */}
              <div
                className="absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient"
                aria-hidden="true"
              />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl md:text-3xl font-display italic text-muted/60 group-hover:text-text-primary transition-colors font-light">
                    {service.num}
                  </span>
                  <div className="w-8 h-8 rounded-full border border-stroke group-hover:border-transparent group-hover:accent-gradient flex items-center justify-center text-text-primary transition-all duration-300">
                    <span className="text-xs rtl-arrow-diag group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      ↗
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono uppercase tracking-wider text-muted block mb-2">
                  {service.subtitle}
                </span>

                <h3 className="text-xl sm:text-2xl font-light text-text-primary mb-3 group-hover:text-white transition-colors leading-snug">
                  {service.title}
                </h3>

                <p className="text-sm text-muted leading-relaxed mb-6">
                  {service.desc}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-stroke/40">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-stroke/30 text-text-primary/80 border border-stroke/50 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
