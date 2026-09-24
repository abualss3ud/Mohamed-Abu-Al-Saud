import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Plus,
  Search,
  Edit2,
  Trash2,
  Globe,
  ExternalLink,
  Github,
  Eye,
  Check,
  X,
  Layers,
  Box,
  Code2,
  Cpu,
  MonitorPlay,
  RotateCw,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLanguage } from '../../context/LanguageContext';
import { PrototypeItem, PrototypeCategory } from '../../types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

const CATEGORIES: { id: PrototypeCategory; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
  { id: 'shader', labelAr: 'الشيدرز والويب GLSL', labelEn: 'Shaders & GLSL', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: '3d', labelAr: 'العوالم ثلاثية الأبعاد 3D', labelEn: '3D & Procedural', icon: <Box className="w-3.5 h-3.5" /> },
  { id: 'generative', labelAr: 'التصاميم التوليدية', labelEn: 'Generative Design', icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: 'frontend', labelAr: 'واجهات وتجارب UI', labelEn: 'Front-End Micro-UI', icon: <Code2 className="w-3.5 h-3.5" /> },
  { id: 'interactive', labelAr: 'نماذج تفاعلية حيّة', labelEn: 'Interactive Labs', icon: <MonitorPlay className="w-3.5 h-3.5" /> },
];

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=85',
];

const ROTATIONS = [
  { value: '-rotate-2', label: '-2°' },
  { value: '-rotate-1', label: '-1°' },
  { value: 'rotate-0', label: '0°' },
  { value: 'rotate-1', label: '+1°' },
  { value: 'rotate-2', label: '+2°' },
];

