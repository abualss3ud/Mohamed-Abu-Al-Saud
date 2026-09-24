import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../translations';

export interface JournalEntry {
  id: string;
  title: string;
  readTime: string;
  date: string;
  image: string;
  excerpt: string;
  content?: string[];
}

const JOURNAL_IMAGES = [
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=85',
];

interface JournalProps {
  onSelectEntry: (entry: JournalEntry) => void;
  onViewAllThoughts?: () => void;
}

export const Journal: React.FC<JournalProps> = ({
  onSelectEntry,
  onViewAllThoughts,
}) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language].journal;

  const entries: JournalEntry[] = t.entries.map((item, idx) => ({
    ...item,
    image: JOURNAL_IMAGES[idx],
  }));

  return (
    <section id="journal" className="bg-bg py-16 md:py-24 border-t border-stroke/40">
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

          {onViewAllThoughts && (
            <button
              onClick={onViewAllThoughts}
              className="hidden md:inline-flex group relative rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer focus:outline-none p-[1.5px]"
            >
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
                aria-hidden="true"
              />
              <span className="flex items-center gap-2 border border-stroke group-hover:border-transparent bg-surface rounded-full px-6 py-3 text-text-primary transition-all">
                <span>{t.viewAll}</span>
                <span className="text-xs rtl-flip group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </span>
            </button>
          )}
        </motion.div>

        {/* 4 journal entries */}
        <div className="flex flex-col gap-4">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              onClick={() => onSelectEntry(entry)}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 bg-surface/50 hover:bg-surface border border-stroke hover:border-stroke/80 rounded-2xl sm:rounded-full transition-all duration-300 cursor-pointer overflow-hidden shadow-sm"
            >
              {/* Left thumbnail & title */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden shrink-0 border border-stroke/50">
                  <img
                    src={entry.image}
                    alt={entry.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="min-w-0 pr-2 rtl:pr-0 rtl:pl-2">
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-text-primary group-hover:text-white transition-colors truncate">
                    {entry.title}
                  </h3>
                  <p className="text-xs text-muted mt-0.5 truncate hidden sm:block">
                    {entry.excerpt}
                  </p>
                </div>
              </div>

              {/* Right metadata & arrow */}
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 shrink-0 pt-2 sm:pt-0 border-t border-stroke/30 sm:border-t-0">
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted font-mono">
                  <span>{entry.readTime}</span>
                  <span>•</span>
                  <span>{entry.date}</span>
                </div>

                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-stroke group-hover:border-transparent group-hover:accent-gradient flex items-center justify-center text-text-primary transition-all duration-300 shrink-0">
                  <span className="text-xs rtl-arrow-diag group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                    ↗
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
