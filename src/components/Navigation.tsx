import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Menu, X, Globe } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { language, setLanguage, t, settings } = usePortfolio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const navLinks = [
    { href: '#work', label: t.nav.work },
    { href: '#services', label: t.nav.services },
    { href: '#about', label: t.nav.about },
    { href: '#process', label: t.nav.process },
    { href: '#blog', label: t.nav.blog },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full bg-[#0D1114] border-b border-[#302C28]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          id="brand-logo"
          className="flex items-center text-[#F3ECE3] hover:text-[#C4875B] transition-colors duration-150"
        >
          <span className="font-semibold text-[17px] tracking-tight">{settings.name || 'Abu Al-Saud'}</span>
        </a>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" aria-label="Main Navigation" className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              id={`nav-link-${link.href.replace('#', '')}`}
              className="text-[14px] text-[#B8AEA3] hover:text-[#F3ECE3] transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Controls & CTA */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            id="language-switcher-btn"
            onClick={toggleLanguage}
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] text-[#B8AEA3] hover:text-[#F3ECE3] hover:bg-[#151A1D] border border-transparent hover:border-[#302C28] rounded-[8px] transition-colors duration-150"
            aria-label={`Switch language to ${language === 'en' ? 'Arabic' : 'English'}`}
          >
            <Globe className="w-4 h-4 text-[#827970]" strokeWidth={1.5} />
            <span className="font-medium">{language === 'en' ? 'العربية' : 'EN'}</span>
          </button>

          {/* Primary CTA */}
          <a
            href="#contact"
            id="header-primary-cta"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-[14px] font-medium bg-[#C4875B] text-[#0D1114] hover:bg-[#b07449] rounded-[8px] transition-colors duration-150 whitespace-nowrap"
          >
            {t.nav.startProject}
          </a>

          {/* Mobile menu toggle */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#B8AEA3] hover:text-[#F3ECE3] border border-[#302C28] rounded-[8px] hover:bg-[#151A1D] transition-colors duration-150"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-panel"
          className="md:hidden border-t border-[#302C28] bg-[#151A1D] px-4 py-4 flex flex-col gap-3"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              id={`mobile-nav-${link.href.replace('#', '')}`}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-[15px] text-[#B8AEA3] hover:text-[#F3ECE3] hover:bg-[#1C2124] rounded-[8px] transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-2 border-t border-[#302C28] flex flex-col gap-2">
            <a
              href="#contact"
              id="mobile-primary-cta"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 text-[14px] font-medium bg-[#C4875B] text-[#0D1114] hover:bg-[#b07449] rounded-[8px] transition-colors duration-150"
            >
              {t.nav.startProject}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
