'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Role } from '@/lib/api';
import { Loading } from './ui';

export default function RoleGuard({
  allow,
  children,
}: {
  allow: Role[];
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !allow.includes(user.role.type))) {
      router.replace('/login');
    }
  }, [loading, user, allow, router]);

  if (loading || !user || !allow.includes(user.role.type)) {
    return <Loading />;
  }

  return <>{children}</>;
}
