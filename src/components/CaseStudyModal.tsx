import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectCaseStudyTemplate } from './ProjectCaseStudyTemplate';
import { X } from 'lucide-react';

export const CaseStudyModal: React.FC = () => {
  const { activeCaseStudy, closeCaseStudy, openCaseStudy, caseStudies, t } = usePortfolio();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCaseStudy();
      }
    };
    if (activeCaseStudy) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeCaseStudy, closeCaseStudy]);

  if (!activeCaseStudy) return null;

  const handleSelectCaseStudy = (slug: string) => {
    const target = caseStudies[slug];
    if (target) {
      openCaseStudy(target);
      const container = document.getElementById('case-study-modal-container');
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div
      id="case-study-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#0D1114]/90 backdrop-blur-none overflow-y-auto"
      onClick={closeCaseStudy}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
    >
      <div
        id="case-study-modal-container"
        className="relative w-full max-w-5xl max-h-[92vh] my-auto bg-[#0D1114] border border-[#302C28] rounded-[8px] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#151A1D] border-b border-[#302C28]">
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-mono text-[#C4875B] uppercase">
              {activeCaseStudy.industry}
            </span>
            <span className="text-[#302C28]">/</span>
            <h2 id="case-study-title" className="text-[17px] font-semibold text-[#F3ECE3]">
              {activeCaseStudy.projectTitle}
            </h2>
          </div>
          <button
            id="close-case-study-btn"
            onClick={closeCaseStudy}
            type="button"
            className="p-1.5 text-[#827970] hover:text-[#F3ECE3] hover:bg-[#1C2124] border border-transparent hover:border-[#302C28] rounded-[8px] transition-colors duration-150"
            aria-label={t.caseStudy.close}
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Modal Body: Reusable Project Case Study Template */}
        <div className="p-4 sm:p-8 md:p-10">
          <ProjectCaseStudyTemplate
            caseStudy={activeCaseStudy}
            onBack={closeCaseStudy}
            onSelectCaseStudy={handleSelectCaseStudy}
            isModal={true}
          />
        </div>
      </div>
    </div>
  );
};

