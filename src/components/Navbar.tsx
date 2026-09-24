import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation, RoutePath, PageId } from '../context/NavigationContext';
import { TRANSLATIONS } from '../translations';

export const Navbar: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  const { activePage, navigate } = useNavigation();
  const t = TRANSLATIONS[language].nav;
  const [hasScrolled, setHasScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // The 6 main website pages: Home, Services, Projects, About, Blog, Contact
  const navItems: { label: string; path: RoutePath; id: PageId }[] = [
    { label: t.home, path: '/', id: 'home' },
    { label: t.services, path: '/services', id: 'services' },
    { label: t.projects, path: '/projects', id: 'projects' },
    { label: t.about, path: '/about', id: 'about' },
    { label: t.blog, path: '/blog', id: 'blog' },
    { label: t.contact, path: '/contact', id: 'contact' },
  ];

  const handleNavClick = (path: RoutePath) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-3 sm:pt-4 px-3 sm:px-4 pointer-events-none transition-all duration-300">
        {/* ================= DESKTOP NAVBAR (md and up) ================= */}
        <nav
          aria-label="Main Navigation"
          className={`hidden md:flex pointer-events-auto relative items-center gap-1 sm:gap-1.5 rounded-full px-2 py-1.5 sm:px-3 sm:py-2 transition-all duration-300 ${
            hasScrolled
              ? 'bg-surface/90 backdrop-blur-xl border border-white/[0.1] shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.12)]'
              : 'bg-surface/70 backdrop-blur-md border border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.08)]'
          }`}
        >
          {/* Logo: User profile image in circular ring */}
          <button
            onClick={() => handleNavClick('/')}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
            className="group relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center p-[1.5px] transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#89AACC]/70 cursor-pointer shrink-0"
            title={t.home}
            aria-label="Mohamed Abu Al-Saud Home"
          >
            {/* Ambient Glow behind Logo */}
            <div
              className="absolute inset-0 rounded-full blur-[6px] opacity-0 group-hover:opacity-80 transition-opacity duration-300 accent-gradient"
              aria-hidden="true"
            />

            {/* Border Ring with Blue Gradient */}
            <div
              className="absolute inset-0 rounded-full transition-transform duration-700 ease-out"
              style={{
                background: logoHovered
                  ? 'linear-gradient(270deg, #89AACC 0%, #4E85BF 100%)'
                  : 'linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)',
                transform: logoHovered ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />

            {/* Inner Circle Image */}
            <div className="relative w-full h-full rounded-full bg-bg overflow-hidden flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/oe19gniu/image/upload/v1790271150/WhatsApp_Image_2026-09-22_at_5.36.09_PM.jpg"
                alt="Mohamed Abu Al-Saud"
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </button>

          {/* Divider */}
          <div className="w-px h-4 sm:h-5 bg-stroke mx-0.5 sm:mx-1 shrink-0" />

          {/* Navigation Items (Home, Services, Projects, About, Blog, Contact) */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path)}
                  className={`relative text-xs sm:text-[13px] rounded-full px-2.5 sm:px-3 py-1.5 font-medium transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-white/50 select-none whitespace-nowrap ${
                    isActive
                      ? 'text-text-primary'
                      : 'text-muted hover:text-text-primary'
                  }`}
                >
                  {/* Smooth Animated Gliding Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-stroke/70 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] -z-10"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="w-px h-4 sm:h-5 bg-stroke mx-0.5 sm:mx-1 shrink-0" />

          {/* Language Switcher (AR / EN) */}
          <button
            onClick={toggleLanguage}
            className="group relative inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-full border border-stroke/70 bg-stroke/30 hover:bg-stroke/60 text-text-primary transition-all duration-200 cursor-pointer focus:outline-none hover:border-[#89AACC]/50 hover:shadow-[0_0_12px_rgba(137,170,204,0.15)] active:scale-95 shrink-0"
            title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            aria-label={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-[#89AACC] group-hover:rotate-15 group-hover:scale-105 transition-transform duration-300 shrink-0" strokeWidth={1.75} />
            <span className="font-mono font-semibold tracking-wide">
              {language === 'ar' ? 'EN' : 'عربي'}
            </span>
          </button>

          {/* Restored Desktop "Say hi" / "تواصل معي" Button with live pulse */}
          <button
            onClick={() => handleNavClick('/contact')}
            className="group relative inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium text-text-primary border border-stroke/70 bg-stroke/30 hover:bg-stroke/60 hover:border-[#89AACC]/50 transition-all duration-200 cursor-pointer focus:outline-none shrink-0"
            title={t.sayHi}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>{t.sayHi}</span>
            <span className="text-[10px] rtl-arrow-diag opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">↗</span>
          </button>
        </nav>

        {/* ================= MOBILE NAVBAR (small screens) ================= */}
        <div className="w-full max-w-md mx-auto md:hidden pointer-events-auto flex flex-col items-center">
          <nav
            aria-label="Mobile Navigation Bar"
            className={`w-full flex items-center justify-between rounded-full px-3.5 py-2 transition-all duration-300 ${
              hasScrolled || mobileMenuOpen
                ? 'bg-surface/95 backdrop-blur-xl border border-white/[0.12] shadow-[0_12px_40px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.12)]'
                : 'bg-surface/80 backdrop-blur-md border border-white/[0.08] shadow-[0_8px_25px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.08)]'
            }`}
          >
            {/* Logo */}
            <button
              onClick={() => handleNavClick('/')}
              className="relative w-8 h-8 rounded-full flex items-center justify-center p-[1.5px] transition-transform duration-200 active:scale-95 focus:outline-none cursor-pointer shrink-0"
              aria-label="Mohamed Abu Al-Saud Home"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)',
                }}
              />
              <div className="relative w-full h-full rounded-full bg-bg overflow-hidden flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/oe19gniu/image/upload/v1790271150/WhatsApp_Image_2026-09-22_at_5.36.09_PM.jpg"
                  alt="Mohamed Abu Al-Saud"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </button>

            {/* Right Controls: Language Switcher + Hamburger Toggle */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="group flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full border border-stroke/70 bg-stroke/30 active:bg-stroke/60 hover:border-[#89AACC]/50 text-text-primary transition-all duration-200 cursor-pointer focus:outline-none active:scale-95"
                title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
                aria-label={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
              >
                <Globe className="w-3.5 h-3.5 text-[#89AACC] group-hover:rotate-15 transition-transform duration-300 shrink-0" strokeWidth={1.75} />
                <span className="font-mono font-semibold">
                  {language === 'ar' ? 'EN' : 'عربي'}
                </span>
              </button>

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="relative w-9 h-9 rounded-full flex items-center justify-center border border-white/[0.08] bg-stroke/40 hover:bg-stroke/70 text-text-primary transition-all duration-200 cursor-pointer focus:outline-none active:scale-95"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </nav>

          {/* Expandable Mobile Menu Dropdown Panel */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full mt-2 rounded-2xl bg-surface/95 backdrop-blur-2xl border border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.1)] p-3 flex flex-col gap-1 overflow-hidden"
              >
                {/* Nav Links */}
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isActive = activePage === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.path)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-start ${
                          isActive
                            ? 'bg-white/[0.08] text-text-primary shadow-xs font-semibold'
                            : 'text-muted hover:text-text-primary hover:bg-white/[0.04]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#89AACC] shadow-[0_0_8px_#89AACC]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="h-px bg-stroke/60 my-1.5" />

                {/* Mobile Language Switcher Row */}
                <button
                  onClick={toggleLanguage}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-text-primary hover:bg-white/[0.04] transition-all duration-150 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#89AACC]" strokeWidth={1.75} />
                    <span>{language === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
                  </span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md border border-stroke/70 bg-stroke/40 text-text-primary">
                    {language === 'ar' ? 'Switch' : 'تبديل'}
                  </span>
                </button>

                {/* "Say hi" / "تواصل معي" Mobile CTA Button */}
                <button
                  onClick={() => handleNavClick('/contact')}
                  className="w-full group relative rounded-xl p-[1px] cursor-pointer focus:outline-none transition-transform active:scale-[0.99]"
                >
                  <span
                    className="absolute inset-0 rounded-xl opacity-80 accent-gradient blur-[1px] -z-10"
                    aria-hidden="true"
                  />
                  <span className="flex items-center justify-between bg-surface border border-white/[0.1] rounded-xl px-4 py-3 text-sm font-medium text-text-primary shadow-md">
                    <span className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span>{t.sayHi}</span>
                    </span>
                    <span className="text-xs rtl-arrow-diag">↗</span>
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
};
