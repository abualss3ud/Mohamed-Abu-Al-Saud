import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox,
  Mail,
  Search,
  CheckCircle,
  Eye,
  Trash2,
  Calendar,
  Building,
  DollarSign,
  Clock,
  Send,
  X,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLanguage } from '../../context/LanguageContext';
import { Message } from '../../types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export const AdminMessages: React.FC = () => {
  const { messages, deleteMessage, updateMessageStatus } = usePortfolio();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.projectDetails.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || msg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      updateMessageStatus(msg.id, 'read');
    }
  };

  const confirmDelete = () => {
    if (messageToDelete) {
      deleteMessage(messageToDelete.id);
      if (selectedMessage?.id === messageToDelete.id) {
        setSelectedMessage(null);
      }
      setMessageToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-surface border border-stroke shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-display italic text-text-primary">
            {isAr ? 'صندوق الرسائل والاستفسارات' : 'Client Inquiries & Contact Messages'}
          </h2>
          <p className="text-xs text-muted mt-1">
            {isAr
              ? 'متابعة وإدارة رسائل طلبات المشاريع والاستفسارات التقنية الواردة من العملاء.'
              : 'Review project proposals, client scopes, budgets, and direct inquiries.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted">
          <span>{messages.filter((m) => m.status === 'unread').length} {isAr ? 'غير مقروءة' : 'unread'}</span>
          <span>•</span>
          <span>{messages.length} {isAr ? 'الإجمالي' : 'total'}</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="p-4 rounded-2xl bg-surface border border-stroke flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث في الاسم، البريد، التفاصيل...' : 'Search name, email, company, scope...'}
            className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-full px-4 py-2 text-xs text-text-primary placeholder:text-muted/60 focus:outline-none pl-9 rtl:pl-4 rtl:pr-9"
          />
          <Search className="w-3.5 h-3.5 text-muted absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-1.5 rounded-full font-mono transition-colors cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-text-primary text-bg font-semibold'
                : 'bg-bg text-muted hover:text-text-primary border border-stroke'
            }`}
          >
            {isAr ? 'الكل' : 'All'}
          </button>

          <button
            onClick={() => setFilterStatus('unread')}
            className={`px-3.5 py-1.5 rounded-full font-mono transition-colors cursor-pointer ${
              filterStatus === 'unread'
                ? 'bg-emerald-500 text-black font-semibold'
                : 'bg-bg text-muted hover:text-text-primary border border-stroke'
            }`}
          >
            {isAr ? 'غير مقروء' : 'Unread'}
          </button>

          <button
            onClick={() => setFilterStatus('read')}
            className={`px-3.5 py-1.5 rounded-full font-mono transition-colors cursor-pointer ${
              filterStatus === 'read'
                ? 'bg-text-primary text-bg font-semibold'
                : 'bg-bg text-muted hover:text-text-primary border border-stroke'
            }`}
          >
            {isAr ? 'مقروء' : 'Read'}
          </button>
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-surface border border-stroke text-muted">
          <Inbox className="w-8 h-8 mx-auto mb-3 opacity-40 text-[#89AACC]" />
          <p className="text-sm">{isAr ? 'لا توجد رسائل مطابقة' : 'No messages found'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenMessage(msg)}
              className={`p-5 rounded-2xl bg-surface border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                msg.status === 'unread'
                  ? 'border-emerald-500/40 bg-emerald-500/[0.03] shadow-sm'
                  : 'border-stroke hover:border-[#89AACC]/40'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-bg border border-stroke flex items-center justify-center font-bold text-xs text-[#89AACC] shrink-0">
                  {msg.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 pr-2 rtl:pr-0 rtl:pl-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-text-primary truncate">
                      {msg.name}
                    </span>
                    {msg.status === 'unread' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                    {msg.company && (
                      <span className="text-xs text-muted font-mono truncate">
                        • {msg.company}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted leading-relaxed line-clamp-1">
                    {msg.projectDetails || 'No project description provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="text-xs font-mono text-muted">{msg.date}</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateMessageStatus(
                      msg.id,
                      msg.status === 'unread' ? 'read' : 'unread'
                    );
                  }}
                  className="px-2.5 py-1 rounded-xl bg-bg hover:bg-stroke/60 text-xs font-mono border border-stroke text-muted hover:text-text-primary transition-colors"
                  title={msg.status === 'unread' ? 'Mark as read' : 'Mark as unread'}
                >
                  {msg.status === 'unread' ? (isAr ? 'تمييز كمقروء' : 'Mark read') : (isAr ? 'غير مقروء' : 'Unread')}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMessageToDelete(msg);
                  }}
                  className="p-1.5 rounded-xl bg-bg hover:bg-rose-500/20 text-muted hover:text-rose-400 border border-stroke hover:border-rose-500/30 transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Details Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="w-full max-w-2xl bg-surface border border-stroke rounded-3xl p-6 sm:p-8 shadow-2xl my-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-stroke">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bg border border-stroke flex items-center justify-center font-bold text-xs text-[#89AACC]">
                    {selectedMessage.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">
                      {selectedMessage.name}
                    </h3>
                    <span className="text-xs text-muted font-mono">{selectedMessage.email}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-1.5 rounded-full hover:bg-bg text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Message Meta Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-bg border border-stroke mb-6 text-xs">
                <div>
                  <span className="text-[11px] font-mono text-muted uppercase block mb-1">
                    {isAr ? 'الشركة / الجهة' : 'Company'}
                  </span>
                  <span className="font-medium text-text-primary">
                    {selectedMessage.company || 'Personal / Direct'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-muted uppercase block mb-1">
                    {isAr ? 'نوع المشروع' : 'Project Type'}
                  </span>
                  <span className="font-medium text-text-primary">
                    {selectedMessage.projectType || 'Web App'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-muted uppercase block mb-1">
                    {isAr ? 'الميزانية التقديرية' : 'Budget'}
                  </span>
                  <span className="font-medium text-text-primary">
                    {selectedMessage.budget || 'Flexible'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-muted uppercase block mb-1">
                    {isAr ? 'تاريخ الإرسال' : 'Date'}
                  </span>
                  <span className="font-medium text-text-primary">{selectedMessage.date}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="mb-8">
                <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-2">
                  {isAr ? 'نص الرسالة والتفاصيل' : 'Message Body'}
                </label>
                <div className="p-5 rounded-2xl bg-bg/80 border border-stroke text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.projectDetails || 'No additional message details provided.'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stroke">
                <button
                  type="button"
                  onClick={() => setMessageToDelete(selectedMessage)}
                  className="px-4 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer"
                >
                  {isAr ? 'حذف الرسالة' : 'Delete Message'}
                </button>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: Portfolio Inquiry`}
                    className="px-6 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAr ? 'الرد عبر البريد الإلكتروني' : 'Reply via Email'}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(messageToDelete)}
        title={isAr ? 'حذف الرسالة نهائياً؟' : 'Delete Message?'}
        message={
          isAr
            ? 'هل أنت متأكد من رغبتك في حذف هذه الرسالة من السجل؟'
            : 'Are you sure you want to permanently delete this client inquiry?'
        }
        itemTitle={messageToDelete?.name}
        onConfirm={confirmDelete}
        onCancel={() => setMessageToDelete(null)}
      />
    </div>
  );
};
