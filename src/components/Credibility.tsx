import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Credibility: React.FC = () => {
  const { t } = usePortfolio();

  return (
    <section
      id="credibility-section"
      className="py-16 md:py-20 border-b border-[#302C28] bg-[#151A1D]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="max-w-[850px]">
          <h2
            id="credibility-heading"
            className="text-[24px] sm:text-[32px] font-semibold text-[#F3ECE3] tracking-tight mb-4"
          >
            {t.credibility.title}
          </h2>

          <p
            id="credibility-description"
            className="text-[16px] text-[#B8AEA3] leading-[1.65] max-w-[65ch] mb-10"
          >
            {t.credibility.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#302C28]">
            {t.credibility.points.map((point, index) => (
              <div key={index} id={`credibility-point-${index}`} className="flex flex-col">
                <h3 className="text-[15px] font-medium text-[#F3ECE3] mb-2">
                  {point.title}
                </h3>
                <p className="text-[13px] text-[#827970] leading-[1.5]">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