export const AdminPrototypes: React.FC = () => {
  const { prototypes, savePrototype, deletePrototype, updatePrototypeStatus, showToast } = usePortfolio();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  const [editingItem, setEditingItem] = useState<PrototypeItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<'ar' | 'en' | 'settings'>('ar');
  const [itemToDelete, setItemToDelete] = useState<PrototypeItem | null>(null);
  const [previewItem, setPreviewItem] = useState<PrototypeItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PrototypeItem>>({});

  const filteredPrototypes = prototypes.filter((item) => {
    const titleAr = item.titleAr || '';
    const titleEn = item.titleEn || item.title || '';
    const descAr = item.descAr || '';
    const descEn = item.descEn || item.desc || '';
    const mediumAr = item.mediumAr || '';
    const mediumEn = item.mediumEn || item.medium || '';

    const matchesSearch =
      titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mediumAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mediumEn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || (item.status || 'published') === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalCount = prototypes.length;
  const publishedCount = prototypes.filter((p) => (p.status || 'published') === 'published').length;
  const draftCount = totalCount - publishedCount;

  const handleCreate = () => {
    const newItem: PrototypeItem = {
      id: `exp-${Date.now()}`,
      title: '',
      titleAr: '',
      titleEn: '',
      image: PRESET_IMAGES[0],
      medium: 'GLSL / WebGL Shader',
      mediumAr: 'شيدرز برمجية GLSL / WebGL',
      mediumEn: 'GLSL / WebGL Shader',
      category: 'shader',
      desc: '',
      descAr: '',
      descEn: '',
      rotation: 'rotate-0',
      githubUrl: 'https://github.com/abualss3ud',
      demoUrl: 'https://github.com/abualss3ud',
      status: 'published',
      featured: false,
      order: totalCount + 1,
    };
    setFormData(newItem);
    setEditingItem(newItem);
    setIsCreating(true);
    setActiveFormTab('ar');
  };

  const handleEdit = (item: PrototypeItem) => {
    setFormData({ ...item });
    setEditingItem(item);
    setIsCreating(false);
    setActiveFormTab('ar');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title && !formData.titleAr && !formData.titleEn) {
      showToast(isAr ? 'يرجى إدخال عنوان للنموذج' : 'Please provide a prototype title', 'destructive');
      return;
    }

    const finalItem: PrototypeItem = {
      id: formData.id || `exp-${Date.now()}`,
      title: formData.titleEn || formData.titleAr || formData.title || 'Untitled Prototype',
      titleAr: formData.titleAr || formData.title || '',
      titleEn: formData.titleEn || formData.title || '',
      image: formData.image || PRESET_IMAGES[0],
      medium: formData.mediumEn || formData.mediumAr || formData.medium || 'WebGL / Interactive',
      mediumAr: formData.mediumAr || formData.medium || 'واجهات تفاعلية WebGL',
      mediumEn: formData.mediumEn || formData.medium || 'WebGL / Interactive',
      category: formData.category || 'shader',
      desc: formData.descEn || formData.descAr || formData.desc || '',
      descAr: formData.descAr || formData.desc || '',
      descEn: formData.descEn || formData.desc || '',
      rotation: formData.rotation || 'rotate-0',
      githubUrl: formData.githubUrl || 'https://github.com/abualss3ud',
      demoUrl: formData.demoUrl || 'https://github.com/abualss3ud',
      featured: Boolean(formData.featured),
      status: formData.status || 'published',
      order: formData.order || totalCount + 1,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    savePrototype(finalItem);
    setEditingItem(null);
    setIsCreating(false);
    showToast(
      isAr
        ? isCreating
          ? 'تمت إضافة النموذج التجريبي بنجاح'
          : 'تم تحديث بيانات النموذج التجريبي'
        : isCreating
        ? 'Prototype created successfully'
        : 'Prototype updated successfully',
      'success'
    );
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deletePrototype(itemToDelete.id);
      showToast(isAr ? 'تم حذف النموذج التجريبي' : 'Prototype removed', 'info');
      setItemToDelete(null);
    }
  };

  const toggleStatus = (item: PrototypeItem) => {
    const nextStatus = item.status === 'draft' ? 'published' : 'draft';
    updatePrototypeStatus(item.id, nextStatus);
    showToast(
      isAr
        ? nextStatus === 'published'
          ? 'تم نشر النموذج في المعرض العام'
          : 'تم تحويل النموذج إلى مسودة'
        : nextStatus === 'published'
        ? 'Prototype published live'
        : 'Prototype moved to drafts',
      'info'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Action */}
      <div className="p-6 rounded-3xl bg-surface border border-stroke shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-display italic text-text-primary">
              {isAr ? 'معرض النماذج والتجارب التفاعلية (Showcase & Prototypes)' : 'Showcase & Interactive Prototypes'}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#89AACC]/15 text-[#89AACC] border border-[#89AACC]/30">
              <Sparkles className="w-3 h-3" />
              <span>{isAr ? 'مختبر الواجهات والـ 3D' : 'Playground Lab'}</span>
            </span>
          </div>
          <p className="text-xs text-muted">
            {isAr
              ? 'إدارة النماذج المصغرة، شيدرز GLSL، العوالم ثلاثية الأبعاد، والتجارب التفاعلية المعروضة في صفحة الأعمال.'
              : 'Manage hands-on prototypes, micro-interaction tests, 3D shaders, and interactive lab showcases.'}
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-5 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة نموذج جديد' : 'Add New Prototype'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-stroke">
          <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1">
            {isAr ? 'إجمالي النماذج' : 'Total Prototypes'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-text-primary">{totalCount}</span>
            <span className="text-xs font-mono text-[#89AACC]">{isAr ? 'نموذج مسجل' : 'Items'}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-stroke">
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
            {isAr ? 'معروض في الموقع (منشور)' : 'Published Live'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-400">{publishedCount}</span>
            <span className="text-xs font-mono text-muted">{isAr ? 'مرئي للزوار' : 'Visible'}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-stroke">
          <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
            {isAr ? 'مسودات قيد التطوير' : 'Drafts in Progress'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-400">{draftCount}</span>
            <span className="text-xs font-mono text-muted">{isAr ? 'غير منشورة' : 'Hidden'}</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-surface border border-stroke flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث بالعنوان، التقنية، الشيدرز، أو الوصف...' : 'Search title, medium, category, description...'}
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
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {isAr ? c.labelAr : c.labelEn}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-bg border border-stroke rounded-full px-3.5 py-2 text-xs text-text-primary focus:outline-none cursor-pointer"
          >
            <option value="all">{isAr ? 'جميع الحالات' : 'All Status'}</option>
            <option value="published">{isAr ? 'منشور فقط 🟢' : 'Published 🟢'}</option>
            <option value="draft">{isAr ? 'مسودة فقط ⚪' : 'Draft ⚪'}</option>
          </select>
        </div>
      </div>

      {/* Prototypes Grid */}
      {filteredPrototypes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-surface border border-stroke text-muted">
          <p className="text-sm">{isAr ? 'لا توجد نماذج مطابقة للبحث المحدد' : 'No prototypes match your query'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrototypes.map((item) => {
            const displayTitle = (isAr ? item.titleAr : item.titleEn) || item.title;
            const displayMedium = (isAr ? item.mediumAr : item.mediumEn) || item.medium;
            const displayDesc = (isAr ? item.descAr : item.descEn) || item.desc;
            const isPublished = (item.status || 'published') === 'published';

            return (
              <div
                key={item.id}
                className="rounded-3xl bg-surface border border-stroke hover:border-[#89AACC]/40 overflow-hidden flex flex-col justify-between shadow-sm group transition-all"
              >
                {/* Image Canvas */}
                <div className="relative aspect-[16/10] bg-bg overflow-hidden">
                  <img
                    src={item.image}
                    alt={displayTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/15">
                      {item.category.toUpperCase()}
                    </span>

                    <button
                      onClick={() => toggleStatus(item)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer backdrop-blur-md ${
                        isPublished
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-zinc-800/80 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                      }`}
                    >
                      {isPublished ? (isAr ? 'منشور 🟢' : 'Live 🟢') : (isAr ? 'مسودة ⚪' : 'Draft ⚪')}
                    </button>
                  </div>

                  {/* Bottom Image Overlay Title */}
                  <div className="absolute bottom-3 inset-x-3 text-start">
                    <span className="text-[10px] font-mono text-[#89AACC] block truncate mb-0.5">
                      {displayMedium}
                    </span>
                    <h3 className="text-base font-bold text-white truncate font-display italic">
                      {displayTitle}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                    {displayDesc || (isAr ? 'لا يوجد وصف مختصر للنموذج.' : 'No description provided.')}
                  </p>

                  <div className="pt-3 border-t border-stroke/60 flex items-center justify-between text-xs">
                    {/* External links */}
                    <div className="flex items-center gap-2">
                      {item.githubUrl && (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full bg-bg hover:bg-stroke text-muted hover:text-text-primary transition-colors"
                          title="GitHub Repository"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {item.demoUrl && (
                        <a
                          href={item.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-full bg-bg hover:bg-stroke text-muted hover:text-[#89AACC] transition-colors"
                          title="Live Demo Preview"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="p-2 rounded-full bg-bg hover:bg-stroke/60 text-text-primary border border-stroke transition-colors cursor-pointer"
                        title={isAr ? 'معاينة تجريبية' : 'Quick Preview'}
                      >
                        <Eye className="w-3.5 h-3.5 text-[#89AACC]" />
                      </button>

                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 rounded-full bg-bg hover:bg-stroke/60 text-text-primary border border-stroke transition-colors cursor-pointer"
                        title={isAr ? 'تعديل النموذج' : 'Edit Prototype'}
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#89AACC]" />
                      </button>

                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-2 rounded-full hover:bg-rose-500/10 text-muted hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                        title={isAr ? 'حذف النموذج' : 'Delete Prototype'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="w-full max-w-3xl bg-surface border border-stroke rounded-3xl p-6 sm:p-8 shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stroke">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#89AACC]" />
                  <h3 className="text-lg font-display italic text-text-primary font-semibold">
                    {isCreating
                      ? isAr
                        ? 'إضافة نموذج تجريبي جديد'
                        : 'Create New Interactive Prototype'
                      : isAr
                      ? `تعديل النموذج: ${formData.titleAr || formData.title}`
                      : `Edit Prototype: ${formData.titleEn || formData.title}`}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="p-1.5 rounded-full hover:bg-bg text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Tabs */}
              <div className="flex items-center gap-2 border-b border-stroke pb-3 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('ar')}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeFormTab === 'ar'
                      ? 'bg-text-primary text-bg font-bold shadow'
                      : 'bg-bg border border-stroke text-muted hover:text-text-primary'
                  }`}
                >
                  🇸🇦 {isAr ? 'المحتوى العربي' : 'Arabic Content'}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFormTab('en')}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeFormTab === 'en'
                      ? 'bg-text-primary text-bg font-bold shadow'
                      : 'bg-bg border border-stroke text-muted hover:text-text-primary'
                  }`}
                >
                  🇬🇧 {isAr ? 'المحتوى الإنجليزي' : 'English Content'}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFormTab('settings')}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeFormTab === 'settings'
                      ? 'bg-text-primary text-bg font-bold shadow'
                      : 'bg-bg border border-stroke text-muted hover:text-text-primary'
                  }`}
                >
                  ⚙️ {isAr ? 'الروابط والإعدادات' : 'Links & Settings'}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. ARABIC TAB */}
                {activeFormTab === 'ar' && (
                  <div className="space-y-4" dir="rtl">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                        عنوان النموذج بالعربية <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.titleAr || ''}
                        onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                        placeholder="مثال: محاكاة السوائل الحركية المتلألئة"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                        الوسيط والتقنية المستخدمة بالعربية
                      </label>
                      <input
                        type="text"
                        value={formData.mediumAr || ''}
                        onChange={(e) => setFormData({ ...formData, mediumAr: e.target.value })}
                        placeholder="مثال: شيدرز برمجية GLSL / WebGL"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                        الوصف والشرح التفاعلي بالعربية
                      </label>
                      <textarea
                        rows={3}
                        value={formData.descAr || ''}
                        onChange={(e) => setFormData({ ...formData, descAr: e.target.value })}
                        placeholder="اكتب نبذة عن المعادلات الرياضية أو فيزياء الضوء أو طريقة تفاعل المستخدم مع النموذج..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* 2. ENGLISH TAB */}
                {activeFormTab === 'en' && (
                  <div className="space-y-4" dir="ltr">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                        Prototype Title (English) <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.titleEn || ''}
                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                        placeholder="e.g. Iridescent Kinetic Fluid"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                        Medium & Tech Stack (English)
                      </label>
                      <input
                        type="text"
                        value={formData.mediumEn || ''}
                        onChange={(e) => setFormData({ ...formData, mediumEn: e.target.value })}
                        placeholder="e.g. GLSL / WebGL Shader"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                        Description & Micro-Interactions (English)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.descEn || ''}
                        onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                        placeholder="Describe light physics, real-time GLSL refraction, or responsive reactive layouts..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* 3. SETTINGS & LINKS TAB */}
                {activeFormTab === 'settings' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                          {isAr ? 'تصنيف التجربة' : 'Category'}
                        </label>
                        <select
                          value={formData.category || 'shader'}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none cursor-pointer"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {isAr ? c.labelAr : c.labelEn}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                          {isAr ? 'زاوية الميلان الجمالية' : 'Card Tilt Angle'}
                        </label>
                        <select
                          value={formData.rotation || 'rotate-0'}
                          onChange={(e) => setFormData({ ...formData, rotation: e.target.value })}
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none cursor-pointer font-mono"
                        >
                          {ROTATIONS.map((r) => (
                            <option key={r.value} value={r.value}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Image URL & Presets */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                        {isAr ? 'رابط صورة المعاينة (Image URL)' : 'Cover Image URL'}
                      </label>
                      <input
                        type="url"
                        value={formData.image || ''}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary font-mono focus:outline-none mb-2"
                      />

                      {/* Quick Presets Selection */}
                      <span className="text-[11px] font-mono text-muted block mb-1.5">
                        {isAr ? 'أو اختر من المعرض الجاهز:' : 'Or choose a preset visual:'}
                      </span>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        {PRESET_IMAGES.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData({ ...formData, image: imgUrl })}
                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                              formData.image === imgUrl ? 'border-[#89AACC] scale-105 shadow-md' : 'border-stroke opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={imgUrl} alt="Preset" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                          {isAr ? 'رابط كود GitHub' : 'GitHub Repository URL'}
                        </label>
                        <input
                          type="url"
                          value={formData.githubUrl || ''}
                          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary font-mono focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-1.5">
                          {isAr ? 'رابط المعاينة الحية (Live Demo URL)' : 'Live Demo / Preview URL'}
                        </label>
                        <input
                          type="url"
                          value={formData.demoUrl || ''}
                          onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Status & Featured */}
                    <div className="p-4 rounded-2xl bg-bg border border-stroke flex items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-semibold text-text-primary block">
                          {isAr ? 'حالة النشر في المعرض' : 'Publication Status'}
                        </span>
                        <span className="text-[11px] text-muted">
                          {isAr ? 'هل يظهر النموذج مباشرة لزوار الموقع العام؟' : 'Make this prototype visible in the public showcase'}
                        </span>
                      </div>

                      <select
                        value={formData.status || 'published'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="bg-surface border border-stroke rounded-xl px-3 py-1.5 text-xs text-text-primary focus:outline-none cursor-pointer"
                      >
                        <option value="published">{isAr ? 'منشور مباشرة 🟢' : 'Published 🟢'}</option>
                        <option value="draft">{isAr ? 'مسودة خاصة ⚪' : 'Draft ⚪'}</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Modal Footer Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-stroke">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveFormTab(
                        activeFormTab === 'ar' ? 'en' : activeFormTab === 'en' ? 'settings' : 'ar'
                      )
                    }
                    className="text-xs text-muted hover:text-text-primary flex items-center gap-1 font-mono transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#89AACC]" />
                    <span>{isAr ? 'التبويب التالي' : 'Next Tab'}</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="px-5 py-2.5 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-xs font-medium text-text-primary transition-colors cursor-pointer"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      {isAr ? 'حفظ النموذج' : 'Save Prototype'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK PREVIEW LIGHTBOX MODAL */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-surface border border-stroke rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setPreviewItem(null)}
                className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-[16/10] w-full bg-bg overflow-hidden relative">
                <img
                  src={previewItem.image}
                  alt={previewItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#89AACC]">
                    {(isAr ? previewItem.mediumAr : previewItem.mediumEn) || previewItem.medium}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-bg border border-stroke text-muted uppercase">
                    {previewItem.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-text-primary font-display italic">
                  {(isAr ? previewItem.titleAr : previewItem.titleEn) || previewItem.title}
                </h3>

                <p className="text-xs text-muted leading-relaxed">
                  {(isAr ? previewItem.descAr : previewItem.descEn) || previewItem.desc}
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-stroke/60">
                  {previewItem.githubUrl && (
                    <a
                      href={previewItem.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-bg hover:bg-stroke text-xs font-mono text-text-primary flex items-center gap-1.5 transition-colors border border-stroke"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>{isAr ? 'عرض الكود على GitHub' : 'View Code on GitHub'}</span>
                    </a>
                  )}

                  {previewItem.demoUrl && (
                    <a
                      href={previewItem.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{isAr ? 'المعاينة الحية Live Demo' : 'Live Demo Preview'}</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(itemToDelete)}
        title={isAr ? 'حذف هذا النموذج التجريبي؟' : 'Delete this prototype?'}
        message={
          isAr
            ? 'هل أنت متأكد من رغبتك في حذف هذا النموذج من المعرض؟ لن يظهر في صفحة الأعمال بعد الحذف.'
            : 'Are you sure you want to remove this prototype from the showcase playground?'
        }
        itemTitle={(isAr ? itemToDelete?.titleAr : itemToDelete?.titleEn) || itemToDelete?.title}
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};
