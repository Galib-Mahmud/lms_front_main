'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, dashboardPathForRole } from '@/lib/auth-context';
import { Button, ErrorBanner, Input, Label } from '@/components/ui';

interface AuthCardProps {
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export default function AuthCard({ initialMode = 'login', onSuccess }: AuthCardProps) {
  const { login, register } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [fullName, setFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [roleType, setRoleType] = useState<'student' | 'instructor'>('student');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const u = await login(identifier, password);
      if (onSuccess) onSuccess();
      else router.push(dashboardPathForRole(u.role?.type));
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const u = await register({
        username: regUsername,
        email: regEmail,
        password: regPassword,
        fullName,
        roleType,
      });
      if (onSuccess) onSuccess();
      else router.push(dashboardPathForRole(u.role?.type));
    } catch (err: any) {
      setError(err.message || 'Could not create account.');
    } finally {
      setSubmitting(false);
    }
  };

  const quickLogin = async (id: string, pass: string) => {
    setIdentifier(id);
    setPassword(pass);
    setError('');
    setSubmitting(true);
    try {
      const u = await login(id, pass);
      if (onSuccess) onSuccess();
      else router.push(dashboardPathForRole(u.role?.type));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mode Switcher Tabs */}
      <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 mb-6">
        <button
          type="button"
          onClick={() => { setMode('login'); setError(''); }}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            mode === 'login'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setError(''); }}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            mode === 'register'
              ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Create Account
        </button>
      </div>

      <div className="glass-card p-8 border border-white/10 shadow-2xl">
        <div className="mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {mode === 'login'
              ? 'Access your enrolled courses, quizzes, and learning history.'
              : 'Join the platform as a student or course instructor.'}
          </p>
        </div>

        <ErrorBanner message={error} />

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <Label>Email or Username</Label>
              <Input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                placeholder="you@example.com"
                autoFocus
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full text-base py-3 mt-2">
              {submitting ? 'Authenticating…' : 'Sign In'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Alex Morgan"
                autoFocus
              />
            </div>

            <div>
              <Label>Username</Label>
              <Input
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                required
                placeholder="alexmorgan"
              />
            </div>

            <div>
              <Label>Email Address</Label>
              <Input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                placeholder="alex@example.com"
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                minLength={6}
                required
                placeholder="••••••••"
              />
            </div>

            <div>
              <Label>Account Role</Label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                {(['student', 'instructor'] as const).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRoleType(r)}
                    className={`rounded-xl border px-3 py-2.5 text-xs font-semibold capitalize transition-all ${
                      roleType === r
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-sm'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {r === 'student' ? 'Student' : 'Instructor'}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full text-base py-3 mt-2">
              {submitting ? 'Creating Account…' : 'Create Account'}
            </Button>
          </form>
        )}

        {/* 1-Click Demo Accounts Selector */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 text-center mb-3">
            Quick 1-Click Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => quickLogin('student@example.com', 'Student123456!')}
              className="text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs"
            >
              <p className="font-semibold text-white">Student</p>
              <p className="text-[10px] text-gray-400 truncate">student@example.com</p>
            </button>
            <button
              type="button"
              onClick={() => quickLogin('instructor@example.com', 'Instructor123456!')}
              className="text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs"
            >
              <p className="font-semibold text-white">Instructor</p>
              <p className="text-[10px] text-gray-400 truncate">instructor@example.com</p>
            </button>
            <button
              type="button"
              onClick={() => quickLogin('content@example.com', 'Content123456!')}
              className="text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs"
            >
              <p className="font-semibold text-white">Content Mgr</p>
              <p className="text-[10px] text-gray-400 truncate">content@example.com</p>
            </button>
            <button
              type="button"
              onClick={() => quickLogin('admin@example.com', 'Admin123456!')}
              className="text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs"
            >
              <p className="font-semibold text-white">Admin</p>
              <p className="text-[10px] text-gray-400 truncate">admin@example.com</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
