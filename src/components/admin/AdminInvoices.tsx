import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  DollarSign,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  X,
  Sparkles,
  Building,
  User,
  Mail,
  Calendar,
  CreditCard,
  Download,
  Copy,
  Check,
  Languages,
  Globe,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Eye,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLanguage } from '../../context/LanguageContext';
import { Invoice, InvoiceItem, InvoiceStatus } from '../../types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { printInvoice, downloadInvoiceHtml } from '../../utils/printInvoice';

const CURRENCIES = [
  { code: 'USD', symbol: '$', labelAr: 'دولار أمريكي ($)', labelEn: 'US Dollar ($)' },
  { code: 'SAR', symbol: 'ر.س', labelAr: 'ريال سعودي (ر.س)', labelEn: 'Saudi Riyal (SAR)' },
  { code: 'AED', symbol: 'د.إ', labelAr: 'درهم إماراتي (د.إ)', labelEn: 'UAE Dirham (AED)' },
  { code: 'EGP', symbol: 'ج.م', labelAr: 'جنيه مصري (ج.م)', labelEn: 'Egyptian Pound (EGP)' },
  { code: 'EUR', symbol: '€', labelAr: 'يورو (€)', labelEn: 'Euro (€)' },
  { code: 'GBP', symbol: '£', labelAr: 'جنيه إسترليني (£)', labelEn: 'British Pound (£)' },
];

