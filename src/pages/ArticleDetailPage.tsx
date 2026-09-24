import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Twitter,
  Linkedin,
  Send,
  Link2,
  Check,
  Mail,
  MessageSquare,
  ThumbsUp,
  Clock,
  Calendar,
  Eye,
  Bookmark,
  Sparkles,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { TRANSLATIONS } from '../translations';

interface Comment {
  id: string;
  author: string;
  avatarBg: string;
  date: string;
  content: string;
  likes: number;
  hasLiked?: boolean;
}

const ARTICLE_IMAGES: Record<string, string> = {
  'fullstack-architecture':
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=85',
  'ui-ux-to-code':
    'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1600&q=85',
  'postgresql-prisma-optimization':
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1600&q=85',
  'docker-cicd-workflow':
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=85',
};

const ARTICLE_CONTENTS: Record<
  string,
  {
    tags: string[];
    ar: {
      lead: string;
      sections: {
        title: string;
        body: string;
        code?: string;
        quote?: string;
      }[];
    };
    en: {
      lead: string;
      sections: {
        title: string;
        body: string;
        code?: string;
        quote?: string;
      }[];
    };
  }
> = {
  'fullstack-architecture': {
    tags: ['Next.js', 'Prisma ORM', 'TypeScript', 'Full-Stack Architecture'],
    ar: {
      lead: 'مع زيادة تعقيد تطبيقات الويب الحديثة، لم يعد الاعتماد على كود متداخل خياراً قابلاً للاستمرار. في هذا المقال نستعرض كيف تبني معمارية برمجية تفصل بين منطق العمل، وواجهات برمجة التطبيقات، وطبقة البيانات.',
      sections: [
        {
          title: '١. المبادئ الأساسية لفصل الطبقات (Layered Architecture)',
          body: 'المعمارية الناجحة تعتمد على مبدأ مسؤولية المكون الواحد (Single Responsibility). نقسم التطبيق إلى أربع طبقات واضحة: Presentation Layer (مكونات الواجهة وتجربة المستخدم)، API Layer (نقاط النهاية والتحقق)، Service Layer (منطق العمليات والأنشطة)، و Data Access Layer (استعلامات Prisma وقاعدة البيانات).',
          quote: '«الكود النظيف ليس الكود الذي يكتب بسرعة، بل هو الكود الذي يمكن لمطور آخر قراءته وتطويره بعد عام كامل دون خوف.»',
        },
        {
          title: '٢. تنظيم استعلامات Prisma ونماذج البيانات',
          body: 'تجنب استدعاء قاعدة البيانات مباشرة من المكونات. قم دائماً بإنشاء مستودعات (Repositories) أو خدمات (Services) تستقبل البيانات النظيفة وتتحقق من صحتها عبر مكتبات مثل Zod.',
          code: `// lib/services/projectService.ts
import prisma from '@/lib/prisma';
import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(3),
  client: z.string(),
  year: z.string(),
});

export async function createProject(data: z.infer<typeof createProjectSchema>) {
  return await prisma.project.create({
    data,
  });
}`,
        },
        {
          title: '٣. تحسين سرعة الاستجابة واستراتيجيات الـ Caching',
          body: 'استخدم React Server Components (RSC) لجلب البيانات على الخادم مسبقاً، مع تطبيق Next.js ISR (Incremental Static Regeneration) لصفحات المقالات والمشاريع لضمان سرعة تحميل أقل من ١٠٠ ميلي ثانية.',
        },
      ],
    },
    en: {
      lead: 'As modern web applications grow in scale, ad-hoc spaghetti code becomes an insurmountable liability. Here is an architectural blueprint for isolating presentation, business logic, and database operations.',
      sections: [
        {
          title: '1. Fundamentals of Layered Full-Stack Architecture',
          body: 'A resilient architecture isolates concerns cleanly: UI Presentation Layer, API Request Validation Layer, Domain Service Layer, and Prisma Data Access Layer. This isolation allows effortless testing and maintainability.',
          quote: '"Clean code is not simply code written fast; it is code another engineer can confidently refactor twelve months later without fear."',
        },
        {
          title: '2. Structuring Prisma Repositories & Zod Validation',
          body: 'Never execute raw ORM queries inside client handlers. Encapsulate database interactions inside deterministic service modules validated with Zod schemas.',
          code: `// lib/services/projectService.ts
import prisma from '@/lib/prisma';
import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(3),
  client: z.string(),
  year: z.string(),
});

export async function createProject(data: z.infer<typeof createProjectSchema>) {
  return await prisma.project.create({
    data,
  });
}`,
        },
        {
          title: '3. Production Caching & Edge Performance',
          body: 'Leverage React Server Components (RSC) to minimize client bundle payloads, combined with Incremental Static Regeneration (ISR) for sub-100ms response times globally.',
        },
      ],
    },
  },
  'ui-ux-to-code': {
    tags: ['Figma', 'UI/UX Design', 'Tailwind CSS', 'Design Tokens'],
    ar: {
      lead: 'تحويل التصاميم من Figma إلى كود React حي ليس مجرد نسخ للألوان والمسافات؛ بل هو ترجمة دقيقة لمنطق التجاوب وحالات التفاعل الحركية.',
      sections: [
        {
          title: '١. مطابقة Design Tokens بين Figma وكود Tailwind',
          body: 'الخطوة الأولى هي توحيد المتغيرات: مقاييس التباعد (Spacing Scale)، تدرجات الخطوط (Typography Hierarchy)، ولوحات الألوان. استخدم متغيرات CSS ورموز Tailwind بحيث يتطابق اسم كل لون في Figma مع اسمه في الكود.',
          quote: '«التصميم الممتاز يفقد ٥٠٪ من قيمته إذا نُفّذ برمجياً بمسافات عشوائية أو سرعات حركة متقطعة.»',
        },
        {
          title: '٢. الحفاظ على المرونة التامة عبر الشاشات المختلفة',
          body: 'ابدأ دائماً بتصميم Mobile-First، ثم توسع للتابلت والحاسوب باستخدام CSS Grid و Flexbox دون قيم بكسل ثابتة تكسر الشاشة.',
          code: `/* Tailwind Component Example */
<div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
  <div className="md:col-span-7 space-y-4">
    <h2 className="text-2xl sm:text-4xl font-light tracking-tight">...</h2>
  </div>
</div>`,
        },
      ],
    },
    en: {
      lead: 'Translating Figma prototypes into production React components is an art of preserving design intent, spacing rhythms, and micro-interaction states.',
      sections: [
        {
          title: '1. Synchronizing Design Tokens with Tailwind CSS',
          body: 'Standardize your spacing system, type scales, and color variables. Ensure that every Figma layer matches semantic Tailwind utility classes identically.',
          quote: '"A brilliant interface loses half its impact if implemented with arbitrary margins or jagged frame rates."',
        },
        {
          title: '2. Fluid Responsive Layouts with CSS Grid',
          body: 'Adopt strict Mobile-First principles. Never rely on rigid pixel widths that degrade on intermediate viewport sizes.',
          code: `/* Tailwind Component Example */
<div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
  <div className="md:col-span-7 space-y-4">
    <h2 className="text-2xl sm:text-4xl font-light tracking-tight">...</h2>
  </div>
</div>`,
        },
      ],
    },
  },
  'postgresql-prisma-optimization': {
    tags: ['PostgreSQL', 'Prisma ORM', 'Database Indexing', 'Performance'],
    ar: {
      lead: 'قواعد البيانات هي قلب أي تطبيق ويب متقدم. إليك كيفية بناء جداول علائقية عالية الأداء مع منع اختناقات الاستعلامات (N+1 Query Problem).',
      sections: [
        {
          title: '١. الفهارس (Indexes) وتأثيرها على سرعة القراءة',
          body: 'إنشاء الفهارس المناسبة على الحقول المستخدمة بكثرة في الـ WHERE والـ JOIN يقلل وقت الاستعلام من ثوانٍ إلى ميلي ثوانٍ معدودة.',
          code: `// schema.prisma
model Article {
  id        String   @id @default(uuid())
  slug      String   @unique
  title     String
  createdAt DateTime @default(now())

  @@index([createdAt])
}`,
        },
        {
          title: '٢. حل مشكلة استعلامات N+1 في Prisma',
          body: 'استخدم دائماً خاصية include أو select بحذر، وتجنب جلب كائنات العلاقات المتداخلة داخل حلقات التكرار البرمجية.',
        },
      ],
    },
    en: {
      lead: 'Databases are the engine of every scalable platform. Here is how to architect PostgreSQL schemas and optimize Prisma ORM queries to prevent production bottlenecks.',
      sections: [
        {
          title: '1. Strategic Indexing on High-Cardinality Fields',
          body: 'Index columns that frequently participate in search predicates, sorting filters, and foreign-key joins.',
          code: `// schema.prisma
model Article {
  id        String   @id @default(uuid())
  slug      String   @unique
  title     String
  createdAt DateTime @default(now())

  @@index([createdAt])
}`,
        },
        {
          title: '2. Mitigating N+1 Query Traps in Prisma',
          body: 'Strictly utilize eager batch loading with include or pre-aggregated selects instead of nested iteration queries.',
        },
      ],
    },
  },
  'docker-cicd-workflow': {
    tags: ['Docker', 'DevOps', 'CI/CD Pipelines', 'Deployment'],
    ar: {
      lead: 'كيف تضمن أن التطبيق الذي يعمل على جهازك المحلي سيعمل بنفس الاستقرار تماماً في خوادم الإنتاج دون أخطاء بيئية مفاجئة.',
      sections: [
        {
          title: '١. بناء Dockerfile متعدد المراحل (Multi-Stage Builds)',
          body: 'استخدام Multi-Stage Docker Builds يقلل حجم صورة الحاوية من 1.2GB إلى أقل من 90MB، مما يسرع عملية النشر ويقلل استهلاك موارد السحابة.',
          code: `# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]`,
        },
        {
          title: '٢. أتمتة الفحص والاختبارات في GitHub Actions',
          body: 'ربط خط CI/CD يقوم تلقائياً بفحص TypeScript (tsc --noEmit) واختبارات الوحدات قبل السماح بدمج أي كود إلى الفرع الرئيسي.',
        },
      ],
    },
    en: {
      lead: 'Eliminating the "it works on my machine" syndrome with reproducible Docker containerization and deterministic GitHub Actions deployment pipelines.',
      sections: [
        {
          title: '1. Lightweight Multi-Stage Docker Builds',
          body: 'Multi-stage builds decouple build dependencies from the final lightweight runner image, slashing image sizes dramatically.',
          code: `# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]`,
        },
        {
          title: '2. Automated Quality Gates with GitHub Actions',
          body: 'Establish automated linting, type-checking, and build validation stages that gate every pull request.',
        },
      ],
    },
  },
};

