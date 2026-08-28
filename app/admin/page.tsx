'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Button, ErrorBanner, Loading, EmptyState } from '@/components/ui';
import { Stamp } from '@/components/Stamp';
import RoleGuard from '@/components/RoleGuard';

const ROLE_TYPES = ['admin', 'content_manager', 'instructor', 'student'] as const;

function AdminInner() {
  const { user: me } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingUserId, setSavingUserId] = useState<number | null>(null);

  const load = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([api.get('/api/admin-stats'), api.get('/api/admin-users')]);
      setStats(statsRes.data);
      setUsers(usersRes.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeRole = async (userId: number, roleType: string) => {
    setSavingUserId(userId);
    setError('');
    try {
      await api.put(`/api/admin-users/${userId}/role`, { roleType });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingUserId(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <span className="font-mono text-xs uppercase tracking-wide text-gold">Admin</span>
      <h1 className="font-display text-4xl mt-2 mb-8">Platform dashboard</h1>
      <ErrorBanner message={error} />

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="index-card p-5 flex flex-col items-center text-center gap-3">
            <Stamp value={stats.totalUsers} label="users" size="sm" />
          </div>
          <div className="index-card p-5 flex flex-col items-center text-center gap-3">
            <Stamp value={stats.totalCourses} label="courses" size="sm" color="gold" />
          </div>
          <div className="index-card p-5 flex flex-col items-center text-center gap-3">
            <Stamp value={stats.totalEnrollments} label="enrollments" size="sm" color="brick" />
          </div>
          <div className="index-card p-5 flex flex-col items-center text-center gap-3">
            <Stamp value={stats.totalQuizzes} label="quizzes" size="sm" />
          </div>
        </div>
      )}

      {stats?.usersByRole && (
        <div className="mb-12">
          <h2 className="font-display text-xl mb-4">Users by role</h2>
          <table className="ledger">
            <thead>
              <tr>
                <th>Role</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {ROLE_TYPES.map((r) => (
                <tr key={r}>
                  <td className="capitalize">{r.replace('_', ' ')}</td>
                  <td className="font-mono">{stats.usersByRole[r] ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-4 mb-12">
        <Link href="/manage/courses"><Button variant="secondary">Manage all courses</Button></Link>
        <Link href="/manage/blog"><Button variant="secondary">Manage blog</Button></Link>
      </div>

      <div>
        <h2 className="font-display text-xl mb-4">All users ({users.length})</h2>
        {users.length === 0 ? (
          <EmptyState title="No users yet" />
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.fullName || u.username}</td>
                  <td className="font-mono text-xs">{u.email}</td>
                  <td>
                    <select
                      value={u.role?.type || ''}
                      disabled={u.id === me?.id || savingUserId === u.id}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                      className="border border-line rounded-card px-2.5 py-1.5 text-sm bg-white/60 disabled:opacity-50"
                    >
                      {ROLE_TYPES.map((r) => (
                        <option key={r} value={r}>
                          {r.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                    {u.id === me?.id && <span className="text-xs text-ink-soft ml-2">(you)</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <RoleGuard allow={['admin']}>
      <AdminInner />
    </RoleGuard>
  );
}
