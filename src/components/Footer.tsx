import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Hls from 'hls.js';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../translations';

const HLS_SOURCE = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';

interface FooterProps {
  onDirectMessage?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onDirectMessage }) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language].contact;
  const videoRef = useRef<HTMLVideoElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Background Video with flipped vertical scale: scale-y-[-1]
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(HLS_SOURCE);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = HLS_SOURCE;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  // GSAP Marquee
  useEffect(() => {
    if (!marqueeRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: language === 'ar' ? 50 : -50,
        duration: 35,
        ease: 'none',
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, [language]);

  const marqueeText = Array(10).fill(t.marquee).join('');

  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Twitter', href: 'https://twitter.com' },
  ];

  return (
    <footer
      id="contact"
      className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden border-t border-stroke/40"
    >
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 scale-y-[-1] opacity-30"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg to-transparent" />
      </div>

      {/* GSAP Marquee */}
      <div className="relative w-full overflow-hidden py-6 border-y border-stroke/40 select-none mb-14 md:mb-20">
        <div
          ref={marqueeRef}
          className="flex whitespace-nowrap will-change-transform"
        >
          <span className="text-3xl sm:text-5xl md:text-6xl font-display italic tracking-widest text-text-primary/10 uppercase select-none">
            {marqueeText}
          </span>
          <span className="text-3xl sm:text-5xl md:text-6xl font-display italic tracking-widest text-text-primary/10 uppercase select-none">
            {marqueeText}
          </span>
        </div>
      </div>

      {/* Main CTA content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col items-center text-center mb-16 md:mb-24">
        <div className="text-xs text-muted uppercase tracking-[0.25em] font-medium mb-4">
          {t.eyebrow}
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-7xl font-light text-text-primary mb-6 max-w-2xl leading-tight">
          {t.headingMain}
          <span className="font-display italic text-text-primary">
            {t.headingItalic}
          </span>
        </h2>

        <p className="text-sm md:text-base text-muted max-w-md mx-auto mb-10 leading-relaxed">
          {t.subtext}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href={`mailto:${t.email}`}
            className="group relative rounded-full text-sm sm:text-base font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] inline-flex items-center cursor-pointer focus:outline-none p-[1.5px]"
          >
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
              aria-hidden="true"
            />
            <span className="flex items-center gap-3 bg-surface border border-stroke group-hover:border-transparent rounded-full px-8 py-3.5 text-text-primary transition-colors">
              <span>{t.email}</span>
              <span className="text-xs rtl-arrow-diag group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200">
                ↗
              </span>
            </span>
          </a>

          {onDirectMessage && (
            <button
              onClick={onDirectMessage}
              className="text-xs uppercase tracking-[0.2em] text-muted hover:text-text-primary px-5 py-3 rounded-full hover:bg-surface/50 transition-colors cursor-pointer"
            >
              {t.directMessage}
            </button>
          )}
        </div>
      </div>

      {/* Footer Bar */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 pt-8 border-t border-stroke/40 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted">
        {/* Availability status */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-text-primary font-medium">{t.available}</span>
          <span className="text-muted/60">• {t.availabilityQuarter}</span>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text-primary transition-colors duration-200 uppercase tracking-wider text-[11px]"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-muted/70 font-mono text-[11px]">
          {t.rights}
        </div>
      </div>
    </footer>
  );
};
