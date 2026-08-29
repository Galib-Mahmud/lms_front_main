'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api, mediaUrl } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Button, ErrorBanner, Loading, EmptyState } from '@/components/ui';
import { ProgressBar, Stamp } from '@/components/Stamp';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState<{ completedLessons: number; totalLessons: number; percentage: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  const isPrivileged = user && ['admin', 'content_manager', 'instructor'].includes(user.role.type);

  const load = async () => {
    try {
      const courseRes = await api.get(`/api/courses/${id}?populate=owner`);
      setCourse(courseRes.data);

      const courseNumericId = courseRes.data.id;

      if (user?.role.type === 'student') {
        const enrollments = await api.get(`/api/enrollments?populate=course`);
        const enrolled = (enrollments.data || []).some(
          (e: any) => (e.course?.id ?? e.course) === courseNumericId
        );
        setIsEnrolled(enrolled);

        if (enrolled) {
          const [lessonsRes, quizzesRes, progressRes] = await Promise.all([
            api.get(`/api/lessons?filters[course][id]=${courseNumericId}&sort=order:asc`),
            api.get(`/api/quizzes?filters[course][id]=${courseNumericId}`),
            api.get(`/api/courses/${id}/progress`),
          ]);
          setLessons(lessonsRes.data || []);
          setQuizzes(quizzesRes.data || []);
          setProgress(progressRes.data);
        }
      } else if (isPrivileged) {
        const [lessonsRes, quizzesRes] = await Promise.all([
          api.get(`/api/lessons?filters[course][id]=${courseNumericId}&sort=order:asc`),
          api.get(`/api/quizzes?filters[course][id]=${courseNumericId}`),
        ]);
        setLessons(lessonsRes.data || []);
        setQuizzes(quizzesRes.data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setError('');
    try {
      await api.post(`/api/courses/${id}/enroll`, {});
      setIsEnrolled(true);
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <Loading />;
  if (!course) return <EmptyState title="Course not found" body="The requested course could not be located." />;

  const canSeeContent = isEnrolled || isPrivileged;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Navigation Breadcrumb */}
      <Link href="/courses" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-400 hover:underline mb-6">
        ← Back to course catalog
      </Link>

      {/* Banner / Cover */}
      {course.coverImageUrl && (
        <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8 border border-white/10 relative shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(course.coverImageUrl)} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-xs font-mono font-bold uppercase tracking-wider bg-amber-500 text-black px-3 py-1 rounded-full">
              {course.owner?.fullName ? `Instructor: ${course.owner.fullName}` : 'Official Course'}
            </span>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="mb-10">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">{course.title}</h1>
        <p className="text-gray-300 text-base sm:text-lg whitespace-pre-line leading-relaxed max-w-3xl">{course.description}</p>
      </div>

      <ErrorBanner message={error} />

      {/* Student Un-Enrolled Callout */}
      {user?.role.type === 'student' && !isEnrolled && (
        <div className="glass-card p-8 mb-10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-emerald-950/40 to-transparent">
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-1">Unlock Full Curriculum</h3>
            <p className="text-sm text-gray-300">Enroll now to gain instant access to lessons, video modules, and auto-graded quizzes.</p>
          </div>
          <Button onClick={handleEnroll} disabled={enrolling} className="whitespace-nowrap px-8 py-3.5 text-base">
            {enrolling ? 'Enrolling…' : 'Enroll Now'}
          </Button>
        </div>
      )}

      {/* Student Progress Banner */}
      {user?.role.type === 'student' && isEnrolled && progress && (
        <div className="glass-card p-6 mb-10 border border-amber-500/30 flex items-center gap-6 bg-amber-500/5">
          <Stamp value={`${progress.percentage}%`} label="completed" color="gold" />
          <div className="flex-1">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-white">Your Learning Progress</span>
              <span className="text-amber-400 font-mono">{progress.completedLessons} of {progress.totalLessons} lessons marked complete</span>
            </div>
            <ProgressBar percentage={progress.percentage} />
          </div>
        </div>
      )}

      {/* Course Content Modules */}
      {canSeeContent ? (
        <div className="space-y-10">
          {/* Lessons Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl font-bold text-white">Course Lessons ({lessons.length})</h2>
              {isPrivileged && (
                <Link href={`/manage/courses/${id}`}>
                  <Button variant="secondary" className="text-xs font-mono uppercase tracking-wider">
                    ⚙️ Edit Lessons in Management
                  </Button>
                </Link>
              )}
            </div>

            {lessons.length === 0 ? (
              <EmptyState title="No lessons added yet" body="The instructor is preparing lesson materials." />
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson: any, i: number) => (
                  <Link
                    key={lesson.id}
                    href={`/courses/${id}/lessons/${lesson.documentId}`}
                    className="index-card flex items-center justify-between p-5 hover:border-emerald-500/50 group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-emerald-400 font-bold text-sm">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {lesson.title}
                        </h3>
                        {lesson.videoUrl && (
                          <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1 mt-0.5">
                            🎥 Video Included
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-emerald-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                      Start Lesson →
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Quizzes Section */}
          {quizzes.length > 0 && (
            <section className="pt-6 border-t border-white/10">
              <h2 className="font-display text-3xl font-bold text-white mb-6">Knowledge Evaluation</h2>
              <div className="space-y-3">
                {quizzes.map((quiz: any) => (
                  <Link
                    key={quiz.id}
                    href={`/quizzes/${quiz.documentId}`}
                    className="index-card flex items-center justify-between p-6 border-amber-500/30 hover:border-amber-500 group bg-amber-500/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-2xl font-bold">
                        📝
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                          {quiz.title}
                        </h3>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {quiz.questions?.length || 0} Multiple Choice Questions · Auto-graded
                        </p>
                      </div>
                    </div>

                    <Button variant="secondary" className="group-hover:border-amber-400 group-hover:text-amber-300">
                      Take Quiz →
                    </Button>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center bg-white/[0.02]">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-display text-2xl font-bold text-white mb-2">Lessons Locked</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">Please enroll in this course above to gain access to lessons and evaluation modules.</p>
        </div>
      )}
    </div>
  );
}
