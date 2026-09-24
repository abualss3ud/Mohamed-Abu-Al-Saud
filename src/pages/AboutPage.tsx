import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { TRANSLATIONS } from '../translations';
import { Stats } from '../components/Stats';
import { FileText, MapPin, Mail, Sparkles, Code2, Palette, Database, Terminal } from 'lucide-react';

interface AboutPageProps {
  onOpenResume: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenResume }) => {
  const { language } = useLanguage();
  const { navigate } = useNavigation();
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language].about;

  const skillsCategories = [
    {
      icon: Code2,
      category: isAr ? 'تطوير الواجهات Front-End' : 'Front-End Development',
      skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    },
    {
      icon: Terminal,
      category: isAr ? 'الخوادم والـ Back-End' : 'Back-End & APIs',
      skills: ['Node.js', 'Express.js', 'REST APIs', 'Authentication & JWT', 'Server-Side Architecture'],
    },
    {
      icon: Database,
      category: isAr ? 'قواعد البيانات والـ ORM' : 'Database & ORM',
      skills: ['PostgreSQL', 'Prisma ORM', 'Database Design', 'Data Modeling', 'Query Optimization'],
    },
    {
      icon: Palette,
      category: isAr ? 'تصميم تجربة وواجهة المستخدم UI/UX' : 'UI/UX Design',
      skills: ['User Interface Design', 'User Experience Design', 'Wireframing', 'Design Systems', 'Typography & Spacing', 'Figma', 'Adobe Suite'],
    },
    {
      icon: Sparkles,
      category: isAr ? 'الأدوات والـ DevOps' : 'DevOps & Tooling',
      skills: ['Git', 'GitHub', 'Docker', 'CI/CD Pipelines', 'Testing & Debugging', 'Production Deployment'],
    },
  ];

  return (
    <div className="w-full pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16 md:mb-20 max-w-3xl"
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
            {isAr
              ? 'مطور Full-Stack JavaScript ومصمم UI/UX متخصص في هندسة وبناء تطبيقات ويب متكاملة وقابلة للتوسع بأحدث التقنيات.'
              : 'Full-Stack JavaScript Developer and UI/UX Designer specialized in building scalable modern web applications from Figma to cloud.'}
          </p>
        </motion.div>

        {/* Bio & Portrait Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          {/* Portrait Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
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

            {/* Location Pill */}
            <div className="mt-4 p-3.5 rounded-2xl bg-surface border border-stroke flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-muted font-mono">
                <MapPin className="w-4 h-4 text-[#89AACC]" />
                <span>{isAr ? 'قنا، مصر' : 'Qena, Egypt'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isAr ? 'متاح للعمل عن بُعد' : 'Available Remote'}</span>
              </div>
            </div>
          </motion.div>

          {/* Detailed Biography Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col justify-between"
          >
            <div className="space-y-6 text-base sm:text-lg text-text-primary/90 font-light leading-relaxed mb-8">
              <p>{t.bio1}</p>
              <p>{t.bio2}</p>
              <p className="text-sm sm:text-base text-muted">
                {isAr
                  ? 'أركز دائماً على كتابة كود نظيف وقابل للصيانة (Clean, Maintainable Code)، والاهتمام بتجربة المستخدم والتجاوب السلس مع مختلف الشاشات، فضلاً عن تحسين الأداء وتهيئة المواقع لمحركات البحث.'
                  : 'I prioritize clean, modular code architectures, performance optimization, and refined typography. Every application is built with reusability, testing, and production stability in mind.'}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-stroke/50">
              <button
                onClick={onOpenResume}
                className="group relative rounded-full text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer focus:outline-none p-[1.5px]"
              >
                <span
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
                  aria-hidden="true"
                />
                <span className="flex items-center gap-2.5 border border-stroke group-hover:border-transparent bg-surface rounded-full px-6 py-3.5 text-text-primary transition-all shadow-md">
                  <FileText className="w-4 h-4 text-[#89AACC]" />
                  <span>{isAr ? 'عرض السيرة الذاتية' : 'View Resume'}</span>
                  <span className="text-xs rtl-arrow-diag">↗</span>
                </span>
              </button>

              <button
                onClick={() => navigate('/contact')}
                className="flex items-center gap-2 border border-stroke hover:border-text-primary/50 bg-bg hover:bg-surface rounded-full px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-medium text-muted hover:text-text-primary transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>{isAr ? 'تواصل معي' : 'Contact Me'}</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-stroke/40 pt-16 mb-24">
          <Stats />
        </div>

        {/* Comprehensive Technical Skills Matrix */}
        <div className="border-t border-stroke/40 pt-16 mb-20">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-muted block mb-2">
              {isAr ? 'المهارات التقنية والتصميمية' : 'Technical & Design Skills'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-display italic text-text-primary font-light">
              {isAr ? 'المنظومة التقنية المتكاملة' : 'Comprehensive Tech Stack'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillsCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className="p-6 rounded-3xl bg-surface border border-stroke flex flex-col justify-between hover:border-stroke/80 transition-all shadow-lg"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-bg border border-stroke flex items-center justify-center text-[#89AACC]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-base font-semibold text-text-primary">
                        {cat.category}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {cat.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs font-mono px-3 py-1 rounded-full bg-bg border border-stroke/80 text-text-primary/90"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
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
            {isAr ? 'فرص التعاون والتوظيف' : 'Career & Collaborations'}
          </span>
          <h3 className="text-3xl sm:text-5xl font-display italic text-text-primary mb-4 font-normal">
            {isAr ? 'دعنا نتحدث حول فرص العمل والمشاريع' : 'Let’s discuss opportunities & projects'}
          </h3>
          <p className="text-muted max-w-lg mb-8 text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'متاح للانضمام إلى فرق عمل متميزة أو العمل على عقود برمجية مستقلة وتطوير مشاريع كاملة.'
              : 'Available for full-time engineering roles, high-impact freelance projects, and technical consultancy.'}
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
              <span>{isAr ? 'تواصل معي مباشرة' : 'Get In Touch'}</span>
              <span className="text-xs rtl-arrow-diag">↗</span>
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};
