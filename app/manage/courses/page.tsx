// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { api } from '@/lib/api';
// import { useAuth } from '@/lib/auth-context';
// import { Button, EmptyState, ErrorBanner, Input, Label, Loading, Textarea } from '@/components/ui';
// import RoleGuard from '@/components/RoleGuard';

// function ManageCoursesInner() {
//   const { user } = useAuth();
//   const [courses, setCourses] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState({ title: '', description: '', coverImageUrl: '' });
//   const [saving, setSaving] = useState(false);

//   const load = async () => {
//     try {
//       const res = await api.get('/api/courses?populate=owner&sort=createdAt:desc');
//       const mine =
//         user?.role.type === 'instructor'
//           ? (res.data || []).filter((c: any) => (c.owner?.id ?? c.owner) === user.id)
//           : res.data || [];
//       setCourses(mine);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user]);

//   const createCourse = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setError('');
//     try {
//       await api.post('/api/courses', { data: form });
//       setForm({ title: '', description: '', coverImageUrl: '' });
//       setShowForm(false);
//       await load();
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const deleteCourse = async (id: number) => {
//     if (!confirm('Delete this course and all its lessons/quizzes?')) return;
//     try {
//       await api.del(`/api/courses/${id}`);
//       await load();
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   if (loading) return <Loading />;

//   return (
//     <div className="max-w-5xl mx-auto px-6 py-14">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="font-display text-4xl mb-1">Manage courses</h1>
//           <p className="text-ink-soft text-sm">
//             {user?.role.type === 'instructor' ? 'Courses you own.' : 'All courses on the platform.'}
//           </p>
//         </div>
//         <Button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : '+ New course'}</Button>
//       </div>

//       <ErrorBanner message={error} />

//       {showForm && (
//         <form onSubmit={createCourse} className="index-card p-6 mb-8 space-y-4">
//           <div>
//             <Label>Title</Label>
//             <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
//           </div>
//           <div>
//             <Label>Description</Label>
//             <Textarea
//               rows={3}
//               value={form.description}
//               onChange={(e) => setForm({ ...form, description: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label>Cover image URL (optional)</Label>
//             <Input
//               value={form.coverImageUrl}
//               onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
//               placeholder="https://…"
//             />
//           </div>
//           <Button type="submit" disabled={saving}>
//             {saving ? 'Creating…' : 'Create course'}
//           </Button>
//         </form>
//       )}

//       {courses.length === 0 ? (
//         <EmptyState title="No courses yet" body="Create your first course to get started." />
//       ) : (
//         <div className="space-y-3">
//           {courses.map((c) => (
//             <div key={c.id} className="index-card p-5 flex items-center justify-between">
//               <div>
//                 <p className="font-display text-lg">{c.title}</p>
//                 <p className="text-xs text-ink-soft font-mono">/{c.slug}</p>
//               </div>
//               <div className="flex gap-3">
//                 <Link href={`/manage/courses/${c.id}`}>
//                   <Button variant="secondary">Manage</Button>
//                 </Link>
//                 <Button variant="danger" onClick={() => deleteCourse(c.id)}>
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function ManageCoursesPage() {
//   return (
//     <RoleGuard allow={['admin', 'content_manager', 'instructor']}>
//       <ManageCoursesInner />
//     </RoleGuard>
//   );
// }





























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
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl mb-1">Manage courses</h1>
          <p className="text-ink-soft text-sm">
            {user?.role.type === 'instructor' ? 'Courses you own.' : 'All courses on the platform.'}
          </p>
        </div>
        <Button onClick={() => setShowForm((s) => !s)}>{showForm ? 'Cancel' : '+ New course'}</Button>
      </div>

      <ErrorBanner message={error} />

      {showForm && (
        <form onSubmit={createCourse} className="index-card p-6 mb-8 space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Cover image URL (optional)</Label>
            <Input
              value={form.coverImageUrl}
              onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
              placeholder="https://…"
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? 'Creating…' : 'Create course'}
          </Button>
        </form>
      )}

      {courses.length === 0 ? (
        <EmptyState title="No courses yet" body="Create your first course to get started." />
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <div key={c.id} className="index-card p-5 flex items-center justify-between">
              <div>
                <p className="font-display text-lg">{c.title}</p>
                <p className="text-xs text-ink-soft font-mono">/{c.slug}</p>
              </div>
              <div className="flex gap-3">
                <Link href={`/manage/courses/${c.documentId}`}>
                  <Button variant="secondary">Manage</Button>
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
