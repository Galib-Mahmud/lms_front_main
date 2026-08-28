'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
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
  if (error) return <div className="max-w-2xl mx-auto px-6 py-14"><ErrorBanner message={error} /></div>;
  if (!post) return <EmptyState title="Post not found" />;

  return (
    <article className="max-w-2xl mx-auto px-6 py-14">
      <p className="text-xs font-mono text-ink-soft mb-3">
        {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : ''}
        {post.author?.fullName ? ` · ${post.author.fullName}` : ''}
      </p>
      <h1 className="font-display text-4xl mb-6">{post.title}</h1>
      {post.coverImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImageUrl} alt="" className="w-full rounded-card mb-8 object-cover max-h-96" />
      )}
      <div className="prose prose-neutral max-w-none whitespace-pre-line leading-relaxed">{post.body}</div>
    </article>
  );
}
