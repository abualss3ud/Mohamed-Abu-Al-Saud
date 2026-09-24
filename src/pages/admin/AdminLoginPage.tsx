import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight, ArrowLeft, Check, AlertCircle, Loader2, Globe } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { useLanguage } from '../../context/LanguageContext';

export const AdminLoginPage: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading, login } = useAdminAuth();
  const { navigate } = useNavigation();
  const { language, toggleLanguage } = useLanguage();
  const isAr = language === 'ar';

  const [email, setEmail] = useState('abualss3ud@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated, redirect to /admin
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage(
        isAr ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter both email and password'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        navigate('/admin');
      } else {
        setErrorMessage(
          result.error ||
            (isAr
              ? 'بيانات الدخول غير صحيحة. يرجى التحقق والمحاولة مجدداً.'
              : 'Invalid admin credentials. Please verify and try again.')
        );
      }
    } catch (err: any) {
      setErrorMessage(
        isAr
          ? 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة لاحقاً.'
          : 'Failed to connect to authentication server.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col justify-between relative overflow-hidden selection:bg-[#4E85BF] selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full accent-gradient opacity-10 blur-[120px] pointer-events-none" />

      {/* Top Header Bar with language switcher & back to site */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-mono text-muted hover:text-text-primary transition-colors cursor-pointer py-1.5 px-3 rounded-full bg-surface/60 border border-stroke/60 hover:border-stroke"
        >
          {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          <span>{isAr ? 'العودة للموقع الرئيسي' : 'Back to Website'}</span>
        </button>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded-full border border-stroke/60 bg-surface/60 hover:border-[#89AACC]/50 text-text-primary transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-[#89AACC]" />
          <span>{isAr ? 'English' : 'العربية'}</span>
        </button>
      </header>

      {/* Main Login Form Card */}
      <main className="flex-grow flex items-center justify-center px-4 py-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="w-full max-w-md bg-surface/90 backdrop-blur-2xl border border-stroke rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        >
          {/* Logo / Header Monogram */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-full p-[1.5px] accent-gradient mb-4 flex items-center justify-center shadow-lg">
              <div className="w-full h-full rounded-full bg-bg flex items-center justify-center overflow-hidden">
                <img
                  src="https://res.cloudinary.com/oe19gniu/image/upload/v1790271150/WhatsApp_Image_2026-09-22_at_5.36.09_PM.jpg"
                  alt="Mohamed Abu Al-Saud"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-bg/80 border border-stroke text-[#89AACC] mb-2">
              <Shield className="w-3 h-3" />
              <span>{isAr ? 'لوحة التحكم الإدارية' : 'Admin Management Portal'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display italic text-text-primary font-semibold">
              {isAr ? 'تسجيل دخول الإدارة' : 'Admin Authentication'}
            </h1>
            <p className="text-xs text-muted mt-1.5 max-w-xs leading-relaxed">
              {isAr
                ? 'إدارة محتوى الموقع والمشاريع والخدمات والمدونة والرسائل'
                : 'Manage portfolio projects, services, blog articles, and inquiries'}
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5 mb-6"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-2">
                {isAr ? 'البريد الإلكتروني للإدارة' : 'Admin Email'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="abualss3ud@gmail.com"
                  dir="ltr"
                  className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-muted/50 focus:outline-none transition-colors pl-11"
                />
                <Mail className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-2">
                {isAr ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  dir="ltr"
                  className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-muted/50 focus:outline-none transition-colors pl-11 pr-11"
                />
                <Lock className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text-primary transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs text-muted">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md bg-bg border border-stroke text-[#89AACC] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>{isAr ? 'تذكر جلستي' : 'Keep me signed in'}</span>
              </label>

              <span className="text-[11px] font-mono text-muted/80">
                {isAr ? 'جلسة مشفرة وآمنة' : 'Encrypted Session'}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full group relative py-3.5 px-6 rounded-2xl bg-text-primary text-bg hover:bg-white text-xs uppercase tracking-wider font-semibold transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isAr ? 'جارِ التحقق...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <span>{isAr ? 'تسجيل الدخول إلى لوحة التحكم' : 'Sign In to Dashboard'}</span>
                  {isAr ? (
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </>
              )}
            </button>
          </form>
        </motion.div>
      </main>

      {/* Footer info */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs font-mono text-muted/60 z-10">
        <span>© {new Date().getFullYear()} Mohamed Abu Al-Saud · Restricted Administrator Access</span>
      </footer>
    </div>
  );
};
