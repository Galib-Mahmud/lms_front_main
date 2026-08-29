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

  const fetchCurrentUser = async (): Promise<CurrentUser> => {
    try {
      const customMe = await api.get('/api/custom-auth/me').catch(() => null);
      if (customMe && customMe.role?.type) {
        return customMe;
      }
    } catch {
      // Fallback if custom-auth/me is building
    }

    const rawMe = await api.get('/api/users/me?populate=role');
    const roleType: Role = (rawMe.role?.type as Role) || 'student';
    return {
      id: rawMe.id,
      username: rawMe.username,
      email: rawMe.email,
      fullName: rawMe.fullName,
      role: { type: roleType, name: ROLE_LABELS[roleType] || 'Student' },
    };
  };

  const refresh = useCallback(async () => {
    try {
      const me = await fetchCurrentUser();
      setUser(me);
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

    let current: CurrentUser;
    if (res.user && res.user.role?.type) {
      current = {
        id: res.user.id,
        username: res.user.username,
        email: res.user.email,
        fullName: res.user.fullName,
        role: { type: res.user.role.type as Role, name: res.user.role.name || 'Student' },
      };
    } else {
      current = await fetchCurrentUser();
    }

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
