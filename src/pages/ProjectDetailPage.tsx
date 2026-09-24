import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  Calendar,
  Layers,
  CheckCircle2,
  Share2,
  Check,
  Link2,
  Maximize2,
  X,
  Sparkles,
  Laptop,
  Server,
  Database,
  Cpu,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { TRANSLATIONS } from '../translations';

const PROJECT_ASSETS: Record<
  string,
  {
    image: string;
    gallery: { url: string; captionAr: string; captionEn: string }[];
    liveDemo: string;
    github: string;
    roleAr: string;
    roleEn: string;
    timelineAr: string;
    timelineEn: string;
  }
> = {
  'devropix-platform': {
    image:
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85',
        captionAr: 'لوحة التحكم المركزية وتحليلات البيانات في الوقت الحقيقي',
        captionEn: 'Real-time analytics dashboard and centralized operations metrics',
      },
      {
        url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=85',
        captionAr: 'واجهة إدارة المشاريع وتتبع خطوط الإنتاج السحابي',
        captionEn: 'Project lifecycle management and cloud deployment status pipelines',
      },
    ],
    liveDemo: 'https://github.com/abualss3ud',
    github: 'https://github.com/abualss3ud',
    roleAr: 'هندسة الويب المتكاملة وتصميم UI/UX',
    roleEn: 'Full-Stack Engineering & UI/UX Architecture',
    timelineAr: '٣ أشهر تطوير واختبار',
    timelineEn: '3 months full delivery',
  },
  'foodi-restaurant-app': {
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85',
        captionAr: 'استعراض الوجبات وتصفية القوائم بحسب الأصناف والتفضيلات الغذائية',
        captionEn: 'Meal exploration and dynamic category filtering with micro-interactions',
      },
      {
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
        captionAr: 'تجربة الطلب السريعة وسلة التسوق التفاعلية المتجاوبة',
        captionEn: 'Streamlined checkout funnel and responsive interactive basket drawer',
      },
    ],
    liveDemo: 'https://github.com/abualss3ud',
    github: 'https://github.com/abualss3ud',
    roleAr: 'تطوير Front-End وتجربة المستخدم',
    roleEn: 'Front-End Development & UX Interactions',
    timelineAr: '٦ أسابيع',
    timelineEn: '6 weeks sprint',
  },
  'personal-portfolio-platform': {
    image:
      'https://res.cloudinary.com/oe19gniu/image/upload/v1790271150/WhatsApp_Image_2026-09-22_at_5.36.09_PM.jpg',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
        captionAr: 'مختبر الواجهات والتجارب التفاعلية ثلاثية الأبعاد',
        captionEn: 'Interactive UI laboratory and 3D visual exploration space',
      },
      {
        url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
        captionAr: 'نظام إدارة المقالات والمدونة المعمارية',
        captionEn: 'Technical blog and engineering architecture publishing engine',
      },
    ],
    liveDemo: 'https://github.com/abualss3ud',
    github: 'https://github.com/abualss3ud',
    roleAr: 'التصميم والهندسة المعمارية الكاملة',
    roleEn: 'End-to-End System Design & Full-Stack Development',
    timelineAr: 'مستمر ومحدث دورياً',
    timelineEn: 'Continually evolved in production',
  },
  'design-systems-architecture': {
    image:
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1600&q=85',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=85',
        captionAr: 'مكتبة الرموز (Design Tokens) وتدرجات الألوان والتايبوغرافي في Figma',
        captionEn: 'Design tokens, typographic scale, and standardized color tokens in Figma',
      },
      {
        url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=85',
        captionAr: 'توثيق المكونات في Storybook مع اختبارات التوافقية والتجاوب',
        captionEn: 'Storybook component documentation with responsive accessibility tests',
      },
    ],
    liveDemo: 'https://github.com/abualss3ud',
    github: 'https://github.com/abualss3ud',
    roleAr: 'هندسة نظام التصميم وتطوير المكونات',
    roleEn: 'Design Systems Architect & React UI Specialist',
    timelineAr: 'شهرين',
    timelineEn: '2 months delivery',
  },
};

