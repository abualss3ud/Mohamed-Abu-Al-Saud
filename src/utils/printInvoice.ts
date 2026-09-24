import { Invoice, SiteSettings } from '../types';

export const generateInvoiceHtml = (
  invoice: Invoice,
  settings: SiteSettings,
  lang: 'ar' | 'en' | 'bilingual' = 'ar'
): string => {
  const isAr = lang === 'ar' || lang === 'bilingual';
  const isEn = lang === 'en';
  const isBilingual = lang === 'bilingual';

  const clientName = isAr
    ? invoice.clientNameAr || invoice.clientName
    : invoice.clientNameEn || invoice.clientName;

  const clientCompany = isAr
    ? invoice.clientCompanyAr || invoice.clientCompany
    : invoice.clientCompanyEn || invoice.clientCompany;

  const clientAddress = isAr
    ? invoice.clientAddressAr || invoice.clientAddress
    : invoice.clientAddressEn || invoice.clientAddress;

  const paymentInstructions = isAr
    ? invoice.paymentInstructionsAr || invoice.paymentInstructions
    : invoice.paymentInstructionsEn || invoice.paymentInstructions;

  const notes = isAr
    ? invoice.notesAr || invoice.notes
    : invoice.notesEn || invoice.notes;

  const getStatusText = () => {
    switch (invoice.status) {
      case 'paid':
        return isAr ? 'مدفوعة (PAID)' : 'PAID';
      case 'pending':
        return isAr ? 'قيد الانتظار (PENDING)' : 'PENDING';
      case 'overdue':
        return isAr ? 'متأخرة السداد (OVERDUE)' : 'OVERDUE';
      case 'draft':
        return isAr ? 'مسودة (DRAFT)' : 'DRAFT';
      case 'cancelled':
        return isAr ? 'ملغية (CANCELLED)' : 'CANCELLED';
      default:
        return String(invoice.status || '').toUpperCase();
    }
  };

  const getStatusColor = () => {
    switch (invoice.status) {
      case 'paid':
        return '#059669';
      case 'pending':
        return '#d97706';
      case 'overdue':
        return '#dc2626';
      default:
        return '#4b5563';
    }
  };

  const rows = invoice.items
    .map((item, idx) => {
      const desc =
        isBilingual
          ? `${item.descriptionAr || item.description} <br/><span style="color:#6b7280; font-size:12px;">${item.descriptionEn || item.description}</span>`
          : isAr
          ? item.descriptionAr || item.description
          : item.descriptionEn || item.description;

      return `
        <tr>
          <td style="padding: 12px 10px; border-bottom: 1px solid #e5e7eb; font-family: monospace; color: #6b7280;">${idx + 1}</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #111827;">${desc}</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #e5e7eb; text-align: center; font-family: monospace;">${item.quantity}</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #e5e7eb; text-align: ${isAr ? 'left' : 'right'}; font-family: monospace;">${item.unitPrice.toLocaleString()} ${invoice.currency}</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #e5e7eb; text-align: ${isAr ? 'left' : 'right'}; font-family: monospace; font-weight: 700; color: #111827;">${item.total.toLocaleString()} ${invoice.currency}</td>
        </tr>
      `;
    })
    .join('');

  const discountAmount = invoice.discountPercentage
    ? (invoice.subtotal * invoice.discountPercentage) / 100
    : 0;
  const taxable = invoice.subtotal - discountAmount;
  const taxAmount = invoice.taxPercentage ? (taxable * invoice.taxPercentage) / 100 : 0;

  return `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${isAr ? 'فاتورة' : 'Invoice'} ${invoice.invoiceNumber} - ${settings.fullName || 'Mohamed Abu Al-Saud'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: ${isAr ? "'Cairo', sans-serif" : "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"};
      color: #1f2937;
      background: #ffffff;
      padding: 24px;
      max-width: 860px;
      margin: 0 auto;
      line-height: 1.5;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 24px;
      border-bottom: 2px solid #f3f4f6;
      gap: 20px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand img {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      object-fit: cover;
      border: 1px solid #e5e7eb;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      color: #111827;
      margin-bottom: 2px;
    }
    .brand-subtitle {
      font-size: 13px;
      color: #4b5563;
      margin-bottom: 2px;
    }
    .brand-contact {
      font-size: 12px;
      color: #6b7280;
      font-family: monospace;
    }
    .invoice-meta {
      text-align: ${isAr ? 'left' : 'right'};
      font-family: monospace;
    }
    .invoice-tag {
      display: inline-block;
      padding: 4px 12px;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .invoice-num {
      font-size: 18px;
      font-weight: 800;
      color: #111827;
      margin-bottom: 4px;
    }
    .invoice-date {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 2px;
    }
    .details-grid {
      display: flex;
      justify-content: space-between;
      padding: 20px 0;
      border-bottom: 2px solid #f3f4f6;
      gap: 20px;
    }
    .client-card {
      flex: 1;
    }
    .status-card {
      text-align: ${isAr ? 'left' : 'right'};
    }
    .label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 6px;
    }
    .client-name {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 2px;
    }
    .client-company {
      font-size: 13px;
      color: #374151;
      font-weight: 600;
      margin-bottom: 2px;
    }
    .client-meta {
      font-size: 12px;
      color: #6b7280;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      color: #ffffff;
      background: ${getStatusColor()};
      margin-top: 6px;
    }
    .amount-display {
      font-size: 24px;
      font-weight: 800;
      font-family: monospace;
      color: #111827;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      font-size: 13px;
    }
    th {
      background: #f9fafb;
      padding: 10px;
      text-align: ${isAr ? 'right' : 'left'};
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      color: #4b5563;
      border-bottom: 2px solid #e5e7eb;
      font-family: monospace;
    }
    .summary-section {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      padding-top: 12px;
      border-top: 2px solid #f3f4f6;
    }
    .instructions-box {
      flex: 1;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      font-size: 12px;
    }
    .instructions-box h4 {
      font-size: 11px;
      text-transform: uppercase;
      color: #4b5563;
      margin-bottom: 8px;
    }
    .instructions-box p {
      white-space: pre-line;
      color: #1f2937;
      font-family: monospace;
      line-height: 1.6;
    }
    .totals-box {
      width: 280px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      font-family: monospace;
      font-size: 13px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      color: #4b5563;
    }
    .totals-row.final {
      border-top: 2px solid #e5e7eb;
      margin-top: 8px;
      padding-top: 8px;
      font-size: 16px;
      font-weight: 800;
      color: #111827;
    }
    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #9ca3af;
      font-family: monospace;
    }
    .no-print {
      margin-bottom: 20px;
      padding: 14px 18px;
      background: #111827;
      color: #ffffff;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-btn {
      background: #ffffff;
      color: #111827;
      border: none;
      padding: 8px 18px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
    }
    @media print {
      .no-print {
        display: none !important;
      }
      body {
        padding: 0 !important;
      }
    }
  </style>
</head>
<body>
  <!-- Print Prompt Bar (Visible only in standalone preview, hidden during print) -->
  <div class="no-print">
    <div style="font-size: 13px; font-weight: 600;">
      ${isAr ? '📄 جاهز للطباعة أو الحفظ كملف PDF' : '📄 Ready to Print or Save as PDF'}
    </div>
    <button class="print-btn" onclick="window.print()">
      ${isAr ? '🖨️ طباعة الآن (Print)' : '🖨️ Print Now'}
    </button>
  </div>

  <div class="header">
    <div class="brand">
      <img src="https://res.cloudinary.com/oe19gniu/image/upload/v1790271150/WhatsApp_Image_2026-09-22_at_5.36.09_PM.jpg" alt="${settings.fullName || 'Mohamed Abu Al-Saud'}" />
      <div>
        <div class="brand-title">${settings.fullName || 'Mohamed Abu Al-Saud'}</div>
        <div class="brand-subtitle">${isAr ? 'مطور برمجيات Full-Stack & مهندس حلول رقمية' : 'Full-Stack Software Engineer & Solutions Architect'}</div>
        <div class="brand-contact">${settings.email || 'abualss3ud@gmail.com'} · ${isAr ? 'مصر' : 'Egypt'}</div>
      </div>
    </div>

    <div class="invoice-meta">
      <div class="invoice-tag">${isAr ? 'فاتورة رسمية' : 'Official Invoice'}</div>
      <div class="invoice-num">${invoice.invoiceNumber}</div>
      <div class="invoice-date">${isAr ? 'الإصدار:' : 'Issued:'} ${invoice.issueDate}</div>
      <div class="invoice-date">${isAr ? 'الاستحقاق:' : 'Due:'} ${invoice.dueDate}</div>
    </div>
  </div>

  <div class="details-grid">
    <div class="client-card">
      <div class="label">${isAr ? 'بيانات العميل (Billed To):' : 'Billed To (Client):'}</div>
      <div class="client-name">${clientName}</div>
      ${clientCompany ? `<div class="client-company">${clientCompany}</div>` : ''}
      ${invoice.clientEmail ? `<div class="client-meta">${invoice.clientEmail}</div>` : ''}
      ${clientAddress ? `<div class="client-meta">${clientAddress}</div>` : ''}
    </div>

    <div class="status-card">
      <div class="label">${isAr ? 'حالة السداد والمبلغ:' : 'Payment Status & Amount:'}</div>
      <div class="amount-display">${invoice.totalAmount.toLocaleString()} ${invoice.currency}</div>
      <div><span class="status-badge">${getStatusText()}</span></div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 40px;">#</th>
        <th>${isAr ? 'بيان البنود والخدمات البرمجية' : 'Description'}</th>
        <th style="text-align: center; width: 70px;">${isAr ? 'الكمية' : 'Qty'}</th>
        <th style="text-align: ${isAr ? 'left' : 'right'}; width: 130px;">${isAr ? 'سعر الوحدة' : 'Unit Price'}</th>
        <th style="text-align: ${isAr ? 'left' : 'right'}; width: 140px;">${isAr ? 'المجموع' : 'Total'}</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="summary-section">
    <div class="instructions-box">
      ${paymentInstructions ? `
        <h4>${isAr ? 'بيانات وطرق الدفع والتحويل:' : 'Payment Details & Bank Instructions:'}</h4>
        <p>${paymentInstructions}</p>
      ` : ''}
      ${notes ? `
        <h4 style="margin-top: ${paymentInstructions ? '12px' : '0'};">${isAr ? 'ملاحظات وشروط:' : 'Notes & Terms:'}</h4>
        <p style="color: #4b5563; font-family: inherit;">${notes}</p>
      ` : ''}
    </div>

    <div class="totals-box">
      <div class="totals-row">
        <span>${isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
        <span>${invoice.subtotal.toLocaleString()} ${invoice.currency}</span>
      </div>
      ${invoice.discountPercentage ? `
        <div class="totals-row" style="color: #059669;">
          <span>${isAr ? `الخصم (${invoice.discountPercentage}%):` : `Discount (${invoice.discountPercentage}%):`}</span>
          <span>-${discountAmount.toLocaleString()} ${invoice.currency}</span>
        </div>
      ` : ''}
      ${invoice.taxPercentage ? `
        <div class="totals-row">
          <span>${isAr ? `الضريبة (${invoice.taxPercentage}%):` : `Tax (${invoice.taxPercentage}%):`}</span>
          <span>+${taxAmount.toLocaleString()} ${invoice.currency}</span>
        </div>
      ` : ''}
      <div class="totals-row final">
        <span>${isAr ? 'الإجمالي المستحق:' : 'Total Due:'}</span>
        <span>${invoice.totalAmount.toLocaleString()} ${invoice.currency}</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <div>© ${new Date().getFullYear()} ${settings.fullName || 'Mohamed Abu Al-Saud'} · All rights reserved.</div>
    <div>${invoice.invoiceNumber} · Verification Document</div>
  </div>
</body>
</html>`;
};

/**
 * Robust print helper:
 * 1. Creates a hidden iframe and triggers native print.
 * 2. If iframe print fails or is blocked by sandbox, triggers instant download of the standalone HTML file that auto-prints when opened!
 */
export const printInvoice = (
  invoice: Invoice,
  settings: SiteSettings,
  lang: 'ar' | 'en' | 'bilingual' = 'ar'
): boolean => {
  const html = generateInvoiceHtml(invoice, settings, lang);

  try {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.setAttribute('title', 'Print Frame');
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          // Fallback to window print
          window.print();
        } finally {
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 2000);
        }
      }, 300);
      return true;
    }
  } catch (err) {
    console.error('Iframe print error:', err);
  }

  // Fallback to direct window.print()
  try {
    window.print();
    return true;
  } catch {
    downloadInvoiceHtml(invoice, settings, lang);
    return false;
  }
};

/**
 * Downloads a standalone, self-contained HTML invoice file that can be opened in any browser and auto-printed.
 */
export const downloadInvoiceHtml = (
  invoice: Invoice,
  settings: SiteSettings,
  lang: 'ar' | 'en' | 'bilingual' = 'ar'
) => {
  const html = generateInvoiceHtml(invoice, settings, lang);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Invoice-${invoice.invoiceNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
