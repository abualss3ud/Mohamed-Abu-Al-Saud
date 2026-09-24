import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ExternalLink, BookOpen, Github } from 'lucide-react';

export const Projects: React.FC = () => {
  const { projects, caseStudies, openCaseStudy, t } = usePortfolio();

  const publishedProjects = projects.filter((p) => p.status === 'published');

  return (
    <section
      id="work"
      className="py-16 md:py-24 border-b border-[#302C28]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-[13px] uppercase tracking-wider text-[#827970] font-medium block mb-2">
            Portfolio
          </span>
          <h2
            id="work-heading"
            className="text-[28px] sm:text-[36px] font-semibold text-[#F3ECE3] tracking-tight mb-3"
          >
            {t.projects.heading}
          </h2>
          <p className="text-[16px] text-[#B8AEA3] max-w-[65ch]">
            {t.projects.subheading}
          </p>
        </div>

        {/* Projects List */}
        <div className="space-y-12">
          {publishedProjects.map((project, index) => {
            const caseStudy = caseStudies[project.slug];

            return (
              <article
                key={project.id}
                id={`project-card-${project.slug}`}
                className="bg-[#151A1D] border border-[#302C28] rounded-[8px] overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Left Column: Media / Interface Preview */}
                  <div className="lg:col-span-5 bg-[#0D1114] border-b lg:border-b-0 lg:border-r border-[#302C28] p-4 sm:p-6 flex flex-col justify-center">
                    <div className="border border-[#302C28] rounded-[8px] overflow-hidden">
                      <img
                        src={project.coverImage}
                        alt={`Screenshot of ${project.title} interface`}
                        referrerPolicy="no-referrer"
                        className="w-full h-auto aspect-video object-cover block"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Right Column: Problem, Solution & Technical Breakdown */}
                  <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      {/* Meta header */}
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-mono uppercase text-[#C4875B]">
                            {project.industry}
                          </span>
                          <span className="text-[#302C28]">/</span>
                          <span className="text-[12px] text-[#827970]">
                            0{index + 1}
                          </span>
                        </div>
                        {project.featured && (
                          <span className="text-[11px] uppercase tracking-wider text-[#827970] px-2 py-0.5 border border-[#302C28] rounded-[8px]">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="text-[22px] sm:text-[24px] font-semibold text-[#F3ECE3] mb-3 tracking-tight">
                        {project.title}
                      </h3>

                      <p className="text-[15px] text-[#B8AEA3] mb-6 leading-[1.6]">
                        {project.description}
                      </p>

                      {/* Problem and Solution block */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pt-4 border-t border-[#302C28]">
                        <div>
                          <span className="text-[12px] uppercase tracking-wider text-[#827970] font-medium block mb-1">
                            {t.projects.problemLabel}
                          </span>
                          <p className="text-[13px] text-[#B8AEA3] leading-[1.5]">
                            {project.problem}
                          </p>
                        </div>
                        <div>
                          <span className="text-[12px] uppercase tracking-wider text-[#827970] font-medium block mb-1">
                            {t.projects.solutionLabel}
                          </span>
                          <p className="text-[13px] text-[#B8AEA3] leading-[1.5]">
                            {project.solution}
                          </p>
                        </div>
                      </div>

                      {/* Role & Technologies */}
                      <div className="space-y-3 pt-4 border-t border-[#302C28] mb-6">
                        <div>
                          <span className="text-[12px] uppercase tracking-wider text-[#827970] font-medium block mb-1">
                            {t.projects.roleLabel}
                          </span>
                          <p className="text-[13px] text-[#F3ECE3]">
                            {project.role}
                          </p>
                        </div>

                        <div>
                          <span className="text-[12px] uppercase tracking-wider text-[#827970] font-medium block mb-2">
                            {t.projects.stackLabel}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="text-[12px] px-2.5 py-1 bg-[#1C2124] text-[#B8AEA3] border border-[#302C28] rounded-[8px]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-[#302C28] flex flex-wrap items-center gap-3">
                      {caseStudy && (
                        <button
                          type="button"
                          id={`view-case-study-${project.slug}`}
                          onClick={() => openCaseStudy(caseStudy)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-[#C4875B] text-[#0D1114] hover:bg-[#b07449] rounded-[8px] transition-colors duration-150"
                        >
                          <BookOpen className="w-4 h-4" strokeWidth={1.5} />
                          <span>{t.projects.viewCaseStudy}</span>
                        </button>
                      )}

                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#F3ECE3] hover:text-[#C4875B] border border-[#302C28] hover:border-[#C4875B]/40 rounded-[8px] transition-colors duration-150"
                      >
                        <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>{t.projects.liveDemo}</span>
                      </a>

                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] text-[#827970] hover:text-[#F3ECE3] border border-[#302C28] rounded-[8px] transition-colors duration-150"
                      >
                        <Github className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>{t.projects.githubRepo}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
