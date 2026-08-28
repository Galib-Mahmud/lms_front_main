'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Loading, EmptyState, ErrorBanner } from '@/components/ui';

export default function BlogListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/blog-posts?populate=author&sort=publishedDate:desc');
        setPosts(res.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <span className="font-mono text-xs uppercase tracking-wide text-gold">Journal</span>
      <h1 className="font-display text-4xl mt-2 mb-8">From the platform</h1>
      <ErrorBanner message={error} />

      {loading ? (
        <Loading />
      ) : posts.length === 0 ? (
        <EmptyState title="No posts published yet" body="Check back soon." />
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="index-card block p-6 hover:border-forest">
              <p className="text-xs font-mono text-ink-soft mb-2">
                {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString() : ''}
                {post.author?.fullName ? ` · ${post.author.fullName}` : ''}
              </p>
              <h2 className="font-display text-2xl">{post.title}</h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
