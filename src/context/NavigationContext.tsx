import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type RoutePath = string;
export type PageId =
  | 'home'
  | 'services'
  | 'projects'
  | 'about'
  | 'blog'
  | 'contact'
  | 'project-detail'
  | 'article-detail'
  | 'admin-login'
  | 'admin-dashboard';

interface NavigationRoute {
  path: RoutePath;
  page: PageId;
  entityId?: string | null;
}

interface NavigationContextType {
  currentPath: RoutePath;
  activePage: PageId;
  activeEntityId?: string | null;
  navigate: (path: string, entityId?: string) => void;
  navigateToProject: (projectId: string) => void;
  navigateToArticle: (articleId: string) => void;
  navigateToAdminTab: (tabId: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

function normalizePath(rawPath: string, explicitEntityId?: string): NavigationRoute {
  const clean = rawPath.toLowerCase().replace(/\/+$/, '') || '/';

  // Admin Routes
  if (clean === '/admin/login') {
    return { path: '/admin/login', page: 'admin-login' };
  }

  const adminMatch = clean.match(/^\/admin(?:\/([a-z0-9-_]+))?$/);
  if (adminMatch) {
    const tab = explicitEntityId || adminMatch[1] || 'overview';
    return { path: clean, page: 'admin-dashboard', entityId: tab };
  }

  // Public Blog Routes
  const blogMatch = clean.match(/^\/(?:blog|journal)\/([a-z0-9-_]+)$/);
  if (blogMatch) {
    return { path: clean, page: 'article-detail', entityId: explicitEntityId || blogMatch[1] };
  }

  // Public Project Routes
  const projectMatch = clean.match(/^\/(?:projects|work)\/([a-z0-9-_]+)$/);
  if (projectMatch) {
    return { path: clean, page: 'project-detail', entityId: explicitEntityId || projectMatch[1] };
  }

  if (clean === '/services') return { path: '/services', page: 'services' };
  if (clean === '/projects' || clean === '/work') return { path: '/projects', page: 'projects' };
  if (clean === '/about') return { path: '/about', page: 'about' };
  if (clean === '/blog' || clean === '/journal') return { path: '/blog', page: 'blog' };
  if (clean === '/contact') return { path: '/contact', page: 'contact' };

  return { path: '/', page: 'home' };
}

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<NavigationRoute>(() => {
    return normalizePath(window.location.pathname);
  });

  const navigate = useCallback((targetPath: string, entityId?: string) => {
    const normalized = normalizePath(targetPath, entityId);
    if (window.location.pathname !== normalized.path) {
      window.history.pushState({}, '', normalized.path);
    }
    setRoute(normalized);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const navigateToProject = useCallback((projectId: string) => {
    navigate(`/projects/${projectId}`, projectId);
  }, [navigate]);

  const navigateToArticle = useCallback((articleId: string) => {
    navigate(`/blog/${articleId}`, articleId);
  }, [navigate]);

  const navigateToAdminTab = useCallback((tabId: string) => {
    navigate(`/admin/${tabId}`, tabId);
  }, [navigate]);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(normalizePath(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        currentPath: route.path,
        activePage: route.page,
        activeEntityId: route.entityId,
        navigate,
        navigateToProject,
        navigateToArticle,
        navigateToAdminTab,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