const DEFAULT_COMMENTS: Comment[] = [
  {
    id: 'c-1',
    author: 'أحمد محمود',
    avatarBg: 'bg-blue-600',
    date: 'منذ يومين',
    content: 'مقال رائع ومعلومات دقيقة جداً خاصة في جزئية تنظيم المعمارية وفصل المسؤوليات. شكراً لك على هذا المحتوى القيم!',
    likes: 5,
  },
  {
    id: 'c-2',
    author: 'سارة المهندس',
    avatarBg: 'bg-emerald-600',
    date: 'منذ ٥ ساعات',
    content: 'الشرح العملي مع كود Prisma ساعدني كثيراً في مشروعي الحالي. هل تنصح باستخدام Prisma Accelerate في بيئات الـ Serverless؟',
    likes: 3,
  },
];

export const ArticleDetailPage: React.FC = () => {
  const { language } = useLanguage();
  const { activeEntityId, navigate, navigateToArticle } = useNavigation();
  const isAr = language === 'ar';
  const tJournal = TRANSLATIONS[language].journal;

  // Scroll reading progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Find target article
  const articleId = activeEntityId || 'fullstack-architecture';
  const articleIndex = tJournal.entries.findIndex((e) => e.id === articleId);
  const articleMeta = tJournal.entries[articleIndex !== -1 ? articleIndex : 0];
  const articleImage = ARTICLE_IMAGES[articleMeta.id] || ARTICLE_IMAGES['fullstack-architecture'];
  const articleContent = ARTICLE_CONTENTS[articleMeta.id] || ARTICLE_CONTENTS['fullstack-architecture'];

  // Previous & Next articles
  const prevArticle = articleIndex > 0 ? tJournal.entries[articleIndex - 1] : null;
  const nextArticle =
    articleIndex < tJournal.entries.length - 1 ? tJournal.entries[articleIndex + 1] : null;

  // Share state
  const [copiedLink, setCopiedLink] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Comments state with localStorage persistence
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem(`article_comments_${articleMeta.id}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_COMMENTS;
  });

  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  // Save comments on change
  useEffect(() => {
    try {
      localStorage.setItem(`article_comments_${articleMeta.id}`, JSON.stringify(comments));
    } catch {}
  }, [comments, articleMeta.id]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${articleMeta.title} - بقلم محمد أبو السعود`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareLinkedin = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${articleMeta.title} - ${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    try {
      const existing = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      existing.push({ email: newsletterEmail, date: new Date().toISOString() });
      localStorage.setItem('newsletter_subscribers', JSON.stringify(existing));
    } catch {}
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) return;

    const bgColors = ['bg-blue-600', 'bg-indigo-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600'];
    const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: authorName.trim(),
      avatarBg: randomBg,
      date: isAr ? 'الآن' : 'Just now',
      content: commentText.trim(),
      likes: 0,
    };

    setComments([newComment, ...comments]);
    setCommentText('');
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 3000);
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const hasLiked = c.hasLiked;
          return {
            ...c,
            likes: hasLiked ? c.likes - 1 : c.likes + 1,
            hasLiked: !hasLiked,
          };
        }
        return c;
      })
    );
  };

  const content = isAr ? articleContent.ar : articleContent.en;

  return (
    <div className="w-full pt-28 pb-24 md:pt-36 md:pb-32 bg-bg text-text-primary relative min-h-screen">
      {/* Top Reading Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#89AACC] via-[#4E85BF] to-[#89AACC] origin-left z-50"
        style={{ scaleX }}
      />

      <div className="max-w-[880px] mx-auto px-5 sm:px-8">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 mb-8 text-xs font-mono text-muted">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-muted hover:text-text-primary transition-colors cursor-pointer py-1 group"
          >
            <span className="rtl-flip group-hover:-translate-x-1 transition-transform">←</span>
            <span>{isAr ? 'العودة إلى المدونة' : 'Back to Articles'}</span>
          </button>

          <div className="flex items-center gap-2 text-muted/60 hidden sm:flex">
            <span className="hover:text-muted cursor-pointer" onClick={() => navigate('/')}>
              {isAr ? 'الرئيسية' : 'Home'}
            </span>
            <span>/</span>
            <span className="hover:text-muted cursor-pointer" onClick={() => navigate('/blog')}>
              {isAr ? 'المدونة' : 'Blog'}
            </span>
            <span>/</span>
            <span className="text-text-primary truncate max-w-[200px]">{articleMeta.title}</span>
          </div>
        </div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {articleContent.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-[11px] font-mono bg-surface border border-stroke text-[#89AACC]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-text-primary leading-tight mb-6">
            {articleMeta.title}
          </h1>

          {/* Excerpt / Lead */}
          <p className="text-base sm:text-lg text-muted/90 leading-relaxed font-normal mb-8">
            {content.lead}
          </p>

          {/* Author Metadata Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface/70 border border-stroke flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-stroke shrink-0">
                <img
                  src="https://res.cloudinary.com/oe19gniu/image/upload/v1790271150/WhatsApp_Image_2026-09-22_at_5.36.09_PM.jpg"
                  alt="Mohamed Abu Al-Saud"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">
                  {isAr ? 'محمد أبو السعود' : 'Mohamed Abu Al-Saud'}
                </div>
                <div className="text-xs text-muted font-mono mt-0.5">
                  {isAr ? 'مطور Full-Stack & مصمم UI/UX' : 'Full-Stack Developer & UI/UX'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-muted">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#89AACC]" />
                <span>{articleMeta.readTime}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#89AACC]" />
                <span>{articleMeta.date}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-stroke shadow-2xl mb-12 bg-surface"
        >
          <img
            src={articleImage}
            alt={articleMeta.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent pointer-events-none" />
        </motion.div>

        {/* Article Body Content */}
        <article className="prose prose-invert max-w-none mb-14 space-y-10">
          {content.sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-light text-text-primary tracking-tight pt-2 border-b border-stroke/30 pb-2">
                {section.title}
              </h2>
              <p className="text-base text-muted/90 leading-relaxed font-normal">
                {section.body}
              </p>

              {/* Optional Callout Quote */}
              {section.quote && (
                <div className="p-5 sm:p-6 rounded-2xl bg-surface/50 border-r-4 rtl:border-r-4 rtl:border-l-0 border-l-4 border-[#89AACC] my-6 italic text-text-primary font-display text-base sm:text-lg">
                  {section.quote}
                </div>
              )}

              {/* Optional Code Snippet */}
              {section.code && (
                <div className="rounded-2xl bg-black/70 border border-stroke/80 overflow-hidden my-6 shadow-xl">
                  <div className="px-4 py-2 bg-surface/90 border-b border-stroke flex items-center justify-between text-xs font-mono text-muted">
                    <span className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-[#89AACC]" />
                      Code Architecture
                    </span>
                    <span>TypeScript</span>
                  </div>
                  <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                    <code>{section.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </article>

        {/* Share Article Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-stroke mb-14 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-medium text-text-primary flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#89AACC]" />
                <span>{isAr ? 'هل أعجبك المقال؟ شاركه مع مجتمعك' : 'Found this insightful? Share it'}</span>
              </h3>
              <p className="text-xs text-muted mt-1">
                {isAr
                  ? 'ساهم في نشر المعرفة البرمجية بمشاركة هذا المقال مع زملائك المطورين.'
                  : 'Spread technical engineering knowledge with your developer network.'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleShareTwitter}
                className="px-3.5 py-2 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-text-primary text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Share on X / Twitter"
              >
                <Twitter className="w-3.5 h-3.5 text-sky-400" />
                <span>X</span>
              </button>

              <button
                onClick={handleShareLinkedin}
                className="px-3.5 py-2 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-text-primary text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-500" />
                <span>LinkedIn</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="px-3.5 py-2 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-text-primary text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Share on WhatsApp"
              >
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title={isAr ? 'نسخ الرابط' : 'Copy link'}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Link2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription Section */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-surface via-surface to-surface/80 border border-stroke mb-16 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full accent-gradient opacity-10 blur-2xl pointer-events-none" />

          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono bg-bg border border-stroke text-[#89AACC] mb-3">
              <Mail className="w-3.5 h-3.5" />
              <span>{isAr ? 'النشرة البريدية التقنية' : 'Engineering Newsletter'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-light text-text-primary tracking-tight mb-3">
              {isAr ? 'احصل على مقالات هندسية أسبوعية في بريدك' : 'Subscribe for Weekly Technical Insights'}
            </h3>

            <p className="text-sm text-muted leading-relaxed mb-6">
              {isAr
                ? 'أشارك بانتظام مقالات حصرية حول معمارية Full-Stack و Next.js وأنظمة التصميم وقواعد البيانات دون أي رسائل ترويجية.'
                : 'Exclusive articles on full-stack architecture, React performance, and scalable databases directly to your inbox.'}
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={isAr ? 'أدخل بريدك الإلكتروني...' : 'Enter your email address...'}
                className="flex-grow bg-bg border border-stroke focus:border-[#89AACC]/80 rounded-full px-5 py-3 text-sm text-text-primary placeholder:text-muted/60 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="px-7 py-3 rounded-full bg-text-primary text-bg hover:bg-white text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer shadow-md shrink-0"
              >
                {isAr ? 'اشتراك الآن' : 'Subscribe'}
              </button>
            </form>

            {newsletterSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{isAr ? 'شكراً لاشتراكك! تم تسجيل بريدك بنجاح.' : 'Thank you for subscribing! We respect your inbox.'}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Interactive Comments Section */}
        <section id="comments" className="mb-16">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-[#89AACC]" />
              <h3 className="text-2xl font-light text-text-primary tracking-tight">
                {isAr ? 'التعليقات والمناقشات' : 'Discussion & Comments'}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-surface border border-stroke text-muted">
                {comments.length}
              </span>
            </div>
          </div>

          {/* Add Comment Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-stroke mb-8 shadow-sm">
            <h4 className="text-sm font-medium text-text-primary mb-4">
              {isAr ? 'أضف تعليقك أو استفسارك التقني' : 'Leave a comment or question'}
            </h4>

            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder={isAr ? 'اسمك الكريم *' : 'Your name *'}
                  className="bg-bg border border-stroke focus:border-[#89AACC]/80 rounded-2xl px-4 py-2.5 text-sm text-text-primary placeholder:text-muted/60 focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  placeholder={isAr ? 'بريدك الإلكتروني (اختياري، لن يُنشر)' : 'Email address (optional, never shared)'}
                  className="bg-bg border border-stroke focus:border-[#89AACC]/80 rounded-2xl px-4 py-2.5 text-sm text-text-primary placeholder:text-muted/60 focus:outline-none transition-colors"
                />
              </div>

              <textarea
                required
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={isAr ? 'اكتب تعليقك أو رأيك حول المقال هنا...' : 'Write your comment or thoughts here...'}
                className="w-full bg-bg border border-stroke focus:border-[#89AACC]/80 rounded-2xl p-4 text-sm text-text-primary placeholder:text-muted/60 focus:outline-none transition-colors resize-y min-h-[90px]"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-muted font-mono">
                  {isAr ? 'سيظهر تعليقك فورياً للمناقشة.' : 'Your comment will be posted instantly.'}
                </span>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  {isAr ? 'إرسال التعليق' : 'Post Comment'}
                </button>
              </div>

              {commentSubmitted && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{isAr ? 'تم نشر تعليقك بنجاح!' : 'Your comment was posted successfully!'}</span>
                </div>
              )}
            </form>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-5 sm:p-6 rounded-2xl bg-surface/60 border border-stroke hover:border-stroke/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full ${comment.avatarBg} text-white flex items-center justify-center text-xs font-bold shrink-0`}
                    >
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">{comment.author}</div>
                      <div className="text-[11px] text-muted font-mono">{comment.date}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-colors cursor-pointer border ${
                      comment.hasLiked
                        ? 'bg-[#89AACC]/20 border-[#89AACC]/50 text-white'
                        : 'bg-surface border-stroke text-muted hover:text-text-primary'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{comment.likes}</span>
                  </button>
                </div>

                <p className="text-sm text-muted/90 leading-relaxed pl-12 rtl:pl-0 rtl:pr-12">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Previous & Next Article Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-stroke/40">
          {prevArticle ? (
            <button
              onClick={() => navigateToArticle(prevArticle.id)}
              className="p-5 rounded-2xl bg-surface border border-stroke hover:border-stroke/80 text-start group cursor-pointer transition-all"
            >
              <span className="text-xs text-muted font-mono block mb-1">
                {isAr ? '← المقال السابق' : '← Previous Article'}
              </span>
              <span className="text-sm font-medium text-text-primary group-hover:text-white transition-colors line-clamp-1">
                {prevArticle.title}
              </span>
            </button>
          ) : (
            <div />
          )}

          {nextArticle ? (
            <button
              onClick={() => navigateToArticle(nextArticle.id)}
              className="p-5 rounded-2xl bg-surface border border-stroke hover:border-stroke/80 text-end group cursor-pointer transition-all"
            >
              <span className="text-xs text-muted font-mono block mb-1">
                {isAr ? 'المقال التالي →' : 'Next Article →'}
              </span>
              <span className="text-sm font-medium text-text-primary group-hover:text-white transition-colors line-clamp-1">
                {nextArticle.title}
              </span>
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
};
