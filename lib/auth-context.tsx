'use client';

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { api, setToken, CurrentUser, Role } from './api';

type AuthContextValue = {
  user: CurrentUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<CurrentUser>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    roleType: Extract<Role, 'student' | 'instructor'>;
  }) => Promise<CurrentUser>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const me = await api.get('/api/custom-auth/me');
      setUser({
        id: me.id,
        username: me.username,
        email: me.email,
        fullName: me.fullName,
        role: { type: me.role?.type || 'student', name: me.role?.name || 'Student' },
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('lms_jwt') : null;
    if (token) {
      refresh();
    } else {
      setLoading(false);
    }
  }, [refresh]);

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await api.post('/api/auth/local', { identifier, password });
    setToken(res.jwt);
    const me = await api.get('/api/custom-auth/me');
    const current: CurrentUser = {
      id: me.id,
      username: me.username,
      email: me.email,
      fullName: me.fullName,
      role: { type: me.role?.type || 'student', name: me.role?.name || 'Student' },
    };
    setUser(current);
    return current;
  }, []);

  const register = useCallback(
    async (data: {
      username: string;
      email: string;
      password: string;
      fullName?: string;
      roleType: Extract<Role, 'student' | 'instructor'>;
    }) => {
      const res = await api.post('/api/custom-auth/register', data);
      setToken(res.jwt);
      setUser(res.user);
      return res.user as CurrentUser;
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  content_manager: 'Content Manager',
  instructor: 'Instructor',
  student: 'Student',
};

export const dashboardPathForRole = (role?: Role) => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'content_manager':
    case 'instructor':
      return '/manage/courses';
    case 'student':
    default:
      return '/my-courses';
  }
};
