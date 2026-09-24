import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../translations';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language].loading;
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Counter using requestAnimationFrame from 000 to 100 over 2700ms
  useEffect(() => {
    const duration = 2700;
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentCount = Math.floor(progress * 100);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(100);
        const timer = setTimeout(() => {
          setIsDone(true);
          setTimeout(() => {
            onComplete();
          }, 400);
        }, 400);
        return () => clearTimeout(timer);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  // Rotate words every 900ms
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % t.words.length);
    }, 900);
    return () => clearInterval(interval);
  }, [t.words.length]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-8 md:p-14 select-none overflow-hidden"
        >
          {/* Top row */}
          <div className="w-full flex justify-between items-start">
            <motion.span
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-xs text-muted uppercase tracking-[0.3em] font-medium"
            >
              {t.portfolio}
            </motion.span>

            <motion.span
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              className="text-xs text-muted/60 tracking-[0.2em] uppercase font-mono hidden sm:inline-block"
            >
              {t.collection}
            </motion.span>
          </div>

          {/* Center: Rotating words */}
          <div className="flex-1 flex items-center justify-center">
            <div className="h-24 md:h-32 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={t.words[wordIndex]}
                  initial={{ y: 30, opacity: 0, filter: 'blur(4px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -30, opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80 tracking-wide"
                >
                  {t.words[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom row: Counter display */}
          <div className="flex justify-between items-end pb-4">
            <div className="text-xs text-muted/60 tracking-wider uppercase font-mono">
              {t.loadingExp}
            </div>
            <div className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums leading-none">
              {String(count).padStart(3, '0')}
            </div>
          </div>

          {/* Bottom progress bar with original blue/slate glow */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50 overflow-hidden">
            <div
              className="h-full accent-gradient transition-transform duration-75 origin-left"
              style={{
                transform: `scaleX(${count / 100})`,
                boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
