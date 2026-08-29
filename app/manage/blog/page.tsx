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
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-8 border-b border-white/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Editorial Management
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3">Manage Blog Posts</h1>
          <p className="text-gray-400 text-sm mt-1">Publish news, write tutorials, and toggle draft/published states.</p>
        </div>

        <Button onClick={() => (showForm ? resetForm() : setShowForm(true))} className="whitespace-nowrap px-6 py-3">
          {showForm ? 'Cancel Editor' : '+ New Blog Post'}
        </Button>
      </div>

      <ErrorBanner message={error} />

      {showForm && (
        <form onSubmit={save} className="glass-card p-8 mb-10 space-y-5 border border-emerald-500/30">
          <h2 className="font-display text-2xl font-bold text-white mb-2">{editingId ? 'Edit Article' : 'Compose New Article'}</h2>
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Article title..." />
          </div>
          <div>
            <Label>Body Content</Label>
            <Textarea rows={8} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required placeholder="Write article body in text/markdown format..." />
          </div>
          <div>
            <Label>Cover Image URL (Optional)</Label>
            <Input value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <Label>Publishing Status</Label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as 'draft' | 'published' })}
              className="w-full border border-white/10 rounded-xl px-4 py-3 bg-black/40 text-white font-semibold focus:outline-none"
            >
              <option value="draft" className="bg-slate-900 text-white">Draft (Hidden from public catalog)</option>
              <option value="published" className="bg-slate-900 text-white">Published (Visible in Journal)</option>
            </select>
          </div>
          <Button type="submit" disabled={saving} className="w-full text-base py-3">
            {saving ? 'Saving Post…' : editingId ? 'Update Article' : 'Publish Article'}
          </Button>
        </form>
      )}

      {posts.length === 0 ? (
        <EmptyState title="No blog posts found" body="Create your first post using the button above." />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="index-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      post.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-gray-400 border border-white/10'
                    }`}
                  >
                    {post.status}
                  </span>
                  <p className="font-display text-xl font-bold text-white">{post.title}</p>
                </div>
                <p className="text-xs text-gray-400 font-mono">By {post.author?.fullName || post.author?.username || 'Unknown'}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => toggleStatus(post)}>
                  {post.status === 'published' ? 'Unpublish' : 'Publish'}
                </Button>
                <Button variant="secondary" onClick={() => startEdit(post)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => remove(post.documentId)}>
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

export default function ManageBlogPage() {
  return (
    <RoleGuard allow={['admin', 'content_manager']}>
      <ManageBlogInner />
    </RoleGuard>
  );
}
