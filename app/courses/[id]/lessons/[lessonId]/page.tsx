// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { api } from '@/lib/api';
// import { useAuth } from '@/lib/auth-context';
// import { Button, ErrorBanner, Loading, EmptyState } from '@/components/ui';

// export default function LessonPage() {
//   const { id, lessonId } = useParams<{ id: string; lessonId: string }>();
//   const { user } = useAuth();
//   const router = useRouter();

//   const [lesson, setLesson] = useState<any>(null);
//   const [allLessons, setAllLessons] = useState<any[]>([]);
//   const [completed, setCompleted] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [lessonRes, siblingsRes, progressRes] = await Promise.all([
//           api.get(`/api/lessons/${lessonId}`),
//           api.get(`/api/lessons?filters[course][id]=${id}&sort=order:asc`),
//           user?.role.type === 'student'
//             ? api.get(`/api/lesson-progresses?filters[lesson][id]=${lessonId}`)
//             : Promise.resolve({ data: [] }),
//         ]);
//         setLesson(lessonRes.data);
//         setAllLessons(siblingsRes.data || []);
//         setCompleted(!!progressRes.data?.[0]?.completed);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [id, lessonId, user]);

//   const markComplete = async () => {
//     setSaving(true);
//     setError('');
//     try {
//       await api.post(`/api/lessons/${lessonId}/complete`, {});
//       setCompleted(true);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <Loading />;
//   if (!lesson) return <EmptyState title="Lesson not found" />;

//   const currentIndex = allLessons.findIndex((l) => l.id === Number(lessonId));
//   const nextLesson = allLessons[currentIndex + 1];
//   const prevLesson = allLessons[currentIndex - 1];

//   return (
//     <div className="max-w-3xl mx-auto px-6 py-14">
//       <Link href={`/courses/${id}`} className="font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-forest">
//         ← Back to course
//       </Link>
//       <h1 className="font-display text-4xl mt-3 mb-6">{lesson.title}</h1>
//       <ErrorBanner message={error} />

//       {lesson.videoUrl && (
//         <div className="aspect-video mb-6 bg-ink rounded-card overflow-hidden">
//           <iframe
//             src={lesson.videoUrl}
//             className="w-full h-full"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           />
//         </div>
//       )}

//       {lesson.content && (
//         <div className="prose max-w-none text-ink whitespace-pre-line leading-relaxed mb-10">{lesson.content}</div>
//       )}

//       {user?.role.type === 'student' && (
//         <div className="index-card p-6 flex items-center justify-between mb-10">
//           <p className="text-sm text-ink-soft">
//             {completed ? 'You completed this lesson.' : 'Mark this lesson complete once you\'re done.'}
//           </p>
//           <Button onClick={markComplete} disabled={completed || saving} variant={completed ? 'secondary' : 'primary'}>
//             {completed ? '✓ Completed' : saving ? 'Saving…' : 'Mark complete'}
//           </Button>
//         </div>
//       )}

//       <div className="flex justify-between">
//         {prevLesson ? (
//           <Link href={`/courses/${id}/lessons/${prevLesson.id}`} className="text-sm font-medium text-forest">
//             ← {prevLesson.title}
//           </Link>
//         ) : (
//           <span />
//         )}
//         {nextLesson ? (
//           <Link href={`/courses/${id}/lessons/${nextLesson.id}`} className="text-sm font-medium text-forest">
//             {nextLesson.title} →
//           </Link>
//         ) : (
//           <span />
//         )}
//       </div>
//     </div>
//   );
// }




































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
        // Fetch the lesson first (with its course populated) so we have the
        // course's numeric id available for the sibling-lessons/progress filters.
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
  if (!lesson) return <EmptyState title="Lesson not found" />;

  const currentIndex = allLessons.findIndex((l) => l.documentId === lessonId);
  const nextLesson = allLessons[currentIndex + 1];
  const prevLesson = allLessons[currentIndex - 1];

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <Link href={`/courses/${id}`} className="font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-forest">
        ← Back to course
      </Link>
      <h1 className="font-display text-4xl mt-3 mb-6">{lesson.title}</h1>
      <ErrorBanner message={error} />

      {lesson.videoUrl && (
        <div className="aspect-video mb-6 bg-ink rounded-card overflow-hidden">
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {lesson.content && (
        <div className="prose max-w-none text-ink whitespace-pre-line leading-relaxed mb-10">{lesson.content}</div>
      )}

      {user?.role.type === 'student' && (
        <div className="index-card p-6 flex items-center justify-between mb-10">
          <p className="text-sm text-ink-soft">
            {completed ? 'You completed this lesson.' : 'Mark this lesson complete once you\'re done.'}
          </p>
          <Button onClick={markComplete} disabled={completed || saving} variant={completed ? 'secondary' : 'primary'}>
            {completed ? '✓ Completed' : saving ? 'Saving…' : 'Mark complete'}
          </Button>
        </div>
      )}

      <div className="flex justify-between">
        {prevLesson ? (
          <Link href={`/courses/${id}/lessons/${prevLesson.documentId}`} className="text-sm font-medium text-forest">
            ← {prevLesson.title}
          </Link>
        ) : (
          <span />
        )}
        {nextLesson ? (
          <Link href={`/courses/${id}/lessons/${nextLesson.documentId}`} className="text-sm font-medium text-forest">
            {nextLesson.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
