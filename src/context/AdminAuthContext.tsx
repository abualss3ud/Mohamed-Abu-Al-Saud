import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AdminUser {
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminUser: AdminUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  token: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const TOKEN_KEY = 'admin_session_auth_token';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Verify existing token with backend API on mount
  const verifyToken = useCallback(async (tokenToVerify: string) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/me', {
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setAdminUser(data.user);
          setIsAuthenticated(true);
          return true;
        }
      }

      // If token invalid, clear
      try {
        sessionStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_KEY);
      } catch {}
      setToken(null);
      setAdminUser(null);
      setIsAuthenticated(false);
      return false;
    } catch (err) {
      console.error('Session verification error:', err);
      // In case of transient offline, don't immediately drop if previously set
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
      setIsAuthenticated(false);
    }
  }, [token, verifyToken]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.token) {
        return {
          success: false,
          error: data.error || 'Invalid credentials or access denied.',
        };
      }

      const receivedToken = data.token;
      try {
        sessionStorage.setItem(TOKEN_KEY, receivedToken);
      } catch {}

      setToken(receivedToken);
      setAdminUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (err: any) {
      console.error('Login request failed:', err);
      return {
        success: false,
        error: 'Network or server error. Please verify the server is running.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {});
      }
    } finally {
      try {
        sessionStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_KEY);
      } catch {}
      setToken(null);
      setAdminUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        adminUser,
        login,
        logout,
        token,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
