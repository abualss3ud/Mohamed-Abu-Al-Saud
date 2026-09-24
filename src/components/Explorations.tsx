import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Sparkles, Github, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';
import { TRANSLATIONS } from '../translations';
import { PrototypeItem } from '../types';

export type ExplorationItem = PrototypeItem;

export { initialPrototypes as EXPLORATIONS } from '../data/initialData';

interface ExplorationsProps {
  onOpenLightbox: (item: any) => void;
  embedded?: boolean;
}

export const Explorations: React.FC<ExplorationsProps> = ({
  onOpenLightbox,
  embedded = false,
}) => {
  const { language } = useLanguage();
  const { prototypes } = usePortfolio();
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language].explorations;

  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: isAr ? 'جميع التجارب' : 'All Experiments' },
    { id: 'shader', label: isAr ? 'الشيدرز والويب GLSL' : 'Shaders & WebGL' },
    { id: '3d', label: isAr ? 'العوالم ثلاثية الأبعاد' : '3D & Procedural' },
    { id: 'generative', label: isAr ? 'التصاميم التوليدية' : 'Generative' },
    { id: 'frontend', label: isAr ? 'واجهات وتجارب UI' : 'Front-End UI' },
    { id: 'interactive', label: isAr ? 'نماذج تفاعلية' : 'Interactive Labs' },
  ];

  const publishedPrototypes = prototypes.filter((p) => (p.status || 'published') === 'published');

  const filteredItems = publishedPrototypes.filter(
    (item) => activeFilter === 'all' || item.category === activeFilter
  );

  const content = (
    <>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6"
      >
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs text-muted uppercase tracking-[0.25em] font-medium font-mono">
              {t.eyebrow}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight font-light leading-tight">
            {t.headingMain}
            <span className="font-display italic text-text-primary">
              {t.headingItalic}
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-sm md:text-base text-muted mt-3 max-w-xl leading-relaxed">
            {t.subtext}
          </p>
        </div>

        {/* GitHub Action Button */}
        <a
          href="https://github.com/abualss3ud"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex group relative rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer focus:outline-none p-[1.5px] shrink-0 self-start md:self-auto"
        >
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
            aria-hidden="true"
          />
          <span className="flex items-center gap-2.5 border border-stroke group-hover:border-transparent bg-surface rounded-full px-6 py-3 text-text-primary transition-all shadow-sm">
            <Github className="w-4 h-4 text-[#89AACC]" />
            <span>{isAr ? 'عرض الكود على GitHub' : 'View Code on GitHub'}</span>
            <span className="text-xs rtl-arrow-diag group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
              ↗
            </span>
          </span>
        </a>
      </motion.div>

      {/* Filter Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-mono transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-text-primary text-bg font-medium shadow-md'
                  : 'bg-surface/80 text-muted hover:text-text-primary hover:bg-surface border border-stroke/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Responsive Showcase Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        <AnimatePresence>
          {filteredItems.map((item, index) => {
            const displayTitle = (isAr ? item.titleAr : item.titleEn) || item.title;
            const displayMedium = (isAr ? item.mediumAr : item.mediumEn) || item.medium;
            const displayDesc = (isAr ? item.descAr : item.descEn) || item.desc;

            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.06,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                onClick={() => onOpenLightbox(item)}
                className="group relative flex flex-col bg-surface/60 hover:bg-surface border border-stroke hover:border-stroke/90 rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image Viewport */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/30">
                  <img
                    src={item.image}
                    alt={displayTitle}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Subtle Halftone Overlay */}
                  <div
                    className="absolute inset-0 opacity-15 mix-blend-multiply pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                      backgroundSize: '4px 4px',
                    }}
                  />

                  {/* Top Tech Badge Floating on Image */}
                  <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-medium tracking-wide bg-bg/85 backdrop-blur-md border border-stroke/60 text-text-primary shadow-sm">
                      {displayMedium}
                    </span>
                  </div>

                  {/* Top Expand Button on Hover */}
                  <div className="absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 w-8 h-8 rounded-full bg-bg/85 backdrop-blur-md border border-stroke/60 text-text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm group-hover:scale-105">
                    <Maximize2 className="w-3.5 h-3.5 text-text-primary" />
                  </div>
                </div>

                {/* Card Content Dedicated Zone */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-text-primary group-hover:text-white transition-colors">
                      {displayTitle}
                    </h3>
                    <p className="text-xs text-muted mt-2 line-clamp-2 leading-relaxed">
                      {displayDesc}
                    </p>
                  </div>

                  {/* Bottom Metadata & Action Bar */}
                  <div className="mt-5 pt-3.5 border-t border-stroke/40 flex items-center justify-between text-xs text-muted">
                    <span className="text-[11px] font-mono text-muted/80">
                      {item.id.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-text-primary font-medium group-hover:text-[#89AACC] transition-colors">
                      <span>{isAr ? 'عرض التفاصيل والكود' : 'View Code & Details'}</span>
                      <span className="text-xs rtl-arrow-diag group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                        ↗
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </>
  );

  if (embedded) {
    return (
      <div id="explorations" className="w-full relative overflow-hidden py-4">
        {content}
      </div>
    );
  }

  return (
    <section
      id="explorations"
      className="py-16 md:py-24 bg-bg relative overflow-hidden border-t border-stroke/40"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {content}
      </div>
    </section>
  );
};
