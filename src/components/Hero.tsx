import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Hls from 'hls.js';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../translations';

interface HeroProps {
  onSeeWorks: () => void;
  onReachOut: () => void;
}

const HLS_SOURCE = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8';

export const Hero: React.FC<HeroProps> = ({ onSeeWorks, onReachOut }) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language].hero;
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  // Initialize HLS video stream
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
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

  // Cycle role every 2.4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % t.roles.length);
    }, 2400);

    return () => clearInterval(interval);
  }, [t.roles.length]);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo(
        '.name-reveal',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, delay: 0.1 }
      );

      tl.fromTo(
        '.blur-in',
        { opacity: 0, filter: 'blur(8px)', y: 16 },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 0.9,
          stagger: 0.1,
        },
        0.25
      );
    }, containerRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-28 pb-20 md:py-28"
    >
      {/* Background HLS Video */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 opacity-65 scale-105"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Subtle radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,hsl(var(--bg))_100%)] opacity-85" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        {/* Eyebrow */}
        <div className="blur-in text-xs text-muted uppercase tracking-[0.25em] mb-4 sm:mb-6 font-medium">
          {t.eyebrow}
        </div>

        {/* Name strictly on a single line */}
        <h1 className="name-reveal whitespace-nowrap text-[clamp(1.65rem,5.2vw,4rem)] font-display italic leading-tight tracking-tight text-text-primary mb-5 sm:mb-6 select-none max-w-full">
          {t.name}
        </h1>

        {/* Dynamic role banner line */}
        <div className="blur-in text-base sm:text-xl md:text-2xl text-text-primary/90 font-light mb-6 flex flex-wrap items-center justify-center gap-1.5 min-h-[36px]">
          {t.roleLinePrefix && <span>{t.roleLinePrefix}</span>}
          <span
            key={`${language}-${roleIndex}`}
            className="font-display italic text-text-primary animate-role-fade-in inline-block font-normal text-lg sm:text-2xl md:text-3xl px-1.5"
          >
            {t.roles[roleIndex]}
          </span>
          <span>{t.roleLineSuffix}</span>
        </div>

        {/* Bio description */}
        <p className="blur-in text-sm sm:text-base text-muted max-w-xl mx-auto mb-10 sm:mb-12 leading-relaxed">
          {t.description}
        </p>

        {/* CTA Buttons */}
        <div className="blur-in flex flex-wrap items-center justify-center gap-4">
          {/* Primary CTA: "See Works" */}
          <button
            onClick={onSeeWorks}
            className="group relative rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer p-[1.5px]"
          >
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
              aria-hidden="true"
            />
            <span className="flex items-center gap-2 bg-text-primary text-bg group-hover:bg-bg group-hover:text-text-primary rounded-full px-6 sm:px-7 py-3 sm:py-3.5 transition-colors duration-300">
              <span>{t.seeWorks}</span>
              <span className="text-xs group-hover:translate-y-0.5 transition-transform duration-200">
                ↓
              </span>
            </span>
          </button>

          {/* Secondary CTA: "Reach out..." */}
          <button
            onClick={onReachOut}
            className="group relative rounded-full text-sm font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer p-[1.5px]"
          >
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 accent-gradient -z-10"
              aria-hidden="true"
            />
            <span className="flex items-center gap-2 border border-stroke bg-bg/90 text-text-primary group-hover:border-transparent rounded-full px-6 sm:px-7 py-3 sm:py-3.5 transition-all duration-300">
              <span>{t.reachOut}</span>
              <span className="text-xs rtl-arrow-diag group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200">
                ↗
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none select-none">
        <span className="text-xs text-muted uppercase tracking-[0.2em] font-medium">
          {t.scroll}
        </span>
        <div className="w-px h-10 bg-stroke relative overflow-hidden">
          <div className="w-full h-1/2 bg-text-primary/70 animate-scroll-down" />
        </div>
      </div>
    </section>
  );
};
