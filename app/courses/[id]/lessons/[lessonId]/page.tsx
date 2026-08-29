'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Button, ErrorBanner, Loading, EmptyState } from '@/components/ui';

export default function LessonPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [lesson, setLesson] = useState<any>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const lessonRes = await api.get(`/api/lessons/${lessonId}?populate=course`);
        const lessonData = lessonRes.data;
        setLesson(lessonData);

        const courseNumericId = lessonData.course?.id;

        const [siblingsRes, progressRes] = await Promise.all([
          api.get(`/api/lessons?filters[course][id]=${courseNumericId}&sort=order:asc`),
          user?.role.type === 'student'
            ? api.get(`/api/lesson-progresses?filters[lesson][id]=${lessonData.id}`)
            : Promise.resolve({ data: [] }),
        ]);
        setAllLessons(siblingsRes.data || []);
        setCompleted(!!progressRes.data?.[0]?.completed);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, lessonId, user]);

  const markComplete = async () => {
    setSaving(true);
    setError('');
    try {
      await api.post(`/api/lessons/${lessonId}/complete`, {});
      setCompleted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (!lesson) return <EmptyState title="Lesson not found" body="The requested lesson does not exist or has been removed." />;

  const currentIndex = allLessons.findIndex((l) => l.documentId === lessonId);
  const nextLesson = allLessons[currentIndex + 1];
  const prevLesson = allLessons[currentIndex - 1];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <Link
          href={`/courses/${id}`}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-400 hover:underline"
        >
          ← Return to course overview
        </Link>
        <span className="font-mono text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          Lesson {currentIndex >= 0 ? currentIndex + 1 : 1} of {allLessons.length}
        </span>
      </div>

      <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">{lesson.title}</h1>
      <ErrorBanner message={error} />

      {/* Video Player */}
      {lesson.videoUrl && (
        <div className="aspect-video mb-10 rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl relative">
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Lesson Content Text */}
      {lesson.content && (
        <div className="glass-card p-8 mb-10 border border-white/10">
          <div className="prose prose-invert max-w-none text-gray-200 whitespace-pre-line leading-relaxed text-base sm:text-lg">
            {lesson.content}
          </div>
        </div>
      )}

      {/* Student Lesson Completion Widget */}
      {user?.role.type === 'student' && (
        <div className="glass-card p-6 mb-12 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${completed ? 'bg-emerald-500 text-black' : 'bg-white/10 text-gray-400'}`}>
              {completed ? '✓' : '⏳'}
            </div>
            <div>
              <p className="font-semibold text-white">
                {completed ? 'Lesson Completed!' : 'Ready to mark this lesson as finished?'}
              </p>
              <p className="text-xs text-gray-400">
                {completed ? 'Your progress has been recorded in your student ledger.' : 'Clicking below will update your course completion percentage.'}
              </p>
            </div>
          </div>

          <Button onClick={markComplete} disabled={completed || saving} variant={completed ? 'secondary' : 'primary'} className="whitespace-nowrap">
            {completed ? '✓ Marked Complete' : saving ? 'Updating…' : 'Mark Complete'}
          </Button>
        </div>
      )}

      {/* Sequence Navigation (Prev / Next) */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10 gap-4">
        {prevLesson ? (
          <Link href={`/courses/${id}/lessons/${prevLesson.documentId}`} className="index-card p-4 flex items-center gap-3 hover:border-emerald-500">
            <span className="text-emerald-400">←</span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Previous Lesson</span>
              <span className="font-semibold text-white text-sm line-clamp-1">{prevLesson.title}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link href={`/courses/${id}/lessons/${nextLesson.documentId}`} className="index-card p-4 flex items-center gap-3 hover:border-emerald-500 text-right">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 block">Next Lesson</span>
              <span className="font-semibold text-white text-sm line-clamp-1">{nextLesson.title}</span>
            </div>
            <span className="text-emerald-400">→</span>
          </Link>
        ) : (
          <Link href={`/courses/${id}`}>
            <Button variant="secondary">Finish & View Course</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
