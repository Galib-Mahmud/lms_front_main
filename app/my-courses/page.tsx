'use strict';

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth, ROLE_LABELS } from '@/lib/auth-context';
import { Button, EmptyState, ErrorBanner, Loading } from '@/components/ui';
import { ProgressBar, Stamp } from '@/components/Stamp';
import AuthCard from '@/components/AuthCard';

export default function MyCoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const enrollRes = await api.get('/api/enrollments?populate=course');
        const withProgress = await Promise.all(
          (enrollRes.data || []).map(async (e: any) => {
            const course = e.course;
            if (!course) return null;
            const courseId = course.documentId || course.id;
            let progress = { percentage: 0, completedLessons: 0, totalLessons: 0 };
            try {
              const progressRes = await api.get(`/api/courses/${courseId}/progress`);
              if (progressRes?.data) {
                progress = progressRes.data;
              }
            } catch {
              // Graceful fallback if progress lookup is delayed
            }
            return { enrollment: e, course, progress };
          })
        );
        setItems(withProgress.filter(Boolean));
      } catch (err: any) {
        setError(err.message || 'Could not load your enrolled courses.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, authLoading]);

  if (loading || authLoading) return <Loading />;

  // Guest State: Render Clean Auth Card inline when not logged in
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Student Dashboard
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3">
            Access Your Learning Portal
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Sign in or create a student account to view your enrolled courses, track lesson progress, and take quizzes.
          </p>
        </div>

        <AuthCard initialMode="login" />
      </div>
    );
  }

  // Calculate overall metrics
  const totalEnrolled = items.length;
  const completedLessonsTotal = items.reduce((acc, curr) => acc + (curr.progress?.completedLessons || 0), 0);
  const totalLessonsOverall = items.reduce((acc, curr) => acc + (curr.progress?.totalLessons || 0), 0);
  const overallPercentage = totalLessonsOverall > 0 ? Math.round((completedLessonsTotal / totalLessonsOverall) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16">
      {/* Human-crafted User Profile Card */}
      <div className="glass-card p-8 border border-white/10 shadow-2xl mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-slate-950 font-display text-2xl font-extrabold flex items-center justify-center shadow-lg shadow-emerald-950/50">
              {(user.fullName || user.username).substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  {user.fullName || user.username}
                </h1>
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {ROLE_LABELS[(user.role?.type || (typeof user.role === 'string' ? user.role : 'student')) as keyof typeof ROLE_LABELS] || 'Student'}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-white font-mono">{totalEnrolled}</p>
              <p className="text-[11px] text-gray-400 font-sans mt-0.5">Enrolled Courses</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-emerald-400 font-mono">{completedLessonsTotal}</p>
              <p className="text-[11px] text-gray-400 font-sans mt-0.5">Completed Lessons</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-amber-400 font-mono">{overallPercentage}%</p>
              <p className="text-[11px] text-gray-400 font-sans mt-0.5">Overall Completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">My Enrolled Courses</h2>
          <p className="text-gray-400 text-xs mt-0.5">Continue your learning path or explore new topics.</p>
        </div>

        <Link href="/courses">
          <Button variant="secondary" className="text-xs font-mono uppercase tracking-wider">
            + Explore Catalog
          </Button>
        </Link>
      </div>

      <ErrorBanner message={error} />

      {items.length === 0 ? (
        <EmptyState title="You haven't enrolled in any courses yet" body="Browse our catalog and pick your first course to begin.">
          <Link href="/courses" className="mt-4 inline-block">
            <Button>Browse Course Catalog →</Button>
          </Link>
        </EmptyState>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {items.map(({ course, progress }) => (
            <div key={course.id} className="glass-card p-6 border border-white/10 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <Stamp value={`${progress?.percentage || 0}%`} size="sm" color={progress?.percentage === 100 ? 'gold' : 'forest'} />
                  <span className="font-mono text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    {progress?.completedLessons || 0} / {progress?.totalLessons || 0} lessons done
                  </span>
                </div>

                <Link href={`/courses/${course.documentId || course.id}`} className="font-display text-2xl font-bold text-white hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                  {course.title}
                </Link>
                <p className="text-sm text-gray-400 line-clamp-2 mb-6">{course.description}</p>
              </div>

              <div>
                <div className="mb-4">
                  <ProgressBar percentage={progress?.percentage || 0} />
                </div>

                <Link href={`/courses/${course.documentId || course.id}`}>
                  <Button variant="primary" className="w-full">
                    Continue Learning →
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
