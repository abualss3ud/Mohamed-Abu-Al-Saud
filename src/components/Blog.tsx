import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Article } from '../types';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ArrowUpRight,
  X,
  Tag,
  Share2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const Blog: React.FC = () => {
  const { articles, t, language, showToast, settings } = usePortfolio();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Close reader on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeArticle) {
        setActiveArticle(null);
      }
    };
    if (activeArticle) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeArticle]);

  // Only show published articles on the public website
  const publishedArticles = articles.filter(
    (art) => art.status === 'published' || !art.status
  );

  // Extract unique categories
  const categories = [
    'all',
    ...Array.from(new Set(publishedArticles.map((a) => a.category).filter(Boolean))),
  ];

  // Filtered list
  const filteredArticles =
    selectedCategory === 'all'
      ? publishedArticles
      : publishedArticles.filter(
          (a) => a.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  // Approximate reading time (200 words per minute)
  const calculateReadTime = (content: string) => {
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 180));
    return `${minutes} ${t.blogSection.readTime}`;
  };

  const handleInquireFromArticle = (topic: string) => {
    setActiveArticle(null);
    window.dispatchEvent(
      new CustomEvent('select-service', {
        detail: topic.includes('database') || topic.includes('API') ? 'Backend and API development' : 'Web applications',
      })
    );
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#contact';
    }
  };

  // Next / Previous article switcher in modal
  const currentIndex = activeArticle
    ? publishedArticles.findIndex((a) => a.id === activeArticle.id)
    : -1;
  const prevArticle = currentIndex > 0 ? publishedArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < publishedArticles.length - 1
      ? publishedArticles[currentIndex + 1]
      : null;

  return (
    <section
      id="blog"
      className="py-16 md:py-24 border-b border-[#302C28] bg-[#0D1114]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-mono uppercase tracking-wider text-[#C4875B]">
              06 / WRITING & PERSPECTIVES
            </span>
            <span className="text-[#302C28]">/</span>
            <span className="text-[12px] font-mono text-[#827970] uppercase">
              {t.blogSection.badge}
            </span>
          </div>

          <h2
            id="blog-heading"
            className="text-[28px] sm:text-[38px] font-semibold text-[#F3ECE3] tracking-tight mb-3"
          >
            {t.blogSection.heading}
          </h2>

          <p className="text-[16px] text-[#B8AEA3] max-w-[70ch] leading-[1.65] mb-8">
            {t.blogSection.subheading}
          </p>

          {/* Category Filter Tabs */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 pb-4">
              {categories.map((cat) => {
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    type="button"
                    className={`px-3 py-1.5 text-[13px] font-medium rounded-[6px] border transition-colors duration-150 ${
                      isSelected
                        ? 'bg-[#C4875B] text-[#0D1114] border-[#C4875B]'
                        : 'bg-[#151A1D] text-[#827970] hover:text-[#F3ECE3] border-[#302C28] hover:border-[#827970]'
                    }`}
                  >
                    {cat === 'all' ? t.blogSection.allCategories : cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="p-8 text-center bg-[#151A1D] border border-[#302C28] rounded-[8px] text-[#827970]">
            <p className="text-[15px]">{t.blogSection.noArticles}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {filteredArticles.map((article, index) => (
              <article
                key={article.id}
                id={`article-card-${article.id}`}
                className="bg-[#151A1D] border border-[#302C28] hover:border-[#827970] rounded-[8px] p-6 sm:p-7 flex flex-col justify-between transition-colors duration-200 group"
              >
                <div>
                  {/* Article Metadata Row */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#C4875B] bg-[#0D1114] px-2 py-0.5 rounded-[4px] border border-[#302C28]">
                        {article.category || 'Architecture'}
                      </span>
                      <span className="text-[12px] font-mono text-[#827970] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#827970]" strokeWidth={1.5} />
                        {calculateReadTime(article.content || article.excerpt)}
                      </span>
                    </div>

                    <time
                      dateTime={article.publishedDate}
                      className="text-[12px] font-mono text-[#827970]"
                    >
                      {article.publishedDate}
                    </time>
                  </div>

                  {/* Article Title */}
                  <h3 className="text-[20px] font-semibold text-[#F3ECE3] group-hover:text-[#C4875B] transition-colors leading-[1.35] tracking-tight mb-3">
                    <button
                      type="button"
                      onClick={() => setActiveArticle(article)}
                      className="text-left w-full hover:underline focus:outline-none"
                    >
                      {article.title}
                    </button>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[14px] text-[#B8AEA3] leading-[1.65] mb-5 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {article.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-mono text-[#827970] bg-[#0D1114] px-2 py-0.5 rounded-[4px] border border-[#26221E]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Read Action */}
                <div className="pt-4 border-t border-[#302C28] flex items-center justify-between mt-auto">
                  <span className="text-[12px] text-[#827970] font-mono">
                    {settings.name || 'Abu Al-Saud'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveArticle(article)}
                    id={`read-article-btn-${article.id}`}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#C4875B] hover:text-[#e4a578] transition-colors"
                  >
                    <span>{t.blogSection.readArticle}</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div
          id="article-reader-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0D1114]/90 backdrop-blur-none overflow-y-auto"
          onClick={() => setActiveArticle(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-reader-title"
        >
          <div
            id="article-reader-modal"
            className="relative w-full max-w-3xl max-h-[92vh] my-auto bg-[#151A1D] border border-[#302C28] rounded-[8px] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#151A1D] border-b border-[#302C28]">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C4875B] bg-[#0D1114] px-2 py-0.5 rounded-[4px] border border-[#302C28]">
                  {activeArticle.category || 'Article'}
                </span>
                <span className="text-[12px] font-mono text-[#827970] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {calculateReadTime(activeArticle.content || activeArticle.excerpt)}
                </span>
              </div>
              <button
                id="close-article-reader-btn"
                onClick={() => setActiveArticle(null)}
                type="button"
                className="p-1.5 text-[#827970] hover:text-[#F3ECE3] hover:bg-[#1C2124] border border-transparent hover:border-[#302C28] rounded-[8px] transition-colors duration-150"
                aria-label={t.blogSection.close}
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Reader Content Body */}
            <div className="p-6 sm:p-10 space-y-8">
              {/* Header Title & Date */}
              <div>
                <time
                  dateTime={activeArticle.publishedDate}
                  className="text-[12px] font-mono text-[#827970] block mb-2"
                >
                  {t.blogSection.publishedOn} · {activeArticle.publishedDate}
                </time>
                <h2
                  id="article-reader-title"
                  className="text-[26px] sm:text-[34px] font-semibold text-[#F3ECE3] tracking-tight leading-[1.25] mb-4"
                >
                  {activeArticle.title}
                </h2>
                <div className="flex items-center gap-3 text-[13px] text-[#B8AEA3] border-b border-[#302C28] pb-6">
                  <span className="font-medium text-[#F3ECE3]">{settings.fullName || settings.name || 'Mohamed Abu Al-Saud'}</span>
                  <span className="text-[#302C28]">/</span>
                  <span className="text-[#827970]">{settings.title || 'Full-Stack Developer'}</span>
                </div>
              </div>

              {/* Cover Image if available */}
              {activeArticle.coverImage && (
                <div className="border border-[#302C28] rounded-[8px] overflow-hidden bg-[#0D1114]">
                  <img
                    src={activeArticle.coverImage}
                    alt={activeArticle.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto aspect-[21/9] object-cover"
                  />
                </div>
              )}

              {/* Excerpt callout */}
              <div className="p-4 sm:p-5 bg-[#0D1114] border-l-2 border-[#C4875B] border-y border-r border-[#302C28] rounded-r-[6px]">
                <p className="text-[15px] sm:text-[16px] text-[#F3ECE3] italic leading-[1.65]">
                  "{activeArticle.excerpt}"
                </p>
              </div>

              {/* Main Content */}
              <div className="space-y-5 text-[15px] sm:text-[16px] text-[#B8AEA3] leading-[1.75]">
                {activeArticle.content.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} className="whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags */}
              {activeArticle.tags && activeArticle.tags.length > 0 && (
                <div className="pt-6 border-t border-[#302C28]">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-3.5 h-3.5 text-[#C4875B]" strokeWidth={1.5} />
                    <span className="text-[11px] font-mono text-[#827970] uppercase">
                      Tags & Topics
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeArticle.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[12px] font-mono text-[#F3ECE3] bg-[#0D1114] px-2.5 py-1 rounded-[4px] border border-[#302C28]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Commercial Inquire Callout Box */}
              <div className="p-6 bg-[#0D1114] border border-[#302C28] rounded-[8px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#C4875B] block mb-1">
                    {t.blogSection.discussTopic}
                  </span>
                  <p className="text-[13px] text-[#B8AEA3]">
                    Turn these architectural patterns into a robust, high-performance product for your business.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleInquireFromArticle(activeArticle.title)}
                  className="px-4 py-2.5 bg-[#C4875B] text-[#0D1114] hover:bg-[#b07449] font-medium text-[13px] rounded-[6px] shrink-0 transition-colors duration-150 inline-flex items-center gap-1.5"
                >
                  <span>{t.blogSection.discussCta}</span>
                  <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>

              {/* Article Footer & Next/Previous Switchers */}
              <div className="pt-6 border-t border-[#302C28] flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="text-[13px] text-[#827970] hover:text-[#F3ECE3] transition-colors"
                >
                  ← {t.blogSection.backToBlog}
                </button>

                <div className="flex items-center gap-2">
                  {prevArticle && (
                    <button
                      type="button"
                      onClick={() => setActiveArticle(prevArticle)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-mono text-[#827970] hover:text-[#F3ECE3] bg-[#0D1114] border border-[#302C28] hover:border-[#827970] rounded-[6px] transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                  )}
                  {nextArticle && (
                    <button
                      type="button"
                      onClick={() => setActiveArticle(nextArticle)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-mono text-[#827970] hover:text-[#F3ECE3] bg-[#0D1114] border border-[#302C28] hover:border-[#827970] rounded-[6px] transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
