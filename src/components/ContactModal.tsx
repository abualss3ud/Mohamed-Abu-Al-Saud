import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-full max-w-lg bg-surface border border-stroke rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-stroke mb-6">
              <div>
                <span className="text-xs text-muted uppercase tracking-[0.25em] font-mono block mb-1">
                  {isAr ? 'تواصل مباشر' : 'Say Hello'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-display italic text-text-primary font-semibold">
                  {isAr ? 'ابدأ محادثة' : "Let's Connect"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stroke/40 hover:bg-stroke text-muted hover:text-text-primary flex items-center justify-center transition-colors cursor-pointer text-sm"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                ✕
              </button>
            </div>

            {sent ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <h3 className="text-lg font-medium text-text-primary">
                  {isAr ? 'تم إرسال الرسالة بنجاح' : 'Message Dispatched'}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {isAr
                    ? 'شكراً لتواصلك، سأقوم بالرد عليك في أقرب وقت ممكن.'
                    : 'Thank you for reaching out. I will get back to you promptly.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-muted uppercase tracking-wider mb-1.5 font-mono">
                    {isAr ? 'الاسم' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isAr ? 'محمد علي' : 'Jane Doe'}
                    className="w-full px-4 py-3 bg-bg border border-stroke rounded-xl text-text-primary placeholder:text-muted/40 focus:outline-none focus:border-[#89AACC]/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-muted uppercase tracking-wider mb-1.5 font-mono">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isAr ? 'your-email@example.com' : 'jane@studio.com'}
                    className="w-full px-4 py-3 bg-bg border border-stroke rounded-xl text-text-primary placeholder:text-muted/40 focus:outline-none focus:border-[#89AACC]/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-muted uppercase tracking-wider mb-1.5 font-mono">
                    {isAr ? 'الرسالة / تفاصيل المشروع' : 'Message / Project Scope'}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      isAr
                        ? 'أخبرني عن فكرة مشروعك، المدة المتوقعة، أو متطلبات العمل...'
                        : 'Tell me about your timeline, vision, or ideas...'
                    }
                    className="w-full px-4 py-3 bg-bg border border-stroke rounded-xl text-text-primary placeholder:text-muted/40 focus:outline-none focus:border-[#89AACC]/60 transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-4">
                  <a
                    href="mailto:abualss3ud@gmail.com"
                    className="text-muted hover:text-text-primary underline underline-offset-4 font-mono text-[11px]"
                  >
                    abualss3ud@gmail.com
                  </a>

                  <button
                    type="submit"
                    className="group relative rounded-full text-xs font-medium cursor-pointer p-[1.5px] transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <span
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
                      aria-hidden="true"
                    />
                    <span className="flex items-center gap-1.5 bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary rounded-full px-6 py-3 transition-colors">
                      <span>{isAr ? 'إرسال الرسالة' : 'Send Message'}</span>
                      <span className="rtl-arrow-diag">↗</span>
                    </span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
