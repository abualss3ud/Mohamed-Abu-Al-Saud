import React from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { ProjectItem } from '../components/SelectedWorks';
import { JournalEntry } from '../components/Journal';
import { Explorations, ExplorationItem } from '../components/Explorations';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { TRANSLATIONS } from '../translations';

interface HomePageProps {
  onSelectProject: (project: ProjectItem) => void;
  onSelectJournalEntry: (entry: JournalEntry) => void;
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

const JOURNAL_IMAGES = [
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=85',
];

export const HomePage: React.FC<HomePageProps> = ({
  onSelectProject,
  onSelectJournalEntry,
  onOpenLightbox,
}) => {
  const { language } = useLanguage();
  const { navigate } = useNavigation();
  const isAr = language === 'ar';

  const tWorks = TRANSLATIONS[language].works;
  const tServices = TRANSLATIONS[language].services;
  const tAbout = TRANSLATIONS[language].about;
  const tJournal = TRANSLATIONS[language].journal;

  // Previews: top 3 projects, 4 services preview, short about, top 3 articles
  const featuredProjects: ProjectItem[] = tWorks.items.slice(0, 3).map((item, idx) => ({
    ...item,
    colSpan: idx === 0 ? 'md:col-span-12 lg:col-span-7' : 'md:col-span-6 lg:col-span-5',
    aspectRatio: 'aspect-[16/11] md:aspect-auto md:h-[420px]',
    image: PROJECT_ASSETS[idx]?.image || PROJECT_ASSETS[0].image,
  }));

  const previewArticles: JournalEntry[] = tJournal.entries.slice(0, 3).map((item, idx) => ({
    ...item,
    image: JOURNAL_IMAGES[idx] || JOURNAL_IMAGES[0],
  }));

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <Hero
        onSeeWorks={() => navigate('/projects')}
        onReachOut={() => navigate('/contact')}
      />

      {/* 2. Services Preview Section */}
      <section id="services-preview" className="bg-bg py-16 md:py-24 border-t border-stroke/40">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
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
                  {tServices.eyebrow}
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight font-light leading-tight">
                {tServices.headingMain}
                <span className="font-display italic text-text-primary">
                  {tServices.headingItalic}
                </span>
              </h2>
              <p className="text-sm md:text-base text-muted mt-3 max-w-lg leading-relaxed">
                {tServices.subtext}
              </p>
            </div>

            {/* CTA: View All Services */}
            <button
              onClick={() => navigate('/services')}
              className="inline-flex group relative rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer focus:outline-none p-[1.5px] shrink-0 self-start md:self-auto"
            >
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
                aria-hidden="true"
              />
              <span className="flex items-center gap-2.5 border border-stroke group-hover:border-transparent bg-surface rounded-full px-6 py-3 text-text-primary transition-all">
                <span>{isAr ? 'عرض كل الخدمات' : 'View All Services'}</span>
                <span className="text-xs rtl-flip group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </span>
            </button>
          </motion.div>

          {/* 4 Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tServices.items.map((service, index) => (
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
                onClick={() => navigate('/services')}
                className="group relative bg-surface border border-stroke hover:border-stroke/80 rounded-3xl p-6 sm:p-8 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg cursor-pointer"
              >
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

                  <h3 className="text-xl sm:text-2xl text-text-primary font-medium mb-3 tracking-tight group-hover:text-white transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-muted leading-relaxed mb-6 line-clamp-2">
                    {service.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-stroke/50">
                  {service.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-bg border border-stroke text-muted"
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

      {/* 3. Projects Preview Section */}
      <section id="projects-preview" className="bg-bg py-16 md:py-24 border-t border-stroke/40">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
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
                  {tWorks.eyebrow}
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight font-light leading-tight">
                {tWorks.headingMain}
                <span className="font-display italic text-text-primary">
                  {tWorks.headingItalic}
                </span>
              </h2>

              <p className="text-sm md:text-base text-muted mt-3 max-w-lg leading-relaxed">
                {tWorks.subtext}
              </p>
            </div>

            {/* CTA: View All Projects */}
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex group relative rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer focus:outline-none p-[1.5px] shrink-0 self-start md:self-auto"
            >
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
                aria-hidden="true"
              />
              <span className="flex items-center gap-2.5 border border-stroke group-hover:border-transparent bg-surface rounded-full px-6 py-3 text-text-primary transition-all">
                <span>{isAr ? 'عرض كل المشاريع' : 'View All Projects'}</span>
                <span className="text-xs rtl-flip group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </span>
            </button>
          </motion.div>

          {/* Featured Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {featuredProjects.map((project, index) => (
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
                      <span>{tWorks.viewLabel || (isAr ? 'عرض' : 'View')}</span>
                      <span className="font-display italic text-sm sm:text-base font-semibold">{project.title}</span>
                      <span className="rtl-arrow-diag text-xs ml-1">↗</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-text-primary/85 max-w-sm line-clamp-2 leading-relaxed">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
                    {project.tags.slice(0, 3).map((tag) => (
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
        </div>
      </section>

      {/* Explorations / UI Playground Section */}
      <Explorations onOpenLightbox={onOpenLightbox} />

      {/* 4. About Preview Section */}
      <section id="about-preview" className="bg-bg py-16 md:py-24 border-t border-stroke/40">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left: Portrait Card */}
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
                  alt={isAr ? 'محمد أبو السعود' : 'Mohamed Abu Al-Saud'}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-85" />
                <div className="absolute bottom-6 inset-x-6">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted block mb-1">
                    {isAr ? 'مطور Full-Stack & مصمم UI/UX' : 'Full-Stack Developer & UI/UX'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-display italic text-text-primary font-semibold">
                    {isAr ? 'محمد أبو السعود' : 'Mohamed Abu Al-Saud'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Short Bio & CTA to /about */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="lg:col-span-7 flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-stroke" />
                <span className="text-xs text-muted uppercase tracking-[0.25em] font-medium">
                  {tAbout.eyebrow}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-text-primary tracking-tight font-light leading-tight mb-6">
                {tAbout.headingMain}
                <span className="font-display italic text-text-primary">
                  {tAbout.headingItalic}
                </span>
              </h2>

              <p className="text-base sm:text-lg text-text-primary/90 leading-relaxed font-light mb-6">
                {tAbout.bio1}
              </p>

              {/* Highlights row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 pt-4 border-t border-stroke/40">
                <div className="p-3.5 rounded-2xl bg-surface border border-stroke">
                  <div className="text-2xl font-display italic font-semibold text-text-primary">100%</div>
                  <div className="text-xs text-muted mt-1">{isAr ? 'تطوير متكامل' : 'Full Delivery'}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface border border-stroke">
                  <div className="text-2xl font-display italic font-semibold text-text-primary">+20</div>
                  <div className="text-xs text-muted mt-1">{isAr ? 'أداة وتقنية' : 'Modern Stack'}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-surface border border-stroke col-span-2 sm:col-span-1">
                  <div className="text-2xl font-display italic font-semibold text-text-primary">Clean</div>
                  <div className="text-xs text-muted mt-1">{isAr ? 'معمارية قابلة للتوسع' : 'Architecture'}</div>
                </div>
              </div>

              {/* CTA: About Me -> /about */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/about')}
                  className="group relative rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer focus:outline-none p-[1.5px]"
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
                    aria-hidden="true"
                  />
                  <span className="flex items-center gap-2.5 border border-stroke group-hover:border-transparent bg-surface rounded-full px-6 py-3 text-text-primary transition-all">
                    <span>{isAr ? 'المزيد عني' : 'About Me'}</span>
                    <span className="text-xs rtl-flip group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Blog Preview Section */}
      <section id="blog-preview" className="bg-bg py-16 md:py-24 border-t border-stroke/40">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
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
                  {tJournal.eyebrow}
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl text-text-primary tracking-tight font-light leading-tight">
                {tJournal.headingMain}
                <span className="font-display italic text-text-primary">
                  {tJournal.headingItalic}
                </span>
              </h2>

              <p className="text-sm md:text-base text-muted mt-3 max-w-lg leading-relaxed">
                {tJournal.subtext}
              </p>
            </div>

            {/* CTA: View All Articles */}
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex group relative rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer focus:outline-none p-[1.5px] shrink-0 self-start md:self-auto"
            >
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
                aria-hidden="true"
              />
              <span className="flex items-center gap-2.5 border border-stroke group-hover:border-transparent bg-surface rounded-full px-6 py-3 text-text-primary transition-all">
                <span>{isAr ? 'عرض كل المقالات' : 'View All Articles'}</span>
                <span className="text-xs rtl-flip group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </span>
            </button>
          </motion.div>

          {/* 3 Articles List (Original Sleek Journal Row Design) */}
          <div className="flex flex-col gap-4">
            {previewArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                onClick={() => onSelectJournalEntry(article)}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 md:p-5 bg-surface/50 hover:bg-surface border border-stroke hover:border-stroke/80 rounded-2xl sm:rounded-full transition-all duration-300 cursor-pointer overflow-hidden shadow-sm"
              >
                {/* Left thumbnail & title */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden shrink-0 border border-stroke/50">
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>

                  <div className="min-w-0 pr-2 rtl:pr-0 rtl:pl-2">
                    <h3 className="text-sm sm:text-base md:text-lg font-medium text-text-primary group-hover:text-white transition-colors truncate">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted mt-0.5 truncate hidden sm:block">
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
    </div>
  );
};