const PROJECT_STORIES: Record<
  string,
  {
    ar: {
      overview: string;
      challenge: string;
      solution: string;
      architecture: string[];
      metrics: { label: string; value: string }[];
    };
    en: {
      overview: string;
      challenge: string;
      solution: string;
      architecture: string[];
      metrics: { label: string; value: string }[];
    };
  }
> = {
  'devropix-platform': {
    ar: {
      overview:
        'منصة برمجية سحابية متقدمة تهدف إلى توحيد إدارة المشاريع ومتابعة فرق العمل وتحليل مؤشرات الأداء اللحظية عبر لوحة تحكم تفاعلية وسريعة الاستجابة.',
      challenge:
        'كان التحدي الرئيسي هو التعامل مع كميات ضخمة من تحديثات البيانات دون التأثير على سرعة الواجهة، وضمان تجربة استخدام سلسة حتى في ظروف الاتصال الضعيف.',
      solution:
        'تم بناء واجهة المستخدم بنظام المكونات المعيارية بـ Next.js و TypeScript، مع إدارة الحالة عبر استراتيجيات Optimistic UI وتطوير خوادم RESTful آمنة تدعم التحقق الدقيق من الصلاحيات.',
      architecture: [
        'معمارية Micro-Services مرنة تفصل بين الخادم والواجهة الأمامية.',
        'قواعد بيانات PostgreSQL مهيأة بفهارس دقيقة لاستعلامات فائقة السرعة.',
        'طبقة مصادقة متقدمة عبر JWT و HTTP-Only Cookies لضمان الأمان الأقصى.',
        'خطوط نشر آلية CI/CD بواسطة GitHub Actions وحاويات Docker.',
      ],
      metrics: [
        { label: 'أداء Lighthouse', value: '٩٨ / ١٠٠' },
        { label: 'زمن استجابة الـ API', value: '< ٨٥ms' },
        { label: 'استقرار بيئة الإنتاج', value: '٩٩.٩٪' },
      ],
    },
    en: {
      overview:
        'An enterprise cloud web platform engineered for real-time task orchestration, telemetry tracking, and team productivity through an intuitive, fluid interface.',
      challenge:
        'Handling high-frequency state updates without UI stutter while maintaining bulletproof data integrity across concurrent user sessions.',
      solution:
        'Engineered with Next.js and TypeScript, incorporating optimistic UI updates, resilient REST APIs via Express/Node.js, and strict schema validation.',
      architecture: [
        'Decoupled presentation and service boundaries for rapid iteration.',
        'PostgreSQL with composite indexes yielding sub-100ms analytics queries.',
        'Robust JWT authentication stored in HTTP-Only cookies with CSRF defense.',
        'Automated multi-stage Docker builds deploying through GitHub Actions CI/CD.',
      ],
      metrics: [
        { label: 'Lighthouse Performance', value: '98 / 100' },
        { label: 'API Response Time', value: '< 85ms' },
        { label: 'Uptime SLA', value: '99.9%' },
      ],
    },
  },
  'foodi-restaurant-app': {
    ar: {
      overview:
        'تطبيق مطعم عصري يقدم تجربة تصفح غنية للأطعمة والوجبات، مع سلة تسوق ديناميكية ونظام تصفية ذكي يعتمد على التفضيلات الغذائية والمكونات.',
      challenge:
        'تحقيق أقصى درجات التجاوب والسرعة على كافة شاشات الهواتف الذكية وتسهيل تجربة الطلب السريع بأقل عدد من النقرات.',
      solution:
        'الاعتماد على Tailwind CSS و React لبناء واجهات بديهية ذات حركة ناعمة، مع تخزين مؤقت للوجبات لضمان التصفح الفوري دون أي تأخير.',
      architecture: [
        'تصميم Mobile-First بالكامل مع شبكة مرنة تتكيف مع مختلف قياسات الشاشات.',
        'سلة تسوق محلية فورية تدعم استرجاع الطلبات عبر LocalStorage.',
        'تطبيق معايير Semantic HTML وإمكانية الوصول الكاملة (a11y).',
      ],
      metrics: [
        { label: 'سرعة التحميل الأولي', value: '٠.٦ ثانية' },
        { label: 'معدل رضا المستخدمين', value: '٩٦٪' },
        { label: 'التجاوب عبر الأجهزة', value: '١٠٠٪' },
      ],
    },
    en: {
      overview:
        'A sleek hospitality and restaurant web application featuring dynamic menu curation, interactive nutritional filters, and instant basket checkout.',
      challenge:
        'Delivering instantaneous mobile responsiveness and friction-free checkout navigation with zero input latency.',
      solution:
        'Constructed with React and Tailwind CSS, leveraging lightweight client-side state caching and fluid micro-animations.',
      architecture: [
        'Strict Mobile-First responsive CSS grid and flex layouts.',
        'Persistent cart state using localStorage with instantaneous totals computation.',
        'Full semantic HTML structure with WCAG accessibility conformance.',
      ],
      metrics: [
        { label: 'First Contentful Paint', value: '0.6s' },
        { label: 'User Satisfaction', value: '96%' },
        { label: 'Device Responsiveness', value: '100%' },
      ],
    },
  },
  'personal-portfolio-platform': {
    ar: {
      overview:
        'منصة الموقع التعريفي الشخصي للمطور محمد أبو السعود، تم تصميمها وهندستها لتكون نموذجاً حياً لجودة التصميم البصري ودقة التنفيذ البرمجي.',
      challenge:
        'الجمع بين الدعم الكامل للغتين العربية (RTL) والإنجليزية (LTR)، والسرعة القصوى في التنقل، دون التنازل عن جمالية الهوية البصرية.',
      solution:
        'بناء منظومة متكاملة تدعم التبديل السلس بين اللغات، ونظام توجيه داخلي فائق السرعة، ومعرض مشاريع وتجارب تفاعلية متجاوبة.',
      architecture: [
        'دعم ثنائي اللغة أصيل (RTL & LTR) مع خطوط محسنة للقراءة.',
        'معمارية مكونات معيارية باستخدام React و TypeScript و Tailwind CSS.',
        'تهيئة متقدمة لمحركات البحث (SEO) وبطاقات المشاركة الاجتماعية.',
      ],
      metrics: [
        { label: 'تقييم الأداء', value: '١٠٠ / ١٠٠' },
        { label: 'التوافقية مع اللغتين', value: '١٠٠٪ RTL/LTR' },
        { label: 'الأمان وسرعة التحميل', value: 'A+' },
      ],
    },
    en: {
      overview:
        'The bespoke personal portfolio platform for Mohamed Abu Al-Saud, designed to exemplify the apex of visual elegance and software craftsmanship.',
      challenge:
        'Balancing comprehensive dual-language (RTL & LTR) support, instant client-side routing, and expressive motion choreography.',
      solution:
        'Built with React, TypeScript, and Tailwind CSS, featuring modular routing, bidirectional font stacks, and interactive project showcases.',
      architecture: [
        'Native bidirectional RTL/LTR layout parity with precision typography.',
        'Modular reusable component tree with strict type safety.',
        'Optimized SEO metadata and social share graph tags.',
      ],
      metrics: [
        { label: 'Performance Rating', value: '100 / 100' },
        { label: 'Bilingual Support', value: '100% RTL/LTR' },
        { label: 'Web Vitals Score', value: 'Grade A+' },
      ],
    },
  },
  'design-systems-architecture': {
    ar: {
      overview:
        'نظام تصميم شامل ومكتبة مكونات قابلة لإعادة الاستخدام تم تطويرها للربط المتين بين فرق التصميم في Figma وفرق الهندسة البرمجية في React.',
      challenge:
        'منع التباين بين التصميم والكود، وتوفير مكتبة مكونات موثقة ومعيارية يمكن لأي فريق برمجتها واستخدامها فوراً.',
      solution:
        'إنشاء منظومة متكاملة تعتمد على Design Tokens الموحدة لجميع الألوان والمقاييس، مع تصديرها كـ Tailwind Config ومكونات React مهيأة.',
      architecture: [
        'توحيد الرموز التصميمية (Color Tokens, Spacing, Typography).',
        'مكونات معيارية قابلة للتخصيص عبر Props دقيقة بـ TypeScript.',
        'دعم ثيمات الألوان الداكنة والفاتحة والتباين العالي.',
      ],
      metrics: [
        { label: 'تسريع وقت بناء الواجهات', value: '+٥٠٪' },
        { label: 'إعادة استخدام المكونات', value: '٩٥٪' },
        { label: 'تغطية التايبوجرافي والألوان', value: '١٠٠٪' },
      ],
    },
    en: {
      overview:
        'A comprehensive design system and component architecture bridging the gap between Figma design tokens and production React components.',
      challenge:
        'Eliminating design-code drift and providing maintainable, thoroughly documented component tokens across multi-developer teams.',
      solution:
        'Established unified tokens for spacing, color palettes, and typographic scales, mapped directly into Tailwind utility configurations.',
      architecture: [
        'Standardized design tokens exported directly into CSS variables.',
        'Type-safe React components with flexible polymorphic properties.',
        'Full dark mode contrast fidelity and accessible interaction states.',
      ],
      metrics: [
        { label: 'Velocity Gain', value: '+50%' },
        { label: 'Component Reusability', value: '95%' },
        { label: 'Design Fidelity', value: '100%' },
      ],
    },
  },
};

