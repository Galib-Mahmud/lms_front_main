'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, dashboardPathForRole } from '@/lib/auth-context';
import { Button, ErrorBanner, Input, Label, Loading } from '@/components/ui';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(identifier, password);
      const next = params.get('next');
      router.push(next || dashboardPathForRole(user.role.type));
    } catch (err: any) {
      setError(err.message || 'Could not log in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-2">Welcome back</h1>
      <p className="text-ink-soft mb-8 text-sm">Log in to pick up right where you left off.</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>Email or username</Label>
          <Input value={identifier} onChange={(e) => setIdentifier(e.target.value)} required autoFocus />
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <ErrorBanner message={error} />
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        No account yet?{' '}
        <Link href="/register" className="text-forest font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}