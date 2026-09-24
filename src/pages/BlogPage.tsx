import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { TRANSLATIONS } from '../translations';
import { JournalEntry } from '../components/Journal';
import { Search } from 'lucide-react';

interface BlogPageProps {
  onSelectJournalEntry: (entry: JournalEntry) => void;
}

const JOURNAL_IMAGES = [
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=85',
];

export const BlogPage: React.FC<BlogPageProps> = ({ onSelectJournalEntry }) => {
  const { language } = useLanguage();
  const { navigate } = useNavigation();
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language].journal;

  const [searchQuery, setSearchQuery] = useState('');

  const entries: JournalEntry[] = t.entries.map((item, idx) => ({
    ...item,
    image: JOURNAL_IMAGES[idx] || JOURNAL_IMAGES[0],
  }));

  const filteredEntries = entries.filter((entry) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.excerpt.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12 md:mb-16 max-w-3xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.25em] font-mono">
              {t.eyebrow}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl text-text-primary tracking-tight font-light leading-[1.08] mb-6">
            {t.headingMain}
            <span className="font-display italic text-text-primary">
              {t.headingItalic}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted leading-relaxed">
            {t.subtext}
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-md mb-12">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-muted absolute left-4 rtl:left-auto rtl:right-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في المقالات...' : 'Search articles & topics...'}
              className="w-full bg-surface border border-stroke focus:border-[#89AACC]/60 rounded-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-2.5 text-sm text-text-primary placeholder:text-muted/60 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Full Articles List */}
        <div className="flex flex-col gap-4 mb-20">
          {filteredEntries.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              onClick={() => onSelectJournalEntry(article)}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 bg-surface/60 hover:bg-surface border border-stroke hover:border-stroke/80 rounded-2xl sm:rounded-full transition-all duration-300 cursor-pointer overflow-hidden shadow-md"
            >
              {/* Left thumbnail & title */}
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden shrink-0 border border-stroke/50">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="min-w-0 pr-2 rtl:pr-0 rtl:pl-2">
                  <h2 className="text-base sm:text-lg md:text-xl font-medium text-text-primary group-hover:text-white transition-colors truncate">
                    {article.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted mt-1 truncate max-w-2xl">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Right metadata & arrow */}
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 shrink-0 pt-2 sm:pt-0 border-t border-stroke/30 sm:border-t-0">
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted font-mono">
                  <span>{article.readTime}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>

                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-stroke group-hover:border-transparent group-hover:accent-gradient flex items-center justify-center text-text-primary transition-all duration-300 shrink-0">
                  <span className="text-xs rtl-arrow-diag group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                    ↗
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl bg-surface border border-stroke p-8 sm:p-12 text-center flex flex-col items-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 accent-gradient opacity-5 pointer-events-none" />
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-muted mb-3">
            {isAr ? 'مشاركة الأفكار' : 'Tech Exchange'}
          </span>
          <h3 className="text-3xl sm:text-5xl font-display italic text-text-primary mb-4 font-normal">
            {isAr ? 'هل تود مناقشة موضوع تقني أو فكرة مقال؟' : 'Have a topic or idea to explore together?'}
          </h3>
          <p className="text-muted max-w-lg mb-8 text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'يسعدني دائماً التواصل وتبادل الخبرات المعمارية والنقاش حول أحدث تقنيات الويب.'
              : 'I enjoy discussing software architecture, developer experience, and frontend patterns. Let’s connect.'}
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="group relative rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer focus:outline-none p-[1.5px]"
          >
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
              aria-hidden="true"
            />
            <span className="flex items-center gap-2 border border-stroke group-hover:border-transparent bg-bg rounded-full px-8 py-3.5 text-text-primary transition-all shadow-md">
              <span>{isAr ? 'تواصل معي' : 'Say Hello'}</span>
              <span className="text-xs rtl-arrow-diag">↗</span>
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};