export const ProjectDetailPage: React.FC = () => {
  const { language } = useLanguage();
  const { activeEntityId, navigate, navigateToProject } = useNavigation();
  const isAr = language === 'ar';
  const tWorks = TRANSLATIONS[language].works;

  // Resolve current project
  const projectId = activeEntityId || 'devropix-platform';
  const projectIndex = tWorks.items.findIndex((p) => p.id === projectId);
  const projectMeta = tWorks.items[projectIndex !== -1 ? projectIndex : 0];
  const projectAsset = PROJECT_ASSETS[projectMeta.id] || PROJECT_ASSETS['devropix-platform'];
  const projectStory = (PROJECT_STORIES[projectMeta.id] || PROJECT_STORIES['devropix-platform'])[
    isAr ? 'ar' : 'en'
  ];

  // Prev / Next projects
  const prevProject = projectIndex > 0 ? tWorks.items[projectIndex - 1] : null;
  const nextProject =
    projectIndex < tWorks.items.length - 1 ? tWorks.items[projectIndex + 1] : null;

  // Gallery zoom modal
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="w-full pt-28 pb-24 md:pt-36 md:pb-32 bg-bg text-text-primary relative min-h-screen">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 mb-8 text-xs font-mono text-muted">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-muted hover:text-text-primary transition-colors cursor-pointer py-1 group"
          >
            <span className="rtl-flip group-hover:-translate-x-1 transition-transform">←</span>
            <span>{isAr ? 'العودة إلى المشاريع' : 'Back to Projects'}</span>
          </button>

          <div className="flex items-center gap-2 text-muted/60 hidden sm:flex">
            <span className="hover:text-muted cursor-pointer" onClick={() => navigate('/')}>
              {isAr ? 'الرئيسية' : 'Home'}
            </span>
            <span>/</span>
            <span className="hover:text-muted cursor-pointer" onClick={() => navigate('/projects')}>
              {isAr ? 'المشاريع' : 'Projects'}
            </span>
            <span>/</span>
            <span className="text-text-primary truncate max-w-[200px]">{projectMeta.title}</span>
          </div>
        </div>

        {/* Project Header Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          {/* Category Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-stroke" />
            <span className="text-xs uppercase tracking-[0.25em] font-mono text-[#89AACC]">
              {projectMeta.category}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-text-primary leading-[1.1] mb-5">
            {projectMeta.title}
          </h1>

          {/* Subtitle / Summary */}
          <p className="text-base sm:text-lg text-muted max-w-3xl leading-relaxed mb-8">
            {projectMeta.summary}
          </p>

          {/* Action Links Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={projectAsset.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-text-primary text-bg hover:bg-white text-xs uppercase tracking-wider font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer"
            >
              <span>{isAr ? 'المعاينة الحية للمشروع' : 'Live Demo Preview'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={projectAsset.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-text-primary text-xs uppercase tracking-wider font-medium transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <Github className="w-4 h-4 text-muted" />
              <span>{isAr ? 'الكود المصدري GitHub' : 'View GitHub Repo'}</span>
            </a>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-text-primary text-xs font-mono transition-all cursor-pointer"
              title={isAr ? 'نسخ رابط المشروع' : 'Copy link'}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Link2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'مشاركة' : 'Share')}</span>
            </button>
          </div>
        </motion.div>

        {/* Project Meta Key Information Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-stroke mb-12 shadow-lg">
          <div>
            <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1">
              {isAr ? 'العميل / المؤسسة' : 'Client / Context'}
            </span>
            <span className="text-sm font-medium text-text-primary">{projectMeta.client}</span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1">
              {isAr ? 'سنة الإنجاز' : 'Timeline / Year'}
            </span>
            <span className="text-sm font-medium text-text-primary">
              {projectMeta.year} ({isAr ? projectAsset.timelineAr : projectAsset.timelineEn})
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1">
              {isAr ? 'الدور والمسؤولية' : 'Engineering Role'}
            </span>
            <span className="text-sm font-medium text-text-primary">
              {isAr ? projectAsset.roleAr : projectAsset.roleEn}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1">
              {isAr ? 'الحالة الحالية' : 'Project Status'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{isAr ? 'متاح للإنتاج (Production)' : 'Live in Production'}</span>
            </span>
          </div>
        </div>

        {/* Hero Showcase Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-stroke shadow-2xl mb-16 bg-surface group"
        >
          <img
            src={projectAsset.image}
            alt={projectMeta.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent pointer-events-none" />

          <button
            onClick={() => setZoomImage(projectAsset.image)}
            className="absolute bottom-5 right-5 rtl:right-auto rtl:left-5 px-4 py-2 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'تكبير المعاينة' : 'Full Preview'}</span>
          </button>
        </motion.div>

        {/* Project Detailed Narrative */}
        <div className="space-y-16 mb-20">
          {/* 1. Overview & Vision */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#89AACC]">01</span>
              <h2 className="text-2xl sm:text-3xl font-light text-text-primary tracking-tight">
                {isAr ? 'نبذة عامة والهدف من المشروع' : 'Project Overview & Vision'}
              </h2>
            </div>
            <p className="text-base sm:text-lg text-muted/90 leading-relaxed max-w-3xl">
              {projectStory.overview}
            </p>
          </section>

          {/* 2. Problem & Challenge */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#89AACC]">02</span>
              <h2 className="text-2xl sm:text-3xl font-light text-text-primary tracking-tight">
                {isAr ? 'التحدي الهندسي والتقني' : 'The Engineering Challenge'}
              </h2>
            </div>
            <p className="text-base text-muted/90 leading-relaxed max-w-3xl">
              {projectStory.challenge}
            </p>
          </section>

          {/* 3. Engineering Solution */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#89AACC]">03</span>
              <h2 className="text-2xl sm:text-3xl font-light text-text-primary tracking-tight">
                {isAr ? 'الحلول الهندسية المطبقة' : 'Engineering Solution & Architecture'}
              </h2>
            </div>
            <p className="text-base text-muted/90 leading-relaxed max-w-3xl mb-6">
              {projectStory.solution}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projectStory.architecture.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-surface/70 border border-stroke flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#89AACC] shrink-0 mt-0.5" />
                  <span className="text-sm text-muted/90 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Tech Stack Breakdown */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#89AACC]">04</span>
              <h2 className="text-2xl sm:text-3xl font-light text-text-primary tracking-tight">
                {isAr ? 'التقنيات والأدوات المستخدمة' : 'Technologies & Architecture Stack'}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {projectMeta.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full text-xs font-mono bg-surface border border-stroke text-text-primary hover:border-[#89AACC]/60 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* 5. Screenshots & Interface Gallery */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#89AACC]">05</span>
              <h2 className="text-2xl sm:text-3xl font-light text-text-primary tracking-tight">
                {isAr ? 'معرض الواجهات ولقطات النظام' : 'User Interface & Architecture Gallery'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projectAsset.gallery.map((shot, idx) => (
                <div
                  key={idx}
                  onClick={() => setZoomImage(shot.url)}
                  className="group relative rounded-2xl overflow-hidden bg-surface border border-stroke cursor-pointer shadow-md hover:shadow-xl transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={shot.url}
                      alt={shot.captionEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 bg-surface border-t border-stroke/60">
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {isAr ? shot.captionAr : shot.captionEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Key Metrics & Impact */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#89AACC]">06</span>
              <h2 className="text-2xl sm:text-3xl font-light text-text-primary tracking-tight">
                {isAr ? 'النتائج والأثر الرقمي' : 'Key Results & Metrics'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {projectStory.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-surface border border-stroke text-center relative overflow-hidden"
                >
                  <div className="text-3xl sm:text-4xl font-display italic text-[#89AACC] font-semibold mb-2">
                    {metric.value}
                  </div>
                  <div className="text-xs text-muted font-mono">{metric.label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom Collaboration CTA Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-surface to-surface/80 border border-stroke text-center mb-16 shadow-2xl relative overflow-hidden">
          <div className="max-w-lg mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#89AACC] block mb-3">
              {isAr ? 'ابدأ مشروعك القادم' : 'Have a similar challenge?'}
            </span>
            <h3 className="text-2xl sm:text-4xl font-light text-text-primary mb-4 leading-tight">
              {isAr ? 'هل تريد بناء حل برمجي مماثل؟' : 'Ready to build something extraordinary?'}
            </h3>
            <p className="text-sm text-muted mb-8 leading-relaxed">
              {isAr
                ? 'متاح لتطوير وبناء تطبيقات الويب المتكاملة وأنظمة التصميم بدءاً من التخطيط وحتى النشر السحابي.'
                : 'Available for full-stack engineering, bespoke UI/UX architecture, and scalable web platforms.'}
            </p>
            <button
              onClick={() => navigate('/contact')}
              className="px-8 py-3.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs uppercase tracking-wider font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer"
            >
              {isAr ? 'تواصل معي لمناقشة التفاصيل' : 'Get in Touch'}
            </button>
          </div>
        </div>

        {/* Next / Previous Project Navigation Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-stroke/40">
          {prevProject ? (
            <button
              onClick={() => navigateToProject(prevProject.id)}
              className="p-5 rounded-2xl bg-surface border border-stroke hover:border-stroke/80 text-start group cursor-pointer transition-all"
            >
              <span className="text-xs text-muted font-mono block mb-1">
                {isAr ? '← المشروع السابق' : '← Previous Project'}
              </span>
              <span className="text-sm font-medium text-text-primary group-hover:text-white transition-colors line-clamp-1">
                {prevProject.title}
              </span>
            </button>
          ) : (
            <div />
          )}

          {nextProject ? (
            <button
              onClick={() => navigateToProject(nextProject.id)}
              className="p-5 rounded-2xl bg-surface border border-stroke hover:border-stroke/80 text-end group cursor-pointer transition-all"
            >
              <span className="text-xs text-muted font-mono block mb-1">
                {isAr ? 'المشروع التالي →' : 'Next Project →'}
              </span>
              <span className="text-sm font-medium text-text-primary group-hover:text-white transition-colors line-clamp-1">
                {nextProject.title}
              </span>
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Image Zoom Lightbox Modal */}
      <AnimatePresence>
        {zoomImage && (
          <div
            onClick={() => setZoomImage(null)}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
          >
            <motion.button
              onClick={() => setZoomImage(null)}
              className="fixed top-5 right-5 rtl:right-auto rtl:left-5 z-[10000] p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black"
            >
              <img src={zoomImage} alt="Zoom Preview" className="w-full h-full object-contain max-h-[85vh]" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
