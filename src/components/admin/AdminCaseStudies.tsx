import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CaseStudy } from '../../types';
import { BookOpen, Check } from 'lucide-react';

export const AdminCaseStudies: React.FC = () => {
  const { caseStudies, setCaseStudies, projects, showToast, t } = usePortfolio();
  const projectSlugs = Object.keys(caseStudies);
  const [selectedSlug, setSelectedSlug] = useState<string>(
    projectSlugs.length > 0 ? projectSlugs[0] : ''
  );

  const activeStudy = caseStudies[selectedSlug];

  const handleUpdateField = (field: keyof CaseStudy, value: any) => {
    if (!activeStudy) return;
    setCaseStudies((prev) => ({
      ...prev,
      [selectedSlug]: {
        ...prev[selectedSlug],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    showToast('Case study documentation updated', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold text-[#F3ECE3]">
            {t.admin.tabs.caseStudies}
          </h2>
          <p className="text-[13px] text-[#827970]">
            Detailed 12-section technical case studies for portfolio deep dives.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[12px] uppercase text-[#827970] font-medium">
            Select Project:
          </label>
          <select
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="px-3 py-1.5 bg-[#151A1D] border border-[#302C28] rounded-[8px] text-[13px] text-[#F3ECE3] focus:border-[#C4875B] focus:outline-none"
          >
            {projectSlugs.map((slug) => (
              <option key={slug} value={slug}>
                {caseStudies[slug]?.projectTitle || slug}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeStudy ? (
        <div className="p-6 bg-[#151A1D] border border-[#302C28] rounded-[8px] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#302C28]">
            <div>
              <h3 className="text-[16px] font-semibold text-[#F3ECE3]">
                {activeStudy.projectTitle} · Case Study Breakdown
              </h3>
              <span className="text-[12px] text-[#827970]">
                {activeStudy.industry}
              </span>
            </div>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium bg-[#C4875B] text-[#0D1114] hover:bg-[#b07449] rounded-[8px] transition-colors"
            >
              <Check className="w-4 h-4" strokeWidth={1.5} />
              <span>Save case study</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[12px] uppercase text-[#827970] font-medium mb-1">
                01. Overview
              </label>
              <textarea
                rows={3}
                value={activeStudy.overview}
                onChange={(e) => handleUpdateField('overview', e.target.value)}
                className="w-full px-3 py-2 bg-[#0D1114] border border-[#302C28] rounded-[8px] text-[13px] text-[#F3ECE3] focus:border-[#C4875B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] uppercase text-[#827970] font-medium mb-1">
                02. Business problem
              </label>
              <textarea
                rows={3}
                value={activeStudy.businessProblem}
                onChange={(e) => handleUpdateField('businessProblem', e.target.value)}
                className="w-full px-3 py-2 bg-[#0D1114] border border-[#302C28] rounded-[8px] text-[13px] text-[#F3ECE3] focus:border-[#C4875B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] uppercase text-[#827970] font-medium mb-1">
              04. Solution
            </label>
            <textarea
              rows={3}
              value={activeStudy.solution}
              onChange={(e) => handleUpdateField('solution', e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1114] border border-[#302C28] rounded-[8px] text-[13px] text-[#F3ECE3] focus:border-[#C4875B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] uppercase text-[#827970] font-medium mb-1">
              06. Architecture
            </label>
            <textarea
              rows={3}
              value={activeStudy.architecture}
              onChange={(e) => handleUpdateField('architecture', e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1114] border border-[#302C28] rounded-[8px] text-[13px] text-[#F3ECE3] focus:border-[#C4875B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12px] uppercase text-[#827970] font-medium mb-1">
                07. Frontend
              </label>
              <textarea
                rows={3}
                value={activeStudy.frontend}
                onChange={(e) => handleUpdateField('frontend', e.target.value)}
                className="w-full px-3 py-2 bg-[#0D1114] border border-[#302C28] rounded-[8px] text-[13px] text-[#F3ECE3] focus:border-[#C4875B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] uppercase text-[#827970] font-medium mb-1">
                08. Backend
              </label>
              <textarea
                rows={3}
                value={activeStudy.backend}
                onChange={(e) => handleUpdateField('backend', e.target.value)}
                className="w-full px-3 py-2 bg-[#0D1114] border border-[#302C28] rounded-[8px] text-[13px] text-[#F3ECE3] focus:border-[#C4875B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] uppercase text-[#827970] font-medium mb-1">
                09. Database
              </label>
              <textarea
                rows={3}
                value={activeStudy.database}
                onChange={(e) => handleUpdateField('database', e.target.value)}
                className="w-full px-3 py-2 bg-[#0D1114] border border-[#302C28] rounded-[8px] text-[13px] text-[#F3ECE3] focus:border-[#C4875B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] uppercase text-[#827970] font-medium mb-1">
              10. Challenges
            </label>
            <textarea
              rows={2}
              value={activeStudy.challenges}
              onChange={(e) => handleUpdateField('challenges', e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1114] border border-[#302C28] rounded-[8px] text-[13px] text-[#F3ECE3] focus:border-[#C4875B] focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-[#827970] bg-[#151A1D] border border-[#302C28] rounded-[8px]">
          No case study selected.
        </div>
      )}
    </div>
  );
};
