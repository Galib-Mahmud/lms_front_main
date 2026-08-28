'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, dashboardPathForRole } from '@/lib/auth-context';
import { Button, ErrorBanner, Input, Label } from '@/components/ui';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    roleType: 'student' as 'student' | 'instructor',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await register(form);
      router.push(dashboardPathForRole(user.role.type));
    } catch (err: any) {
      setError(err.message || 'Could not create your account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-2">Create your account</h1>
      <p className="text-ink-soft mb-8 text-sm">
        Admin and Content Manager accounts are assigned by an administrator — everyone else starts here.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>Full name</Label>
          <Input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required autoFocus />
        </div>
        <div>
          <Label>Username</Label>
          <Input value={form.username} onChange={(e) => update('username', e.target.value)} required />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            minLength={6}
            required
          />
        </div>
        <div>
          <Label>I am joining as a…</Label>
          <div className="flex gap-3">
            {(['student', 'instructor'] as const).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => update('roleType', r)}
                className={`flex-1 rounded-card border px-4 py-2.5 text-sm capitalize transition-colors ${
                  form.roleType === r ? 'border-forest bg-forest text-paper' : 'border-line hover:border-forest'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <ErrorBanner message={error} />
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Creating account…' : 'Sign up'}
        </Button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-forest font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
