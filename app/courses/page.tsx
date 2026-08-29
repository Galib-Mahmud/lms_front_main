'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, mediaUrl } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Button, EmptyState, ErrorBanner, Loading, Input } from '@/components/ui';

type Course = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl?: string;
  owner?: { id: number; fullName?: string; username?: string };
};

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/courses?populate=*&sort=createdAt:desc');
        setCourses(
          (res.data || []).map((c: any) => ({
            id: c.id,
            documentId: c.documentId,
            title: c.title || c.attributes?.title,
            slug: c.slug || c.attributes?.slug,
            description: c.description || c.attributes?.description,
            coverImageUrl: c.coverImageUrl || c.attributes?.coverImageUrl,
            owner: c.owner,
          }))
        );

        if (user?.role.type === 'student') {
          const enrollments = await api.get('/api/enrollments?populate=course');
          setEnrolledIds((enrollments.data || []).map((e: any) => e.course?.id || e.attributes?.course?.data?.id));
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleEnroll = async (course: Course) => {
    setEnrollingId(course.id);
    setError('');
    try {
      await api.post(`/api/courses/${course.documentId}/enroll`, {});
      setEnrolledIds((ids) => [...ids, course.id]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3 border border-emerald-500/20">
            Catalog & Enrollment
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white">Academic Course Library</h1>
          <p className="text-gray-400 text-sm mt-2">Explore courses, master new technical domains, and prove your progress.</p>
        </div>

        <div className="w-full md:w-80">
          <Input
            placeholder="🔍 Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border-white/15"
          />
        </div>
      </div>

      <ErrorBanner message={error} />

      {filteredCourses.length === 0 ? (
        <EmptyState title="No courses found" body="Try refining your search terms or check back soon." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledIds.includes(course.id);
            return (
              <div key={course.id} className="index-card flex flex-col overflow-hidden group">
                {/* Cover Image */}
                <div className="relative h-48 w-full bg-black/40 overflow-hidden">
                  {course.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mediaUrl(course.coverImageUrl)}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-950 to-amber-950/40 flex items-center justify-center text-4xl">
                      📖
                    </div>
                  )}

                  {isEnrolled && (
                    <span className="absolute top-3 right-3 bg-emerald-500 text-black text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      ✓ Enrolled
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        Course #{course.id}
                      </span>
                    </div>

                    <Link
                      href={`/courses/${course.documentId}`}
                      className="font-display text-xl font-bold text-white hover:text-emerald-400 transition-colors line-clamp-2 mb-3"
                    >
                      {course.title}
                    </Link>

                    <p className="text-sm text-gray-400 line-clamp-3 mb-6 leading-relaxed">{course.description}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                    {user?.role.type === 'student' ? (
                      isEnrolled ? (
                        <Link href={`/courses/${course.documentId}`} className="w-full">
                          <Button variant="secondary" className="w-full">
                            Continue Learning →
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          onClick={() => handleEnroll(course)}
                          disabled={enrollingId === course.id}
                          className="w-full"
                        >
                          {enrollingId === course.id ? 'Enrolling…' : 'Enroll Now'}
                        </Button>
                      )
                    ) : (
                      <Link href={`/courses/${course.documentId}`} className="w-full">
                        <Button variant="secondary" className="w-full">
                          View Curriculum →
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
