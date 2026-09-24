import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../translations';

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  year: string;
  colSpan: string;
  aspectRatio: string;
  image: string;
  summary: string;
  tags: string[];
  client: string;
  stats?: string;
}

const PROJECT_ASSETS = [
  {
    id: 'automotive-motion',
    colSpan: 'md:col-span-7',
    aspectRatio: 'aspect-[16/11] md:aspect-auto md:h-[440px]',
    image:
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'urban-architecture',
    colSpan: 'md:col-span-5',
    aspectRatio: 'aspect-[16/11] md:aspect-auto md:h-[440px]',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'human-perspective',
    colSpan: 'md:col-span-5',
    aspectRatio: 'aspect-[16/11] md:aspect-auto md:h-[440px]',
    image:
      'https://res.cloudinary.com/oe19gniu/image/upload/v1790271150/WhatsApp_Image_2026-09-22_at_5.36.09_PM.jpg',
  },
  {
    id: 'brand-identity',
    colSpan: 'md:col-span-7',
    aspectRatio: 'aspect-[16/11] md:aspect-auto md:h-[440px]',
    image:
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1600&q=85',
  },
];

interface SelectedWorksProps {
  onSelectProject: (project: ProjectItem) => void;
  onViewAllWork?: () => void;
}

export const SelectedWorks: React.FC<SelectedWorksProps> = ({
  onSelectProject,
  onViewAllWork,
}) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language].works;

  const projects: ProjectItem[] = t.items.map((item, index) => ({
    ...item,
    colSpan: PROJECT_ASSETS[index].colSpan,
    aspectRatio: PROJECT_ASSETS[index].aspectRatio,
    image: PROJECT_ASSETS[index].image,
  }));

  return (
    <section id="work" className="bg-bg py-16 md:py-24 border-t border-stroke/40">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Section Header */}
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

          {onViewAllWork && (
            <button
              onClick={onViewAllWork}
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

        {/* Bento Grid: 7 / 5 / 5 / 7 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.7,
                delay: index * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              onClick={() => onSelectProject(project)}
              className={`${project.colSpan} ${project.aspectRatio} bg-surface border border-stroke hover:border-stroke/80 rounded-3xl overflow-hidden relative group cursor-pointer select-none shadow-lg`}
            >
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Halftone subtle overlay */}
              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                }}
              />

              {/* Card Bottom Metadata Banner */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-bg/95 via-bg/60 to-transparent flex items-end justify-between transition-opacity duration-300 group-hover:opacity-0">
                <div className="min-w-0 pr-4 rtl:pr-0 rtl:pl-4">
                  <span className="text-[11px] text-muted uppercase tracking-[0.15em] block mb-1 truncate">
                    {project.category}
                  </span>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-light text-text-primary truncate">
                    {project.title}
                  </h3>
                </div>
                <span className="text-xs text-muted/80 font-mono shrink-0">{project.year}</span>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-bg/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                <div className="relative p-[1.5px] rounded-full overflow-hidden shadow-xl mb-3">
                  <div className="absolute inset-0 accent-gradient animate-gradient-shift" />
                  <div className="relative px-5 py-2 rounded-full bg-white text-black font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-lg">
                    <span>{t.viewLabel}</span>
                    <span className="font-display italic text-sm sm:text-base font-semibold">{project.title}</span>
                    <span className="rtl-arrow-diag text-xs ml-1">↗</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-text-primary/80 max-w-sm line-clamp-2 leading-relaxed">
                  {project.summary}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
