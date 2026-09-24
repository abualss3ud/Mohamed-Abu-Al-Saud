import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  Globe,
  Star,
  EyeOff,
  Search,
  ExternalLink,
  Github,
  Image as ImageIcon,
  Check,
  X,
  Sparkles,
  Languages,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLanguage } from '../../context/LanguageContext';
import { Project } from '../../types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export const AdminProjects: React.FC = () => {
  const { projects, saveProject, deleteProject, showToast } = usePortfolio();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [formTab, setFormTab] = useState<'ar' | 'en' | 'meta'>('ar');

  const emptyProject: Project = {
    id: `project-${Date.now()}`,
    title: '',
    titleAr: '',
    titleEn: '',
    slug: '',
    industry: 'Full-Stack Web App',
    industryAr: 'تطبيقات الويب الكاملة',
    industryEn: 'Full-Stack Web App',
    description: '',
    descriptionAr: '',
    descriptionEn: '',
    problem: '',
    problemAr: '',
    problemEn: '',
    solution: '',
    solutionAr: '',
    solutionEn: '',
    role: 'Lead Full-Stack Engineer',
    roleAr: 'مطور Full-Stack رئيسي',
    roleEn: 'Lead Full-Stack Engineer',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    projectUrl: 'https://github.com/abualss3ud',
    githubUrl: 'https://github.com/abualss3ud',
    coverImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85',
    ],
    status: 'published',
    featured: true,
    updatedAt: new Date().toISOString().split('T')[0],
  };

  const categories = Array.from(
    new Set(
      projects.flatMap((p) => [p.industry, p.industryAr, p.industryEn]).filter(Boolean)
    )
  );

  const filteredProjects = projects.filter((project) => {
    const q = searchQuery.toLowerCase();
    const titleAr = project.titleAr || '';
    const titleEn = project.titleEn || project.title || '';
    const descAr = project.descriptionAr || '';
    const descEn = project.descriptionEn || project.description || '';

    const matchesSearch =
      titleAr.toLowerCase().includes(q) ||
      titleEn.toLowerCase().includes(q) ||
      descAr.toLowerCase().includes(q) ||
      descEn.toLowerCase().includes(q) ||
      project.technologies.some((t) => t.toLowerCase().includes(q));

    const matchesCategory =
      filterCategory === 'all' ||
      project.industry === filterCategory ||
      project.industryAr === filterCategory ||
      project.industryEn === filterCategory;

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'published' && project.status === 'published') ||
      (filterStatus === 'draft' && project.status === 'draft') ||
      (filterStatus === 'featured' && project.featured);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (project: Project) => {
    setEditingProject({
      ...project,
      titleAr: project.titleAr || (isAr ? project.title : ''),
      titleEn: project.titleEn || (!isAr ? project.title : project.title),
      industryAr: project.industryAr || project.industry,
      industryEn: project.industryEn || project.industry,
      descriptionAr: project.descriptionAr || (isAr ? project.description : ''),
      descriptionEn: project.descriptionEn || (!isAr ? project.description : project.description),
      problemAr: project.problemAr || project.problem,
      problemEn: project.problemEn || project.problem,
      solutionAr: project.solutionAr || project.solution,
      solutionEn: project.solutionEn || project.solution,
      roleAr: project.roleAr || project.role,
      roleEn: project.roleEn || project.role,
    });
    setFormTab(isAr ? 'ar' : 'en');
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingProject({ ...emptyProject, id: `proj-${Date.now()}` });
    setFormTab(isAr ? 'ar' : 'en');
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const primaryTitle =
      (isAr ? editingProject.titleAr : editingProject.titleEn) ||
      editingProject.titleEn ||
      editingProject.titleAr ||
      editingProject.title;

    if (!primaryTitle?.trim()) {
      showToast(isAr ? 'يرجى كتابة عنوان للمشروع' : 'Please provide a project title', 'destructive');
      return;
    }

    const titleEn = editingProject.titleEn?.trim() || primaryTitle;
    const titleAr = editingProject.titleAr?.trim() || primaryTitle;
    const descriptionEn = editingProject.descriptionEn?.trim() || editingProject.description || '';
    const descriptionAr = editingProject.descriptionAr?.trim() || editingProject.description || '';

    const formattedSlug =
      editingProject.slug.trim() ||
      titleEn
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') ||
      `project-${Date.now()}`;

    const updated: Project = {
      ...editingProject,
      title: isAr ? titleAr : titleEn,
      titleAr,
      titleEn,
      industry: isAr ? (editingProject.industryAr || editingProject.industry) : (editingProject.industryEn || editingProject.industry),
      industryAr: editingProject.industryAr || editingProject.industry,
      industryEn: editingProject.industryEn || editingProject.industry,
      description: isAr ? descriptionAr : descriptionEn,
      descriptionAr,
      descriptionEn,
      problem: editingProject.problemAr || editingProject.problemEn || editingProject.problem,
      problemAr: editingProject.problemAr || editingProject.problem,
      problemEn: editingProject.problemEn || editingProject.problem,
      solution: editingProject.solutionAr || editingProject.solutionEn || editingProject.solution,
      solutionAr: editingProject.solutionAr || editingProject.solution,
      solutionEn: editingProject.solutionEn || editingProject.solution,
      role: isAr ? (editingProject.roleAr || editingProject.role) : (editingProject.roleEn || editingProject.role),
      roleAr: editingProject.roleAr || editingProject.role,
      roleEn: editingProject.roleEn || editingProject.role,
      slug: formattedSlug,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    saveProject(updated);
    showToast(
      isCreating
        ? isAr
          ? 'تمت إضافة المشروع باللغتين بنجاح'
          : 'Project added successfully in both languages'
        : isAr
        ? 'تم تحديث بيانات المشروع باللغتين'
        : 'Project updated in both languages',
      'success'
    );
    setEditingProject(null);
    setIsCreating(false);
  };

  const togglePublish = (project: Project) => {
    saveProject({
      ...project,
      status: project.status === 'published' ? 'draft' : 'published',
      updatedAt: new Date().toISOString().split('T')[0],
    });
    showToast(
      project.status === 'published'
        ? isAr
          ? 'تم تحويل المشروع إلى مسودة'
          : 'Project changed to draft'
        : isAr
        ? 'تم نشر المشروع على الموقع'
        : 'Project published live',
      'info'
    );
  };

  const toggleFeatured = (project: Project) => {
    saveProject({
      ...project,
      featured: !project.featured,
      updatedAt: new Date().toISOString().split('T')[0],
    });
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      showToast(isAr ? 'تم حذف المشروع' : 'Project removed', 'info');
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-surface border border-stroke shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-display italic text-text-primary">
              {isAr ? 'إدارة المشاريع والأعمال' : 'Portfolio Projects Management'}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#89AACC]/15 text-[#89AACC] border border-[#89AACC]/30">
              <Languages className="w-3 h-3" />
              <span>{isAr ? 'عربي / English' : 'Bilingual AR/EN'}</span>
            </span>
          </div>
          <p className="text-xs text-muted">
            {isAr
              ? 'إضافة وتعديل المشاريع ودراسات الحالة باللغتين العربية والإنجليزية مع روابط العرض وGitHub.'
              : 'Add and edit projects and case studies in both Arabic and English with live and code URLs.'}
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-5 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة مشروع جديد (AR/EN)' : 'New Project (AR/EN)'}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-stroke flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث في المشاريع، العناوين بالعربية والإنجليزية...' : 'Search projects in English & Arabic...'}
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
            <option value="all">{isAr ? 'جميع الفئات' : 'All Categories'}</option>
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
            <option value="featured">{isAr ? 'المميزة فقط ⭐' : 'Featured Only ⭐'}</option>
          </select>
        </div>
      </div>

      {/* Editor Modal Drawer */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="w-full max-w-4xl bg-surface border border-stroke rounded-3xl p-6 sm:p-8 shadow-2xl my-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stroke">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-display italic text-text-primary font-semibold">
                    {isCreating
                      ? isAr
                        ? 'إضافة مشروع جديد (بالعربي والإنجليزي)'
                        : 'Create New Project (Bilingual AR/EN)'
                      : isAr
                      ? `تعديل مشروع: ${editingProject.titleAr || editingProject.titleEn || editingProject.title}`
                      : `Edit Project: ${editingProject.titleEn || editingProject.titleAr || editingProject.title}`}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="p-1.5 rounded-full hover:bg-bg text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Bilingual Tab Switcher */}
              <div className="flex items-center gap-2 p-1.5 bg-bg rounded-2xl border border-stroke mb-6 max-w-md">
                <button
                  type="button"
                  onClick={() => setFormTab('ar')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    formTab === 'ar'
                      ? 'bg-text-primary text-bg font-semibold shadow'
                      : 'text-muted hover:text-text-primary'
                  }`}
                >
                  <span>🇸🇦 المحتوى بالعربية</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormTab('en')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    formTab === 'en'
                      ? 'bg-text-primary text-bg font-semibold shadow'
                      : 'text-muted hover:text-text-primary'
                  }`}
                >
                  <span>🇬🇧 English Content</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormTab('meta')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    formTab === 'meta'
                      ? 'bg-text-primary text-bg font-semibold shadow'
                      : 'text-muted hover:text-text-primary'
                  }`}
                >
                  <span>⚙️ {isAr ? 'الروابط والوسائط' : 'Links & Media'}</span>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                {/* 1. ARABIC CONTENT TAB */}
                {formTab === 'ar' && (
                  <div className="space-y-4" dir="rtl">
                    <div className="p-3.5 rounded-2xl bg-[#89AACC]/10 border border-[#89AACC]/20 text-xs text-[#89AACC] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>الحقول أدناه تظهر للزوار عند تصفح الموقع باللغة العربية (RTL).</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          عنوان المشروع بالعربية *
                        </label>
                        <input
                          type="text"
                          required={formTab === 'ar' && !editingProject.titleEn}
                          value={editingProject.titleAr || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, titleAr: e.target.value })
                          }
                          placeholder="مثال: منصة فودي لطلب الوجبات الذكية"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          التصنيف / المجال بالعربية
                        </label>
                        <input
                          type="text"
                          value={editingProject.industryAr || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, industryAr: e.target.value })
                          }
                          placeholder="مثال: تجارة إلكترونية، مطاعم، لوجستيات"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        دورك ومسؤولياتك في المشروع بالعربية
                      </label>
                      <input
                        type="text"
                        value={editingProject.roleAr || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, roleAr: e.target.value })
                        }
                        placeholder="مثال: مطور Full-Stack رئيسي (تصميم الواجهات، وبناء الـ API، وتكامل قواعد البيانات)"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        الوصف المختصر للمشروع بالعربية
                      </label>
                      <textarea
                        rows={2}
                        value={editingProject.descriptionAr || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, descriptionAr: e.target.value })
                        }
                        placeholder="نبذة سريعة وجذابة عن فكرة المشروع والحلول التي يقدمها..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y text-right"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          المشكلة والتحدي التقني بالعربية
                        </label>
                        <textarea
                          rows={3}
                          value={editingProject.problemAr || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, problemAr: e.target.value })
                          }
                          placeholder="ما التحدي الذي كان يواجهه العميل أو المستخدمون؟"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          الحل الهندسي والنتائج بالعربية
                        </label>
                        <textarea
                          rows={3}
                          value={editingProject.solutionAr || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, solutionAr: e.target.value })
                          }
                          placeholder="كيف قمت ببناء الحل الهندسي وتجاوز العقبات؟"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y text-right"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ENGLISH CONTENT TAB */}
                {formTab === 'en' && (
                  <div className="space-y-4" dir="ltr">
                    <div className="p-3.5 rounded-2xl bg-[#89AACC]/10 border border-[#89AACC]/20 text-xs text-[#89AACC] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>These fields will be displayed when visitors browse in English (LTR).</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          Project Title in English *
                        </label>
                        <input
                          type="text"
                          required={formTab === 'en' && !editingProject.titleAr}
                          value={editingProject.titleEn || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, titleEn: e.target.value })
                          }
                          placeholder="e.g. Foodi Restaurant Ordering Platform"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          Industry / Category in English
                        </label>
                        <input
                          type="text"
                          value={editingProject.industryEn || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, industryEn: e.target.value })
                          }
                          placeholder="e.g. Restaurant, E-Commerce, Logistics"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        Your Role & Responsibilities in English
                      </label>
                      <input
                        type="text"
                        value={editingProject.roleEn || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, roleEn: e.target.value })
                        }
                        placeholder="e.g. Lead Full-Stack Developer (UI architecture, API design, Database modeling)"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        Short Project Description in English
                      </label>
                      <textarea
                        rows={2}
                        value={editingProject.descriptionEn || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, descriptionEn: e.target.value })
                        }
                        placeholder="Concise, high-impact summary of the product and its business value..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          Problem & Challenge in English
                        </label>
                        <textarea
                          rows={3}
                          value={editingProject.problemEn || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, problemEn: e.target.value })
                          }
                          placeholder="What bottleneck or challenge did the client face?"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          Engineering Solution in English
                        </label>
                        <textarea
                          rows={3}
                          value={editingProject.solutionEn || ''}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, solutionEn: e.target.value })
                          }
                          placeholder="How did you architect and implement the solution?"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. TECHNICAL & MEDIA LINKS TAB */}
                {formTab === 'meta' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          {isAr ? 'رابط المعاينة الحية (Live Demo URL)' : 'Live Demo URL'}
                        </label>
                        <input
                          type="url"
                          value={editingProject.projectUrl}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, projectUrl: e.target.value })
                          }
                          placeholder="https://..."
                          dir="ltr"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          {isAr ? 'رابط الكود المصدري GitHub' : 'GitHub Repository URL'}
                        </label>
                        <input
                          type="url"
                          value={editingProject.githubUrl}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, githubUrl: e.target.value })
                          }
                          placeholder="https://github.com/..."
                          dir="ltr"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        {isAr ? 'رابط صورة الغلاف (Cover Image URL)' : 'Cover Image URL'}
                      </label>
                      <input
                        type="url"
                        value={editingProject.coverImage}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, coverImage: e.target.value })
                        }
                        placeholder="https://images.unsplash.com/..."
                        dir="ltr"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        {isAr ? 'التقنيات المستخدمة (مفصولة بفواصل)' : 'Technologies (comma separated)'}
                      </label>
                      <input
                        type="text"
                        value={editingProject.technologies.join(', ')}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            technologies: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="React, TypeScript, Next.js, PostgreSQL, Tailwind CSS"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          {isAr ? 'المعرّف الرابطي المخصص (Slug)' : 'Custom URL Slug'}
                        </label>
                        <input
                          type="text"
                          value={editingProject.slug}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, slug: e.target.value })
                          }
                          placeholder="e.g. foodi-app"
                          dir="ltr"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col justify-end gap-2 pt-2">
                        <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={editingProject.status === 'published'}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                status: e.target.checked ? 'published' : 'draft',
                              })
                            }
                            className="w-4 h-4 rounded bg-bg border border-stroke text-[#89AACC]"
                          />
                          <span>{isAr ? 'منشور على الموقع الحي' : 'Published live on portfolio'}</span>
                        </label>

                        <label className="flex items-center gap-2 text-xs text-text-primary cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={editingProject.featured}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, featured: e.target.checked })
                            }
                            className="w-4 h-4 rounded bg-bg border border-stroke text-[#89AACC]"
                          />
                          <span>{isAr ? 'مشروع مميز ⭐' : 'Featured Showcase ⭐'}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-stroke">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormTab(formTab === 'ar' ? 'en' : formTab === 'en' ? 'meta' : 'ar')}
                      className="text-xs text-muted hover:text-text-primary flex items-center gap-1 font-mono transition-colors cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#89AACC]" />
                      <span>{isAr ? 'الانتقال للتبويب التالي' : 'Switch Tab'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-5 py-2.5 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-xs font-medium text-text-primary transition-colors cursor-pointer"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      {isAr ? 'حفظ المشروع باللغتين' : 'Save Project (Bilingual)'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Projects Grid / Table View */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-surface border border-stroke text-muted">
          <p className="text-sm">{isAr ? 'لم يتم العثور على أي مشاريع مطابقة للبحث' : 'No projects match the selected criteria'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const displayTitle = (isAr ? project.titleAr : project.titleEn) || project.title;
            const displayDesc = (isAr ? project.descriptionAr : project.descriptionEn) || project.description;
            const displayIndustry = (isAr ? project.industryAr : project.industryEn) || project.industry;

            return (
              <div
                key={project.id}
                className="p-5 sm:p-6 rounded-3xl bg-surface border border-stroke hover:border-[#89AACC]/40 transition-all flex flex-col justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-bg border border-stroke shrink-0">
                        <img
                          src={project.coverImage || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=300&q=80'}
                          alt={displayTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-text-primary">{displayTitle}</h3>
                          {project.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-muted mt-0.5">
                          <span>{displayIndustry}</span>
                          {(project.titleAr && project.titleEn) && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#89AACC]/20 text-[#89AACC]">AR+EN</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => togglePublish(project)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-medium transition-colors cursor-pointer ${
                          project.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {project.status === 'published' ? (isAr ? 'منشور' : 'Published') : (isAr ? 'مسودة' : 'Draft')}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-3">
                    {displayDesc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-bg border border-stroke text-[11px] font-mono text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-0.5 rounded-md bg-bg border border-stroke text-[11px] font-mono text-muted">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-stroke/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg hover:bg-bg text-muted hover:text-text-primary transition-colors cursor-pointer"
                        title={isAr ? 'رابط GitHub' : 'GitHub'}
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg hover:bg-bg text-muted hover:text-text-primary transition-colors cursor-pointer"
                        title={isAr ? 'المعاينة الحية' : 'Live Demo'}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(project)}
                      className="px-3 py-1.5 rounded-full bg-bg hover:bg-stroke/60 text-xs font-medium text-text-primary border border-stroke transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-[#89AACC]" />
                      <span>{isAr ? 'تعديل (AR/EN)' : 'Edit (AR/EN)'}</span>
                    </button>

                    <button
                      onClick={() => setProjectToDelete(project)}
                      className="p-1.5 rounded-full hover:bg-rose-500/10 text-muted hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                      title={isAr ? 'حذف المشروع' : 'Delete Project'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(projectToDelete)}
        title={isAr ? 'حذف هذا المشروع نهائياً؟' : 'Delete this project permanently?'}
        message={
          isAr
            ? 'هل أنت متأكد من رغبتك في حذف هذا المشروع؟ سيتم حذفه من كافة صفحات المعرض ودراسات الحالة.'
            : 'Are you sure you want to delete this project? It will be removed from all public portfolio views.'
        }
        itemTitle={(isAr ? projectToDelete?.titleAr : projectToDelete?.titleEn) || projectToDelete?.title}
        onConfirm={confirmDelete}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  );
};
