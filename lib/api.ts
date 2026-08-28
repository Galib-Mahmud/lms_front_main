const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lms_jwt');
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('lms_jwt', token);
    document.cookie = `lms_jwt=${token}; path=/; max-age=2592000; SameSite=Lax`;
  } else {
    localStorage.removeItem('lms_jwt');
    document.cookie = 'lms_jwt=; path=/; max-age=0';
  }
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      body?.error?.message || body?.message?.[0]?.messages?.[0]?.message || 'Something went wrong.';
    throw new ApiError(message, res.status);
  }
  return body;
}

export const api = {
  get: (path: string) => request(path, { method: 'GET' }),
  post: (path: string, data?: unknown) =>
    request(path, { method: 'POST', body: data !== undefined ? JSON.stringify(data) : undefined }),
  put: (path: string, data?: unknown) =>
    request(path, { method: 'PUT', body: data !== undefined ? JSON.stringify(data) : undefined }),
  del: (path: string) => request(path, { method: 'DELETE' }),
};

export const mediaUrl = (path?: string) => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_URL}${path}`;
};

export type Role = 'admin' | 'content_manager' | 'instructor' | 'student';

export type CurrentUser = {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: { type: Role; name: string };
};
