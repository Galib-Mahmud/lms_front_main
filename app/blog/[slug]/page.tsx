'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api, mediaUrl } from '@/lib/api';
import { Loading, EmptyState, ErrorBanner } from '@/components/ui';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/blog-posts?filters[slug][$eq]=${slug}&populate=author`);
        setPost((res.data || [])[0] || null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return <Loading />;
  if (error) return <div className="max-w-3xl mx-auto px-6 py-14"><ErrorBanner message={error} /></div>;
  if (!post) return <EmptyState title="Article not found" body="The requested blog post could not be located." />;

  return (
    <article className="max-w-3xl mx-auto px-6 py-14">
      <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-400 hover:underline mb-8">
        ← Back to all journal articles
      </Link>

      <div className="mb-6">
        <p className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider mb-2">
          {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString(undefined, { dateStyle: 'full' }) : 'Draft'}
          {post.author?.fullName ? ` · Written by ${post.author.fullName}` : ''}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight">{post.title}</h1>
      </div>

      {post.coverImageUrl && (
        <div className="w-full h-80 rounded-2xl overflow-hidden mb-10 border border-white/10 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(post.coverImageUrl)} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="glass-card p-8 sm:p-12 border border-white/10">
        <div className="prose prose-invert max-w-none text-gray-200 text-lg leading-relaxed whitespace-pre-line">
          {post.body}
        </div>
      </div>
    </article>
  );
}
