import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, MessageSquareQuote, Star, X, Building, Languages, Globe } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLanguage } from '../../context/LanguageContext';
import { Testimonial } from '../../types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export const AdminTestimonials: React.FC = () => {
  const { testimonials, setTestimonials, showToast } = usePortfolio();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [formTab, setFormTab] = useState<'ar' | 'en'>('ar');

  const emptyTestimonial: Testimonial = {
    id: `test-${Date.now()}`,
    clientName: '',
    clientNameAr: '',
    clientNameEn: '',
    role: 'Chief Technology Officer',
    roleAr: 'الرئيس التنفيذي للتقنية',
    roleEn: 'Chief Technology Officer',
    company: '',
    companyAr: '',
    companyEn: '',
    feedback: '',
    feedbackAr: '',
    feedbackEn: '',
    projectTitle: 'Full-Stack Platform Delivery',
    projectTitleAr: 'تطوير منصة سحابية كاملة',
    projectTitleEn: 'Full-Stack Platform Delivery',
  };

  const handleEdit = (test: Testimonial) => {
    setEditingTestimonial({
      ...test,
      clientNameAr: test.clientNameAr || (isAr ? test.clientName : ''),
      clientNameEn: test.clientNameEn || (!isAr ? test.clientName : test.clientName),
      companyAr: test.companyAr || test.company,
      companyEn: test.companyEn || test.company,
      roleAr: test.roleAr || test.role,
      roleEn: test.roleEn || test.role,
      feedbackAr: test.feedbackAr || (isAr ? test.feedback : ''),
      feedbackEn: test.feedbackEn || (!isAr ? test.feedback : test.feedback),
      projectTitleAr: test.projectTitleAr || test.projectTitle,
      projectTitleEn: test.projectTitleEn || test.projectTitle,
    });
    setFormTab(isAr ? 'ar' : 'en');
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingTestimonial({ ...emptyTestimonial, id: `test-${Date.now()}` });
    setFormTab(isAr ? 'ar' : 'en');
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    const primaryName =
      (isAr ? editingTestimonial.clientNameAr : editingTestimonial.clientNameEn) ||
      editingTestimonial.clientNameEn ||
      editingTestimonial.clientNameAr ||
      editingTestimonial.clientName;

    if (!primaryName?.trim()) {
      showToast(isAr ? 'يرجى إدخال اسم العميل' : 'Please provide client name', 'destructive');
      return;
    }

    const nameEn = editingTestimonial.clientNameEn?.trim() || primaryName;
    const nameAr = editingTestimonial.clientNameAr?.trim() || primaryName;
    const feedbackEn = editingTestimonial.feedbackEn?.trim() || editingTestimonial.feedback || '';
    const feedbackAr = editingTestimonial.feedbackAr?.trim() || editingTestimonial.feedback || '';

    const updated: Testimonial = {
      ...editingTestimonial,
      clientName: isAr ? nameAr : nameEn,
      clientNameAr: nameAr,
      clientNameEn: nameEn,
      company: isAr ? (editingTestimonial.companyAr || editingTestimonial.company) : (editingTestimonial.companyEn || editingTestimonial.company),
      companyAr: editingTestimonial.companyAr,
      companyEn: editingTestimonial.companyEn,
      role: isAr ? (editingTestimonial.roleAr || editingTestimonial.role) : (editingTestimonial.roleEn || editingTestimonial.role),
      roleAr: editingTestimonial.roleAr,
      roleEn: editingTestimonial.roleEn,
      feedback: isAr ? feedbackAr : feedbackEn,
      feedbackAr,
      feedbackEn,
      projectTitle: isAr ? (editingTestimonial.projectTitleAr || editingTestimonial.projectTitle) : (editingTestimonial.projectTitleEn || editingTestimonial.projectTitle),
      projectTitleAr: editingTestimonial.projectTitleAr,
      projectTitleEn: editingTestimonial.projectTitleEn,
    };

    if (isCreating) {
      setTestimonials((prev) => [updated, ...prev]);
      showToast(isAr ? 'تمت إضافة التوصية باللغتين بنجاح' : 'Testimonial added in both languages', 'success');
    } else {
      setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      showToast(isAr ? 'تم تحديث التوصية باللغتين' : 'Testimonial updated in both languages', 'success');
    }
    setEditingTestimonial(null);
    setIsCreating(false);
  };

  const confirmDelete = () => {
    if (testimonialToDelete) {
      setTestimonials((prev) => prev.filter((t) => t.id !== testimonialToDelete.id));
      showToast(isAr ? 'تم حذف التوصية' : 'Testimonial removed', 'info');
      setTestimonialToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-surface border border-stroke shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-display italic text-text-primary">
              {isAr ? 'إدارة آراء وتوصيات العملاء' : 'Client Testimonials & Endorsements'}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#89AACC]/15 text-[#89AACC] border border-[#89AACC]/30">
              <Languages className="w-3 h-3" />
              <span>{isAr ? 'عربي / English' : 'Bilingual AR/EN'}</span>
            </span>
          </div>
          <p className="text-xs text-muted">
            {isAr
              ? 'إضافة وتعديل مراجعات العملاء وتوصياتهم باللغتين العربية والإنجليزية.'
              : 'Manage verified client feedback, corporate endorsements, and recommendations in AR & EN.'}
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-5 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة رأي عميل (AR/EN)' : 'Add Testimonial (AR/EN)'}</span>
        </button>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {editingTestimonial && (
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
                      ? 'إضافة رأي عميل جديد (بالعربي والإنجليزي)'
                      : 'Add Client Testimonial (Bilingual AR/EN)'
                    : isAr
                    ? `تعديل توصية: ${editingTestimonial.clientNameAr || editingTestimonial.clientNameEn || editingTestimonial.clientName}`
                    : `Edit Testimonial: ${editingTestimonial.clientNameEn || editingTestimonial.clientNameAr || editingTestimonial.clientName}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
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
                {/* 1. ARABIC TAB */}
                {formTab === 'ar' && (
                  <div className="space-y-4" dir="rtl">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          اسم العميل بالعربية *
                        </label>
                        <input
                          type="text"
                          required={formTab === 'ar' && !editingTestimonial.clientNameEn}
                          value={editingTestimonial.clientNameAr || ''}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              clientNameAr: e.target.value,
                            })
                          }
                          placeholder="مثال: أحمد منصور"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          المسمى الوظيفي بالعربية
                        </label>
                        <input
                          type="text"
                          value={editingTestimonial.roleAr || ''}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              roleAr: e.target.value,
                            })
                          }
                          placeholder="مثال: الشريك المؤسس والرئيس التقني"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          اسم الشركة بالعربية
                        </label>
                        <input
                          type="text"
                          value={editingTestimonial.companyAr || ''}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              companyAr: e.target.value,
                            })
                          }
                          placeholder="مثال: تك فينتشرز المحدودة"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        المشروع أو الخدمة المنفذة بالعربية
                      </label>
                      <input
                        type="text"
                        value={editingTestimonial.projectTitleAr || ''}
                        onChange={(e) =>
                          setEditingTestimonial({
                            ...editingTestimonial,
                            projectTitleAr: e.target.value,
                          })
                        }
                        placeholder="مثال: تطوير منصة التجارة الإلكترونية الشاملة"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        نص الرأي والتوصية بالعربية
                      </label>
                      <textarea
                        rows={4}
                        value={editingTestimonial.feedbackAr || ''}
                        onChange={(e) =>
                          setEditingTestimonial({
                            ...editingTestimonial,
                            feedbackAr: e.target.value,
                          })
                        }
                        placeholder="اكتب التوصية المهنية التي قدمها العميل باللغة العربية..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-4 text-xs text-text-primary focus:outline-none resize-y leading-relaxed text-right"
                      />
                    </div>
                  </div>
                )}

                {/* 2. ENGLISH TAB */}
                {formTab === 'en' && (
                  <div className="space-y-4" dir="ltr">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          Client Name in English *
                        </label>
                        <input
                          type="text"
                          required={formTab === 'en' && !editingTestimonial.clientNameAr}
                          value={editingTestimonial.clientNameEn || ''}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              clientNameEn: e.target.value,
                            })
                          }
                          placeholder="e.g. Ahmed Mansour"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          Role / Title in English
                        </label>
                        <input
                          type="text"
                          value={editingTestimonial.roleEn || ''}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              roleEn: e.target.value,
                            })
                          }
                          placeholder="e.g. Co-Founder & CTO"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          Company Name in English
                        </label>
                        <input
                          type="text"
                          value={editingTestimonial.companyEn || ''}
                          onChange={(e) =>
                            setEditingTestimonial({
                              ...editingTestimonial,
                              companyEn: e.target.value,
                            })
                          }
                          placeholder="e.g. TechVentures Studio"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        Project / Delivered Solution in English
                      </label>
                      <input
                        type="text"
                        value={editingTestimonial.projectTitleEn || ''}
                        onChange={(e) =>
                          setEditingTestimonial({
                            ...editingTestimonial,
                            projectTitleEn: e.target.value,
                          })
                        }
                        placeholder="e.g. Full-Stack Commerce Architecture"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        Feedback / Testimonial in English
                      </label>
                      <textarea
                        rows={4}
                        value={editingTestimonial.feedbackEn || ''}
                        onChange={(e) =>
                          setEditingTestimonial({
                            ...editingTestimonial,
                            feedbackEn: e.target.value,
                          })
                        }
                        placeholder="Write the client's verified endorsement in English..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-4 text-xs text-text-primary focus:outline-none resize-y leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
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
                      onClick={() => setEditingTestimonial(null)}
                      className="px-5 py-2.5 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-xs font-medium text-text-primary transition-colors cursor-pointer"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      {isAr ? 'حفظ التوصية باللغتين' : 'Save Testimonial (Bilingual)'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((test) => {
          const displayName = (isAr ? test.clientNameAr : test.clientNameEn) || test.clientName;
          const displayCompany = (isAr ? test.companyAr : test.companyEn) || test.company;
          const displayRole = (isAr ? test.roleAr : test.roleEn) || test.role;
          const displayFeedback = (isAr ? test.feedbackAr : test.feedbackEn) || test.feedback;
          const displayProject = (isAr ? test.projectTitleAr : test.projectTitleEn) || test.projectTitle;

          return (
            <div
              key={test.id}
              className="p-6 rounded-3xl bg-surface border border-stroke hover:border-[#89AACC]/40 transition-all flex flex-col justify-between gap-4 shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#89AACC]/15 text-[#89AACC] flex items-center justify-center font-bold text-sm border border-[#89AACC]/30 shrink-0">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-text-primary">{displayName}</h3>
                        {(test.clientNameAr && test.clientNameEn) && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#89AACC]/20 text-[#89AACC]">AR+EN</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-muted mt-0.5">
                        <span>{displayRole}</span>
                        {displayCompany && (
                          <>
                            <span>@</span>
                            <span className="text-text-primary/80">{displayCompany}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-muted leading-relaxed italic line-clamp-4 my-3 bg-bg/50 p-3.5 rounded-2xl border border-stroke/60">
                  "{displayFeedback}"
                </p>

                {displayProject && (
                  <div className="text-[11px] font-mono text-[#89AACC] pt-2">
                    <span>{isAr ? 'المشروع المنفذ: ' : 'Delivered Project: '}</span>
                    <span className="text-text-primary font-medium">{displayProject}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stroke/60 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(test)}
                  className="px-3.5 py-1.5 rounded-full bg-bg hover:bg-stroke/60 text-xs font-medium text-text-primary border border-stroke transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-[#89AACC]" />
                  <span>{isAr ? 'تعديل (AR/EN)' : 'Edit (AR/EN)'}</span>
                </button>

                <button
                  onClick={() => setTestimonialToDelete(test)}
                  className="p-1.5 rounded-full hover:bg-rose-500/10 text-muted hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                  title={isAr ? 'حذف التوصية' : 'Delete Testimonial'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        isOpen={Boolean(testimonialToDelete)}
        title={isAr ? 'حذف هذه التوصية؟' : 'Delete this testimonial?'}
        message={
          isAr
            ? 'هل أنت متأكد من رغبتك في حذف هذا التقييم والتوصية من الموقع؟'
            : 'Are you sure you want to delete this verified endorsement?'
        }
        itemTitle={(isAr ? testimonialToDelete?.clientNameAr : testimonialToDelete?.clientNameEn) || testimonialToDelete?.clientName}
        onConfirm={confirmDelete}
        onCancel={() => setTestimonialToDelete(null)}
      />
    </div>
  );
};