export const AdminInvoices: React.FC = () => {
  const { invoices, saveInvoice, deleteInvoice, updateInvoiceStatus, settings, showToast } = usePortfolio();
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCurrency, setFilterCurrency] = useState<string>('all');

  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [invoicePrintLang, setInvoicePrintLang] = useState<'ar' | 'en' | 'bilingual'>('ar');
  const [isCreating, setIsCreating] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [formTab, setFormTab] = useState<'details' | 'ar' | 'en' | 'items'>('details');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Stats
  const totalInvoicesCount = invoices.length;
  const paidInvoicesCount = invoices.filter((i) => i.status === 'paid').length;
  const pendingInvoicesCount = invoices.filter((i) => i.status === 'pending').length;

  const totalPaidUSD = invoices
    .filter((i) => i.status === 'paid' && (i.currency === 'USD' || !i.currency))
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalPendingUSD = invoices
    .filter((i) => i.status === 'pending' && (i.currency === 'USD' || !i.currency))
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `INV-${year}-${String(count).padStart(3, '0')}`;
  };

  const emptyInvoice: Invoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber: generateInvoiceNumber(),
    clientName: '',
    clientNameAr: '',
    clientNameEn: '',
    clientEmail: '',
    clientCompany: '',
    clientCompanyAr: '',
    clientCompanyEn: '',
    clientAddress: '',
    clientAddressAr: '',
    clientAddressEn: '',
    currency: 'USD',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    items: [
      {
        id: `item-${Date.now()}-1`,
        description: 'Full-Stack Web Application Engineering',
        descriptionAr: 'تطوير وهندسة تطبيقات الويب الكاملة',
        descriptionEn: 'Full-Stack Web Application Engineering',
        quantity: 1,
        unitPrice: 2500,
        total: 2500,
      },
    ],
    subtotal: 2500,
    discountPercentage: 0,
    taxPercentage: 0,
    totalAmount: 2500,
    notes: 'Thank you for your business. Full source code, deployment, and technical documentation included.',
    notesAr: 'شكراً لتعاملكم معنا. تشمل الفاتورة الكود المصدري الكامل والنشر على البيئة السحابية والتوثيق الهندسي.',
    notesEn: 'Thank you for your business. Full source code, deployment, and technical documentation included.',
    paymentInstructions: 'Bank Transfer (IBAN) / PayPal: abualss3ud@gmail.com',
    paymentInstructionsAr: 'التحويل البنكي المباشر أو باي بال: abualss3ud@gmail.com',
    paymentInstructionsEn: 'Bank Transfer (IBAN) / PayPal: abualss3ud@gmail.com',
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.clientName.toLowerCase().includes(q) ||
      (inv.clientNameAr && inv.clientNameAr.toLowerCase().includes(q)) ||
      (inv.clientNameEn && inv.clientNameEn.toLowerCase().includes(q)) ||
      (inv.clientCompany && inv.clientCompany.toLowerCase().includes(q)) ||
      inv.clientEmail.toLowerCase().includes(q);

    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    const matchesCurrency = filterCurrency === 'all' || inv.currency === filterCurrency;

    return matchesSearch && matchesStatus && matchesCurrency;
  });

  const handleCreate = () => {
    const newInv = {
      ...emptyInvoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: generateInvoiceNumber(),
    };
    setEditingInvoice(newInv);
    setFormTab('details');
    setIsCreating(true);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice({
      ...invoice,
      clientNameAr: invoice.clientNameAr || invoice.clientName,
      clientNameEn: invoice.clientNameEn || invoice.clientName,
      clientCompanyAr: invoice.clientCompanyAr || invoice.clientCompany,
      clientCompanyEn: invoice.clientCompanyEn || invoice.clientCompany,
      clientAddressAr: invoice.clientAddressAr || invoice.clientAddress,
      clientAddressEn: invoice.clientAddressEn || invoice.clientAddress,
      notesAr: invoice.notesAr || invoice.notes,
      notesEn: invoice.notesEn || invoice.notes,
      paymentInstructionsAr: invoice.paymentInstructionsAr || invoice.paymentInstructions,
      paymentInstructionsEn: invoice.paymentInstructionsEn || invoice.paymentInstructions,
    });
    setFormTab('details');
    setIsCreating(false);
  };

  const handleAddItem = () => {
    if (!editingInvoice) return;
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: 'Engineering Milestone Service',
      descriptionAr: 'خدمة برمجية ومرحلة تسليم',
      descriptionEn: 'Engineering Milestone Service',
      quantity: 1,
      unitPrice: 500,
      total: 500,
    };
    const newItems = [...editingInvoice.items, newItem];
    recalculateTotals(editingInvoice, newItems);
  };

  const handleRemoveItem = (itemId: string) => {
    if (!editingInvoice || editingInvoice.items.length <= 1) {
      showToast(isAr ? 'يجب أن تحتوي الفاتورة على بند واحد على الأقل' : 'Invoice must have at least one line item', 'warning');
      return;
    }
    const newItems = editingInvoice.items.filter((item) => item.id !== itemId);
    recalculateTotals(editingInvoice, newItems);
  };

  const handleItemChange = (itemId: string, field: keyof InvoiceItem, value: any) => {
    if (!editingInvoice) return;
    const newItems = editingInvoice.items.map((item) => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          const qty = field === 'quantity' ? Number(value) || 0 : item.quantity;
          const price = field === 'unitPrice' ? Number(value) || 0 : item.unitPrice;
          updated.total = qty * price;
        }
        return updated;
      }
      return item;
    });
    recalculateTotals(editingInvoice, newItems);
  };

  const recalculateTotals = (
    baseInvoice: Invoice,
    items = baseInvoice.items,
    discount = baseInvoice.discountPercentage || 0,
    tax = baseInvoice.taxPercentage || 0
  ) => {
    const subtotal = items.reduce((acc, curr) => acc + (curr.total || 0), 0);
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * tax) / 100;
    const totalAmount = Math.max(0, afterDiscount + taxAmount);

    setEditingInvoice({
      ...baseInvoice,
      items,
      subtotal,
      discountPercentage: discount,
      taxPercentage: tax,
      totalAmount,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    if (!editingInvoice.invoiceNumber.trim()) {
      showToast(isAr ? 'يرجى إدخال رقم الفاتورة' : 'Please provide invoice number', 'destructive');
      return;
    }

    const primaryName =
      (isAr ? editingInvoice.clientNameAr : editingInvoice.clientNameEn) ||
      editingInvoice.clientNameEn ||
      editingInvoice.clientNameAr ||
      editingInvoice.clientName;

    if (!primaryName?.trim()) {
      showToast(isAr ? 'يرجى إدخال اسم العميل' : 'Please provide client name', 'destructive');
      return;
    }

    const updated: Invoice = {
      ...editingInvoice,
      clientName: isAr ? (editingInvoice.clientNameAr || primaryName) : (editingInvoice.clientNameEn || primaryName),
      clientNameAr: editingInvoice.clientNameAr || primaryName,
      clientNameEn: editingInvoice.clientNameEn || primaryName,
      clientCompany: isAr ? (editingInvoice.clientCompanyAr || editingInvoice.clientCompany) : (editingInvoice.clientCompanyEn || editingInvoice.clientCompany),
      clientCompanyAr: editingInvoice.clientCompanyAr,
      clientCompanyEn: editingInvoice.clientCompanyEn,
      notes: isAr ? (editingInvoice.notesAr || editingInvoice.notes) : (editingInvoice.notesEn || editingInvoice.notes),
      notesAr: editingInvoice.notesAr,
      notesEn: editingInvoice.notesEn,
      paymentInstructions: isAr ? (editingInvoice.paymentInstructionsAr || editingInvoice.paymentInstructions) : (editingInvoice.paymentInstructionsEn || editingInvoice.paymentInstructions),
      paymentInstructionsAr: editingInvoice.paymentInstructionsAr,
      paymentInstructionsEn: editingInvoice.paymentInstructionsEn,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    saveInvoice(updated);
    showToast(
      isCreating
        ? isAr
          ? 'تم إنشاء الفاتورة بنجاح'
          : 'Invoice created successfully'
        : isAr
        ? 'تم تحديث بيانات الفاتورة'
        : 'Invoice updated successfully',
      'success'
    );
    setEditingInvoice(null);
    setIsCreating(false);
  };

  const handleStatusChange = (invoiceId: string, status: InvoiceStatus) => {
    updateInvoiceStatus(invoiceId, status);
    showToast(
      isAr ? `تم تعديل حالة الفاتورة إلى: ${getStatusLabel(status, true)}` : `Invoice status updated to: ${status}`,
      'info'
    );
  };

  const confirmDelete = () => {
    if (invoiceToDelete) {
      deleteInvoice(invoiceToDelete.id);
      showToast(isAr ? 'تم حذف الفاتورة' : 'Invoice deleted', 'info');
      setInvoiceToDelete(null);
    }
  };

  const handlePrint = () => {
    if (viewingInvoice) {
      showToast(isAr ? 'جاري تجهيز أمر الطباعة...' : 'Preparing print...', 'info');
      printInvoice(viewingInvoice, settings, invoicePrintLang);
    } else {
      window.print();
    }
  };

  const handleDownload = (inv?: Invoice) => {
    const target = inv || viewingInvoice;
    if (target) {
      downloadInvoiceHtml(target, settings, invoicePrintLang);
      showToast(
        isAr ? 'تم تحميل ملف الفاتورة للطباعة وحفظ PDF بنجاح' : 'Downloaded printable invoice file successfully',
        'success'
      );
    }
  };

  const handleDirectPrint = (inv: Invoice) => {
    setViewingInvoice(inv);
    showToast(isAr ? 'جاري إرسال أمر الطباعة...' : 'Sending to printer...', 'info');
    printInvoice(inv, settings, isAr ? 'ar' : 'en');
  };

  const copyInvoiceSummary = (inv: Invoice) => {
    const lines = [
      `📄 ${isAr ? 'فاتورة' : 'Invoice'} #${inv.invoiceNumber}`,
      `👤 ${isAr ? 'العميل' : 'Client'}: ${(isAr ? inv.clientNameAr : inv.clientNameEn) || inv.clientName}`,
      inv.clientCompany ? `🏢 ${isAr ? 'الشركة' : 'Company'}: ${(isAr ? inv.clientCompanyAr : inv.clientCompanyEn) || inv.clientCompany}` : '',
      `📅 ${isAr ? 'تاريخ الإصدار' : 'Date'}: ${inv.issueDate} | ${isAr ? 'تاريخ الاستحقاق' : 'Due'}: ${inv.dueDate}`,
      `💰 ${isAr ? 'المبلغ الإجمالي' : 'Total Amount'}: ${inv.totalAmount.toLocaleString()} ${inv.currency}`,
      `📌 ${isAr ? 'الحالة' : 'Status'}: ${getStatusLabel(inv.status, isAr)}`,
      inv.paymentInstructions ? `💳 ${isAr ? 'بيانات الدفع' : 'Payment'}: ${inv.paymentInstructions}` : '',
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(lines);
    setCopiedId(inv.id);
    showToast(isAr ? 'تم نسخ ملخص الفاتورة بنجاح' : 'Invoice summary copied', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isAr ? 'مدفوعة' : 'Paid'}</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            <span>{isAr ? 'قيد الانتظار' : 'Pending'}</span>
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            <span>{isAr ? 'متأخرة' : 'Overdue'}</span>
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <FileText className="w-3 h-3" />
            <span>{isAr ? 'مسودة' : 'Draft'}</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
            <X className="w-3 h-3" />
            <span>{isAr ? 'ملغية' : 'Cancelled'}</span>
          </span>
        );
    }
  };

  const getStatusLabel = (status: InvoiceStatus, arabic: boolean) => {
    switch (status) {
      case 'paid':
        return arabic ? 'مدفوعة' : 'Paid';
      case 'pending':
        return arabic ? 'قيد الانتظار' : 'Pending';
      case 'overdue':
        return arabic ? 'متأخرة' : 'Overdue';
      case 'draft':
        return arabic ? 'مسودة' : 'Draft';
      case 'cancelled':
        return arabic ? 'ملغية' : 'Cancelled';
    }
  };

  const getCurrencySymbol = (code: string) => {
    const found = CURRENCIES.find((c) => c.code === code);
    return found ? found.symbol : code;
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="p-6 rounded-3xl bg-surface border border-stroke shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-display italic text-text-primary">
              {isAr ? 'نظام الفواتير والمطالبات المالية' : 'Invoices & Billing Management'}
            </h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#89AACC]/15 text-[#89AACC] border border-[#89AACC]/30">
              <Languages className="w-3 h-3" />
              <span>{isAr ? 'عربي / English / طباعة PDF' : 'AR/EN & Print PDF'}</span>
            </span>
          </div>
          <p className="text-xs text-muted">
            {isAr
              ? 'إنشاء وإصدار فواتير برمجية احترافية للعملاء، متابعة التحصيل، وطباعتها بصيغة PDF باللغتين.'
              : 'Create, manage, and print professional invoices for software engineering clients in multiple currencies.'}
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="px-5 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إنشاء فاتورة جديدة' : 'Create New Invoice'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-stroke">
          <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1">
            {isAr ? 'إجمالي الفواتير' : 'Total Invoices'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-text-primary">{totalInvoicesCount}</span>
            <span className="text-xs font-mono text-[#89AACC]">{isAr ? 'فاتورة مسجلة' : 'Recorded'}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-stroke">
          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
            {isAr ? 'المبالغ المحصلة (مدفوعة)' : 'Total Collected (Paid)'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-400">${totalPaidUSD.toLocaleString()}</span>
            <span className="text-xs font-mono text-muted">{paidInvoicesCount} {isAr ? 'فواتير' : 'invoices'}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-stroke">
          <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
            {isAr ? 'مستحقات قيد الانتظار' : 'Pending Receivables'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-400">${totalPendingUSD.toLocaleString()}</span>
            <span className="text-xs font-mono text-muted">{pendingInvoicesCount} {isAr ? 'فواتير' : 'pending'}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-stroke">
          <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1">
            {isAr ? 'العملات المدعومة' : 'Currencies'}
          </span>
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            {CURRENCIES.map((c) => (
              <span key={c.code} className="px-2 py-0.5 rounded text-[10px] font-mono bg-bg border border-stroke text-muted">
                {c.code}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-stroke flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث برقم الفاتورة، اسم العميل، الشركة، البريد...' : 'Search invoice #, client, company...'}
            className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-full px-4 py-2 text-xs text-text-primary placeholder:text-muted/60 focus:outline-none pl-9 rtl:pl-4 rtl:pr-9"
          />
          <Search className="w-3.5 h-3.5 text-muted absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-bg border border-stroke rounded-full px-3.5 py-2 text-xs text-text-primary focus:outline-none cursor-pointer"
          >
            <option value="all">{isAr ? 'جميع الحالات' : 'All Status'}</option>
            <option value="paid">{isAr ? 'مدفوعة فقط 🟢' : 'Paid Only 🟢'}</option>
            <option value="pending">{isAr ? 'قيد الانتظار 🟡' : 'Pending Only 🟡'}</option>
            <option value="overdue">{isAr ? 'متأخرة 🔴' : 'Overdue Only 🔴'}</option>
            <option value="draft">{isAr ? 'مسودات ⚪' : 'Drafts Only ⚪'}</option>
          </select>

          <select
            value={filterCurrency}
            onChange={(e) => setFilterCurrency(e.target.value)}
            className="bg-bg border border-stroke rounded-full px-3.5 py-2 text-xs text-text-primary focus:outline-none cursor-pointer"
          >
            <option value="all">{isAr ? 'جميع العملات' : 'All Currencies'}</option>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {isAr ? c.labelAr : c.labelEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Invoices List / Table */}
      {filteredInvoices.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-surface border border-stroke text-muted">
          <p className="text-sm">{isAr ? 'لا توجد فواتير مطابقة للبحث المحدد' : 'No invoices match your query'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInvoices.map((inv) => {
            const displayClientName = (isAr ? inv.clientNameAr : inv.clientNameEn) || inv.clientName;
            const displayCompany = (isAr ? inv.clientCompanyAr : inv.clientCompanyEn) || inv.clientCompany;

            return (
              <div
                key={inv.id}
                className="p-5 sm:p-6 rounded-3xl bg-surface border border-stroke hover:border-[#89AACC]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                {/* Left: Invoice Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-bg border border-stroke flex items-center justify-center text-[#89AACC] font-mono font-bold text-sm shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-bold font-mono text-text-primary">{inv.invoiceNumber}</span>
                      {getStatusBadge(inv.status)}
                      <span className="text-xs font-mono text-muted">
                        {inv.items.length} {isAr ? 'بنود' : 'items'}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-text-primary flex items-center gap-2">
                      <span>{displayClientName}</span>
                      {displayCompany && (
                        <>
                          <span className="text-muted font-normal">•</span>
                          <span className="text-xs font-normal text-muted">{displayCompany}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-muted flex-wrap">
                      <span>
                        {isAr ? 'الإصدار:' : 'Issued:'} {inv.issueDate}
                      </span>
                      <span>•</span>
                      <span>
                        {isAr ? 'الاستحقاق:' : 'Due:'} {inv.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Price & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-stroke/60">
                  <div className="text-start md:text-end">
                    <div className="text-lg font-bold font-mono text-text-primary">
                      {inv.totalAmount.toLocaleString()} {getCurrencySymbol(inv.currency)}
                    </div>
                    <span className="text-[11px] font-mono text-muted">
                      {inv.currency} {inv.discountPercentage ? `(-${inv.discountPercentage}%)` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* View Modal Button */}
                    <button
                      onClick={() => setViewingInvoice(inv)}
                      className="p-2 rounded-full bg-bg hover:bg-stroke/60 text-text-primary border border-stroke transition-colors cursor-pointer"
                      title={isAr ? 'معاينة الفاتورة' : 'View Invoice'}
                    >
                      <Eye className="w-4 h-4 text-[#89AACC]" />
                    </button>

                    {/* Direct Print Button */}
                    <button
                      onClick={() => handleDirectPrint(inv)}
                      className="p-2 rounded-full bg-bg hover:bg-stroke/60 text-text-primary border border-stroke transition-colors cursor-pointer"
                      title={isAr ? 'طباعة الفاتورة' : 'Print Invoice'}
                    >
                      <Printer className="w-4 h-4 text-emerald-400" />
                    </button>

                    {/* Download Printable Invoice File */}
                    <button
                      onClick={() => handleDownload(inv)}
                      className="p-2 rounded-full bg-bg hover:bg-stroke/60 text-text-primary border border-stroke transition-colors cursor-pointer"
                      title={isAr ? 'تحميل ملف الفاتورة للطباعة / PDF' : 'Download Printable Invoice HTML/PDF'}
                    >
                      <Download className="w-4 h-4 text-[#89AACC]" />
                    </button>

                    {/* Copy Summary */}
                    <button
                      onClick={() => copyInvoiceSummary(inv)}
                      className="p-2 rounded-full bg-bg hover:bg-stroke/60 text-text-primary border border-stroke transition-colors cursor-pointer"
                      title={isAr ? 'نسخ ملخص الفاتورة' : 'Copy Invoice Summary'}
                    >
                      {copiedId === inv.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-muted" />}
                    </button>

                    {/* Status Dropdown */}
                    <select
                      value={inv.status}
                      onChange={(e) => handleStatusChange(inv.id, e.target.value as InvoiceStatus)}
                      className="bg-bg border border-stroke rounded-full px-2.5 py-1.5 text-xs text-text-primary focus:outline-none cursor-pointer hidden sm:block"
                    >
                      <option value="paid">{isAr ? 'مدفوعة' : 'Paid'}</option>
                      <option value="pending">{isAr ? 'قيد الانتظار' : 'Pending'}</option>
                      <option value="overdue">{isAr ? 'متأخرة' : 'Overdue'}</option>
                      <option value="draft">{isAr ? 'مسودة' : 'Draft'}</option>
                      <option value="cancelled">{isAr ? 'ملغية' : 'Cancelled'}</option>
                    </select>

                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(inv)}
                      className="p-2 rounded-full bg-bg hover:bg-stroke/60 text-text-primary border border-stroke transition-colors cursor-pointer"
                      title={isAr ? 'تعديل الفاتورة' : 'Edit Invoice'}
                    >
                      <Edit2 className="w-4 h-4 text-[#89AACC]" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setInvoiceToDelete(inv)}
                      className="p-2 rounded-full hover:bg-rose-500/10 text-muted hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-colors cursor-pointer"
                      title={isAr ? 'حذف الفاتورة' : 'Delete Invoice'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT INVOICE MODAL */}
      <AnimatePresence>
        {editingInvoice && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="w-full max-w-4xl bg-surface border border-stroke rounded-3xl p-6 sm:p-8 shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-stroke">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#89AACC]" />
                  <h3 className="text-lg font-display italic text-text-primary font-semibold">
                    {isCreating
                      ? isAr
                        ? 'إنشاء فاتورة برمجية جديدة'
                        : 'Create New Engineering Invoice'
                      : isAr
                      ? `تعديل الفاتورة: ${editingInvoice.invoiceNumber}`
                      : `Edit Invoice: ${editingInvoice.invoiceNumber}`}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingInvoice(null)}
                  className="p-1.5 rounded-full hover:bg-bg text-muted hover:text-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Navigation Tabs */}
              <div className="flex items-center gap-2 p-1.5 bg-bg rounded-2xl border border-stroke mb-6 max-w-lg">
                <button
                  type="button"
                  onClick={() => setFormTab('details')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    formTab === 'details'
                      ? 'bg-text-primary text-bg font-semibold shadow'
                      : 'text-muted hover:text-text-primary'
                  }`}
                >
                  <span>1. {isAr ? 'البيانات الأساسية' : 'Main Details'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormTab('ar')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    formTab === 'ar'
                      ? 'bg-text-primary text-bg font-semibold shadow'
                      : 'text-muted hover:text-text-primary'
                  }`}
                >
                  <span>🇸🇦 {isAr ? 'بيانات العميل (عربي)' : 'Client (Arabic)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormTab('en')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    formTab === 'en'
                      ? 'bg-text-primary text-bg font-semibold shadow'
                      : 'text-muted hover:text-text-primary'
                  }`}
                >
                  <span>🇬🇧 {isAr ? 'بيانات العميل (إنجليزي)' : 'Client (English)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormTab('items')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    formTab === 'items'
                      ? 'bg-text-primary text-bg font-semibold shadow'
                      : 'text-muted hover:text-text-primary'
                  }`}
                >
                  <span>2. {isAr ? 'البنود والحسابات' : 'Line Items'}</span>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                {/* 1. GENERAL DETAILS */}
                {formTab === 'details' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          {isAr ? 'رقم الفاتورة *' : 'Invoice Number *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={editingInvoice.invoiceNumber}
                          onChange={(e) => setEditingInvoice({ ...editingInvoice, invoiceNumber: e.target.value })}
                          placeholder="INV-2026-001"
                          dir="ltr"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary font-mono focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          {isAr ? 'العملة *' : 'Currency *'}
                        </label>
                        <select
                          value={editingInvoice.currency}
                          onChange={(e) => setEditingInvoice({ ...editingInvoice, currency: e.target.value })}
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none cursor-pointer"
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {isAr ? c.labelAr : c.labelEn}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          {isAr ? 'حالة الفاتورة' : 'Invoice Status'}
                        </label>
                        <select
                          value={editingInvoice.status}
                          onChange={(e) => setEditingInvoice({ ...editingInvoice, status: e.target.value as InvoiceStatus })}
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none cursor-pointer"
                        >
                          <option value="pending">{isAr ? 'قيد الانتظار 🟡' : 'Pending 🟡'}</option>
                          <option value="paid">{isAr ? 'مدفوعة 🟢' : 'Paid 🟢'}</option>
                          <option value="overdue">{isAr ? 'متأخرة 🔴' : 'Overdue 🔴'}</option>
                          <option value="draft">{isAr ? 'مسودة ⚪' : 'Draft ⚪'}</option>
                          <option value="cancelled">{isAr ? 'ملغية ❌' : 'Cancelled ❌'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          {isAr ? 'تاريخ الإصدار' : 'Issue Date'}
                        </label>
                        <input
                          type="date"
                          value={editingInvoice.issueDate}
                          onChange={(e) => setEditingInvoice({ ...editingInvoice, issueDate: e.target.value })}
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          {isAr ? 'تاريخ الاستحقاق' : 'Due Date'}
                        </label>
                        <input
                          type="date"
                          value={editingInvoice.dueDate}
                          onChange={(e) => setEditingInvoice({ ...editingInvoice, dueDate: e.target.value })}
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        {isAr ? 'البريد الإلكتروني للعميل' : 'Client Email Address'}
                      </label>
                      <input
                        type="email"
                        value={editingInvoice.clientEmail}
                        onChange={(e) => setEditingInvoice({ ...editingInvoice, clientEmail: e.target.value })}
                        placeholder="client@company.com"
                        dir="ltr"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 2. ARABIC CLIENT DATA */}
                {formTab === 'ar' && (
                  <div className="space-y-4" dir="rtl">
                    <div className="p-3.5 rounded-2xl bg-[#89AACC]/10 border border-[#89AACC]/20 text-xs text-[#89AACC] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>تظهر هذه الحقول عند طباعة أو إرسال الفاتورة بالعربية.</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          اسم العميل بالعربية *
                        </label>
                        <input
                          type="text"
                          value={editingInvoice.clientNameAr || ''}
                          onChange={(e) => setEditingInvoice({ ...editingInvoice, clientNameAr: e.target.value })}
                          placeholder="مثال: أحمد منصور"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          اسم الشركة / المؤسسة بالعربية
                        </label>
                        <input
                          type="text"
                          value={editingInvoice.clientCompanyAr || ''}
                          onChange={(e) => setEditingInvoice({ ...editingInvoice, clientCompanyAr: e.target.value })}
                          placeholder="مثال: شركة الحلول الرقمية"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none text-right"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        عنوان العميل / الرقم الضريبي بالعربية
                      </label>
                      <input
                        type="text"
                        value={editingInvoice.clientAddressAr || ''}
                        onChange={(e) => setEditingInvoice({ ...editingInvoice, clientAddressAr: e.target.value })}
                        placeholder="مثال: الرياض، المملكة العربية السعودية - الرقم الضريبي: 3000..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        تعليمات الدفع والتحويل البنكي بالعربية
                      </label>
                      <textarea
                        rows={2}
                        value={editingInvoice.paymentInstructionsAr || ''}
                        onChange={(e) => setEditingInvoice({ ...editingInvoice, paymentInstructionsAr: e.target.value })}
                        placeholder="التحويل البنكي المباشر (IBAN: SA...) أو حساب PayPal..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        ملاحظات وشروط الفاتورة بالعربية
                      </label>
                      <textarea
                        rows={2}
                        value={editingInvoice.notesAr || ''}
                        onChange={(e) => setEditingInvoice({ ...editingInvoice, notesAr: e.target.value })}
                        placeholder="شكراً لتعاملكم معنا. الدفع مستحق خلال 14 يوماً من تاريخ الإصدار..."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y text-right"
                      />
                    </div>
                  </div>
                )}

                {/* 3. ENGLISH CLIENT DATA */}
                {formTab === 'en' && (
                  <div className="space-y-4" dir="ltr">
                    <div className="p-3.5 rounded-2xl bg-[#89AACC]/10 border border-[#89AACC]/20 text-xs text-[#89AACC] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>These fields will be displayed when printing or generating English invoices.</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          Client Name in English *
                        </label>
                        <input
                          type="text"
                          value={editingInvoice.clientNameEn || ''}
                          onChange={(e) => setEditingInvoice({ ...editingInvoice, clientNameEn: e.target.value })}
                          placeholder="e.g. Ahmed Mansour"
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                          Company / Organization in English
                        </label>
                        <input
                          type="text"
                          value={editingInvoice.clientCompanyEn || ''}
                          onChange={(e) => setEditingInvoice({ ...editingInvoice, clientCompanyEn: e.target.value })}
                          placeholder="e.g. Digital Solutions Inc."
                          className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-sm text-text-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        Client Address / Tax ID in English
                      </label>
                      <input
                        type="text"
                        value={editingInvoice.clientAddressEn || ''}
                        onChange={(e) => setEditingInvoice({ ...editingInvoice, clientAddressEn: e.target.value })}
                        placeholder="e.g. 100 Innovation Way, Suite 400, New York, NY"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl px-4 py-2.5 text-xs text-text-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        Payment Instructions in English
                      </label>
                      <textarea
                        rows={2}
                        value={editingInvoice.paymentInstructionsEn || ''}
                        onChange={(e) => setEditingInvoice({ ...editingInvoice, paymentInstructionsEn: e.target.value })}
                        placeholder="Direct Wire Transfer (IBAN / SWIFT) or PayPal: abualss3ud@gmail.com"
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
                        Notes & Terms in English
                      </label>
                      <textarea
                        rows={2}
                        value={editingInvoice.notesEn || ''}
                        onChange={(e) => setEditingInvoice({ ...editingInvoice, notesEn: e.target.value })}
                        placeholder="Thank you for your business. Payment is due within 14 days."
                        className="w-full bg-bg border border-stroke focus:border-[#89AACC] rounded-2xl p-3 text-xs text-text-primary focus:outline-none resize-y"
                      />
                    </div>
                  </div>
                )}

                {/* 4. LINE ITEMS & FINANCIALS */}
                {formTab === 'items' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-stroke">
                      <span className="text-xs font-mono text-muted uppercase tracking-wider">
                        {isAr ? 'بنود الخدمات والتطوير' : 'Invoice Line Items'}
                      </span>

                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="px-3 py-1.5 rounded-full bg-bg hover:bg-stroke/60 border border-stroke text-xs font-medium text-[#89AACC] hover:text-text-primary flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAr ? 'إضافة بند' : 'Add Item'}</span>
                      </button>
                    </div>

                    {/* Items table / cards */}
                    <div className="space-y-3">
                      {editingInvoice.items.map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-bg border border-stroke space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-mono text-muted">
                              #{idx + 1}
                            </span>
                            {editingInvoice.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-1 rounded-full text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title={isAr ? 'حذف البند' : 'Remove Item'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-mono text-muted mb-1">
                                {isAr ? 'وصف البند بالعربية' : 'Item Description (Arabic)'}
                              </label>
                              <input
                                type="text"
                                value={item.descriptionAr || ''}
                                onChange={(e) => handleItemChange(item.id, 'descriptionAr', e.target.value)}
                                placeholder="مثال: تطوير واجهات المستخدم في React"
                                className="w-full bg-surface border border-stroke rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none text-right"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-mono text-muted mb-1">
                                {isAr ? 'وصف البند بالإنجليزية' : 'Item Description (English)'}
                              </label>
                              <input
                                type="text"
                                value={item.descriptionEn || item.description || ''}
                                onChange={(e) => handleItemChange(item.id, 'descriptionEn', e.target.value)}
                                placeholder="e.g. React Frontend UI Engineering"
                                className="w-full bg-surface border border-stroke rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 pt-1">
                            <div>
                              <label className="block text-[11px] font-mono text-muted mb-1">
                                {isAr ? 'الكمية' : 'Qty'}
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                className="w-full bg-surface border border-stroke rounded-xl px-3 py-1.5 text-xs text-text-primary font-mono focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-mono text-muted mb-1">
                                {isAr ? 'سعر الوحدة' : 'Unit Price'}
                              </label>
                              <input
                                type="number"
                                min="0"
                                value={item.unitPrice}
                                onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                                className="w-full bg-surface border border-stroke rounded-xl px-3 py-1.5 text-xs text-text-primary font-mono focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-mono text-muted mb-1">
                                {isAr ? 'الإجمالي' : 'Total'}
                              </label>
                              <div className="w-full bg-surface/60 border border-stroke/80 rounded-xl px-3 py-1.5 text-xs font-bold font-mono text-text-primary">
                                {item.total.toLocaleString()} {getCurrencySymbol(editingInvoice.currency)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Financial Summary Controls */}
                    <div className="p-4 rounded-2xl bg-surface border border-stroke space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-muted mb-1">
                            {isAr ? 'نسبة الخصم (%)' : 'Discount Percentage (%)'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editingInvoice.discountPercentage || 0}
                            onChange={(e) =>
                              recalculateTotals(
                                editingInvoice,
                                editingInvoice.items,
                                Number(e.target.value) || 0,
                                editingInvoice.taxPercentage || 0
                              )
                            }
                            className="w-full bg-bg border border-stroke rounded-xl px-3 py-2 text-xs font-mono text-text-primary focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-muted mb-1">
                            {isAr ? 'نسبة الضريبة / VAT (%)' : 'Tax / VAT Percentage (%)'}
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editingInvoice.taxPercentage || 0}
                            onChange={(e) =>
                              recalculateTotals(
                                editingInvoice,
                                editingInvoice.items,
                                editingInvoice.discountPercentage || 0,
                                Number(e.target.value) || 0
                              )
                            }
                            className="w-full bg-bg border border-stroke rounded-xl px-3 py-2 text-xs font-mono text-text-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Calculations breakdown */}
                      <div className="pt-3 border-t border-stroke/60 flex flex-col gap-1.5 text-xs font-mono">
                        <div className="flex justify-between text-muted">
                          <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                          <span>{editingInvoice.subtotal.toLocaleString()} {editingInvoice.currency}</span>
                        </div>

                        {editingInvoice.discountPercentage ? (
                          <div className="flex justify-between text-emerald-400">
                            <span>{isAr ? `خصم (${editingInvoice.discountPercentage}%):` : `Discount (${editingInvoice.discountPercentage}%):`}</span>
                            <span>- {((editingInvoice.subtotal * editingInvoice.discountPercentage) / 100).toLocaleString()} {editingInvoice.currency}</span>
                          </div>
                        ) : null}

                        {editingInvoice.taxPercentage ? (
                          <div className="flex justify-between text-muted">
                            <span>{isAr ? `ضريبة (${editingInvoice.taxPercentage}%):` : `Tax (${editingInvoice.taxPercentage}%):`}</span>
                            <span>+ {(((editingInvoice.subtotal - (editingInvoice.subtotal * (editingInvoice.discountPercentage || 0)) / 100) * editingInvoice.taxPercentage) / 100).toLocaleString()} {editingInvoice.currency}</span>
                          </div>
                        ) : null}

                        <div className="flex justify-between text-base font-bold text-text-primary pt-2 border-t border-stroke/60">
                          <span>{isAr ? 'المبلغ الإجمالي المستحق:' : 'Total Payable Amount:'}</span>
                          <span className="text-[#89AACC]">{editingInvoice.totalAmount.toLocaleString()} {getCurrencySymbol(editingInvoice.currency)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal Footer Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-stroke">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormTab(
                          formTab === 'details'
                            ? 'ar'
                            : formTab === 'ar'
                            ? 'en'
                            : formTab === 'en'
                            ? 'items'
                            : 'details'
                        )
                      }
                      className="text-xs text-muted hover:text-text-primary flex items-center gap-1 font-mono transition-colors cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#89AACC]" />
                      <span>{isAr ? 'الانتقال للتبويب التالي' : 'Next Step'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingInvoice(null)}
                      className="px-5 py-2.5 rounded-full bg-surface hover:bg-stroke/60 border border-stroke text-xs font-medium text-text-primary transition-colors cursor-pointer"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      {isAr ? 'حفظ الفاتورة' : 'Save Invoice'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW & PRINT MODAL */}
      <AnimatePresence>
        {viewingInvoice && (
          <div className="fixed inset-0 z-[9995] flex items-center justify-center p-2 sm:p-4 md:p-8 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-4xl bg-surface border border-stroke rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col print:border-none print:shadow-none print:max-w-none print:w-full print:rounded-none print:bg-white print:text-black"
            >
              {/* Modal Top Toolbar (Hidden in Print) */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-stroke bg-surface print:hidden shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#89AACC]" />
                  <span className="text-sm font-mono font-bold text-text-primary">
                    {viewingInvoice.invoiceNumber}
                  </span>
                  {getStatusBadge(viewingInvoice.status)}
                </div>

                <div className="flex items-center gap-2">
                  {/* Print Language Toggle */}
                  <div className="flex items-center bg-bg rounded-full border border-stroke p-0.5 text-xs font-mono">
                    <button
                      onClick={() => setInvoicePrintLang('ar')}
                      className={`px-2.5 py-1 rounded-full cursor-pointer ${invoicePrintLang === 'ar' ? 'bg-text-primary text-bg font-bold' : 'text-muted'}`}
                    >
                      عربي
                    </button>
                    <button
                      onClick={() => setInvoicePrintLang('en')}
                      className={`px-2.5 py-1 rounded-full cursor-pointer ${invoicePrintLang === 'en' ? 'bg-text-primary text-bg font-bold' : 'text-muted'}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setInvoicePrintLang('bilingual')}
                      className={`px-2.5 py-1 rounded-full cursor-pointer ${invoicePrintLang === 'bilingual' ? 'bg-text-primary text-bg font-bold' : 'text-muted'}`}
                    >
                      ثنائي AR/EN
                    </button>
                  </div>

                  <button
                    onClick={handlePrint}
                    className="px-4 py-1.5 rounded-full bg-text-primary text-bg hover:bg-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow"
                    title={isAr ? 'إرسال أمر الطباعة المباشر' : 'Send Direct Print'}
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAr ? 'طباعة' : 'Print'}</span>
                  </button>

                  <button
                    onClick={() => handleDownload()}
                    className="px-4 py-1.5 rounded-full bg-surface hover:bg-stroke/80 border border-stroke text-text-primary text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow"
                    title={isAr ? 'تحميل ملف الفاتورة للطباعة وحفظ PDF' : 'Download Invoice HTML/PDF'}
                  >
                    <Download className="w-3.5 h-3.5 text-[#89AACC]" />
                    <span>{isAr ? 'تنزيل PDF / HTML' : 'Download PDF/HTML'}</span>
                  </button>

                  <button
                    onClick={() => setViewingInvoice(null)}
                    className="p-1.5 rounded-full hover:bg-bg text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PRINTABLE INVOICE PAPER CANVAS */}
              <div
                id="printable-invoice"
                className={`p-6 sm:p-10 md:p-12 overflow-y-auto flex-1 bg-surface print:bg-white print:text-black print:p-8 ${
                  invoicePrintLang === 'ar' ? 'rtl text-right' : invoicePrintLang === 'en' ? 'ltr text-left' : ''
                }`}
                dir={invoicePrintLang === 'ar' ? 'rtl' : 'ltr'}
              >
                {/* 1. Header: Brand Monogram & Invoice Details */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-stroke/80 print:border-black/20">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-bg border border-stroke p-0.5 shrink-0 print:border-black/20">
                      <img
                        src="https://res.cloudinary.com/oe19gniu/image/upload/v1790271150/WhatsApp_Image_2026-09-22_at_5.36.09_PM.jpg"
                        alt="Mohamed Abu Al-Saud"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-text-primary print:text-black font-display italic">
                        {settings.fullName || 'Mohamed Abu Al-Saud'}
                      </h1>
                      <p className="text-xs font-mono text-muted print:text-gray-600">
                        {invoicePrintLang === 'ar' ? 'مطور Full-Stack ومصمم تجارب مستخدم UI/UX' : 'Full-Stack Developer & UI/UX Designer'}
                      </p>
                      <p className="text-[11px] font-mono text-muted print:text-gray-600">
                        {settings.email || 'abualss3ud@gmail.com'} · {invoicePrintLang === 'ar' ? 'قنا، مصر' : 'Qena, Egypt'}
                      </p>
                    </div>
                  </div>

                  <div className="text-start sm:text-end font-mono">
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-bg print:bg-gray-100 border border-stroke print:border-gray-300 text-text-primary print:text-black mb-2">
                      {invoicePrintLang === 'ar' ? 'فاتورة ضريبية / مهنية' : 'Tax & Engineering Invoice'}
                    </div>
                    <div className="text-lg font-bold text-text-primary print:text-black">{viewingInvoice.invoiceNumber}</div>
                    <div className="text-xs text-muted print:text-gray-600">
                      {invoicePrintLang === 'ar' ? 'تاريخ الإصدار:' : 'Issued:'} {viewingInvoice.issueDate}
                    </div>
                    <div className="text-xs text-muted print:text-gray-600">
                      {invoicePrintLang === 'ar' ? 'تاريخ الاستحقاق:' : 'Due Date:'} {viewingInvoice.dueDate}
                    </div>
                  </div>
                </div>

                {/* 2. Client & Payee Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-stroke/80 print:border-black/20 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted print:text-gray-500 block mb-1">
                      {invoicePrintLang === 'ar' ? 'فاتورة إلى (العميل):' : 'Billed To (Client):'}
                    </span>
                    <div className="text-sm font-bold text-text-primary print:text-black">
                      {invoicePrintLang === 'ar'
                        ? viewingInvoice.clientNameAr || viewingInvoice.clientName
                        : viewingInvoice.clientNameEn || viewingInvoice.clientName}
                    </div>
                    {(viewingInvoice.clientCompanyAr || viewingInvoice.clientCompanyEn || viewingInvoice.clientCompany) && (
                      <div className="text-muted print:text-gray-700 font-medium">
                        {invoicePrintLang === 'ar'
                          ? viewingInvoice.clientCompanyAr || viewingInvoice.clientCompany
                          : viewingInvoice.clientCompanyEn || viewingInvoice.clientCompany}
                      </div>
                    )}
                    {viewingInvoice.clientEmail && (
                      <div className="text-muted print:text-gray-600 font-mono">{viewingInvoice.clientEmail}</div>
                    )}
                    {(viewingInvoice.clientAddressAr || viewingInvoice.clientAddressEn || viewingInvoice.clientAddress) && (
                      <div className="text-muted print:text-gray-600">
                        {invoicePrintLang === 'ar'
                          ? viewingInvoice.clientAddressAr || viewingInvoice.clientAddress
                          : viewingInvoice.clientAddressEn || viewingInvoice.clientAddress}
                      </div>
                    )}
                  </div>

                  <div className="sm:text-end">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted print:text-gray-500 block mb-1">
                      {invoicePrintLang === 'ar' ? 'حالة السداد والمبلغ الإجمالي:' : 'Payment Status & Amount:'}
                    </span>
                    <div className="text-2xl font-bold font-mono text-[#89AACC] print:text-black">
                      {viewingInvoice.totalAmount.toLocaleString()} {getCurrencySymbol(viewingInvoice.currency)}
                    </div>
                    <div className="mt-1">{getStatusBadge(viewingInvoice.status)}</div>
                  </div>
                </div>

                {/* 3. Line Items Table */}
                <div className="py-6">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-stroke print:border-black text-muted print:text-gray-600 font-mono uppercase tracking-wider">
                        <th className="py-3 px-2 text-start font-semibold">{invoicePrintLang === 'ar' ? '#' : '#'}</th>
                        <th className="py-3 px-2 text-start font-semibold">{invoicePrintLang === 'ar' ? 'بيان البند والخدمة' : 'Description'}</th>
                        <th className="py-3 px-2 text-center font-semibold">{invoicePrintLang === 'ar' ? 'الكمية' : 'Qty'}</th>
                        <th className="py-3 px-2 text-end font-semibold">{invoicePrintLang === 'ar' ? 'سعر الوحدة' : 'Unit Price'}</th>
                        <th className="py-3 px-2 text-end font-semibold">{invoicePrintLang === 'ar' ? 'المجموع' : 'Total'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stroke/60 print:divide-gray-200">
                      {viewingInvoice.items.map((item, idx) => {
                        const itemDesc =
                          invoicePrintLang === 'ar'
                            ? item.descriptionAr || item.description
                            : invoicePrintLang === 'en'
                            ? item.descriptionEn || item.description
                            : `${item.descriptionAr || item.description} / ${item.descriptionEn || item.description}`;

                        return (
                          <tr key={item.id} className="text-text-primary print:text-black">
                            <td className="py-4 px-2 font-mono text-muted print:text-gray-500">{idx + 1}</td>
                            <td className="py-4 px-2">
                              <span className="font-semibold block">{itemDesc}</span>
                            </td>
                            <td className="py-4 px-2 text-center font-mono">{item.quantity}</td>
                            <td className="py-4 px-2 text-end font-mono">
                              {item.unitPrice.toLocaleString()} {viewingInvoice.currency}
                            </td>
                            <td className="py-4 px-2 text-end font-mono font-bold">
                              {item.total.toLocaleString()} {viewingInvoice.currency}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 4. Financial Calculation Summary */}
                <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-stroke print:border-black">
                  {/* Left Notes & Instructions */}
                  <div className="flex-1 space-y-3 text-xs">
                    {(viewingInvoice.paymentInstructionsAr || viewingInvoice.paymentInstructionsEn || viewingInvoice.paymentInstructions) && (
                      <div className="p-3.5 rounded-2xl bg-bg print:bg-gray-50 border border-stroke print:border-gray-200">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted print:text-gray-600 block mb-1">
                          {invoicePrintLang === 'ar' ? 'بيانات التحويل وطرق الدفع:' : 'Payment Details & Instructions:'}
                        </span>
                        <p className="font-mono text-text-primary print:text-black leading-relaxed whitespace-pre-line">
                          {invoicePrintLang === 'ar'
                            ? viewingInvoice.paymentInstructionsAr || viewingInvoice.paymentInstructions
                            : viewingInvoice.paymentInstructionsEn || viewingInvoice.paymentInstructions}
                        </p>
                      </div>
                    )}

                    {(viewingInvoice.notesAr || viewingInvoice.notesEn || viewingInvoice.notes) && (
                      <div className="text-muted print:text-gray-600 text-xs leading-relaxed">
                        <span className="font-semibold block mb-0.5">
                          {invoicePrintLang === 'ar' ? 'ملاحظات:' : 'Notes:'}
                        </span>
                        <p>
                          {invoicePrintLang === 'ar'
                            ? viewingInvoice.notesAr || viewingInvoice.notes
                            : viewingInvoice.notesEn || viewingInvoice.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Totals Box */}
                  <div className="w-full sm:w-72 p-4 rounded-2xl bg-bg print:bg-gray-50 border border-stroke print:border-gray-200 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-muted print:text-gray-600">
                      <span>{invoicePrintLang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                      <span>{viewingInvoice.subtotal.toLocaleString()} {viewingInvoice.currency}</span>
                    </div>

                    {viewingInvoice.discountPercentage ? (
                      <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                        <span>{invoicePrintLang === 'ar' ? `الخصم (${viewingInvoice.discountPercentage}%):` : `Discount (${viewingInvoice.discountPercentage}%):`}</span>
                        <span>- {((viewingInvoice.subtotal * viewingInvoice.discountPercentage) / 100).toLocaleString()} {viewingInvoice.currency}</span>
                      </div>
                    ) : null}

                    {viewingInvoice.taxPercentage ? (
                      <div className="flex justify-between text-muted print:text-gray-600">
                        <span>{invoicePrintLang === 'ar' ? `الضريبة (${viewingInvoice.taxPercentage}%):` : `Tax (${viewingInvoice.taxPercentage}%):`}</span>
                        <span>+ {(((viewingInvoice.subtotal - (viewingInvoice.subtotal * (viewingInvoice.discountPercentage || 0)) / 100) * viewingInvoice.taxPercentage) / 100).toLocaleString()} {viewingInvoice.currency}</span>
                      </div>
                    ) : null}

                    <div className="flex justify-between text-base font-bold text-text-primary print:text-black pt-2 border-t border-stroke print:border-gray-300">
                      <span>{invoicePrintLang === 'ar' ? 'الإجمالي المستحق:' : 'Total Due:'}</span>
                      <span className="text-[#89AACC] print:text-black">
                        {viewingInvoice.totalAmount.toLocaleString()} {getCurrencySymbol(viewingInvoice.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Signature & Stamp */}
                <div className="mt-12 pt-6 border-t border-stroke/60 print:border-gray-300 flex items-center justify-between text-[11px] font-mono text-muted print:text-gray-500">
                  <span>© {new Date().getFullYear()} Mohamed Abu Al-Saud · All Rights Reserved</span>
                  <span>Invoice Reference: {viewingInvoice.invoiceNumber}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(invoiceToDelete)}
        title={isAr ? 'حذف هذه الفاتورة؟' : 'Delete this invoice?'}
        message={
          isAr
            ? 'هل أنت متأكد من رغبتك في حذف سجل هذه الفاتورة نهائياً؟'
            : 'Are you sure you want to delete this invoice record permanently?'
        }
        itemTitle={invoiceToDelete?.invoiceNumber}
        onConfirm={confirmDelete}
        onCancel={() => setInvoiceToDelete(null)}
      />
    </div>
  );
};
