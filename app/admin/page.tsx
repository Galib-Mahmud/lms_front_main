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
    <div className="max-w-6xl mx-auto px-6 py-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-8 border-b border-white/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            👑 System Administrator
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3">Platform Governance</h1>
          <p className="text-gray-400 text-sm mt-1">Manage global metrics, user roles, and system permission assignments.</p>
        </div>

        <div className="flex gap-3">
          <Link href="/manage/courses">
            <Button variant="secondary" className="text-xs font-mono uppercase tracking-wider">
              Manage Courses
            </Button>
          </Link>
          <Link href="/manage/blog">
            <Button variant="secondary" className="text-xs font-mono uppercase tracking-wider">
              Manage Blog
            </Button>
          </Link>
        </div>
      </div>

      <ErrorBanner message={error} />

      {/* Platform Summary Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="glass-card p-6 border border-emerald-500/30 flex flex-col items-center text-center gap-3">
            <Stamp value={stats.totalUsers} label="users" size="sm" color="forest" />
            <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">Total System Users</span>
          </div>
          <div className="glass-card p-6 border border-amber-500/30 flex flex-col items-center text-center gap-3">
            <Stamp value={stats.totalCourses} label="courses" size="sm" color="gold" />
            <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">Published Courses</span>
          </div>
          <div className="glass-card p-6 border border-red-500/30 flex flex-col items-center text-center gap-3">
            <Stamp value={stats.totalEnrollments} label="enrolled" size="sm" color="brick" />
            <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">Active Enrollments</span>
          </div>
          <div className="glass-card p-6 border border-purple-500/30 flex flex-col items-center text-center gap-3">
            <Stamp value={stats.totalQuizzes} label="quizzes" size="sm" color="forest" />
            <span className="font-mono text-xs text-gray-400 uppercase tracking-wider">Total Quizzes</span>
          </div>
        </div>
      )}

      {/* Role Breakdown Table */}
      {stats?.usersByRole && (
        <div className="glass-card p-6 mb-12 border border-white/10">
          <h2 className="font-display text-xl font-bold text-white mb-4">User Count by Role Type</h2>
          <table className="ledger">
            <thead>
              <tr>
                <th>Role Type</th>
                <th>User Count</th>
              </tr>
            </thead>
            <tbody>
              {ROLE_TYPES.map((r) => (
                <tr key={r}>
                  <td className="capitalize font-semibold text-emerald-400">{r.replace('_', ' ')}</td>
                  <td className="font-mono font-bold text-white">{stats.usersByRole[r] ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All Users Governance Table */}
      <div className="glass-card p-6 border border-white/10">
        <h2 className="font-display text-2xl font-bold text-white mb-4">User Directory & Role Assignments ({users.length})</h2>
        {users.length === 0 ? (
          <EmptyState title="No users registered yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="ledger">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Email</th>
                  <th>Role Designation</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="font-semibold text-white">{u.fullName || u.username}</div>
                      <div className="text-[11px] font-mono text-gray-400">@{u.username}</div>
                    </td>
                    <td className="font-mono text-xs text-gray-300">{u.email}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role?.type || ''}
                          disabled={u.id === me?.id || savingUserId === u.id}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                          className="border border-white/20 rounded-xl px-3 py-2 text-xs bg-black/60 text-emerald-400 font-semibold focus:outline-none disabled:opacity-50"
                        >
                          {ROLE_TYPES.map((r) => (
                            <option key={r} value={r} className="bg-slate-900 text-white">
                              {r.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                        {u.id === me?.id && <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">(You)</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
