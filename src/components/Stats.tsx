import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../translations';

export const Stats: React.FC = () => {
  const { language } = useLanguage();
  const stats = TRANSLATIONS[language].about.stats;

  return (
    <section className="bg-bg py-16 md:py-24 border-t border-stroke/40">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 divide-y md:divide-y-0 md:divide-x rtl:divide-y md:rtl:divide-x-reverse divide-stroke/50">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.8,
                delay: index * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className={`flex flex-col justify-between ${
                index !== 0 ? 'pt-8 md:pt-0 md:pl-10 md:rtl:pl-0 md:rtl:pr-10' : ''
              }`}
            >
              <div>
                <div className="text-5xl sm:text-6xl md:text-7xl font-display italic text-text-primary tracking-tight leading-none mb-3">
                  {item.value}
                </div>
                <h3 className="text-sm sm:text-base uppercase tracking-[0.15em] text-text-primary font-medium mb-2">
                  {item.label}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-xs">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
