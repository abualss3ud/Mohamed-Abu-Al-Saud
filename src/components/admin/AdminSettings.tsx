import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Sparkles,
  User,
  Languages,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLanguage } from '../../context/LanguageContext';
import { SiteSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, showToast } = usePortfolio();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [formData, setFormData] = useState<SiteSettings>({
    ...settings,
    fullName: settings.fullName || 'Mohamed Abu Al-Saud',
    title: settings.title || 'Full-Stack Developer & UI/UX Designer',
    titleAr: settings.titleAr || 'مطور Full-Stack ومصمم تجارب مستخدم UI/UX',
    titleEn: settings.titleEn || 'Full-Stack Developer & UI/UX Designer',
    bio: settings.bio || '',
    bioAr:
      settings.bioAr ||
      'مطور ويب Full-Stack بخبرة متقدمة في بناء تطبيقات الويب السحابية المتكاملة، أنظمة التجارة الإلكترونية، ولوحات التحكم الإدارية عالية الأداء.',
    bioEn:
      settings.bioEn ||
      'Full-Stack Web Developer & UI/UX Designer specializing in scalable web applications, real-time dashboards, and high-performance digital products.',
    location: settings.location || 'Qena, Egypt',
    locationAr: settings.locationAr || 'قنا، مصر',
    locationEn: settings.locationEn || 'Qena, Egypt',
    email: settings.email || 'abualss3ud@gmail.com',
    seoTitle: settings.seoTitle || 'Abu Al-Saud · Full-Stack Developer',
    seoTitleAr: settings.seoTitleAr || 'محمد أبو السعود · مطور Full-Stack ومصمم UI/UX',
    seoTitleEn: settings.seoTitleEn || 'Abu Al-Saud · Full-Stack Developer & UI/UX',
    seoDescription: settings.seoDescription || '',
    seoDescriptionAr:
      settings.seoDescriptionAr ||
      'الموقع الشخصي ومعرض أعمال ومقالات المطور محمد أبو السعود، خبير تطوير تطبيقات الويب الحديثة.',
    seoDescriptionEn:
      settings.seoDescriptionEn ||
      'Personal portfolio and technical journal of Mohamed Abu Al-Saud, Full-Stack engineer specializing in modern web platforms.',
  });

  const [settingsTab, setSettingsTab] = useState<'ar' | 'en' | 'social'>('ar');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: SiteSettings = {
      ...formData,
      title: isAr ? (formData.titleAr || formData.title) : (formData.titleEn || formData.title),
      bio: isAr ? (formData.bioAr || formData.bio) : (formData.bioEn || formData.bio),
      location: isAr ? (formData.locationAr || formData.location) : (formData.locationEn || formData.location),
      seoTitle: isAr ? (formData.seoTitleAr || formData.seoTitle) : (formData.seoTitleEn || formData.seoTitle),
      seoDescription: isAr ? (formData.seoDescriptionAr || formData.seoDescription) : (formData.seoDescriptionEn || formData.seoDescription),
    };

    updateSettings(updated);
    showToast(
      isAr
        ? 'تم حفظ إعدادات الموقع باللغتين العربية والإنجليزية بنجاح'
        : 'Website settings saved in both Arabic and English successfully',
      'success'
    );
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-surface border border-stroke shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl sm:text-2xl font-display italic text-text-primary">
            {isAr ? 'إعدادات الموقع والهوية العامة' : 'General Website & Profile Settings'}
          </h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#89AACC]/15 text-[#89AACC] border border-[#89AACC]/30">
            <Languages className="w-3 h-3" />
            <span>{isAr ? 'عربي / English' : 'Bilingual AR/EN'}</span>
          </span>
        </div>
        <p className="text-xs text-muted">
          {isAr
            ? 'تحديث بيانات السيرة الذاتية، قنوات الاتصال، وروابط التواصل، وتهيئة SEO باللغتين العربية والإنجليزية.'
            : 'Configure profile metadata, bio, social links, and SEO optimization in both Arabic and English.'}
        </p>
      </div>

      {/* Language / Category Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-surface rounded-2xl border border-stroke max-w-md">
        <button
          type="button"
          onClick={() => setSettingsTab('ar')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            settingsTab === 'ar'
              ? 'bg-text-primary text-bg font-semibold shadow'
              : 'text-muted hover:text-text-primary'
          }`}
        >
          <span>🇸🇦 البيانات بالعربية</span>
        </button>

        <button
          type="button"
          onClick={() => setSettingsTab('en')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            settingsTab === 'en'
              ? 'bg-text-primary text-bg font-semibold shadow'
              : 'text-muted hover:text-text-primary'
          }`}
        >
          <span>🇬🇧 English Data</span>
        </button>

        <button
          type="button"
          onClick={() => setSettingsTab('social')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            settingsTab === 'social'
              ? 'bg-text-primary text-bg font-semibold shadow'
              : 'text-muted hover:text-text-primary'
          }`}
        >
          <span>🌐 {isAr ? 'الروابط العامة' : 'Links & Status'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. ARABIC PROFILE & SEO */}
        {settingsTab === 'ar' && (
          <div className="p-6 sm:p-7 rounded-3xl bg-surface border border-stroke space-y-5 shadow-sm" dir="rtl">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stroke">
              <User className="w-4 h-4 text-[#89AACC]" />
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                المعلومات الشخصية وتهيئة SEO بالعربية
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                  المسمى المهني بالعربية
                </label>
                <input
                  type="text"
                  value={formData.titleAr || ''}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  placeholder="مطور Full-Stack ومصمم واجهات UI/UX"
                  className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                  الموقع الجغرافي بالعربية
                </label>
                <input
                  type="text"
                  value={formData.locationAr || ''}
                  onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })}
                  placeholder="قنا، مصر"
                  className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                النبذة التعريفية (Bio) بالعربية
              </label>
              <textarea
                rows={4}
                value={formData.bioAr || ''}
                onChange={(e) => setFormData({ ...formData, bioAr: e.target.value })}
                placeholder="نبذة عن خبرتك البرمجية ومعمارية الويب والتقنيات التي تتقنها..."
                className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-4 text-sm text-text-primary focus:outline-none resize-y text-right leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-stroke/60 space-y-4">
              <span className="text-xs font-mono text-muted block uppercase tracking-wider">
                تهيئة محركات البحث (SEO بالعربية)
              </span>

              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                  عنوان الصفحة في Google (SEO Title بالعربية)
                </label>
                <input
                  type="text"
                  value={formData.seoTitleAr || ''}
                  onChange={(e) => setFormData({ ...formData, seoTitleAr: e.target.value })}
                  placeholder="محمد أبو السعود · مطور Full-Stack"
                  className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                  وصف الموقع لمحركات البحث (SEO Description بالعربية)
                </label>
                <textarea
                  rows={2}
                  value={formData.seoDescriptionAr || ''}
                  onChange={(e) => setFormData({ ...formData, seoDescriptionAr: e.target.value })}
                  placeholder="وصف مختصر ومؤثر يظهر في نتائج البحث عند تصفح محركات البحث باللغة العربية..."
                  className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y text-right"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. ENGLISH PROFILE & SEO */}
        {settingsTab === 'en' && (
          <div className="p-6 sm:p-7 rounded-3xl bg-surface border border-stroke space-y-5 shadow-sm" dir="ltr">
            <div className="flex items-center gap-2.5 pb-3 border-b border-stroke">
              <User className="w-4 h-4 text-[#89AACC]" />
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                Personal Profile & SEO in English
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                  Professional Title in English
                </label>
                <input
                  type="text"
                  value={formData.titleEn || ''}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Full-Stack Developer & UI/UX Designer"
                  className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                  Location in English
                </label>
                <input
                  type="text"
                  value={formData.locationEn || ''}
                  onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                  placeholder="Qena, Egypt"
                  className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                Bio & Summary in English
              </label>
              <textarea
                rows={4}
                value={formData.bioEn || ''}
                onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
                placeholder="Engineering bio, full-stack specializations, and production experience..."
                className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-4 text-sm text-text-primary focus:outline-none resize-y leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-stroke/60 space-y-4">
              <span className="text-xs font-mono text-muted block uppercase tracking-wider">
                Search Engine Optimization (SEO in English)
              </span>

              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                  Page Title in Google (SEO Title in English)
                </label>
                <input
                  type="text"
                  value={formData.seoTitleEn || ''}
                  onChange={(e) => setFormData({ ...formData, seoTitleEn: e.target.value })}
                  placeholder="Abu Al-Saud · Full-Stack Developer & UI/UX"
                  className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                  Meta Description (SEO Description in English)
                </label>
                <textarea
                  rows={2}
                  value={formData.seoDescriptionEn || ''}
                  onChange={(e) => setFormData({ ...formData, seoDescriptionEn: e.target.value })}
                  placeholder="High-impact concise summary that appears in English search results..."
                  className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. SOCIAL, CONTACT & STATUS */}
        {settingsTab === 'social' && (
          <div className="space-y-6">
            {/* General Identity */}
            <div className="p-6 sm:p-7 rounded-3xl bg-surface border border-stroke space-y-5 shadow-sm">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stroke">
                <User className="w-4 h-4 text-[#89AACC]" />
                <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                  {isAr ? 'بيانات الهوية والاتصال' : 'General Contact Channels'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                    {isAr ? 'الاسم المختصر (Display Name)' : 'Display Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Abu Al-Saud"
                    className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                    {isAr ? 'البريد الإلكتروني للعمل' : 'Work Email'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="abualss3ud@gmail.com"
                    dir="ltr"
                    className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6 sm:p-7 rounded-3xl bg-surface border border-stroke space-y-5 shadow-sm">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stroke">
                <Globe className="w-4 h-4 text-[#89AACC]" />
                <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                  {isAr ? 'روابط المنصات والشبكات' : 'Social & Developer Profiles'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                    GitHub URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      placeholder="https://github.com/..."
                      dir="ltr"
                      className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none pl-9"
                    />
                    <Github className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                    LinkedIn URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      dir="ltr"
                      className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none pl-9"
                    />
                    <Linkedin className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                    Twitter / X URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      placeholder="https://x.com/..."
                      dir="ltr"
                      className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none pl-9"
                    />
                    <Twitter className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="p-6 sm:p-7 rounded-3xl bg-surface border border-stroke space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">
                    {isAr ? 'حالة التفرغ واستقبال المشاريع الجديدة' : 'Work Availability Status'}
                  </h4>
                  <p className="text-xs text-muted mt-0.5">
                    {isAr
                      ? 'تحدد ما إذا كانت شارة "متاح للعمل" خضراء ونشطة على الموقع العام.'
                      : 'Controls whether the "Available for Projects" badge is active on the website.'}
                  </p>
                </div>

                <select
                  value={formData.siteStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      siteStatus: e.target.value as SiteSettings['siteStatus'],
                    })
                  }
                  className="bg-bg border border-stroke rounded-2xl px-4 py-2 text-xs text-text-primary focus:outline-none cursor-pointer"
                >
                  <option value="available">{isAr ? 'متاح لمشاريع جديدة 🟢' : 'Available for Work 🟢'}</option>
                  <option value="booked">{isAr ? 'محجوز حالياً 🔴' : 'Currently Booked 🔴'}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Submit Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-stroke">
          <button
            type="button"
            onClick={() => setSettingsTab(settingsTab === 'ar' ? 'en' : settingsTab === 'en' ? 'social' : 'ar')}
            className="text-xs text-muted hover:text-text-primary flex items-center gap-1 font-mono transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#89AACC]" />
            <span>{isAr ? 'الانتقال للتبويب التالي' : 'Next Tab'}</span>
          </button>

          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{isAr ? 'حفظ كافة الإعدادات باللغتين' : 'Save All Settings (Bilingual)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
