import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  Project,
  CaseStudy,
  Service,
  Message,
  Article,
  Testimonial,
  MediaItem,
  SiteSettings,
  ToastMessage,
  AdminTab,
  Invoice,
  PrototypeItem,
} from '../types';
import {
  initialProjects,
  initialCaseStudies,
  initialServices,
  initialMessages,
  initialArticles,
  initialTestimonials,
  initialMediaItems,
  initialSettings,
  initialInvoices,
  initialPrototypes,
} from '../data/initialData';
import { translations } from '../data/translations';

interface PortfolioContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  caseStudies: Record<string, CaseStudy>;
  setCaseStudies: React.Dispatch<React.SetStateAction<Record<string, CaseStudy>>>;
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  prototypes: PrototypeItem[];
  setPrototypes: React.Dispatch<React.SetStateAction<PrototypeItem[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  media: MediaItem[];
  setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  settings: SiteSettings;
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  activeCaseStudy: CaseStudy | null;
  openCaseStudy: (caseStudy: CaseStudy) => void;
  closeCaseStudy: () => void;
  currentView: 'site' | 'admin';
  setCurrentView: (view: 'site' | 'admin') => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  addMessage: (inquiry: Omit<Message, 'id' | 'date' | 'status'>) => void;
  deleteMessage: (id: string) => void;
  updateMessageStatus: (id: string, status: Message['status']) => void;
  saveProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  savePrototype: (prototype: PrototypeItem) => void;
  deletePrototype: (id: string) => void;
  updatePrototypeStatus: (id: string, status: 'published' | 'draft') => void;
  saveArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  saveInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  updateSettings: (newSettings: SiteSettings) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('portfolio_lang');
      return (saved === 'ar' || saved === 'en') ? saved : 'ar';
    } catch {
      return 'ar';
    }
  });

  const [currentView, setCurrentViewState] = useState<'site' | 'admin'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'site';
  });

  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [activeCaseStudy, setActiveCaseStudy] = useState<CaseStudy | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent States
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_projects');
      return saved ? JSON.parse(saved) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  const [caseStudies, setCaseStudies] = useState<Record<string, CaseStudy>>(() => {
    try {
      const saved = localStorage.getItem('portfolio_case_studies');
      return saved ? JSON.parse(saved) : initialCaseStudies;
    } catch {
      return initialCaseStudies;
    }
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_services');
      return saved ? JSON.parse(saved) : initialServices;
    } catch {
      return initialServices;
    }
  });

  const [prototypes, setPrototypes] = useState<PrototypeItem[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_prototypes_v1');
      return saved ? JSON.parse(saved) : initialPrototypes;
    } catch {
      return initialPrototypes;
    }
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_messages');
      return saved ? JSON.parse(saved) : initialMessages;
    } catch {
      return initialMessages;
    }
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_articles');
      return saved ? JSON.parse(saved) : initialArticles;
    } catch {
      return initialArticles;
    }
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_testimonials');
      return saved ? JSON.parse(saved) : initialTestimonials;
    } catch {
      return initialTestimonials;
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_invoices');
      return saved ? JSON.parse(saved) : initialInvoices;
    } catch {
      return initialInvoices;
    }
  });

  const [media, setMedia] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_media');
      return saved ? JSON.parse(saved) : initialMediaItems;
    } catch {
      return initialMediaItems;
    }
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('portfolio_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Tariq Mansour' || !parsed.name) {
          parsed.name = 'Abu Al-Saud';
          parsed.fullName = 'Mohamed Abu Al-Saud';
          parsed.email = 'abualss3ud@gmail.com';
          localStorage.setItem('portfolio_settings', JSON.stringify(parsed));
        }
        return parsed;
      }
      return initialSettings;
    } catch {
      return initialSettings;
    }
  });

  // Sync Language
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('portfolio_lang', lang);
    } catch {}
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setCurrentViewState('admin');
      } else if (hash.startsWith('#case-study-')) {
        const slug = hash.replace('#case-study-', '');
        if (caseStudies[slug]) {
          setActiveCaseStudy(caseStudies[slug]);
        }
        setCurrentViewState('site');
      } else {
        setCurrentViewState('site');
      }
    };
    // Check initial hash on mount
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [caseStudies]);

  const setCurrentView = (view: 'site' | 'admin') => {
    setCurrentViewState(view);
    if (view === 'admin') {
      window.location.hash = '#admin';
    } else {
      window.location.hash = '';
    }
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    } catch {}
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_prototypes_v1', JSON.stringify(prototypes));
    } catch {}
  }, [prototypes]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_articles', JSON.stringify(articles));
    } catch {}
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_invoices', JSON.stringify(invoices));
    } catch {}
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Toast System
  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Actions
  const openCaseStudy = (caseStudy: CaseStudy) => {
    setActiveCaseStudy(caseStudy);
    window.location.hash = `#case-study-${caseStudy.slug}`;
  };

  const closeCaseStudy = () => {
    setActiveCaseStudy(null);
    if (window.location.hash.startsWith('#case-study-')) {
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  const addMessage = (inquiry: Omit<Message, 'id' | 'date' | 'status'>) => {
    const newMessage: Message = {
      ...inquiry,
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'unread',
    };
    setMessages((prev) => [newMessage, ...prev]);
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    showToast('Message deleted', 'info');
  };

  const updateMessageStatus = (id: string, status: Message['status']) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  const saveProject = (project: Project) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === project.id);
      if (exists) {
        return prev.map((p) => (p.id === project.id ? project : p));
      }
      return [project, ...prev];
    });
    showToast('Project saved successfully', 'success');
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showToast('Project removed', 'info');
  };

  const savePrototype = (prototype: PrototypeItem) => {
    setPrototypes((prev) => {
      const exists = prev.some((p) => p.id === prototype.id);
      if (exists) {
        return prev.map((p) => (p.id === prototype.id ? { ...prototype, updatedAt: new Date().toISOString().split('T')[0] } : p));
      }
      return [{ ...prototype, updatedAt: new Date().toISOString().split('T')[0] }, ...prev];
    });
    showToast('Prototype saved successfully', 'success');
  };

  const deletePrototype = (id: string) => {
    setPrototypes((prev) => prev.filter((p) => p.id !== id));
    showToast('Prototype removed', 'info');
  };

  const updatePrototypeStatus = (id: string, status: 'published' | 'draft') => {
    setPrototypes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, updatedAt: new Date().toISOString().split('T')[0] } : p))
    );
  };

  const saveArticle = (article: Article) => {
    setArticles((prev) => {
      const exists = prev.some((a) => a.id === article.id);
      if (exists) {
        return prev.map((a) => (a.id === article.id ? article : a));
      }
      return [article, ...prev];
    });
    showToast('Article saved successfully', 'success');
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    showToast('Article removed', 'info');
  };

  const saveInvoice = (invoice: Invoice) => {
    setInvoices((prev) => {
      const exists = prev.some((inv) => inv.id === invoice.id);
      if (exists) {
        return prev.map((inv) => (inv.id === invoice.id ? invoice : inv));
      }
      return [invoice, ...prev];
    });
    showToast('Invoice saved successfully', 'success');
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    showToast('Invoice removed', 'info');
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status, updatedAt: new Date().toISOString().split('T')[0] } : inv))
    );
  };

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    showToast('Settings updated', 'success');
  };

  const t = translations[language];

  return (
    <PortfolioContext.Provider
      value={{
        language,
        setLanguage,
        t,
        projects,
        setProjects,
        caseStudies,
        setCaseStudies,
        services,
        setServices,
        prototypes,
        setPrototypes,
        messages,
        setMessages,
        articles,
        setArticles,
        testimonials,
        setTestimonials,
        invoices,
        setInvoices,
        media,
        setMedia,
        settings,
        setSettings,
        activeCaseStudy,
        openCaseStudy,
        closeCaseStudy,
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        toasts,
        showToast,
        removeToast,
        addMessage,
        deleteMessage,
        updateMessageStatus,
        saveProject,
        deleteProject,
        savePrototype,
        deletePrototype,
        updatePrototypeStatus,
        saveArticle,
        deleteArticle,
        saveInvoice,
        deleteInvoice,
        updateInvoiceStatus,
        updateSettings,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
