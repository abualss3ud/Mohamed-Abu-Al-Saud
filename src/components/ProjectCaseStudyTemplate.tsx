import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CaseStudy, CaseStudyScreenshot } from '../types';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Building,
  Calendar,
  User,
  Layers,
  Server,
  Database,
  Code2,
  CheckCircle2,
  Maximize2,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Compass,
} from 'lucide-react';

export interface ProjectCaseStudyTemplateProps {
  caseStudy: CaseStudy;
  onBack?: () => void;
  onSelectCaseStudy?: (slug: string) => void;
  isModal?: boolean;
}

export const ProjectCaseStudyTemplate: React.FC<ProjectCaseStudyTemplateProps> = ({
  caseStudy,
  onBack,
  onSelectCaseStudy,
  isModal = false,
}) => {
  const { t, caseStudies, projects } = usePortfolio();
  const [activeZoomScreenshot, setActiveZoomScreenshot] = useState<CaseStudyScreenshot | null>(null);

  // Find matching project for extra links if available
  const matchingProject = projects.find((p) => p.slug === caseStudy.slug || p.id === caseStudy.projectId);

  // Available case studies for previous/next navigation
  const allCaseStudies = Object.values(caseStudies);
  const currentIndex = allCaseStudies.findIndex((cs) => cs.slug === caseStudy.slug);
  const prevCaseStudy = currentIndex > 0 ? allCaseStudies[currentIndex - 1] : null;
  const nextCaseStudy = currentIndex < allCaseStudies.length - 1 ? allCaseStudies[currentIndex + 1] : null;

  // Resolve links
  const demoUrl = caseStudy.liveDemoUrl || matchingProject?.projectUrl || 'https://demo.example.com';
  const githubUrl = caseStudy.githubUrl || matchingProject?.githubUrl || 'https://github.com';

  const screenshots: CaseStudyScreenshot[] = caseStudy.screenshots && caseStudy.screenshots.length > 0
    ? caseStudy.screenshots
    : [
        {
          url: caseStudy.coverImage,
          caption: `${caseStudy.projectTitle} primary application interface designed for sub-second interactions and high operational clarity.`,
          tag: 'Primary Interface',
          alt: `${caseStudy.projectTitle} overview screenshot`,
        },
      ];

  const handleDiscussSimilar = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBack && isModal) {
      onBack();
    }
    const serviceType = matchingProject?.title || caseStudy.projectTitle;
    window.dispatchEvent(new CustomEvent('select-service', { detail: serviceType }));
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#contact';
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sectionsNav = [
    { id: 'cs-overview', label: '01. Overview' },
    { id: 'cs-problem', label: '02. Problem' },
    { id: 'cs-goals', label: '03. Goals' },
    { id: 'cs-solution', label: '04. Solution' },
    { id: 'cs-ux', label: '05. UX' },
    { id: 'cs-architecture', label: '06. Architecture' },
    { id: 'cs-stack-detail', label: '07-09. Stack Details' },
    { id: 'cs-challenges', label: '10. Challenges' },
    { id: 'cs-results', label: '11. Results' },
    { id: 'cs-tech-stack', label: '12. Tech Stack' },
    { id: 'cs-screenshots', label: 'Screenshots' },
    { id: 'cs-demo-links', label: 'Demo Links' },
  ];

  return (
    <article
      id={`case-study-template-${caseStudy.slug}`}
      className={`text-[#B8AEA3] ${isModal ? 'bg-transparent' : 'max-w-[1100px] mx-auto px-4 sm:px-6 py-12 md:py-20'}`}
    >
      {/* ── Top Navigation & Back Action ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#302C28]">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            id="case-study-back-button"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#B8AEA3] hover:text-[#F3ECE3] transition-colors duration-150 py-1 px-2.5 rounded-[8px] border border-[#302C28] hover:border-[#827970] bg-[#151A1D]"
          >
            <ArrowLeft className="w-4 h-4 text-[#C4875B]" strokeWidth={1.75} />
            <span>{t.caseStudy.backToProjects}</span>
          </button>
        )}

        {/* Quick External Actions */}
        <div className="flex items-center gap-3 ml-auto">
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              id="top-action-live-demo"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#0D1114] bg-[#C4875B] hover:bg-[#b07449] rounded-[8px] transition-colors duration-150"
            >
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>{t.caseStudy.liveDemo}</span>
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              id="top-action-github"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#F3ECE3] hover:text-[#C4875B] bg-[#151A1D] hover:bg-[#1C2124] border border-[#302C28] rounded-[8px] transition-colors duration-150"
            >
              <Github className="w-3.5 h-3.5 text-[#827970]" strokeWidth={1.75} />
              <span>{t.caseStudy.sourceCode}</span>
            </a>
          )}
        </div>
      </div>

      {/* ── Case Study Header & Meta Information ── */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[12px] font-mono uppercase tracking-wider text-[#C4875B]">
            {caseStudy.industry}
          </span>
          <span className="text-[#302C28]">/</span>
          <span className="text-[12px] font-mono text-[#827970] uppercase">
            {t.caseStudy.caseStudyBadge || 'CASE STUDY'}
          </span>
        </div>

        <h1
          id="case-study-heading"
          className="text-[32px] sm:text-[44px] font-semibold text-[#F3ECE3] tracking-tight leading-[1.15] mb-6"
        >
          {caseStudy.projectTitle}
        </h1>

        {/* Meta Grid: Client, Role, Timeline, Industry */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-[#151A1D] border border-[#302C28] rounded-[8px] text-[13px]">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#827970] font-mono block mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#C4875B]" strokeWidth={1.5} />
              {t.caseStudy.clientLabel}
            </span>
            <p className="text-[#F3ECE3] font-medium truncate">
              {caseStudy.clientName || t.caseStudy.confidentialClient || 'Confidential Client'}
            </p>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#827970] font-mono block mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#C4875B]" strokeWidth={1.5} />
              {t.caseStudy.roleLabel}
            </span>
            <p className="text-[#F3ECE3] font-medium truncate">
              {caseStudy.role || t.hero.roleTag || 'Full-Stack Developer'}
            </p>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#827970] font-mono block mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C4875B]" strokeWidth={1.5} />
              {t.caseStudy.timelineLabel}
            </span>
            <p className="text-[#F3ECE3] font-medium truncate">
              {caseStudy.timeline || t.caseStudy.defaultTimeline || '6 Weeks Delivery'}
            </p>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#827970] font-mono block mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#C4875B]" strokeWidth={1.5} />
              {t.caseStudy.industryLabel}
            </span>
            <p className="text-[#F3ECE3] font-medium truncate">
              {caseStudy.industry}
            </p>
          </div>
        </div>
      </header>

      {/* ── Sticky Table of Contents Jump Bar ── */}
      <nav
        id="case-study-toc-bar"
        aria-label={t.caseStudy.tableOfContents}
        className="sticky top-2 z-10 p-2.5 mb-10 bg-[#151A1D]/95 backdrop-blur-sm border border-[#302C28] rounded-[8px] overflow-x-auto shadow-sm"
      >
        <div className="flex items-center gap-1.5 min-w-max text-[12px]">
          <span className="text-[#827970] font-mono px-2 flex items-center gap-1 shrink-0">
            <Compass className="w-3.5 h-3.5 text-[#C4875B]" strokeWidth={1.5} />
            {t.caseStudy.quickJump}:
          </span>
          {sectionsNav.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToSection(s.id)}
              className="px-2.5 py-1 text-[#B8AEA3] hover:text-[#F3ECE3] hover:bg-[#1C2124] rounded-[6px] transition-colors whitespace-nowrap"
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Primary Hero Interface Preview with Browser Shell ── */}
      <div className="mb-14 border border-[#302C28] rounded-[8px] overflow-hidden bg-[#0D1114]">
        {/* Browser Top Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#151A1D] border-b border-[#302C28]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#302C28]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#302C28]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#302C28]" />
          </div>
          <div className="px-4 py-0.5 bg-[#0D1114] border border-[#302C28] rounded-[6px] text-[11px] font-mono text-[#827970] max-w-[320px] truncate">
            {demoUrl}
          </div>
          <button
            type="button"
            onClick={() => setActiveZoomScreenshot(screenshots[0])}
            className="flex items-center gap-1 text-[11px] text-[#827970] hover:text-[#F3ECE3] transition-colors"
            title={t.caseStudy.clickToZoom}
          >
            <Maximize2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="hidden sm:inline">{t.caseStudy.inspectScreen || 'Inspect'}</span>
          </button>
        </div>

        {/* Hero Screenshot */}
        <div
          className="relative group cursor-pointer overflow-hidden bg-[#0D1114]"
          onClick={() => setActiveZoomScreenshot(screenshots[0])}
        >
          <img
            src={caseStudy.coverImage}
            alt={`Hero screenshot of ${caseStudy.projectTitle}`}
            referrerPolicy="no-referrer"
            className="w-full h-auto aspect-video object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-[#0D1114]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="px-3 py-1.5 bg-[#151A1D]/90 border border-[#302C28] text-[12px] text-[#F3ECE3] rounded-[6px] shadow-sm flex items-center gap-2">
              <Maximize2 className="w-3.5 h-3.5 text-[#C4875B]" />
              {t.caseStudy.clickToZoom}
            </span>
          </div>
        </div>
      </div>

      {/* ── 12 Required Sections Flow ── */}
      <div className="space-y-12 md:space-y-16">
        {/* 01. Overview */}
        <section id="cs-overview" className="border-t border-[#302C28] pt-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#C4875B]">
              {t.caseStudy.overview}
            </span>
          </div>
          <h2 className="text-[22px] font-semibold text-[#F3ECE3] tracking-tight mb-3">
            Executive Summary & Project Scope
          </h2>
          <p className="text-[16px] text-[#F3ECE3] leading-[1.7] max-w-[75ch]">
            {caseStudy.overview}
          </p>
        </section>

        {/* 02. Business problem */}
        <section id="cs-problem" className="border-t border-[#302C28] pt-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#C4875B]">
              {t.caseStudy.businessProblem}
            </span>
          </div>
          <h2 className="text-[22px] font-semibold text-[#F3ECE3] tracking-tight mb-3">
            The Business Friction & Operational Roadblock
          </h2>
          <div className="p-5 bg-[#151A1D] border border-[#302C28] rounded-[8px]">
            <p className="text-[15px] text-[#B8AEA3] leading-[1.7]">
              {caseStudy.businessProblem}
            </p>
          </div>
        </section>

        {/* 03. Goals */}
        <section id="cs-goals" className="border-t border-[#302C28] pt-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#C4875B]">
              {t.caseStudy.goals}
            </span>
          </div>
          <h2 className="text-[22px] font-semibold text-[#F3ECE3] tracking-tight mb-4">
            Quantified Objectives & Technical Benchmarks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {caseStudy.goals.map((goal, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#151A1D] border border-[#302C28] rounded-[8px] flex items-start gap-3"
              >
                <span className="w-5 h-5 rounded-[6px] bg-[#1C2124] border border-[#302C28] text-[11px] font-mono text-[#C4875B] flex items-center justify-center shrink-0 mt-0.5">
                  0{idx + 1}
                </span>
                <span className="text-[14px] text-[#B8AEA3] leading-[1.6]">
                  {goal}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 04. Solution */}
        <section id="cs-solution" className="border-t border-[#302C28] pt-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#C4875B]">
              {t.caseStudy.solution}
            </span>
          </div>
          <h2 className="text-[22px] font-semibold text-[#F3ECE3] tracking-tight mb-3">
            End-to-End System Solution
          </h2>
          <p className="text-[15px] text-[#B8AEA3] leading-[1.7] max-w-[75ch]">
            {caseStudy.solution}
          </p>
        </section>

        {/* 05. UX decisions (with embedded visual highlight) */}
        <section id="cs-ux" className="border-t border-[#302C28] pt-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#C4875B]">
              {t.caseStudy.uxDecisions}
            </span>
          </div>
          <h2 className="text-[22px] font-semibold text-[#F3ECE3] tracking-tight mb-4">
            User Experience Strategy & Workflow Streamlining
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-3">
              {caseStudy.uxDecisions.map((decision, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#151A1D] border border-[#302C28] rounded-[8px] flex items-start gap-3.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C4875B] mt-0.5 shrink-0" strokeWidth={1.75} />
                  <p className="text-[14px] text-[#B8AEA3] leading-[1.65]">
                    {decision}
                  </p>
                </div>
              ))}
            </div>

            {/* Contextual screenshot snippet embedded in UX section */}
            {screenshots[0] && (
              <div className="lg:col-span-5 border border-[#302C28] rounded-[8px] overflow-hidden bg-[#0D1114]">
                <img
                  src={screenshots[0].url}
                  alt={screenshots[0].alt || 'UX flow preview'}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto aspect-video object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => setActiveZoomScreenshot(screenshots[0])}
                />
                <div className="p-3 bg-[#151A1D] border-t border-[#302C28]">
                  <span className="text-[11px] font-mono uppercase text-[#C4875B] block mb-1">
                    {screenshots[0].tag || 'Key Workflow Interface'}
                  </span>
                  <p className="text-[12px] text-[#827970] leading-[1.45]">
                    {screenshots[0].caption}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 06. Architecture */}
        <section id="cs-architecture" className="border-t border-[#302C28] pt-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#C4875B]">
              {t.caseStudy.architecture}
            </span>
          </div>
          <h2 className="text-[22px] font-semibold text-[#F3ECE3] tracking-tight mb-3">
            System Architecture & Data Flow
          </h2>
          <div className="p-5 bg-[#151A1D] border border-[#302C28] rounded-[8px]">
            <p className="text-[15px] text-[#B8AEA3] leading-[1.7]">
              {caseStudy.architecture}
            </p>
          </div>
        </section>

        {/* 07, 08, 09. Frontend, Backend, Database Detailed Breakdown */}
        <section id="cs-stack-detail" className="border-t border-[#302C28] pt-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#C4875B]">
              07 - 09. Implementation Engineering
            </span>
          </div>
          <h2 className="text-[22px] font-semibold text-[#F3ECE3] tracking-tight mb-6">
            Frontend, Backend & Database Implementation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 07. Frontend */}
            <div className="p-5 bg-[#151A1D] border border-[#302C28] rounded-[8px] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-[#C4875B]" strokeWidth={1.5} />
                  <span className="text-[12px] font-mono uppercase tracking-wider text-[#827970]">
                    {t.caseStudy.frontend}
                  </span>
                </div>
                <h3 className="text-[16px] font-medium text-[#F3ECE3] mb-3">
                  Client-Side Architecture
                </h3>
                <p className="text-[14px] text-[#B8AEA3] leading-[1.65]">
                  {caseStudy.frontend}
                </p>
              </div>
            </div>

            {/* 08. Backend */}
            <div className="p-5 bg-[#151A1D] border border-[#302C28] rounded-[8px] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Server className="w-4 h-4 text-[#C4875B]" strokeWidth={1.5} />
                  <span className="text-[12px] font-mono uppercase tracking-wider text-[#827970]">
                    {t.caseStudy.backend}
                  </span>
                </div>
                <h3 className="text-[16px] font-medium text-[#F3ECE3] mb-3">
                  Server-Side Logic & APIs
                </h3>
                <p className="text-[14px] text-[#B8AEA3] leading-[1.65]">
                  {caseStudy.backend}
                </p>
              </div>
            </div>

            {/* 09. Database */}
            <div className="p-5 bg-[#151A1D] border border-[#302C28] rounded-[8px] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-[#C4875B]" strokeWidth={1.5} />
                  <span className="text-[12px] font-mono uppercase tracking-wider text-[#827970]">
                    {t.caseStudy.database}
                  </span>
                </div>
                <h3 className="text-[16px] font-medium text-[#F3ECE3] mb-3">
                  Data Persistence & Schemas
                </h3>
                <p className="text-[14px] text-[#B8AEA3] leading-[1.65]">
                  {caseStudy.database}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Challenges */}
        <section id="cs-challenges" className="border-t border-[#302C28] pt-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#C4875B]">
              {t.caseStudy.challenges}
            </span>
          </div>
          <h2 className="text-[22px] font-semibold text-[#F3ECE3] tracking-tight mb-3">
            Technical Roadblocks & Engineering Overcomes
          </h2>
          <div className="p-5 bg-[#151A1D] border border-[#302C28] rounded-[8px]">
            <p className="text-[15px] text-[#B8AEA3] leading-[1.7]">
              {caseStudy.challenges}
            </p>
          </div>
        </section>

        {/* 11. Results */}
        <section id="cs-results" className="border-t border-[#302C28] pt-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#C4875B]">
              {t.caseStudy.results}
            </span>
          </div>
          <h2 className="text-[22px] font-semibold text-[#F3ECE3] tracking-tight mb-6">
            Measured Business Impact & Results
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
            {caseStudy.results.map((res, idx) => (
              <div
                key={idx}
                className="p-5 bg-[#151A1D] border border-[#302C28] rounded-[8px]"
              >
                <div className="text-[32px] font-semibold text-[#F3ECE3] mb-1 font-mono tracking-tight">
                  {res.metric}
                </div>
                <div className="text-[14px] font-medium text-[#F3ECE3] mb-1">
                  {res.label}
                </div>
                <div className="text-[12px] text-[#827970] leading-[1.5]">
                  {res.note}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[12px] text-[#827970] italic">
            {t.caseStudy.demoNote}
          </p>
        </section>

        {/* 12. Technology stack */}
        <section id="cs-tech-stack" className="border-t border-[#302C28] pt-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#C4875B]">
              {t.caseStudy.techStack}
            </span>
          </div>
          <h2 className="text-[22px] font-semibold text-[#F3ECE3] tracking-tight mb-6">
            Technology Stack & Libraries
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {caseStudy.techStack.map((category, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#151A1D] border border-[#302C28] rounded-[8px]"
              >
                <span className="text-[13px] font-medium text-[#F3ECE3] block mb-2 pb-1 border-b border-[#302C28]">
                  {category.category}
                </span>
                <ul className="space-y-1.5">
                  {category.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="text-[13px] text-[#B8AEA3] flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#C4875B]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Embedded Screenshots Gallery with Captions & Lightbox ── */}
        <section id="cs-screenshots" className="border-t border-[#302C28] pt-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#C4875B]">
              {t.caseStudy.embeddedScreenshots}
            </span>
          </div>
          <h2 className="text-[22px] font-semibold text-[#F3ECE3] tracking-tight mb-3">
            Embedded Interface Showcase & User Flows
          </h2>
          <p className="text-[14px] text-[#827970] mb-6">
            {t.caseStudy.clickToZoom}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {screenshots.map((s, idx) => (
              <div
                key={idx}
                onClick={() => setActiveZoomScreenshot(s)}
                className="group cursor-pointer bg-[#151A1D] border border-[#302C28] hover:border-[#827970] rounded-[8px] overflow-hidden transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="relative overflow-hidden bg-[#0D1114]">
                    <img
                      src={s.url}
                      alt={s.alt || `Screenshot ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 p-1.5 bg-[#0D1114]/80 backdrop-blur-none text-[#F3ECE3] rounded-[6px] opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="p-4">
                    {s.tag && (
                      <span className="inline-block text-[11px] font-mono uppercase text-[#C4875B] px-2 py-0.5 bg-[#0D1114] border border-[#302C28] rounded-[4px] mb-2">
                        {s.tag}
                      </span>
                    )}
                    <p className="text-[13px] text-[#B8AEA3] leading-[1.5]">
                      {s.caption}
                    </p>
                  </div>
                </div>
                <div className="px-4 pb-3 pt-0">
                  <span className="text-[11px] text-[#827970] group-hover:text-[#F3ECE3] transition-colors flex items-center gap-1">
                    <span>{t.caseStudy.inspectScreen || 'Inspect screen'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Demo Links & Interactive Action Bar ── */}
        <section
          id="cs-demo-links"
          className="border-t border-[#302C28] pt-10"
        >
          <div className="p-6 sm:p-8 bg-[#151A1D] border border-[#302C28] rounded-[8px] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-[550px]">
              <span className="text-[12px] font-mono uppercase text-[#C4875B] block mb-1">
                Verification & Source Access
              </span>
              <h3 className="text-[20px] font-semibold text-[#F3ECE3] mb-2">
                Explore the running demo or inspect the codebase
              </h3>
              <p className="text-[14px] text-[#827970] leading-[1.6]">
                This solution was delivered according to real client operational requirements. All core workflows and interfaces are accessible for inspection.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
              {demoUrl && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  id="bottom-action-live-demo"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[14px] font-medium bg-[#C4875B] text-[#0D1114] hover:bg-[#b07449] rounded-[8px] transition-colors duration-150 shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" strokeWidth={1.75} />
                  <span>{t.caseStudy.liveDemo}</span>
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  id="bottom-action-github"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[14px] font-medium text-[#F3ECE3] hover:text-[#C4875B] bg-[#0D1114] hover:bg-[#1C2124] border border-[#302C28] rounded-[8px] transition-colors duration-150"
                >
                  <Github className="w-4 h-4 text-[#827970]" strokeWidth={1.75} />
                  <span>{t.caseStudy.sourceCode}</span>
                </a>
              )}
              <button
                type="button"
                onClick={handleDiscussSimilar}
                id="bottom-action-discuss"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-[14px] text-[#B8AEA3] hover:text-[#F3ECE3] border border-[#302C28] hover:border-[#827970] rounded-[8px] transition-colors duration-150"
              >
                <Sparkles className="w-4 h-4 text-[#C4875B]" />
                <span>{t.caseStudy.inquireSimilar}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Adjacent Case Studies Switcher (Previous / Next) ── */}
        <section className="border-t border-[#302C28] pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevCaseStudy ? (
              <button
                type="button"
                onClick={() => onSelectCaseStudy?.(prevCaseStudy.slug)}
                id="prev-case-study-btn"
                className="text-left p-4 bg-[#151A1D] hover:bg-[#1C2124] border border-[#302C28] hover:border-[#827970] rounded-[8px] transition-all group"
              >
                <span className="text-[11px] font-mono uppercase text-[#827970] flex items-center gap-1 mb-1">
                  <ChevronLeft className="w-3.5 h-3.5 text-[#C4875B]" />
                  {t.caseStudy.prevCaseStudy}
                </span>
                <span className="text-[15px] font-medium text-[#F3ECE3] group-hover:text-[#C4875B] transition-colors">
                  {prevCaseStudy.projectTitle}
                </span>
                <span className="text-[12px] text-[#827970] block truncate">
                  {prevCaseStudy.industry}
                </span>
              </button>
            ) : <div />}

            {nextCaseStudy && (
              <button
                type="button"
                onClick={() => onSelectCaseStudy?.(nextCaseStudy.slug)}
                id="next-case-study-btn"
                className="text-right p-4 bg-[#151A1D] hover:bg-[#1C2124] border border-[#302C28] hover:border-[#827970] rounded-[8px] transition-all group ml-auto w-full"
              >
                <span className="text-[11px] font-mono uppercase text-[#827970] flex items-center justify-end gap-1 mb-1">
                  {t.caseStudy.nextCaseStudy}
                  <ChevronRight className="w-3.5 h-3.5 text-[#C4875B]" />
                </span>
                <span className="text-[15px] font-medium text-[#F3ECE3] group-hover:text-[#C4875B] transition-colors">
                  {nextCaseStudy.projectTitle}
                </span>
                <span className="text-[12px] text-[#827970] block truncate">
                  {nextCaseStudy.industry}
                </span>
              </button>
            )}
          </div>
        </section>
      </div>

      {/* ── High-Resolution Lightbox Zoom Modal ── */}
      {activeZoomScreenshot && (
        <div
          id="screenshot-zoom-lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-[#0D1114]/95 backdrop-blur-none"
          onClick={() => setActiveZoomScreenshot(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-5xl w-full bg-[#151A1D] border border-[#302C28] rounded-[8px] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[#151A1D] border-b border-[#302C28]">
              <div className="flex items-center gap-2">
                {activeZoomScreenshot.tag && (
                  <span className="text-[11px] font-mono uppercase text-[#C4875B] px-2 py-0.5 bg-[#0D1114] border border-[#302C28] rounded-[4px]">
                    {activeZoomScreenshot.tag}
                  </span>
                )}
                <span className="text-[13px] text-[#F3ECE3] font-medium truncate">
                  {caseStudy.projectTitle} Screenshot Preview
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveZoomScreenshot(null)}
                className="p-1.5 text-[#827970] hover:text-[#F3ECE3] hover:bg-[#1C2124] rounded-[6px] transition-colors"
                aria-label={t.caseStudy.closeZoom}
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="bg-[#0D1114] max-h-[75vh] overflow-auto flex items-center justify-center p-2">
              <img
                src={activeZoomScreenshot.url}
                alt={activeZoomScreenshot.alt || 'High resolution screenshot'}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[70vh] object-contain rounded-[4px]"
              />
            </div>
            <div className="p-4 bg-[#151A1D] border-t border-[#302C28]">
              <p className="text-[13px] text-[#B8AEA3] leading-[1.6]">
                {activeZoomScreenshot.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
