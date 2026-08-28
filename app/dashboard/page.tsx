'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, dashboardPathForRole } from '@/lib/auth-context';
import { Loading } from '@/components/ui';

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(user ? dashboardPathForRole(user.role.type) : '/login');
    }
  }, [loading, user, router]);

  return <Loading />;
}
