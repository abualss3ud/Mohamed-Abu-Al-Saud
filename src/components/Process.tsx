import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Process: React.FC = () => {
  const { t } = usePortfolio();

  return (
    <section
      id="process"
      className="py-16 md:py-24 border-b border-[#302C28]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <span className="text-[13px] uppercase tracking-wider text-[#827970] font-medium block mb-2">
            Methodology
          </span>
          <h2
            id="process-heading"
            className="text-[28px] sm:text-[36px] font-semibold text-[#F3ECE3] tracking-tight mb-3"
          >
            {t.process.heading}
          </h2>
          <p className="text-[16px] text-[#B8AEA3] max-w-[65ch]">
            {t.process.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.process.steps.map((step) => (
            <div
              key={step.number}
              id={`step-${step.number}`}
              className="p-6 bg-[#151A1D] border border-[#302C28] rounded-[8px] flex flex-col justify-between"
            >
              <div>
                <span className="text-[14px] font-mono text-[#C4875B] block mb-3 font-semibold">
                  {step.number}
                </span>
                <h3 className="text-[18px] font-semibold text-[#F3ECE3] mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#B8AEA3] leading-[1.6]">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
