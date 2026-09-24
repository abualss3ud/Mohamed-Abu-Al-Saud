import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { TRANSLATIONS } from '../translations';
import { CheckCircle2, Layers, Cpu, Database, Cloud } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { language } = useLanguage();
  const { navigate } = useNavigation();
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language].services;

  const workflows = [
    {
      icon: Layers,
      title: isAr ? '١. البحث وتصميم الـ UI/UX' : '1. UX Research & UI Design',
      desc: isAr
        ? 'دراسة سلوك المستخدم وتصميم Wireframes ونماذج تفاعلية عالية الدقة في Figma وبناء نظام Design System متكامل.'
        : 'User experience mapping, high-fidelity interactive wireframes in Figma, and complete design systems.',
    },
    {
      icon: Cpu,
      title: isAr ? '٢. تطوير الـ Front-End التفاعلي' : '2. Reactive Front-End Engineering',
      desc: isAr
        ? 'بناء واجهات متجاوبة، حديثة وسريعة باستخدام React و Next.js و TypeScript و Tailwind CSS بهيكلية نظيفة.'
        : 'Modern responsive web client applications with React, Next.js, TypeScript, and clean component hierarchies.',
    },
    {
      icon: Database,
      title: isAr ? '٣. الخوادم وقواعد البيانات' : '3. Backend APIs & Database Modeling',
      desc: isAr
        ? 'تطوير RESTful APIs قوية بـ Node.js و Express، وتصميم مخططات قواعد بيانات آمنة عبر PostgreSQL و Prisma.'
        : 'Scalable RESTful API architecture with Node.js & Express, plus relational data schemas via PostgreSQL & Prisma.',
    },
    {
      icon: Cloud,
      title: isAr ? '٤. الاختبار والنشر السحابي' : '4. Automated CI/CD & Cloud Shipping',
      desc: isAr
        ? 'إعداد حاويات Docker، وأتمتة الاختبارات، وضبط خطوط CI/CD لضمان استقرار التطبيق في بيئة الإنتاج السحابية.'
        : 'Docker containerization, testing pipelines, and automated zero-downtime CI/CD deployment.',
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
            {t.subtext}
          </p>
        </motion.div>

        {/* Full Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {t.items.map((service, index) => (
            <motion.div
              key={service.num}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group relative bg-surface border border-stroke hover:border-stroke/80 rounded-3xl p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div
                className="absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient"
                aria-hidden="true"
              />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl sm:text-4xl font-display italic text-muted/60 group-hover:text-text-primary transition-colors font-light">
                    {service.num}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#89AACC] px-3 py-1 rounded-full bg-[#89AACC]/10 border border-[#89AACC]/20">
                    {service.subtitle}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl text-text-primary font-medium mb-4 tracking-tight group-hover:text-white transition-colors">
                  {service.title}
                </h2>

                <p className="text-sm sm:text-base text-muted leading-relaxed mb-8">
                  {service.desc}
                </p>
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted/80 block mb-3">
                  {isAr ? 'التقنيات والمخرجات:' : 'Key Deliverables & Stack:'}
                </span>
                <div className="flex flex-wrap gap-2 pt-3 border-t border-stroke/50">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-3 py-1 rounded-full bg-bg border border-stroke text-text-primary/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Workflow & Process Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl bg-surface/60 border border-stroke p-8 sm:p-12 mb-20 shadow-2xl"
        >
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-muted block mb-2">
              {isAr ? 'منهجية العمل المتكاملة' : 'End-to-End Methodology'}
            </span>
            <h3 className="text-2xl sm:text-4xl font-display italic text-text-primary font-normal">
              {isAr ? 'كيف نحول الفكرة إلى منتج حقيقي؟' : 'From Conceptual Idea to Live Deployment'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflows.map((wf, idx) => {
              const Icon = wf.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-bg/70 border border-stroke/70 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-surface border border-stroke flex items-center justify-center text-[#89AACC] mb-4 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-semibold text-text-primary mb-2">
                      {wf.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted leading-relaxed">
                      {wf.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

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
            {isAr ? 'مشروع جديد' : 'New Project Inquiry'}
          </span>
          <h3 className="text-3xl sm:text-5xl font-display italic text-text-primary mb-4 font-normal">
            {isAr ? 'هل لديك فكرة مشروع ترغب في تنفيذها؟' : 'Have a project ready to be built?'}
          </h3>
          <p className="text-muted max-w-lg mb-8 text-sm sm:text-base leading-relaxed">
            {isAr
              ? 'سواء كنت بحاجة إلى تطبيق ويب متكامل، أو تصميم واجهات UI/UX، دعنا نتحدث حول التفاصيل.'
              : 'Whether you need a full-stack web application, scalable backend APIs, or bespoke UI/UX designs, let’s connect.'}
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
              <span>{isAr ? 'تواصل معي لمناقشة المشروع' : 'Start A Conversation'}</span>
              <span className="text-xs rtl-arrow-diag">↗</span>
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};
