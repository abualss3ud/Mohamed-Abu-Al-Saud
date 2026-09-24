import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, CheckCircle2, Layers, X, Sparkles, Languages, Globe } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLanguage } from '../../context/LanguageContext';
import { Service } from '../../types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export const AdminServices: React.FC = () => {
  const { services, setServices, showToast } = usePortfolio();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [formTab, setFormTab] = useState<'ar' | 'en'>('ar');

  const emptyService: Service = {
    id: `srv-${Date.now()}`,
    title: '',
    titleAr: '',
    titleEn: '',
    subtitle: '',
    subtitleAr: '',
    subtitleEn: '',
    description: '',
    descriptionAr: '',
    descriptionEn: '',
    businessValue: '',
    businessValueAr: '',
    businessValueEn: '',
    typicalDeliverables: ['Custom Architecture', 'Production Deployment', 'Source Code & Documentation'],
    typicalDeliverablesAr: ['هندسة برمجية مخصصة', 'نشر وإنتاج مباشر', 'الكود المصدري والتوثيق التقني'],
    typicalDeliverablesEn: ['Custom Architecture', 'Production Deployment', 'Source Code & Documentation'],
    suitableFor: 'Startups and high-growth digital businesses',
    suitableForAr: 'الشركات الناشئة والمؤسسات الرقمية السريعة النمو',
    suitableForEn: 'Startups and high-growth digital businesses',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    tagsAr: ['تطبيقات سحابية', 'أداء عالي', 'أمان متقدم'],
    tagsEn: ['Cloud Apps', 'High Performance', 'Robust Security'],
  };

  const handleCreate = () => {
    setEditingService({ ...emptyService, id: `srv-${Date.now()}` });
    setFormTab(isAr ? 'ar' : 'en');
    setIsCreating(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService({
      ...service,
      titleAr: service.titleAr || (isAr ? service.title : ''),
      titleEn: service.titleEn || (!isAr ? service.title : service.title),
      subtitleAr: service.subtitleAr || service.subtitle || '',
      subtitleEn: service.subtitleEn || service.subtitle || '',
      descriptionAr: service.descriptionAr || (isAr ? service.description : ''),
      descriptionEn: service.descriptionEn || (!isAr ? service.description : service.description),
      businessValueAr: service.businessValueAr || service.businessValue || '',
      businessValueEn: service.businessValueEn || service.businessValue || '',
      typicalDeliverablesAr: service.typicalDeliverablesAr || service.typicalDeliverables,
      typicalDeliverablesEn: service.typicalDeliverablesEn || service.typicalDeliverables,
      suitableForAr: service.suitableForAr || service.suitableFor,
      suitableForEn: service.suitableForEn || service.suitableFor,
      tagsAr: service.tagsAr || service.tags,
      tagsEn: service.tagsEn || service.tags,
    });
    setFormTab(isAr ? 'ar' : 'en');
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const primaryTitle =
      (isAr ? editingService.titleAr : editingService.titleEn) ||
      editingService.titleEn ||
      editingService.titleAr ||
      editingService.title;

    if (!primaryTitle?.trim()) {
      showToast(isAr ? 'يرجى إدخال عنوان للخدمة' : 'Please provide a service title', 'destructive');
      return;
    }

    const titleEn = editingService.titleEn?.trim() || primaryTitle;
    const titleAr = editingService.titleAr?.trim() || primaryTitle;
    const descEn = editingService.descriptionEn?.trim() || editingService.description || '';
    const descAr = editingService.descriptionAr?.trim() || editingService.description || '';

    const updated: Service = {
      ...editingService,
      title: isAr ? titleAr : titleEn,
      titleAr,
      titleEn,
      subtitle: isAr ? (editingService.subtitleAr || editingService.subtitle) : (editingService.subtitleEn || editingService.subtitle),
      subtitleAr: editingService.subtitleAr,
      subtitleEn: editingService.subtitleEn,
      description: isAr ? descAr : descEn,
      descriptionAr: descAr,
      descriptionEn: descEn,
      businessValue: isAr ? (editingService.businessValueAr || editingService.businessValue) : (editingService.businessValueEn || editingService.businessValue),
      businessValueAr: editingService.businessValueAr,
      businessValueEn: editingService.businessValueEn,
      typicalDeliverables: isAr ? (editingService.typicalDeliverablesAr || editingService.typicalDeliverables) : (editingService.typicalDeliverablesEn || editingService.typicalDeliverables),
      typicalDeliverablesAr: editingService.typicalDeliverablesAr,
      typicalDeliverablesEn: editingService.typicalDeliverablesEn,
      suitableFor: isAr ? (editingService.suitableForAr || editingService.suitableFor) : (editingService.suitableForEn || editingService.suitableFor),
      suitableForAr: editingService.suitableForAr,
      suitableForEn: editingService.suitableForEn,
      tags: isAr ? (editingService.tagsAr || editingService.tags) : (editingService.tagsEn || editingService.tags),
      tagsAr: editingService.tagsAr,
      tagsEn: editingService.tagsEn,
    };

    if (isCreating) {
      setServices((prev) => [...prev, updated]);
      showToast(isAr ? 'تمت إضافة الخدمة باللغتين بنجاح' : 'Service created in both languages', 'success');
    } else {
      setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      showToast(isAr ? 'تم تحديث بيانات الخدمة باللغتين' : 'Service updated in both languages', 'success');
    }

    setEditingService(null);
    setIsCreating(false);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      setServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
      showToast(isAr ? 'تم حذف الخدمة' : 'Service removed', 'info');
      setServiceToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-surface border border-stroke shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-display italic text-text-primary">
              {isAr ? 'إدارة الخدمات والحلول البرمجية' : 'Engineering Services Management'}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#89AACC]/15 text-[#89AACC] border border-[#89AACC]/30">
              <Languages className="w-3 h-3" />
              <span>{isAr ? 'عربي / English' : 'Bilingual AR/EN'}</span>
            </span>
          </div>
          <p className="text-xs text-muted">
            {isAr
              ? 'تخصيص مجالات العمل، مخرجات التسليم، ونطاق الخدمات باللغتين العربية والإنجليزية.'
              : 'Configure core engineering capabilities, deliverables, and client scope in both Arabic and English.'}
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-5 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة خدمة جديدة (AR/EN)' : 'Add Service (AR/EN)'}</span>
        </button>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingService && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="w-full max-w-3xl bg-surface border border-stroke rounded-3xl p-6 sm:p-8 shadow-2xl my-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stroke">
                <h3 className="text-lg font-display italic text-text-primary font-semibold">
                  {isCreating
                    ? isAr
                      ? 'إضافة خدمة جديدة (بالعربي والإنجليزي)'
                      : 'Add New Service (Bilingual AR/EN)'
                    : isAr
                    ? `تعديل خدمة: ${editingService.titleAr || editingService.titleEn || editingService.title}`
                    : `Edit Service: ${editingService.titleEn || editingService.titleAr || editingService.title}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="p-1.5 rounded-full hover:bg-bg text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Bilingual Tab Switcher */}
              <div className="flex items-center gap-2 p-1.5 bg-bg rounded-2xl border border-stroke mb-6 max-w-xs">
                <button
                  type="button"
                  onClick={() => setFormTab('ar')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    formTab === 'ar'
                      ? 'bg-text-primary text-bg font-semibold shadow'
                      : 'text-muted hover:text-text-primary'
                  }`}
                >
                  <span>🇸🇦 العربية</span>
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
                  <span>🇬🇧 English</span>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* ARABIC TAB */}
                {formTab === 'ar' && (
                  <div className="space-y-4" dir="rtl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          عنوان الخدمة بالعربية *
                        </label>
                        <input
                          type="text"
                          required={formTab === 'ar' && !editingService.titleEn}
                          value={editingService.titleAr || ''}
                          onChange={(e) =>
                            setEditingService({ ...editingService, titleAr: e.target.value })
                          }
                          placeholder="مثال: تطوير تطبيقات الويب الكاملة"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          العنوان الفرعي بالعربية
                        </label>
                        <input
                          type="text"
                          value={editingService.subtitleAr || ''}
                          onChange={(e) =>
                            setEditingService({ ...editingService, subtitleAr: e.target.value })
                          }
                          placeholder="مثال: منصات سحابية عالية السرعة والأمان"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        شرح وتفاصيل الخدمة بالعربية
                      </label>
                      <textarea
                        rows={3}
                        value={editingService.descriptionAr || ''}
                        onChange={(e) =>
                          setEditingService({ ...editingService, descriptionAr: e.target.value })
                        }
                        placeholder="شرح معمق لما تتضمنه هذه الخدمة الهندسية وكيفية تنفيذها..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        القيمة المضافة للأعمال (Business Value) بالعربية
                      </label>
                      <input
                        type="text"
                        value={editingService.businessValueAr || ''}
                        onChange={(e) =>
                          setEditingService({ ...editingService, businessValueAr: e.target.value })
                        }
                        placeholder="مثال: زيادة معدل التحويل وسرعة الاستجابة بنسبة 40%"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        مخرجات التسليم النموذجية بالعربية (مفصولة بفواصل)
                      </label>
                      <input
                        type="text"
                        value={(editingService.typicalDeliverablesAr || []).join('، ')}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            typicalDeliverablesAr: e.target.value
                              .split(/[,،]/)
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="هندسة مخصصة، اختبارات جودة شاملة، نشر سحابي مباشر"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        الفئة المستهدفة بالعربية (مناسب لمن؟)
                      </label>
                      <input
                        type="text"
                        value={editingService.suitableForAr || ''}
                        onChange={(e) =>
                          setEditingService({ ...editingService, suitableForAr: e.target.value })
                        }
                        placeholder="مثال: الشركات الناشئة، المتاجر الإلكترونية، والمؤسسات الطموحة"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none text-right"
                      />
                    </div>
                  </div>
                )}

                {/* ENGLISH TAB */}
                {formTab === 'en' && (
                  <div className="space-y-4" dir="ltr">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          Service Title in English *
                        </label>
                        <input
                          type="text"
                          required={formTab === 'en' && !editingService.titleAr}
                          value={editingService.titleEn || ''}
                          onChange={(e) =>
                            setEditingService({ ...editingService, titleEn: e.target.value })
                          }
                          placeholder="e.g. Full-Stack Web Application Engineering"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          Subtitle in English
                        </label>
                        <input
                          type="text"
                          value={editingService.subtitleEn || ''}
                          onChange={(e) =>
                            setEditingService({ ...editingService, subtitleEn: e.target.value })
                          }
                          placeholder="e.g. High-performance, scalable cloud architectures"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        Service Description in English
                      </label>
                      <textarea
                        rows={3}
                        value={editingService.descriptionEn || ''}
                        onChange={(e) =>
                          setEditingService({ ...editingService, descriptionEn: e.target.value })
                        }
                        placeholder="In-depth details about this engineering capability and how it helps clients..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        Business Value in English
                      </label>
                      <input
                        type="text"
                        value={editingService.businessValueEn || ''}
                        onChange={(e) =>
                          setEditingService({ ...editingService, businessValueEn: e.target.value })
                        }
                        placeholder="e.g. 40% reduction in bounce rate and sub-second load times"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        Deliverables in English (comma separated)
                      </label>
                      <input
                        type="text"
                        value={(editingService.typicalDeliverablesEn || []).join(', ')}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            typicalDeliverablesEn: e.target.value
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="Custom Architecture, QA Testing, Live CI/CD Pipeline"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        Target Audience in English (Suitable For)
                      </label>
                      <input
                        type="text"
                        value={editingService.suitableForEn || ''}
                        onChange={(e) =>
                          setEditingService({ ...editingService, suitableForEn: e.target.value })
                        }
                        placeholder="e.g. High-growth startups, scale-ups, and established brands"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-stroke">
                  <button
                    type="button"
                    onClick={() => setFormTab(formTab === 'ar' ? 'en' : 'ar')}
                    className="text-xs text-muted hover:text-text-primary flex items-center gap-1 font-mono transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#89AACC]" />
                    <span>{formTab === 'ar' ? 'الانتقال إلى English' : 'Switch to العربية'}</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingService(null)}
                      className="px-5 py-2.5 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-xs font-medium text-text-primary transition-colors cursor-pointer"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      {isAr ? 'حفظ الخدمة باللغتين' : 'Save Service (Bilingual)'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Services List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => {
          const displayTitle = (isAr ? service.titleAr : service.titleEn) || service.title;
          const displayDesc = (isAr ? service.descriptionAr : service.descriptionEn) || service.description;
          const displayDeliverables = (isAr ? service.typicalDeliverablesAr : service.typicalDeliverablesEn) || service.typicalDeliverables || [];
          const displaySuitable = (isAr ? service.suitableForAr : service.suitableForEn) || service.suitableFor;

          return (
            <div
              key={service.id}
              className="p-6 rounded-3xl bg-surface border border-stroke hover:border-[#89AACC]/40 transition-all flex flex-col justify-between gap-4 shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-bg border border-stroke flex items-center justify-center text-[#89AACC] shrink-0">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-text-primary">{displayTitle}</h3>
                        {(service.titleAr && service.titleEn) && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#89AACC]/20 text-[#89AACC]">AR+EN</span>
                        )}
                      </div>
                      {displaySuitable && (
                        <span className="text-[11px] font-mono text-muted">
                          {displaySuitable}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted leading-relaxed line-clamp-3 mb-4">
                  {displayDesc}
                </p>

                {displayDeliverables.length > 0 && (
                  <div className="space-y-1.5 pt-3 border-t border-stroke/40">
                    <span className="text-[10px] font-mono uppercase text-muted tracking-wider block">
                      {isAr ? 'مخرجات التسليم الأساسية:' : 'Key Deliverables:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {displayDeliverables.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-bg border border-stroke text-text-primary"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#89AACC]" />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-stroke/60 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="px-3.5 py-1.5 rounded-full bg-bg hover:bg-stroke/60 text-xs font-medium text-text-primary border border-stroke transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-[#89AACC]" />
                  <span>{isAr ? 'تعديل (AR/EN)' : 'Edit (AR/EN)'}</span>
                </button>

                <button
                  onClick={() => setServiceToDelete(service)}
                  className="p-1.5 rounded-full hover:bg-rose-500/10 text-muted hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                  title={isAr ? 'حذف الخدمة' : 'Delete Service'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(serviceToDelete)}
        title={isAr ? 'حذف هذه الخدمة؟' : 'Delete this service?'}
        message={
          isAr
            ? 'هل أنت متأكد من رغبتك في إزالة هذه الخدمة من قائمة الخدمات المعروضة على الموقع؟'
            : 'Are you sure you want to remove this engineering service from the public portfolio?'
        }
        itemTitle={(isAr ? serviceToDelete?.titleAr : serviceToDelete?.titleEn) || serviceToDelete?.title}
        onConfirm={confirmDelete}
        onCancel={() => setServiceToDelete(null)}
      />
    </div>
  );
};
