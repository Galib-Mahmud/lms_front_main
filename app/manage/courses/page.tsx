'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Button, EmptyState, ErrorBanner, Input, Label, Loading, Textarea } from '@/components/ui';
import RoleGuard from '@/components/RoleGuard';

function ManageCoursesInner() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', coverImageUrl: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await api.get('/api/courses?populate=owner&sort=createdAt:desc');
      const mine =
        user?.role.type === 'instructor'
          ? (res.data || []).filter((c: any) => (c.owner?.id ?? c.owner) === user.id)
          : res.data || [];
      setCourses(mine);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/api/courses', { data: form });
      setForm({ title: '', description: '', coverImageUrl: '' });
      setShowForm(false);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (documentId: string) => {
    if (!confirm('Delete this course and all its lessons/quizzes?')) return;
    try {
      await api.del(`/api/courses/${documentId}`);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-8 border-b border-white/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Instructor Portal
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3">Manage Courses</h1>
          <p className="text-gray-400 text-sm mt-1">
            {user?.role.type === 'instructor' ? 'Courses assigned to your account.' : 'All courses registered across the platform.'}
          </p>
        </div>

        <Button onClick={() => setShowForm((s) => !s)} className="whitespace-nowrap px-6 py-3">
          {showForm ? 'Cancel Creation' : '+ Create New Course'}
        </Button>
      </div>

      <ErrorBanner message={error} />

      {showForm && (
        <form onSubmit={createCourse} className="glass-card p-8 mb-10 space-y-5 border border-emerald-500/30">
          <h2 className="font-display text-2xl font-bold text-white mb-2">Create New Academic Course</h2>
          <div>
            <Label>Course Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="e.g. Advanced Distributed Systems"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detailed syllabus overview and learning objectives..."
            />
          </div>
          <div>
            <Label>Cover Image URL (Optional)</Label>
            <Input
              value={form.coverImageUrl}
              onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          <Button type="submit" disabled={saving} className="w-full text-base py-3">
            {saving ? 'Creating Course…' : 'Publish Course'}
          </Button>
        </form>
      )}

      {courses.length === 0 ? (
        <EmptyState title="No courses found" body="Create your first course to begin adding lessons and quizzes." />
      ) : (
        <div className="space-y-4">
          {courses.map((c) => (
            <div key={c.id} className="index-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-white hover:text-emerald-400 transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-1">Slug: /{c.slug}</p>
                {c.description && <p className="text-sm text-gray-300 line-clamp-2 mt-2 max-w-2xl">{c.description}</p>}
              </div>

              <div className="flex items-center gap-3">
                <Link href={`/manage/courses/${c.documentId}`}>
                  <Button variant="secondary">Manage Lessons & Quizzes →</Button>
                </Link>
                <Button variant="danger" onClick={() => deleteCourse(c.documentId)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ManageCoursesPage() {
  return (
    <RoleGuard allow={['admin', 'content_manager', 'instructor']}>
      <ManageCoursesInner />
    </RoleGuard>
  );
}
