import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { TRANSLATIONS } from '../translations';
import { ProjectItem } from '../components/SelectedWorks';
import { Explorations, ExplorationItem } from '../components/Explorations';

interface ProjectsPageProps {
  onSelectProject: (project: ProjectItem) => void;
  onOpenLightbox: (item: ExplorationItem) => void;
}

const PROJECT_ASSETS = [
  {
    id: 'devropix-platform',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'foodi-restaurant-app',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'personal-portfolio-platform',
    image: 'https://res.cloudinary.com/oe19gniu/image/upload/v1790271150/WhatsApp_Image_2026-09-22_at_5.36.09_PM.jpg',
  },
  {
    id: 'design-systems-architecture',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1600&q=85',
  },
];

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onSelectProject,
  onOpenLightbox,
}) => {
  const { language } = useLanguage();
  const { navigate } = useNavigation();
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language].works;

  const [activeFilter, setActiveFilter] = useState<'all' | 'fullstack' | 'frontend' | 'design'>('all');

  const filterTabs = [
    { id: 'all', label: isAr ? 'كل المشاريع' : 'All Works' },
    { id: 'fullstack', label: isAr ? 'تطبيقات Full-Stack' : 'Full-Stack' },
    { id: 'frontend', label: isAr ? 'واجهات Front-End' : 'Front-End UI' },
    { id: 'design', label: isAr ? 'أنظمة التصميم UI/UX' : 'Design Systems' },
  ];

  const allProjects: ProjectItem[] = t.items.map((item, idx) => ({
    ...item,
    colSpan: idx % 3 === 0 ? 'md:col-span-12 lg:col-span-7' : 'md:col-span-6 lg:col-span-5',
    aspectRatio: 'aspect-[16/11] md:aspect-auto md:h-[440px]',
    image: PROJECT_ASSETS[idx]?.image || PROJECT_ASSETS[0].image,
  }));

  const filteredProjects = allProjects.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'fullstack') return p.category.toLowerCase().includes('full-stack');
    if (activeFilter === 'frontend') return p.category.toLowerCase().includes('front-end');
    if (activeFilter === 'design') return p.category.toLowerCase().includes('design');
    return true;
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

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-text-primary text-bg font-semibold shadow-md'
                    : 'bg-surface border border-stroke text-muted hover:text-text-primary hover:border-stroke/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Projects Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
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
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 bg-gradient-to-t from-bg/95 via-bg/60 to-transparent flex items-end justify-between transition-opacity duration-300 group-hover:opacity-0">
                <div className="min-w-0 pr-4 rtl:pr-0 rtl:pl-4">
                  <span className="text-[11px] text-muted uppercase tracking-[0.15em] block mb-1 truncate font-mono">
                    {project.category}
                  </span>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-light text-text-primary truncate">
                    {project.title}
                  </h3>
                </div>
                <span className="text-xs text-muted/80 font-mono shrink-0">{project.year}</span>
              </div>

              {/* Hover Overlay with Animated Pill */}
              <div className="absolute inset-0 bg-bg/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                <div className="relative p-[1.5px] rounded-full overflow-hidden shadow-xl mb-3">
                  <div className="absolute inset-0 accent-gradient animate-gradient-shift" />
                  <div className="relative px-5 py-2 rounded-full bg-white text-black font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-lg">
                    <span>{t.viewLabel || (isAr ? 'عرض' : 'View')}</span>
                    <span className="font-display italic text-sm sm:text-base font-semibold">{project.title}</span>
                    <span className="rtl-arrow-diag text-xs ml-1">↗</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-text-primary/85 max-w-sm line-clamp-2 leading-relaxed">
                  {project.summary}
                </p>

                {project.stats && (
                  <span className="text-xs font-mono text-[#89AACC] mt-2 block font-medium">
                    {project.stats}
                  </span>
                )}

                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-surface border border-stroke/60 text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section: Explorations & UI Lab */}
        <div className="border-t border-stroke/40 pt-16 mb-20">
          <Explorations onOpenLightbox={onOpenLightbox} embedded />
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
            {isAr ? 'بدء التعاون' : 'Collaboration'}
          </span>
          <h3 className="text-3xl sm:text-5xl font-display italic text-text-primary mb-4 font-normal">
            {isAr ? 'هل تريد بناء تطبيق مشابه لمشروعك؟' : 'Interested in building something similar?'}
          </h3>
          <p className="text-muted max-w-lg mb-8 text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'متاح لتطوير منتجات رقمية متكاملة بدءاً من دراسة المتطلبات والتصميم وحتى النشر النهائي.'
              : 'Available for end-to-end full stack development, design systems, and frontend architecture.'}
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
              <span>{isAr ? 'تواصل معي لمناقشة التفاصيل' : 'Get In Touch'}</span>
              <span className="text-xs rtl-arrow-diag">↗</span>
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};
