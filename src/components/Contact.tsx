import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Mail, Linkedin, Github, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const { t, settings, addMessage, showToast } = usePortfolio();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'Web applications',
    budget: '$5,000 - $10,000',
    timeline: '1 to 2 months',
    projectDetails: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleSelectService = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        // Map service title to dropdown value
        const val = customEvent.detail;
        setFormData((prev) => ({
          ...prev,
          projectType: val,
        }));
      }
    };
    window.addEventListener('select-service', handleSelectService);
    return () => {
      window.removeEventListener('select-service', handleSelectService);
    };
  }, []);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.projectDetails.trim()) {
      errs.projectDetails = 'Please provide details about your project';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || 'Individual Client',
        projectType: formData.projectType,
        budget: formData.budget,
        timeline: formData.timeline,
        projectDetails: formData.projectDetails.trim(),
      });
      setIsSubmitting(false);
      setSubmitted(true);
      showToast('Project inquiry submitted successfully', 'success');
      setFormData({
        name: '',
        email: '',
        company: '',
        projectType: 'Web applications',
        budget: '$5,000 - $10,000',
        timeline: '1 to 2 months',
        projectDetails: '',
      });
    }, 400);
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-24 border-b border-[#302C28]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Context & Direct Contact options */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[13px] uppercase tracking-wider text-[#827970] font-medium block mb-2">
                Project inquiries
              </span>
              <h2
                id="contact-heading"
                className="text-[28px] sm:text-[36px] font-semibold text-[#F3ECE3] tracking-tight mb-4"
              >
                {t.contact.heading}
              </h2>
              <p className="text-[16px] text-[#B8AEA3] leading-[1.65] mb-8">
                {t.contact.body}
              </p>

              {/* Status indicator */}
              <div className="p-4 bg-[#151A1D] border border-[#302C28] rounded-[8px] mb-8">
                <div className="flex items-center gap-2 text-[13px] text-[#F3ECE3] font-medium mb-1">
                  <span className="w-2 h-2 rounded-[8px] bg-[#3F6E4E]" />
                  <span>{t.contact.availabilityLabel}</span>
                </div>
                <p className="text-[12px] text-[#827970]">
                  {t.contact.availabilityDescription || 'Currently accepting 1 new client project for development starting this quarter.'}
                </p>
              </div>
            </div>

            {/* Direct Contact links */}
            <div>
              <span className="text-[13px] font-medium text-[#F3ECE3] block mb-3">
                {t.contact.directContact}
              </span>
              <div className="space-y-2">
                <a
                  href={`mailto:${settings.email}`}
                  id="direct-email-link"
                  className="flex items-center gap-3 p-3 bg-[#151A1D] hover:bg-[#1C2124] border border-[#302C28] rounded-[8px] text-[14px] text-[#B8AEA3] hover:text-[#F3ECE3] transition-colors duration-150"
                >
                  <Mail className="w-4 h-4 text-[#827970]" strokeWidth={1.5} />
                  <span>{settings.email}</span>
                </a>
                <a
                  href={settings.linkedin}
                  id="direct-linkedin-link"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#151A1D] hover:bg-[#1C2124] border border-[#302C28] rounded-[8px] text-[14px] text-[#B8AEA3] hover:text-[#F3ECE3] transition-colors duration-150"
                >
                  <Linkedin className="w-4 h-4 text-[#827970]" strokeWidth={1.5} />
                  <span>{t.contact.linkedinLabel || 'LinkedIn Profile'}</span>
                </a>
                <a
                  href={settings.github}
                  id="direct-github-link"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#151A1D] hover:bg-[#1C2124] border border-[#302C28] rounded-[8px] text-[14px] text-[#B8AEA3] hover:text-[#F3ECE3] transition-colors duration-150"
                >
                  <Github className="w-4 h-4 text-[#827970]" strokeWidth={1.5} />
                  <span>{t.contact.githubLabel || 'GitHub Repositories'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-[#151A1D] border border-[#302C28] rounded-[8px]">
              {submitted ? (
                <div id="contact-success-notice" className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-[8px] bg-[#1C2124] border border-[#302C28]">
                    <CheckCircle2 className="w-6 h-6 text-[#3F6E4E]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-[20px] font-semibold text-[#F3ECE3]">
                    {t.contact.successTitle}
                  </h3>
                  <p className="text-[14px] text-[#B8AEA3] max-w-md mx-auto leading-[1.6]">
                    {t.contact.successMessage}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 text-[13px] text-[#C4875B] hover:text-[#e4a578] transition-colors"
                  >
                    {t.contact.submitAnother || 'Submit another inquiry'}
                  </button>
                </div>
              ) : (
                <form id="project-inquiry-form" onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inquiry-name"
                        className="block text-[13px] font-medium text-[#F3ECE3] mb-1.5"
                      >
                        {t.contact.name} <span className="text-[#A84B42]">*</span>
                      </label>
                      <input
                        type="text"
                        id="inquiry-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t.contact.namePlaceholder}
                        className={`w-full px-3.5 py-2.5 bg-[#0D1114] border ${
                          errors.name ? 'border-[#A84B42]' : 'border-[#302C28]'
                        } rounded-[8px] text-[14px] text-[#F3ECE3] placeholder-[#827970] focus:border-[#C4875B] focus:outline-none transition-colors duration-150`}
                      />
                      {errors.name && (
                        <span className="text-[12px] text-[#A84B42] mt-1 block">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-email"
                        className="block text-[13px] font-medium text-[#F3ECE3] mb-1.5"
                      >
                        {t.contact.email} <span className="text-[#A84B42]">*</span>
                      </label>
                      <input
                        type="email"
                        id="inquiry-email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t.contact.emailPlaceholder}
                        className={`w-full px-3.5 py-2.5 bg-[#0D1114] border ${
                          errors.email ? 'border-[#A84B42]' : 'border-[#302C28]'
                        } rounded-[8px] text-[14px] text-[#F3ECE3] placeholder-[#827970] focus:border-[#C4875B] focus:outline-none transition-colors duration-150`}
                      />
                      {errors.email && (
                        <span className="text-[12px] text-[#A84B42] mt-1 block">
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Company & Project Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inquiry-company"
                        className="block text-[13px] font-medium text-[#F3ECE3] mb-1.5"
                      >
                        {t.contact.company}
                      </label>
                      <input
                        type="text"
                        id="inquiry-company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder={t.contact.companyPlaceholder}
                        className="w-full px-3.5 py-2.5 bg-[#0D1114] border border-[#302C28] rounded-[8px] text-[14px] text-[#F3ECE3] placeholder-[#827970] focus:border-[#C4875B] focus:outline-none transition-colors duration-150"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-project-type"
                        className="block text-[13px] font-medium text-[#F3ECE3] mb-1.5"
                      >
                        {t.contact.projectType}
                      </label>
                      <select
                        id="inquiry-project-type"
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#0D1114] border border-[#302C28] rounded-[8px] text-[14px] text-[#F3ECE3] focus:border-[#C4875B] focus:outline-none transition-colors duration-150"
                      >
                        <option value="Business websites">{t.contact.projectTypeOptions?.businessWebsites || 'Business website'}</option>
                        <option value="Web applications">{t.contact.projectTypeOptions?.webApplications || 'Web application'}</option>
                        <option value="E-commerce">{t.contact.projectTypeOptions?.ecommerce || 'E-commerce storefront'}</option>
                        <option value="Admin dashboards">{t.contact.projectTypeOptions?.adminDashboards || 'Admin dashboard'}</option>
                        <option value="Custom software">{t.contact.projectTypeOptions?.customSoftware || 'Custom software / workflow'}</option>
                        <option value="Backend and APIs">{t.contact.projectTypeOptions?.backendApis || 'Backend and API architecture'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget & Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inquiry-budget"
                        className="block text-[13px] font-medium text-[#F3ECE3] mb-1.5"
                      >
                        {t.contact.budget}
                      </label>
                      <select
                        id="inquiry-budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#0D1114] border border-[#302C28] rounded-[8px] text-[14px] text-[#F3ECE3] focus:border-[#C4875B] focus:outline-none transition-colors duration-150"
                      >
                        <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                        <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                        <option value="$25,000+">$25,000+</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-timeline"
                        className="block text-[13px] font-medium text-[#F3ECE3] mb-1.5"
                      >
                        {t.contact.timeline}
                      </label>
                      <select
                        id="inquiry-timeline"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#0D1114] border border-[#302C28] rounded-[8px] text-[14px] text-[#F3ECE3] focus:border-[#C4875B] focus:outline-none transition-colors duration-150"
                      >
                        <option value="Immediate (under 1 month)">{t.contact.timelineOptions?.immediate || 'Immediate (under 1 month)'}</option>
                        <option value="1 to 2 months">{t.contact.timelineOptions?.oneToTwoMonths || '1 to 2 months'}</option>
                        <option value="2 to 4 months">{t.contact.timelineOptions?.twoToFourMonths || '2 to 4 months'}</option>
                        <option value="Flexible / exploratory">{t.contact.timelineOptions?.flexible || 'Flexible / exploratory'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label
                      htmlFor="inquiry-details"
                      className="block text-[13px] font-medium text-[#F3ECE3] mb-1.5"
                    >
                      {t.contact.projectDetails} <span className="text-[#A84B42]">*</span>
                    </label>
                    <textarea
                      id="inquiry-details"
                      rows={5}
                      value={formData.projectDetails}
                      onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                      placeholder={t.contact.projectDetailsPlaceholder}
                      className={`w-full px-3.5 py-2.5 bg-[#0D1114] border ${
                        errors.projectDetails ? 'border-[#A84B42]' : 'border-[#302C28]'
                      } rounded-[8px] text-[14px] text-[#F3ECE3] placeholder-[#827970] focus:border-[#C4875B] focus:outline-none transition-colors duration-150`}
                    />
                    {errors.projectDetails && (
                      <span className="text-[12px] text-[#A84B42] mt-1 block">
                        {errors.projectDetails}
                      </span>
                    )}
                  </div>

                  {/* Submit Button: NOT full width on desktop */}
                  <div>
                    <button
                      type="submit"
                      id="submit-inquiry-btn"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-3 text-[14px] font-medium bg-[#C4875B] text-[#0D1114] hover:bg-[#b07449] disabled:opacity-50 rounded-[8px] transition-colors duration-150"
                    >
                      {isSubmitting ? t.contact.sending : t.contact.submit}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
