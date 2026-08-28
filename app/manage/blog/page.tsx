// 'use client';

// import { useEffect, useState } from 'react';
// import { api } from '@/lib/api';
// import { Button, ErrorBanner, Input, Label, Loading, Textarea, EmptyState } from '@/components/ui';
// import RoleGuard from '@/components/RoleGuard';

// function ManageBlogInner() {
//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [form, setForm] = useState({ title: '', body: '', coverImageUrl: '', status: 'draft' as 'draft' | 'published' });
//   const [saving, setSaving] = useState(false);

//   const load = async () => {
//     try {
//       const res = await api.get('/api/blog-posts?populate=author&sort=createdAt:desc');
//       setPosts(res.data || []);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const resetForm = () => {
//     setEditingId(null);
//     setForm({ title: '', body: '', coverImageUrl: '', status: 'draft' });
//     setShowForm(false);
//   };

//   const startEdit = (post: any) => {
//     setEditingId(post.id);
//     setForm({ title: post.title, body: post.body, coverImageUrl: post.coverImageUrl || '', status: post.status });
//     setShowForm(true);
//   };

//   const save = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     setError('');
//     try {
//       const payload: any = { ...form };
//       if (form.status === 'published') payload.publishedDate = new Date().toISOString();
//       if (editingId) {
//         await api.put(`/api/blog-posts/${editingId}`, { data: payload });
//       } else {
//         await api.post('/api/blog-posts', { data: payload });
//       }
//       resetForm();
//       await load();
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const toggleStatus = async (post: any) => {
//     const nextStatus = post.status === 'published' ? 'draft' : 'published';
//     try {
//       await api.put(`/api/blog-posts/${post.id}`, {
//         data: { status: nextStatus, publishedDate: nextStatus === 'published' ? new Date().toISOString() : post.publishedDate },
//       });
//       await load();
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const remove = async (id: number) => {
//     if (!confirm('Delete this post?')) return;
//     try {
//       await api.del(`/api/blog-posts/${id}`);
//       await load();
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   if (loading) return <Loading />;

//   return (
//     <div className="max-w-4xl mx-auto px-6 py-14">
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="font-display text-4xl">Manage blog</h1>
//         <Button onClick={() => (showForm ? resetForm() : setShowForm(true))}>{showForm ? 'Cancel' : '+ New post'}</Button>
//       </div>

//       <ErrorBanner message={error} />

//       {showForm && (
//         <form onSubmit={save} className="index-card p-6 mb-8 space-y-4">
//           <div>
//             <Label>Title</Label>
//             <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
//           </div>
//           <div>
//             <Label>Body</Label>
//             <Textarea rows={8} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
//           </div>
//           <div>
//             <Label>Cover image URL (optional)</Label>
//             <Input value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} placeholder="https://…" />
//           </div>
//           <div>
//             <Label>Status</Label>
//             <select
//               value={form.status}
//               onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
//               className="w-full border border-line rounded-card px-3.5 py-2.5 bg-white/60"
//             >
//               <option value="draft">Draft</option>
//               <option value="published">Published</option>
//             </select>
//           </div>
//           <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update post' : 'Create post'}</Button>
//         </form>
//       )}

//       {posts.length === 0 ? (
//         <EmptyState title="No posts yet" />
//       ) : (
//         <div className="space-y-3">
//           {posts.map((post) => (
//             <div key={post.id} className="index-card p-5 flex items-center justify-between">
//               <div>
//                 <div className="flex items-center gap-2 mb-1">
//                   <span
//                     className={`text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full ${
//                       post.status === 'published' ? 'bg-forest text-paper' : 'bg-line text-ink-soft'
//                     }`}
//                   >
//                     {post.status}
//                   </span>
//                   <p className="font-display text-lg">{post.title}</p>
//                 </div>
//                 <p className="text-xs text-ink-soft font-mono">by {post.author?.fullName || post.author?.username || 'unknown'}</p>
//               </div>
//               <div className="flex gap-2">
//                 <Button variant="secondary" onClick={() => toggleStatus(post)}>
//                   {post.status === 'published' ? 'Unpublish' : 'Publish'}
//                 </Button>
//                 <Button variant="secondary" onClick={() => startEdit(post)}>Edit</Button>
//                 <Button variant="danger" onClick={() => remove(post.id)}>Delete</Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default function ManageBlogPage() {
//   return (
//     <RoleGuard allow={['admin', 'content_manager']}>
//       <ManageBlogInner />
//     </RoleGuard>
//   );
// }









































'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button, ErrorBanner, Input, Label, Loading, Textarea, EmptyState } from '@/components/ui';
import RoleGuard from '@/components/RoleGuard';

function ManageBlogInner() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', body: '', coverImageUrl: '', status: 'draft' as 'draft' | 'published' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await api.get('/api/blog-posts?populate=author&sort=createdAt:desc');
      setPosts(res.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: '', body: '', coverImageUrl: '', status: 'draft' });
    setShowForm(false);
  };

  const startEdit = (post: any) => {
    setEditingId(post.documentId);
    setForm({ title: post.title, body: post.body, coverImageUrl: post.coverImageUrl || '', status: post.status });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload: any = { ...form };
      if (form.status === 'published') payload.publishedDate = new Date().toISOString();
      if (editingId) {
        await api.put(`/api/blog-posts/${editingId}`, { data: payload });
      } else {
        await api.post('/api/blog-posts', { data: payload });
      }
      resetForm();
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (post: any) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await api.put(`/api/blog-posts/${post.documentId}`, {
        data: { status: nextStatus, publishedDate: nextStatus === 'published' ? new Date().toISOString() : post.publishedDate },
      });
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const remove = async (documentId: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.del(`/api/blog-posts/${documentId}`);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl">Manage blog</h1>
        <Button onClick={() => (showForm ? resetForm() : setShowForm(true))}>{showForm ? 'Cancel' : '+ New post'}</Button>
      </div>

      <ErrorBanner message={error} />

      {showForm && (
        <form onSubmit={save} className="index-card p-6 mb-8 space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label>Body</Label>
            <Textarea rows={8} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
          </div>
          <div>
            <Label>Cover image URL (optional)</Label>
            <Input value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} placeholder="https://…" />
          </div>
          <div>
            <Label>Status</Label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
              className="w-full border border-line rounded-card px-3.5 py-2.5 bg-white/60"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Update post' : 'Create post'}</Button>
        </form>
      )}

      {posts.length === 0 ? (
        <EmptyState title="No posts yet" />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="index-card p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      post.status === 'published' ? 'bg-forest text-paper' : 'bg-line text-ink-soft'
                    }`}
                  >
                    {post.status}
                  </span>
                  <p className="font-display text-lg">{post.title}</p>
                </div>
                <p className="text-xs text-ink-soft font-mono">by {post.author?.fullName || post.author?.username || 'unknown'}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => toggleStatus(post)}>
                  {post.status === 'published' ? 'Unpublish' : 'Publish'}
                </Button>
                <Button variant="secondary" onClick={() => startEdit(post)}>Edit</Button>
                <Button variant="danger" onClick={() => remove(post.documentId)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ManageBlogPage() {
  return (
    <RoleGuard allow={['admin', 'content_manager']}>
      <ManageBlogInner />
    </RoleGuard>
  );
}
