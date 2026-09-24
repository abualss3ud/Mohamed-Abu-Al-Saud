import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const TechStack: React.FC = () => {
  const { t } = usePortfolio();

  const groups = [
    {
      category: t.techStack.frontend,
      items: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Tailwind CSS'],
    },
    {
      category: t.techStack.backend,
      items: ['Node.js', 'Express.js', 'REST APIs', 'Authentication', 'Webhooks'],
    },
    {
      category: t.techStack.database,
      items: ['PostgreSQL', 'Prisma ORM', 'Schema Design', 'Connection Pooling'],
    },
    {
      category: t.techStack.tools,
      items: ['Git', 'GitHub', 'Docker', 'Linux', 'CI/CD Pipelines'],
    },
  ];

  return (
    <section
      id="tech-stack-section"
      className="py-16 md:py-20 border-b border-[#302C28] bg-[#151A1D]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="mb-10">
          <span className="text-[13px] uppercase tracking-wider text-[#827970] font-medium block mb-2">
            Technical foundations
          </span>
          <h2
            id="tech-heading"
            className="text-[24px] sm:text-[32px] font-semibold text-[#F3ECE3] tracking-tight mb-3"
          >
            {t.techStack.heading}
          </h2>
          <p className="text-[15px] text-[#B8AEA3] max-w-[65ch]">
            {t.techStack.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {groups.map((group, idx) => (
            <div
              key={idx}
              className="p-5 bg-[#0D1114] border border-[#302C28] rounded-[8px]"
            >
              <h3 className="text-[14px] font-medium text-[#F3ECE3] mb-4 pb-2 border-b border-[#302C28]">
                {group.category}
              </h3>
              <ul className="space-y-2">
                {group.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    className="text-[13px] text-[#B8AEA3] flex items-center justify-between"
                  >
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
