export type Language = 'en' | 'ar';

export type AdminTab =
  | 'overview'
  | 'projects'
  | 'case-studies'
  | 'services'
  | 'invoices'
  | 'messages'
  | 'testimonials'
  | 'blog'
  | 'media'
  | 'settings';

export type ProjectStatus = 'published' | 'draft';
export type MessageStatus = 'unread' | 'read' | 'archived';
export type ArticleStatus = 'published' | 'draft';
export type SiteAvailability = 'available' | 'booked';
export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  descriptionAr?: string;
  descriptionEn?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientNameAr?: string;
  clientNameEn?: string;
  clientEmail: string;
  clientCompany?: string;
  clientCompanyAr?: string;
  clientCompanyEn?: string;
  clientAddress?: string;
  clientAddressAr?: string;
  clientAddressEn?: string;
  currency: string; // USD, SAR, AED, EGP, EUR, GBP
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discountPercentage?: number;
  taxPercentage?: number;
  totalAmount: number;
  notes?: string;
  notesAr?: string;
  notesEn?: string;
  paymentInstructions?: string;
  paymentInstructionsAr?: string;
  paymentInstructionsEn?: string;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  titleAr?: string;
  titleEn?: string;
  slug: string;
  industry: string;
  industryAr?: string;
  industryEn?: string;
  description: string;
  descriptionAr?: string;
  descriptionEn?: string;
  problem: string;
  problemAr?: string;
  problemEn?: string;
  solution: string;
  solutionAr?: string;
  solutionEn?: string;
  role: string;
  roleAr?: string;
  roleEn?: string;
  technologies: string[];
  projectUrl: string;
  githubUrl: string;
  coverImage: string;
  gallery: string[];
  status: ProjectStatus;
  featured: boolean;
  updatedAt: string;
}

export interface CaseStudySection {
  number: string;
  title: string;
  content: string;
  details?: string[];
}

export interface CaseStudyScreenshot {
  url: string;
  caption: string;
  alt?: string;
  tag?: string;
}

export interface CaseStudy {
  projectId: string;
  projectTitle: string;
  slug: string;
  industry: string;
  coverImage: string;
  overview: string;
  businessProblem: string;
  goals: string[];
  solution: string;
  uxDecisions: string[];
  architecture: string;
  frontend: string;
  backend: string;
  database: string;
  challenges: string;
  results: {
    metric: string;
    label: string;
    note: string;
  }[];
  techStack: {
    category: string;
    items: string[];
  }[];
  liveDemoUrl?: string;
  githubUrl?: string;
  screenshots?: CaseStudyScreenshot[];
  clientName?: string;
  timeline?: string;
  role?: string;
}

export interface Service {
  id: string;
  title: string;
  titleAr?: string;
  titleEn?: string;
  subtitle?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  description: string;
  descriptionAr?: string;
  descriptionEn?: string;
  businessValue?: string;
  businessValueAr?: string;
  businessValueEn?: string;
  benefits?: string[];
  benefitsAr?: string[];
  benefitsEn?: string[];
  typicalDeliverables: string[];
  typicalDeliverablesAr?: string[];
  typicalDeliverablesEn?: string[];
  suitableFor: string;
  suitableForAr?: string;
  suitableForEn?: string;
  tags?: string[];
  tagsAr?: string[];
  tagsEn?: string[];
  iconName?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  projectDetails: string;
  date: string;
  status: MessageStatus;
}

export interface Article {
  id: string;
  title: string;
  titleAr?: string;
  titleEn?: string;
  slug: string;
  excerpt: string;
  excerptAr?: string;
  excerptEn?: string;
  content: string;
  contentAr?: string;
  contentEn?: string;
  coverImage: string;
  category: string;
  categoryAr?: string;
  categoryEn?: string;
  tags: string[];
  tagsAr?: string[];
  tagsEn?: string[];
  publishedDate: string;
  status: ArticleStatus;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientNameAr?: string;
  clientNameEn?: string;
  company: string;
  companyAr?: string;
  companyEn?: string;
  role: string;
  roleAr?: string;
  roleEn?: string;
  feedback: string;
  feedbackAr?: string;
  feedbackEn?: string;
  content?: string;
  projectTitle: string;
  projectTitleAr?: string;
  projectTitleEn?: string;
  projectRef?: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  type: string;
  size: string;
  uploadDate: string;
  url: string;
}

export interface SiteSettings {
  name: string;
  fullName?: string;
  title: string;
  titleAr?: string;
  titleEn?: string;
  bio: string;
  bioAr?: string;
  bioEn?: string;
  email: string;
  location?: string;
  locationAr?: string;
  locationEn?: string;
  linkedin: string;
  github: string;
  twitter: string;
  seoTitle: string;
  seoTitleAr?: string;
  seoTitleEn?: string;
  seoDescription: string;
  seoDescriptionAr?: string;
  seoDescriptionEn?: string;
  siteStatus: SiteAvailability;
  availableForWork?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'destructive' | 'info';
  message: string;
}
