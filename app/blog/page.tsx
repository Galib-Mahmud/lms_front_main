'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, mediaUrl } from '@/lib/api';
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
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Platform Journal & News
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-3">Articles & Research</h1>
        <p className="text-gray-400 text-sm">Insights on software engineering, visual design systems, and modern pedagogy.</p>
      </div>

      <ErrorBanner message={error} />

      {loading ? (
        <Loading />
      ) : posts.length === 0 ? (
        <EmptyState title="No published articles yet" body="Check back soon for upcoming posts." />
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="index-card flex flex-col overflow-hidden group">
              {post.coverImageUrl && (
                <div className="h-48 w-full bg-black/40 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(post.coverImageUrl)}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-mono text-emerald-400 mb-2">
                    {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : ''}
                    {post.author?.fullName ? ` · By ${post.author.fullName}` : ''}
                  </p>
                  <h2 className="font-display text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors mb-3">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">{post.body}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Read Article →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
