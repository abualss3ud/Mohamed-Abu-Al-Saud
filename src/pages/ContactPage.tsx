import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';
import { TRANSLATIONS } from '../translations';
import { Mail, MapPin, CheckCircle2, Copy, Check, Send, Github, Linkedin, ExternalLink } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { language } = useLanguage();
  const { addMessage } = usePortfolio();
  const isAr = language === 'ar';
  const t = TRANSLATIONS[language].contact;

  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('fullstack');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('abualss3ud@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(isAr ? 'يرجى إدخال اسمك الكريم' : 'Please enter your name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError(isAr ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
      return;
    }
    if (!message.trim()) {
      setError(isAr ? 'يرجى كتابة رسالتك أو تفاصيل المشروع' : 'Please describe your message or project');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Save to context
      addMessage({
        name: name.trim(),
        email: email.trim(),
        company: '',
        projectType: service,
        budget: 'Flexible',
        timeline: 'Standard',
        projectDetails: message.trim(),
      });

      // Post to backend API
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          projectType: service,
          message: message.trim(),
        }),
      }).catch(() => {});

      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Info Cards & Links */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Direct Email Card */}
            <div className="p-8 rounded-3xl bg-surface border border-stroke shadow-xl relative overflow-hidden group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-bg border border-stroke flex items-center justify-center text-[#89AACC]">
                  <Mail className="w-5 h-5" />
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg border border-stroke text-xs text-muted hover:text-text-primary transition-colors cursor-pointer"
                  title="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-mono">
                        {isAr ? 'تم النسخ' : 'Copied'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="font-mono">{isAr ? 'نسخ' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>

              <span className="text-xs font-mono uppercase tracking-wider text-muted block mb-1">
                {isAr ? 'البريد الإلكتروني المباشر' : 'Direct Email'}
              </span>
              <a
                href="mailto:abualss3ud@gmail.com"
                className="text-lg sm:text-xl font-medium text-text-primary hover:text-white transition-colors block font-mono break-all"
              >
                abualss3ud@gmail.com
              </a>
            </div>

            {/* Location & Availability Card */}
            <div className="p-8 rounded-3xl bg-surface border border-stroke shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-bg border border-stroke flex items-center justify-center text-[#89AACC]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-muted block">
                    {isAr ? 'الموقع الجغرافي' : 'Location & Timezone'}
                  </span>
                  <span className="text-base font-medium text-text-primary">
                    {isAr ? 'قنا، مصر (GMT+2)' : 'Qena, Egypt (GMT+2)'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-stroke/50 flex items-center gap-2.5 text-xs text-muted font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="text-emerald-400 font-medium">
                  {isAr
                    ? 'متاح للعمل عن بُعد حول العالم أو داخل مصر'
                    : 'Available for Remote Worldwide & On-site Egypt'}
                </span>
              </div>
            </div>

            {/* Social & Professional Profiles */}
            <div className="p-8 rounded-3xl bg-surface border border-stroke shadow-xl">
              <span className="text-xs font-mono uppercase tracking-wider text-muted block mb-4">
                {isAr ? 'الحسابات المهنية' : 'Professional Profiles'}
              </span>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-bg border border-stroke hover:border-[#89AACC]/60 text-text-primary transition-all group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-medium">
                    <Github className="w-4 h-4 text-muted group-hover:text-text-primary transition-colors" />
                    <span>GitHub</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-text-primary transition-colors" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-bg border border-stroke hover:border-[#89AACC]/60 text-text-primary transition-all group"
                >
                  <div className="flex items-center gap-2.5 text-xs font-medium">
                    <Linkedin className="w-4 h-4 text-muted group-hover:text-text-primary transition-colors" />
                    <span>LinkedIn</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-text-primary transition-colors" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Full Interactive Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-stroke shadow-2xl relative">
              <h2 className="text-2xl sm:text-3xl font-display italic text-text-primary mb-2 font-normal">
                {isAr ? 'أرسل رسالة أو تفاصيل مشروع' : 'Send A Message Or Project Request'}
              </h2>
              <p className="text-sm text-muted mb-8 leading-relaxed">
                {isAr
                  ? 'املأ النموذج أدناه وسأقوم بالرد عليك خلال ٢٤ ساعة لمناقشة كافة التفاصيل.'
                  : 'Fill out the form below and I will get back to you within 24 hours to discuss details.'}
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-2xl bg-bg border border-emerald-500/40 text-center flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {isAr ? 'تم استلام رسالتك بنجاح!' : 'Message Received!'}
                  </h3>
                  <p className="text-sm text-muted max-w-md mb-6 leading-relaxed">
                    {isAr
                      ? 'شكراً لتواصلك يا أستاذ/ة. سأراجع طلبك وأرد عليك عبر البريد الإلكتروني في أقرب وقت.'
                      : 'Thank you for reaching out. I have received your note and will reply promptly.'}
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 rounded-full bg-surface border border-stroke text-xs font-mono uppercase tracking-wider text-text-primary hover:border-text-primary/50 transition-colors cursor-pointer"
                  >
                    {isAr ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                        {isAr ? 'الاسم الكامل *' : 'Your Name *'}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isAr ? 'مثال: أحمد محمد' : 'e.g. Alex Morgan'}
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC]/70 rounded-2xl px-4 py-3.5 text-sm text-text-primary placeholder:text-muted/50 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                        {isAr ? 'البريد الإلكتروني *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC]/70 rounded-2xl px-4 py-3.5 text-sm text-text-primary placeholder:text-muted/50 focus:outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                      {isAr ? 'نوع الخدمة أو المشروع المطلوبة' : 'Service Or Project Type'}
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-bg border border-stroke focus:border-[#89AACC]/70 rounded-2xl px-4 py-3.5 text-sm text-text-primary focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="fullstack">
                        {isAr ? 'تطوير تطبيق ويب متكامل (Full-Stack Web App)' : 'Full-Stack Web Application (React, Next.js, Node)'}
                      </option>
                      <option value="uiux">
                        {isAr ? 'تصميم واجهة وتجربة المستخدم (UI/UX & Design Systems)' : 'UI/UX Design & Figma Design Systems'}
                      </option>
                      <option value="frontend">
                        {isAr ? 'تطوير واجهات Front-End متجاوبة' : 'Front-End Development & React Architecture'}
                      </option>
                      <option value="backend">
                        {isAr ? 'برمجة خوادم وقواعد بيانات (APIs & PostgreSQL)' : 'Backend APIs & Database Architecture'}
                      </option>
                      <option value="consultancy">
                        {isAr ? 'استشارة برمجية / فرصة توظيف' : 'Technical Consultancy / Job Opportunity'}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                      {isAr ? 'تفاصيل الرسالة أو المشروع *' : 'Project Details / Message *'}
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        isAr
                          ? 'أخبرني عن مشروعك، المواعيد المتوقعة، أو متطلباتك التقنية...'
                          : 'Describe your vision, requirements, timelines, or anything relevant...'
                      }
                      className="w-full bg-bg border border-stroke focus:border-[#89AACC]/70 rounded-2xl p-4 text-sm text-text-primary placeholder:text-muted/50 focus:outline-none transition-colors resize-y leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group relative rounded-2xl text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer focus:outline-none p-[1.5px] disabled:opacity-60 disabled:pointer-events-none"
                  >
                    <span
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
                      aria-hidden="true"
                    />
                    <span className="flex items-center justify-center gap-2.5 border border-stroke group-hover:border-transparent bg-bg rounded-2xl py-4 text-text-primary transition-all shadow-md">
                      {isSubmitting ? (
                        <span>{isAr ? 'جاري الإرسال...' : 'Sending Message...'}</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-[#89AACC]" />
                          <span>{isAr ? 'إرسال الرسالة الآن' : 'Send Message'}</span>
                          <span className="text-xs rtl-arrow-diag">↗</span>
                        </>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
