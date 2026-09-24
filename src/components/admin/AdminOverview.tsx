import React from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban,
  FileText,
  Inbox,
  Layers,
  Star,
  CheckCircle,
  Plus,
  ArrowRight,
  ArrowLeft,
  Mail,
  Eye,
  Clock,
  Sparkles,
  MessageSquareQuote,
  Image as ImageIcon,
  CreditCard,
  DollarSign,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLanguage } from '../../context/LanguageContext';
import { AdminTab } from '../../types';

interface AdminOverviewProps {
  onSelectTab: (tab: AdminTab) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onSelectTab }) => {
  const { projects, services, articles, messages, testimonials, invoices, settings } = usePortfolio();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.status === 'published').length;
  const featuredProjects = projects.filter((p) => p.featured).length;

  const totalServices = services.length;
  const totalArticles = articles.length;
  const publishedArticles = articles.filter((a) => a.status === 'published').length;

  const unreadMessages = messages.filter((m) => m.status === 'unread').length;
  const totalMessages = messages.length;

  const totalInvoices = invoices.length;
  const pendingInvoices = invoices.filter((i) => i.status === 'pending').length;
  const totalPaidUSD = invoices
    .filter((i) => i.status === 'paid' && (i.currency === 'USD' || !i.currency))
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalTestimonials = testimonials.length;

  const recentMessages = messages.slice(0, 4);
  const recentProjects = projects.slice(0, 4);
  const recentInvoices = invoices.slice(0, 3);

  const stats = [
    {
      title: isAr ? 'إجمالي المشاريع' : 'Total Projects',
      value: totalProjects,
      sub: isAr ? `${publishedProjects} منشور على الموقع` : `${publishedProjects} published live`,
      icon: <FolderKanban className="w-5 h-5 text-[#89AACC]" />,
      tab: 'projects' as AdminTab,
    },
    {
      title: isAr ? 'الفواتير والتحصيل' : 'Invoices & Revenue',
      value: `$${totalPaidUSD.toLocaleString()}`,
      sub: isAr ? `${pendingInvoices} فواتير قيد الانتظار` : `${pendingInvoices} pending invoices`,
      badge: pendingInvoices > 0 ? (isAr ? `${pendingInvoices} مستحق` : `${pendingInvoices} Due`) : undefined,
      icon: <CreditCard className="w-5 h-5 text-emerald-400" />,
      tab: 'invoices' as AdminTab,
    },
    {
      title: isAr ? 'الرسائل والاستفسارات' : 'Inquiries & Messages',
      value: totalMessages,
      sub: isAr ? `${unreadMessages} رسالة جديدة غير مقروءة` : `${unreadMessages} unread messages`,
      badge: unreadMessages > 0 ? (isAr ? 'جديد' : 'New') : undefined,
      icon: <Inbox className="w-5 h-5 text-cyan-400" />,
      tab: 'messages' as AdminTab,
    },
    {
      title: isAr ? 'المقالات التقنية' : 'Blog Articles',
      value: totalArticles,
      sub: isAr ? `${publishedArticles} مقال منشور` : `${publishedArticles} published`,
      icon: <FileText className="w-5 h-5 text-purple-400" />,
      tab: 'blog' as AdminTab,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-stroke shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono bg-bg border border-stroke text-[#89AACC] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'لوحة تحكم الموقع الحي' : 'Live Portfolio Console'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display italic text-text-primary">
            {isAr ? `مرحباً، ${settings.fullName || settings.name}` : `Welcome back, ${settings.fullName || settings.name}`}
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1 max-w-xl leading-relaxed">
            {isAr
              ? 'متابعة وإدارة المشاريع، المقالات الهندسية، الخدمات، والرسائل الواردة من العملاء بكل سهولة.'
              : 'Monitor analytics, update case studies, publish blog posts, and review client inquiries.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            onClick={() => onSelectTab('invoices')}
            className="px-4 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <CreditCard className="w-4 h-4" />
            <span>{isAr ? 'إنشاء فاتورة' : 'New Invoice'}</span>
          </button>

          <button
            onClick={() => onSelectTab('projects')}
            className="px-4 py-2.5 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-text-primary text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة مشروع' : 'Add Project'}</span>
          </button>

          <button
            onClick={() => onSelectTab('blog')}
            className="px-4 py-2.5 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-text-primary text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'كتابة مقال' : 'Write Post'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -2 }}
            onClick={() => onSelectTab(item.tab)}
            className="p-6 rounded-3xl bg-surface/70 border border-stroke hover:border-[#89AACC]/50 transition-all cursor-pointer shadow-sm relative overflow-hidden group"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-xs font-mono text-muted uppercase tracking-wider block">
                {item.title}
              </span>
              <div className="p-2.5 rounded-2xl bg-bg border border-stroke shrink-0 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl sm:text-4xl font-display font-semibold italic text-text-primary">
                {item.value}
              </span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                  {item.badge}
                </span>
              )}
            </div>

            <span className="text-xs text-muted/80 font-normal">{item.sub}</span>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout: Recent Messages & Featured Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Recent Contact Messages */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-surface border border-stroke shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#89AACC]" />
                <h3 className="text-base font-medium text-text-primary">
                  {isAr ? 'أحدث استفسارات العملاء' : 'Recent Client Inquiries'}
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('messages')}
                className="text-xs font-mono text-[#89AACC] hover:underline cursor-pointer"
              >
                {isAr ? 'عرض الكل ←' : 'View all →'}
              </button>
            </div>

            {recentMessages.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-bg/50 border border-stroke text-muted text-xs">
                {isAr ? 'لا توجد رسائل جديدة حالياً' : 'No recent messages in inbox'}
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => onSelectTab('messages')}
                    className="p-4 rounded-2xl bg-bg/60 border border-stroke hover:border-[#89AACC]/40 transition-colors cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 pr-2 rtl:pr-0 rtl:pl-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary truncate">
                          {msg.name}
                        </span>
                        {msg.status === 'unread' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>
                      <span className="text-xs text-muted block truncate mt-0.5">
                        {msg.company ? `${msg.company} • ` : ''}
                        {msg.projectDetails || msg.email}
                      </span>
                    </div>

                    <div className="text-end shrink-0">
                      <span className="text-[11px] font-mono text-muted block mb-1">
                        {msg.date}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          msg.status === 'unread'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-surface border-stroke text-muted'
                        }`}
                      >
                        {msg.status === 'unread'
                          ? isAr
                            ? 'غير مقروءة'
                            : 'Unread'
                          : isAr
                          ? 'مقروءة'
                          : 'Read'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Featured & Recent Projects */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-surface border border-stroke shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <FolderKanban className="w-4 h-4 text-[#89AACC]" />
                <h3 className="text-base font-medium text-text-primary">
                  {isAr ? 'أحدث المشاريع' : 'Recent Portfolio Projects'}
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('projects')}
                className="text-xs font-mono text-[#89AACC] hover:underline cursor-pointer"
              >
                {isAr ? 'إدارة المشاريع ←' : 'Manage all →'}
              </button>
            </div>

            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onSelectTab('projects')}
                  className="p-3.5 rounded-2xl bg-bg/60 border border-stroke hover:border-[#89AACC]/40 transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface border border-stroke shrink-0">
                      <img
                        src={project.coverImage || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=300&q=80'}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-text-primary truncate">
                        {project.title}
                      </div>
                      <div className="text-xs text-muted font-mono truncate">
                        {project.industry || 'Web Application'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {project.featured && (
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    )}
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        project.status === 'published'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-surface border-stroke text-muted'
                      }`}
                    >
                      {project.status === 'published'
                        ? isAr
                          ? 'منشور'
                          : 'Live'
                        : isAr
                        ? 'مسودة'
                        : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-surface border border-stroke shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-4 h-4 text-[#89AACC]" />
            <h3 className="text-base font-medium text-text-primary">
              {isAr ? 'أحدث الفواتير والمطالبات' : 'Recent Invoices & Billing'}
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('invoices')}
            className="text-xs font-mono text-[#89AACC] hover:underline cursor-pointer"
          >
            {isAr ? 'إدارة كافة الفواتير ←' : 'Manage Invoices →'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentInvoices.map((inv) => (
            <div
              key={inv.id}
              onClick={() => onSelectTab('invoices')}
              className="p-4 rounded-2xl bg-bg border border-stroke hover:border-[#89AACC]/40 transition-colors cursor-pointer flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-text-primary block">
                    {inv.invoiceNumber}
                  </span>
                  <span className="text-xs text-muted truncate block mt-0.5">
                    {(isAr ? inv.clientNameAr : inv.clientNameEn) || inv.clientName}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    inv.status === 'paid'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : inv.status === 'pending'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-surface border-stroke text-muted'
                  }`}
                >
                  {inv.status === 'paid'
                    ? isAr ? 'مدفوعة' : 'Paid'
                    : inv.status === 'pending'
                    ? isAr ? 'قيد الانتظار' : 'Pending'
                    : inv.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-stroke/60 font-mono">
                <span className="text-[11px] text-muted">{inv.dueDate}</span>
                <span className="text-sm font-bold text-text-primary">
                  {inv.totalAmount.toLocaleString()} {inv.currency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
