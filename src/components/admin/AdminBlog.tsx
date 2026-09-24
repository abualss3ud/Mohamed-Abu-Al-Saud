import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Globe,
  EyeOff,
  Search,
  Calendar,
  Tag,
  Clock,
  X,
  FileText,
  Sparkles,
  Languages,
  MessageSquare,
  Code2,
  Send,
  CheckCircle2,
  XCircle,
  Bell,
  ThumbsUp,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLanguage } from '../../context/LanguageContext';
import { Article, CodeSnippet, ArticleComment } from '../../types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export const AdminBlog: React.FC = () => {
  const {
    articles,
    saveArticle,
    deleteArticle,
    comments,
    replyToArticleComment,
    updateCommentStatus,
    deleteArticleComment,
    markCommentsAsRead,
    showToast,
  } = usePortfolio();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'articles' | 'comments'>('articles');
  const [commentSearch, setCommentSearch] = useState('');
  const [commentFilterStatus, setCommentFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<ArticleComment | null>(null);
  const [formTab, setFormTab] = useState<'ar' | 'en' | 'code' | 'meta'>('ar');

  const emptyArticle: Article = {
    id: `art-${Date.now()}`,
    title: '',
    titleAr: '',
    titleEn: '',
    slug: '',
    excerpt: '',
    excerptAr: '',
    excerptEn: '',
    content: '',
    contentAr: '',
    contentEn: '',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=85',
    category: 'Architecture',
    categoryAr: 'معمارية الويب والأنظمة',
    categoryEn: 'Web Architecture',
    tags: ['Full-Stack', 'React', 'TypeScript', 'Node.js'],
    tagsAr: ['تطوير الويب', 'أداء متقدم', 'أنظمة التصميم'],
    tagsEn: ['Web Engineering', 'Performance', 'Design Systems'],
    publishedDate: new Date().toISOString().split('T')[0],
    status: 'published',
  };

  const categories = Array.from(
    new Set(articles.flatMap((a) => [a.category, a.categoryAr, a.categoryEn]).filter(Boolean))
  );

  const filteredArticles = articles.filter((article) => {
    const q = searchQuery.toLowerCase();
    const titleAr = article.titleAr || '';
    const titleEn = article.titleEn || article.title || '';
    const excerptAr = article.excerptAr || '';
    const excerptEn = article.excerptEn || article.excerpt || '';

    const matchesSearch =
      titleAr.toLowerCase().includes(q) ||
      titleEn.toLowerCase().includes(q) ||
      excerptAr.toLowerCase().includes(q) ||
      excerptEn.toLowerCase().includes(q) ||
      article.tags.some((t) => t.toLowerCase().includes(q));

    const matchesCategory =
      filterCategory === 'all' ||
      article.category === filterCategory ||
      article.categoryAr === filterCategory ||
      article.categoryEn === filterCategory;

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && article.status === 'published') ||
      (filterStatus === 'draft' && article.status === 'draft');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreate = () => {
    setEditingArticle({ ...emptyArticle, id: `art-${Date.now()}` });
    setFormTab(isAr ? 'ar' : 'en');
    setIsCreating(true);
  };

  const handleEdit = (article: Article) => {
    setEditingArticle({
      ...article,
      titleAr: article.titleAr || (isAr ? article.title : ''),
      titleEn: article.titleEn || (!isAr ? article.title : article.title),
      excerptAr: article.excerptAr || (isAr ? article.excerpt : ''),
      excerptEn: article.excerptEn || (!isAr ? article.excerpt : article.excerpt),
      contentAr: article.contentAr || (isAr ? article.content : ''),
      contentEn: article.contentEn || (!isAr ? article.content : article.content),
      categoryAr: article.categoryAr || article.category,
      categoryEn: article.categoryEn || article.category,
      tagsAr: article.tagsAr || article.tags,
      tagsEn: article.tagsEn || article.tags,
    });
    setFormTab(isAr ? 'ar' : 'en');
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    const primaryTitle =
      (isAr ? editingArticle.titleAr : editingArticle.titleEn) ||
      editingArticle.titleEn ||
      editingArticle.titleAr ||
      editingArticle.title;

    if (!primaryTitle?.trim()) {
      showToast(isAr ? 'يرجى كتابة عنوان للمقال' : 'Please provide an article title', 'destructive');
      return;
    }

    const titleEn = editingArticle.titleEn?.trim() || primaryTitle;
    const titleAr = editingArticle.titleAr?.trim() || primaryTitle;
    const excerptEn = editingArticle.excerptEn?.trim() || editingArticle.excerpt || '';
    const excerptAr = editingArticle.excerptAr?.trim() || editingArticle.excerpt || '';
    const contentEn = editingArticle.contentEn?.trim() || editingArticle.content || '';
    const contentAr = editingArticle.contentAr?.trim() || editingArticle.content || '';

    const formattedSlug =
      editingArticle.slug.trim() ||
      titleEn
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') ||
      `article-${Date.now()}`;

    const updated: Article = {
      ...editingArticle,
      title: isAr ? titleAr : titleEn,
      titleAr,
      titleEn,
      excerpt: isAr ? excerptAr : excerptEn,
      excerptAr,
      excerptEn,
      content: isAr ? contentAr : contentEn,
      contentAr,
      contentEn,
      category: isAr ? (editingArticle.categoryAr || editingArticle.category) : (editingArticle.categoryEn || editingArticle.category),
      categoryAr: editingArticle.categoryAr || editingArticle.category,
      categoryEn: editingArticle.categoryEn || editingArticle.category,
      tags: isAr ? (editingArticle.tagsAr || editingArticle.tags) : (editingArticle.tagsEn || editingArticle.tags),
      tagsAr: editingArticle.tagsAr,
      tagsEn: editingArticle.tagsEn,
      slug: formattedSlug,
    };

    saveArticle(updated);
    showToast(
      isCreating
        ? isAr
          ? 'تم نشر/حفظ المقال باللغتين بنجاح'
          : 'Article created in both languages'
        : isAr
        ? 'تم تحديث بيانات المقال باللغتين'
        : 'Article updated in both languages',
      'success'
    );
    setEditingArticle(null);
    setIsCreating(false);
  };

  const togglePublish = (article: Article) => {
    saveArticle({
      ...article,
      status: article.status === 'published' ? 'draft' : 'published',
    });
    showToast(
      article.status === 'published'
        ? isAr
          ? 'تم تحويل المقال لمسودة'
          : 'Article reverted to draft'
        : isAr
        ? 'تم نشر المقال'
        : 'Article published',
      'info'
    );
  };

  const confirmDelete = () => {
    if (articleToDelete) {
      deleteArticle(articleToDelete.id);
      showToast(isAr ? 'تم حذف المقال' : 'Article removed', 'info');
      setArticleToDelete(null);
    }
  };

  const unreadCommentsCount = comments.filter((c) => !c.isReadByAdmin).length;

  const filteredComments = comments.filter((comment) => {
    const q = commentSearch.toLowerCase();
    const matchesSearch =
      comment.authorName.toLowerCase().includes(q) ||
      (comment.authorEmail || '').toLowerCase().includes(q) ||
      (comment.articleTitle || '').toLowerCase().includes(q) ||
      comment.content.toLowerCase().includes(q);

    const matchesStatus =
      commentFilterStatus === 'all' || comment.status === commentFilterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleSendReply = (commentId: string) => {
    if (!replyText.trim()) return;
    replyToArticleComment(commentId, replyText.trim());
    setReplyText('');
    setActiveReplyId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Main Navigation Tabs: Articles vs Comments */}
      <div className="flex items-center gap-2 p-1.5 bg-surface border border-stroke rounded-2xl max-w-md shadow-sm">
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'articles'
              ? 'bg-text-primary text-bg font-bold shadow'
              : 'text-muted hover:text-text-primary'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isAr ? 'إدارة المقالات' : 'Manage Articles'}</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('comments');
            markCommentsAsRead();
          }}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer flex items-center justify-center gap-2 relative ${
            activeTab === 'comments'
              ? 'bg-text-primary text-bg font-bold shadow'
              : 'text-muted hover:text-text-primary'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{isAr ? 'التعليقات والردود' : 'Comments & Replies'}</span>
          {unreadCommentsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
              {unreadCommentsCount}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'articles' ? (
        <>
          {/* Top Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-surface border border-stroke shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-display italic text-text-primary">
              {isAr ? 'إدارة المقالات والمدونة' : 'Blog & Technical Journal'}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#89AACC]/15 text-[#89AACC] border border-[#89AACC]/30">
              <Languages className="w-3 h-3" />
              <span>{isAr ? 'عربي / English' : 'Bilingual AR/EN'}</span>
            </span>
          </div>
          <p className="text-xs text-muted">
            {isAr
              ? 'كتابة وتعديل المقالات الهندسية باللغتين العربية والإنجليزية مع إمكانية إدارة المسودات والوسوم.'
              : 'Write and edit engineering articles in both Arabic and English with draft states and tags.'}
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-5 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'كتابة مقال جديد (AR/EN)' : 'New Article (AR/EN)'}</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="p-4 rounded-2xl bg-surface border border-stroke flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث في المقالات والوسوم بالعربية والإنجليزية...' : 'Search articles and tags in AR/EN...'}
            className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-full px-4 py-2 text-xs text-text-primary placeholder:text-muted/60 focus:outline-none pl-9 rtl:pl-4 rtl:pr-9"
          />
          <Search className="w-3.5 h-3.5 text-muted absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-bg border border-stroke rounded-full px-3.5 py-2 text-xs text-text-primary focus:outline-none cursor-pointer"
          >
            <option value="all">{isAr ? 'جميع التصنيفات' : 'All Categories'}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-bg border border-stroke rounded-full px-3.5 py-2 text-xs text-text-primary focus:outline-none cursor-pointer"
          >
            <option value="all">{isAr ? 'جميع الحالات' : 'All Status'}</option>
            <option value="published">{isAr ? 'منشور فقط' : 'Published Only'}</option>
            <option value="draft">{isAr ? 'مسودات فقط' : 'Drafts Only'}</option>
          </select>
        </div>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingArticle && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="w-full max-w-4xl bg-surface border border-stroke rounded-3xl p-6 sm:p-8 shadow-2xl my-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stroke">
                <h3 className="text-lg font-display italic text-text-primary font-semibold">
                  {isCreating
                    ? isAr
                      ? 'كتابة مقال جديد (بالعربي والإنجليزي)'
                      : 'Write New Article (Bilingual AR/EN)'
                    : isAr
                    ? `تعديل مقال: ${editingArticle.titleAr || editingArticle.titleEn || editingArticle.title}`
                    : `Edit Article: ${editingArticle.titleEn || editingArticle.titleAr || editingArticle.title}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="p-1.5 rounded-full hover:bg-bg text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Bilingual Tab Switcher */}
              <div className="flex items-center gap-2 p-1.5 bg-bg rounded-2xl border border-stroke mb-6 max-w-lg">
                <button
                  type="button"
                  onClick={() => setFormTab('ar')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    formTab === 'ar'
                      ? 'bg-text-primary text-bg font-semibold shadow'
                      : 'text-muted hover:text-text-primary'
                  }`}
                >
                  <span>🇸🇦 {isAr ? 'عربي' : 'Arabic'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormTab('en')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    formTab === 'en'
                      ? 'bg-text-primary text-bg font-semibold shadow'
                      : 'text-muted hover:text-text-primary'
                  }`}
                >
                  <span>🇬🇧 English</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormTab('code')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    formTab === 'code'
                      ? 'bg-text-primary text-bg font-semibold shadow'
                      : 'text-muted hover:text-text-primary'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'الأكواد' : 'Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormTab('meta')}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    formTab === 'meta'
                      ? 'bg-text-primary text-bg font-semibold shadow'
                      : 'text-muted hover:text-text-primary'
                  }`}
                >
                  <span>⚙️ {isAr ? 'الإعدادات' : 'Settings'}</span>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* 1. ARABIC CONTENT */}
                {formTab === 'ar' && (
                  <div className="space-y-4" dir="rtl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          عنوان المقال بالعربية *
                        </label>
                        <input
                          type="text"
                          required={formTab === 'ar' && !editingArticle.titleEn}
                          value={editingArticle.titleAr || ''}
                          onChange={(e) =>
                            setEditingArticle({ ...editingArticle, titleAr: e.target.value })
                          }
                          placeholder="مثال: كيف تبني معمارية تطبيقات الويب فائقة السرعة"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          التصنيف بالعربية
                        </label>
                        <input
                          type="text"
                          value={editingArticle.categoryAr || ''}
                          onChange={(e) =>
                            setEditingArticle({ ...editingArticle, categoryAr: e.target.value })
                          }
                          placeholder="مثال: معمارية الويب، أنظمة التصميم، قواعد البيانات"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        المقتطف والملخص بالعربية
                      </label>
                      <textarea
                        rows={2}
                        value={editingArticle.excerptAr || ''}
                        onChange={(e) =>
                          setEditingArticle({ ...editingArticle, excerptAr: e.target.value })
                        }
                        placeholder="ملخص جذاب وموجز يظهر في بطاقات المدونة..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        المحتوى الكامل للمقال بالعربية
                      </label>
                      <textarea
                        rows={8}
                        value={editingArticle.contentAr || ''}
                        onChange={(e) =>
                          setEditingArticle({ ...editingArticle, contentAr: e.target.value })
                        }
                        placeholder="اكتب المحتوى الكامل للمقال هنا (يدعم التقسيم والفقرات)..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-4 text-xs text-text-primary focus:outline-none resize-y font-sans leading-relaxed text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        الوسوم بالعربية (مفصولة بفواصل)
                      </label>
                      <input
                        type="text"
                        value={(editingArticle.tagsAr || []).join('، ')}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            tagsAr: e.target.value
                              .split(/[,،]/)
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="رياكت، تايب سكريبت، أداء عالي"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none text-right"
                      />
                    </div>
                  </div>
                )}

                {/* 2. ENGLISH CONTENT */}
                {formTab === 'en' && (
                  <div className="space-y-4" dir="ltr">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          Article Title in English *
                        </label>
                        <input
                          type="text"
                          required={formTab === 'en' && !editingArticle.titleAr}
                          value={editingArticle.titleEn || ''}
                          onChange={(e) =>
                            setEditingArticle({ ...editingArticle, titleEn: e.target.value })
                          }
                          placeholder="e.g. Architecting High-Performance Web Applications in 2026"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          Category in English
                        </label>
                        <input
                          type="text"
                          value={editingArticle.categoryEn || ''}
                          onChange={(e) =>
                            setEditingArticle({ ...editingArticle, categoryEn: e.target.value })
                          }
                          placeholder="e.g. Architecture, Design Systems, Database"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        Article Excerpt in English
                      </label>
                      <textarea
                        rows={2}
                        value={editingArticle.excerptEn || ''}
                        onChange={(e) =>
                          setEditingArticle({ ...editingArticle, excerptEn: e.target.value })
                        }
                        placeholder="Short compelling summary for blog cards and previews..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        Full Article Content in English
                      </label>
                      <textarea
                        rows={8}
                        value={editingArticle.contentEn || ''}
                        onChange={(e) =>
                          setEditingArticle({ ...editingArticle, contentEn: e.target.value })
                        }
                        placeholder="Write the comprehensive article content here..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-4 text-xs text-text-primary focus:outline-none resize-y font-sans leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        Tags in English (comma separated)
                      </label>
                      <input
                        type="text"
                        value={(editingArticle.tagsEn || []).join(', ')}
                        onChange={(e) =>
                          setEditingArticle({
                            ...editingArticle,
                            tagsEn: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="React, TypeScript, Performance, Architecture"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 3. CODE SNIPPETS TAB */}
                {formTab === 'code' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-stroke">
                      <div>
                        <span className="text-xs font-mono font-bold text-text-primary block">
                          {isAr ? 'الأكواد والمقتطفات البرمجية لهذا المقال' : 'Code Snippets for Article'}
                        </span>
                        <span className="text-[11px] text-muted">
                          {isAr ? 'ستظهر ككتل أكواد منسقة ومظللة بالكامل مع إمكانية النسخ.' : 'Rendered as syntax-highlighted code blocks with direct copy button.'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const newSnippet: CodeSnippet = {
                            id: `snip-${Date.now()}`,
                            language: 'typescript',
                            title: isAr ? 'مثال كود برمجي' : 'Code Implementation',
                            code: '// Write your code snippet here\n',
                            explanationAr: 'شرح موجز لمحتوى الكود...',
                            explanationEn: 'Brief explanation note...',
                          };
                          setEditingArticle({
                            ...editingArticle,
                            codeSnippets: [...(editingArticle.codeSnippets || []), newSnippet],
                          });
                        }}
                        className="px-4 py-2 rounded-full bg-bg border border-stroke text-xs font-mono text-[#89AACC] hover:text-white hover:border-[#89AACC] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAr ? 'إضافة كود جديد' : 'Add Code Snippet'}</span>
                      </button>
                    </div>

                    {(!editingArticle.codeSnippets || editingArticle.codeSnippets.length === 0) ? (
                      <div className="p-8 text-center rounded-2xl bg-bg border border-stroke text-xs text-muted font-mono">
                        {isAr
                          ? 'لم تقم بإضافة أي مقتطفات أكواد لهذا المقال بعد. انقر "إضافة كود جديد" لإتاحة تجربة قراءة تفاعلية للمطورين.'
                          : 'No code snippets added yet. Click "Add Code Snippet" to add interactive developer blocks.'}
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                        {editingArticle.codeSnippets.map((snip, sIdx) => (
                          <div key={snip.id} className="p-4 rounded-2xl bg-bg border border-stroke space-y-3 shadow-inner">
                            <div className="flex items-center justify-between gap-3">
                              <input
                                type="text"
                                value={snip.title || ''}
                                onChange={(e) => {
                                  const updatedSnippets = [...(editingArticle.codeSnippets || [])];
                                  updatedSnippets[sIdx] = { ...snip, title: e.target.value };
                                  setEditingArticle({ ...editingArticle, codeSnippets: updatedSnippets });
                                }}
                                placeholder={isAr ? 'عنوان الملف أو الكود (مثال: lib/services/user.ts)' : 'Code title / file path (e.g. lib/services/user.ts)'}
                                className="bg-surface border border-stroke focus:border-[#89AACC] rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none flex-grow"
                              />

                              <select
                                value={snip.language || 'typescript'}
                                onChange={(e) => {
                                  const updatedSnippets = [...(editingArticle.codeSnippets || [])];
                                  updatedSnippets[sIdx] = { ...snip, language: e.target.value };
                                  setEditingArticle({ ...editingArticle, codeSnippets: updatedSnippets });
                                }}
                                className="bg-surface border border-stroke rounded-xl px-3 py-1.5 text-xs text-text-primary font-mono focus:outline-none cursor-pointer"
                              >
                                <option value="typescript">TypeScript</option>
                                <option value="javascript">JavaScript</option>
                                <option value="react">React / JSX</option>
                                <option value="sql">PostgreSQL / SQL</option>
                                <option value="python">Python</option>
                                <option value="bash">Bash / Terminal</option>
                                <option value="json">JSON Config</option>
                                <option value="css">CSS / Tailwind</option>
                                <option value="html">HTML5</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => {
                                  const updatedSnippets = editingArticle.codeSnippets?.filter((_, i) => i !== sIdx);
                                  setEditingArticle({ ...editingArticle, codeSnippets: updatedSnippets });
                                }}
                                className="p-1.5 rounded-lg text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title={isAr ? 'حذف هذا الكود' : 'Remove Snippet'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <textarea
                              rows={5}
                              value={snip.code || ''}
                              onChange={(e) => {
                                const updatedSnippets = [...(editingArticle.codeSnippets || [])];
                                updatedSnippets[sIdx] = { ...snip, code: e.target.value };
                                setEditingArticle({ ...editingArticle, codeSnippets: updatedSnippets });
                              }}
                              placeholder="// Write or paste source code here..."
                              className="w-full bg-[#080C14] border border-stroke/80 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none leading-relaxed"
                            />

                            <input
                              type="text"
                              value={isAr ? snip.explanationAr || '' : snip.explanationEn || ''}
                              onChange={(e) => {
                                const updatedSnippets = [...(editingArticle.codeSnippets || [])];
                                if (isAr) {
                                  updatedSnippets[sIdx] = { ...snip, explanationAr: e.target.value };
                                } else {
                                  updatedSnippets[sIdx] = { ...snip, explanationEn: e.target.value };
                                }
                                setEditingArticle({ ...editingArticle, codeSnippets: updatedSnippets });
                              }}
                              placeholder={isAr ? 'ملاحظة أو شرح خفيف يظهر أسفل المربع (اختياري)...' : 'Brief explanation note below code box (optional)...'}
                              className="w-full bg-surface border border-stroke rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. SETTINGS & MEDIA */}
                {formTab === 'meta' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        {isAr ? 'رابط صورة الغلاف (Cover Image URL)' : 'Cover Image URL'}
                      </label>
                      <input
                        type="url"
                        value={editingArticle.coverImage}
                        onChange={(e) =>
                          setEditingArticle({ ...editingArticle, coverImage: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/..."
                        dir="ltr"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          {isAr ? 'تاريخ النشر' : 'Publication Date'}
                        </label>
                        <input
                          type="date"
                          value={editingArticle.publishedDate}
                          onChange={(e) =>
                            setEditingArticle({
                              ...editingArticle,
                              publishedDate: e.target.value,
                            })
                          }
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          {isAr ? 'المعرّف الرابطي (Slug)' : 'URL Slug'}
                        </label>
                        <input
                          type="text"
                          value={editingArticle.slug}
                          onChange={(e) =>
                            setEditingArticle({ ...editingArticle, slug: e.target.value })
                          }
                          placeholder="e.g. modern-react-architecture"
                          dir="ltr"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editingArticle.status === 'published'}
                          onChange={(e) =>
                            setEditingArticle({
                              ...editingArticle,
                              status: e.target.checked ? 'published' : 'draft',
                            })
                          }
                          className="w-4 h-4 rounded bg-bg border border-stroke text-[#89AACC]"
                        />
                        <span>{isAr ? 'نشر المقال على المدونة مباشرة' : 'Publish live on blog'}</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-stroke">
                  <button
                    type="button"
                    onClick={() => setFormTab(formTab === 'ar' ? 'en' : formTab === 'en' ? 'meta' : 'ar')}
                    className="text-xs text-muted hover:text-text-primary flex items-center gap-1 font-mono transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#89AACC]" />
                    <span>{isAr ? 'الانتقال للتبويب التالي' : 'Switch Tab'}</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingArticle(null)}
                      className="px-5 py-2.5 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-xs font-medium text-text-primary transition-colors cursor-pointer"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      {isAr ? 'حفظ المقال باللغتين' : 'Save Article (Bilingual)'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((article) => {
          const displayTitle = (isAr ? article.titleAr : article.titleEn) || article.title;
          const displayExcerpt = (isAr ? article.excerptAr : article.excerptEn) || article.excerpt;
          const displayCategory = (isAr ? article.categoryAr : article.categoryEn) || article.category;
          const displayTags = (isAr ? article.tagsAr : article.tagsEn) || article.tags || [];

          return (
            <div
              key={article.id}
              className="p-6 rounded-3xl bg-surface border border-stroke hover:border-[#89AACC]/40 transition-all flex flex-col justify-between gap-4 shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-bg border border-stroke shrink-0">
                      <img
                        src={article.coverImage || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=300&q=80'}
                        alt={displayTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-text-primary line-clamp-1">{displayTitle}</h3>
                        {(article.titleAr && article.titleEn) && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#89AACC]/20 text-[#89AACC]">AR+EN</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-muted mt-0.5">
                        <span>{displayCategory}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{article.publishedDate}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => togglePublish(article)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium transition-colors cursor-pointer shrink-0 ${
                      article.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {article.status === 'published' ? (isAr ? 'منشور' : 'Published') : (isAr ? 'مسودة' : 'Draft')}
                  </button>
                </div>

                <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-4">
                  {displayExcerpt}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {displayTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-bg border border-stroke text-[11px] font-mono text-muted flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5 text-[#89AACC]" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stroke/60 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(article)}
                  className="px-3.5 py-1.5 rounded-full bg-bg hover:bg-stroke/60 text-xs font-medium text-text-primary border border-stroke transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-[#89AACC]" />
                  <span>{isAr ? 'تعديل (AR/EN)' : 'Edit (AR/EN)'}</span>
                </button>

                <button
                  onClick={() => setArticleToDelete(article)}
                  className="p-1.5 rounded-full hover:bg-rose-500/10 text-muted hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                  title={isAr ? 'حذف المقال' : 'Delete Article'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
        </>
      ) : (
        /* COMMENTS & DISCUSSION MANAGEMENT VIEW */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-surface border border-stroke shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-5 h-5 text-[#89AACC]" />
                <h2 className="text-xl sm:text-2xl font-display italic text-text-primary">
                  {isAr ? 'إدارة تعليقات ومناقشات المدونة' : 'Blog Comments & Reader Discussions'}
                </h2>
              </div>
              <p className="text-xs text-muted">
                {isAr
                  ? 'مراجعة تعليقات القراء، الموافقة عليها، والرد المباشر بصفة المطور ليظهر ردك فوراً أسفل المقال.'
                  : 'Review reader comments, approve discussions, and reply directly as author.'}
              </p>
            </div>

            {unreadCommentsCount > 0 && (
              <div className="px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2 shrink-0">
                <Bell className="w-4 h-4 animate-bounce text-rose-400" />
                <span>
                  {isAr
                    ? `لديك ${unreadCommentsCount} تعليق جديد بحاجة لمراجعتك`
                    : `${unreadCommentsCount} new comment(s) awaiting review`}
                </span>
              </div>
            )}
          </div>

          {/* Search & Status Filter */}
          <div className="p-4 rounded-2xl bg-surface border border-stroke flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                value={commentSearch}
                onChange={(e) => setCommentSearch(e.target.value)}
                placeholder={isAr ? 'بحث بالاسم، الإيميل، عنوان المقال، أو نص التعليق...' : 'Search author, email, article title, or comment text...'}
                className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-full px-4 py-2 text-xs text-text-primary placeholder:text-muted/60 focus:outline-none pl-9 rtl:pl-4 rtl:pr-9"
              />
              <Search className="w-3.5 h-3.5 text-muted absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <select
              value={commentFilterStatus}
              onChange={(e) => setCommentFilterStatus(e.target.value as any)}
              className="bg-bg border border-stroke rounded-full px-3.5 py-2 text-xs text-text-primary focus:outline-none cursor-pointer"
            >
              <option value="all">{isAr ? 'جميع التعليقات' : 'All Comments'}</option>
              <option value="approved">{isAr ? 'مقبولة ومستعرضة 🟢' : 'Approved 🟢'}</option>
              <option value="pending">{isAr ? 'قيد المراجعة 🟡' : 'Pending 🟡'}</option>
              <option value="rejected">{isAr ? 'مرفوضة 🔴' : 'Rejected 🔴'}</option>
            </select>
          </div>

          {/* Comments List */}
          {filteredComments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-surface border border-stroke text-muted text-xs font-mono">
              {isAr ? 'لا توجد تعليقات مطابقة للبحث' : 'No comments match your search filter'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComments.map((comment) => {
                const isReplying = activeReplyId === comment.id;

                return (
                  <div
                    key={comment.id}
                    className="p-5 sm:p-6 rounded-3xl bg-surface border border-stroke hover:border-[#89AACC]/40 transition-all space-y-4 shadow-sm"
                  >
                    {/* Header bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stroke/60">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${comment.authorAvatarBg || 'bg-[#4E85BF]'} text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm`}
                        >
                          {comment.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-text-primary">{comment.authorName}</span>
                            {comment.authorEmail && (
                              <span className="text-xs text-muted font-mono">({comment.authorEmail})</span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-[#89AACC] block mt-0.5">
                            📌 {comment.articleTitle || comment.articleId}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono text-muted">{comment.createdAt}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            comment.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : comment.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {comment.status === 'approved'
                            ? (isAr ? 'مقبول 🟢' : 'Approved 🟢')
                            : comment.status === 'pending'
                            ? (isAr ? 'معلق 🟡' : 'Pending 🟡')
                            : (isAr ? 'مرفوض 🔴' : 'Rejected 🔴')}
                        </span>
                      </div>
                    </div>

                    {/* Comment text */}
                    <p className="text-xs sm:text-sm text-text-primary leading-relaxed font-normal bg-bg/50 p-4 rounded-2xl border border-stroke/60">
                      "{comment.content}"
                    </p>

                    {/* Existing Author Reply */}
                    {comment.reply && (
                      <div className="p-4 rounded-2xl bg-[#89AACC]/10 border border-[#89AACC]/30 space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono text-[#89AACC] font-bold">
                          <span>{isAr ? 'رد المطور الحالي:' : 'Your Saved Reply:'}</span>
                          <span className="text-[10px] text-muted">{comment.replyDate}</span>
                        </div>
                        <p className="text-xs text-text-primary leading-relaxed">{comment.reply}</p>
                      </div>
                    )}

                    {/* Active Reply Input Box */}
                    {isReplying && (
                      <div className="p-4 rounded-2xl bg-bg border border-[#89AACC]/50 space-y-3">
                        <label className="block text-xs font-mono font-bold text-[#89AACC]">
                          {isAr ? 'اكتب ردك المباشر بصفتك مطور المنصة:' : 'Write Author Reply:'}
                        </label>
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={isAr ? 'أهلاً بك! بالنسبة للاستفسار حول هذا الموضوع...' : 'Type your developer reply...'}
                          className="w-full bg-surface border border-stroke rounded-xl p-3 text-xs text-text-primary focus:outline-none"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveReplyId(null);
                              setReplyText('');
                            }}
                            className="px-4 py-1.5 rounded-full bg-surface border border-stroke text-xs text-muted hover:text-text-primary transition-colors cursor-pointer"
                          >
                            {isAr ? 'إلغاء' : 'Cancel'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSendReply(comment.id)}
                            className="px-5 py-1.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isAr ? 'حفظ وإرسال الرد' : 'Save & Publish Reply'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-stroke/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveReplyId(isReplying ? null : comment.id);
                            setReplyText(comment.reply || '');
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-bg hover:bg-stroke/60 text-text-primary border border-stroke font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Send className="w-3 h-3 text-[#89AACC]" />
                          <span>{comment.reply ? (isAr ? 'تعديل الرد' : 'Edit Reply') : (isAr ? 'رد على التعليق' : 'Reply')}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {comment.status !== 'approved' && (
                          <button
                            onClick={() => updateCommentStatus(comment.id, 'approved')}
                            className="p-1.5 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors cursor-pointer border border-emerald-500/30"
                            title={isAr ? 'قبول التعليق' : 'Approve Comment'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        {comment.status !== 'rejected' && (
                          <button
                            onClick={() => updateCommentStatus(comment.id, 'rejected')}
                            className="p-1.5 rounded-full bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer border border-amber-500/30"
                            title={isAr ? 'رفض التعليق' : 'Reject Comment'}
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => setCommentToDelete(comment)}
                          className="p-1.5 rounded-full hover:bg-rose-500/10 text-muted hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                          title={isAr ? 'حذف التعليق' : 'Delete Comment'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Delete Comment Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(commentToDelete)}
        title={isAr ? 'حذف هذا التعليق؟' : 'Delete comment?'}
        message={
          isAr
            ? 'هل أنت متأكد من رغبتك في حذف هذا التعليق نهائياً؟'
            : 'Are you sure you want to delete this comment permanently?'
        }
        itemTitle={commentToDelete?.authorName}
        onConfirm={() => {
          if (commentToDelete) {
            deleteArticleComment(commentToDelete.id);
            setCommentToDelete(null);
          }
        }}
        onCancel={() => setCommentToDelete(null)}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        isOpen={Boolean(articleToDelete)}
        title={isAr ? 'حذف هذا المقال نهائياً؟' : 'Delete this article?'}
        message={
          isAr
            ? 'هل أنت متأكد من رغبتك في حذف هذا المقال من المدونة؟ لن يتمكن الزوار من قراءته مجدداً.'
            : 'Are you sure you want to delete this article? It will be removed from the technical journal.'
        }
        itemTitle={(isAr ? articleToDelete?.titleAr : articleToDelete?.titleEn) || articleToDelete?.title}
        onConfirm={confirmDelete}
        onCancel={() => setArticleToDelete(null)}
      />
    </div>
  );
};
