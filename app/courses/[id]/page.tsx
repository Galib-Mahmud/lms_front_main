// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';
// import { api } from '@/lib/api';
// import { useAuth } from '@/lib/auth-context';
// import { Button, ErrorBanner, Loading, EmptyState } from '@/components/ui';
// import { ProgressBar, Stamp } from '@/components/Stamp';

// export default function CourseDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const { user } = useAuth();
//   const [course, setCourse] = useState<any>(null);
//   const [lessons, setLessons] = useState<any[]>([]);
//   const [quizzes, setQuizzes] = useState<any[]>([]);
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [progress, setProgress] = useState<{ completedLessons: number; totalLessons: number; percentage: number } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [enrolling, setEnrolling] = useState(false);

//   const isPrivileged = user && ['admin', 'content_manager', 'instructor'].includes(user.role.type);

//   const load = async () => {
//     try {
//       const courseRes = await api.get(`/api/courses/${id}?populate=owner`);
//       setCourse(courseRes.data);

//       if (user?.role.type === 'student') {
//         const enrollments = await api.get(`/api/enrollments?populate=course`);
//         const enrolled = (enrollments.data || []).some((e: any) => (e.course?.id ?? e.course) === Number(id));
//         setIsEnrolled(enrolled);

//         if (enrolled) {
//           const [lessonsRes, quizzesRes, progressRes] = await Promise.all([
//             api.get(`/api/lessons?filters[course][id]=${id}&sort=order:asc`),
//             api.get(`/api/quizzes?filters[course][id]=${id}`),
//             api.get(`/api/courses/${id}/progress`),
//           ]);
//           setLessons(lessonsRes.data || []);
//           setQuizzes(quizzesRes.data || []);
//           setProgress(progressRes.data);
//         }
//       } else if (isPrivileged) {
//         const [lessonsRes, quizzesRes] = await Promise.all([
//           api.get(`/api/lessons?filters[course][id]=${id}&sort=order:asc`),
//           api.get(`/api/quizzes?filters[course][id]=${id}`),
//         ]);
//         setLessons(lessonsRes.data || []);
//         setQuizzes(quizzesRes.data || []);
//       }
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id, user]);

//   const handleEnroll = async () => {
//     setEnrolling(true);
//     setError('');
//     try {
//       await api.post(`/api/courses/${id}/enroll`, {});
//       setIsEnrolled(true);
//       await load();
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setEnrolling(false);
//     }
//   };

//   if (loading) return <Loading />;
//   if (!course) return <EmptyState title="Course not found" />;

//   const canSeeContent = isEnrolled || isPrivileged;

//   return (
//     <div className="max-w-4xl mx-auto px-6 py-14">
//       <span className="font-mono text-xs uppercase tracking-wide text-gold">Course</span>
//       <h1 className="font-display text-4xl mt-2 mb-4">{course.title}</h1>
//       <p className="text-ink-soft mb-6 whitespace-pre-line">{course.description}</p>
//       <ErrorBanner message={error} />

//       {user?.role.type === 'student' && !isEnrolled && (
//         <div className="index-card p-6 mb-8 flex items-center justify-between">
//           <p className="text-sm text-ink-soft">Enroll to unlock lessons and the course quiz.</p>
//           <Button onClick={handleEnroll} disabled={enrolling}>
//             {enrolling ? 'Enrolling…' : 'Enroll now'}
//           </Button>
//         </div>
//       )}

//       {user?.role.type === 'student' && isEnrolled && progress && (
//         <div className="index-card p-6 mb-8 flex items-center gap-6">
//           <Stamp value={`${progress.percentage}%`} label="complete" />
//           <div className="flex-1">
//             <p className="text-sm text-ink mb-2">
//               {progress.completedLessons} of {progress.totalLessons} lessons done
//             </p>
//             <ProgressBar percentage={progress.percentage} />
//           </div>
//         </div>
//       )}

//       {canSeeContent ? (
//         <>
//           <h2 className="font-display text-2xl mb-4">Lessons</h2>
//           {lessons.length === 0 ? (
//             <EmptyState title="No lessons yet" body="Content is on its way." />
//           ) : (
//             <ol className="space-y-2 mb-10">
//               {lessons.map((lesson: any, i: number) => (
//                 <li key={lesson.id}>
//                   <Link
//                     href={`/courses/${id}/lessons/${lesson.id}`}
//                     className="index-card flex items-center gap-4 px-5 py-4 hover:border-forest"
//                   >
//                     <span className="font-mono text-xs text-ink-soft w-6">{String(i + 1).padStart(2, '0')}</span>
//                     <span className="font-medium">{lesson.title}</span>
//                   </Link>
//                 </li>
//               ))}
//             </ol>
//           )}

//           {quizzes.length > 0 && (
//             <>
//               <h2 className="font-display text-2xl mb-4">Quiz</h2>
//               <div className="space-y-2">
//                 {quizzes.map((quiz: any) => (
//                   <Link
//                     key={quiz.id}
//                     href={`/quizzes/${quiz.id}`}
//                     className="index-card flex items-center justify-between px-5 py-4 hover:border-forest"
//                   >
//                     <span className="font-medium">{quiz.title}</span>
//                     <span className="text-sm text-ink-soft">{quiz.questions?.length || 0} questions →</span>
//                   </Link>
//                 ))}
//               </div>
//             </>
//           )}

//           {isPrivileged && (
//             <div className="mt-10">
//               <Link href={`/manage/courses/${id}`}>
//                 <Button variant="secondary">Manage this course</Button>
//               </Link>
//             </div>
//           )}
//         </>
//       ) : (
//         <p className="text-ink-soft text-sm">Enroll in this course to view its lessons and quiz.</p>
//       )}
//     </div>
//   );
// }






































'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
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
  if (!course) return <EmptyState title="Course not found" />;

  const canSeeContent = isEnrolled || isPrivileged;

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <span className="font-mono text-xs uppercase tracking-wide text-gold">Course</span>
      <h1 className="font-display text-4xl mt-2 mb-4">{course.title}</h1>
      <p className="text-ink-soft mb-6 whitespace-pre-line">{course.description}</p>
      <ErrorBanner message={error} />

      {user?.role.type === 'student' && !isEnrolled && (
        <div className="index-card p-6 mb-8 flex items-center justify-between">
          <p className="text-sm text-ink-soft">Enroll to unlock lessons and the course quiz.</p>
          <Button onClick={handleEnroll} disabled={enrolling}>
            {enrolling ? 'Enrolling…' : 'Enroll now'}
          </Button>
        </div>
      )}

      {user?.role.type === 'student' && isEnrolled && progress && (
        <div className="index-card p-6 mb-8 flex items-center gap-6">
          <Stamp value={`${progress.percentage}%`} label="complete" />
          <div className="flex-1">
            <p className="text-sm text-ink mb-2">
              {progress.completedLessons} of {progress.totalLessons} lessons done
            </p>
            <ProgressBar percentage={progress.percentage} />
          </div>
        </div>
      )}

      {canSeeContent ? (
        <>
          <h2 className="font-display text-2xl mb-4">Lessons</h2>
          {lessons.length === 0 ? (
            <EmptyState title="No lessons yet" body="Content is on its way." />
          ) : (
            <ol className="space-y-2 mb-10">
              {lessons.map((lesson: any, i: number) => (
                <li key={lesson.id}>
                  <Link
                    href={`/courses/${id}/lessons/${lesson.documentId}`}
                    className="index-card flex items-center gap-4 px-5 py-4 hover:border-forest"
                  >
                    <span className="font-mono text-xs text-ink-soft w-6">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-medium">{lesson.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
          )}

          {quizzes.length > 0 && (
            <>
              <h2 className="font-display text-2xl mb-4">Quiz</h2>
              <div className="space-y-2">
                {quizzes.map((quiz: any) => (
                  <Link
                    key={quiz.id}
                    href={`/quizzes/${quiz.documentId}`}
                    className="index-card flex items-center justify-between px-5 py-4 hover:border-forest"
                  >
                    <span className="font-medium">{quiz.title}</span>
                    <span className="text-sm text-ink-soft">{quiz.questions?.length || 0} questions →</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {isPrivileged && (
            <div className="mt-10">
              <Link href={`/manage/courses/${id}`}>
                <Button variant="secondary">Manage this course</Button>
              </Link>
            </div>
          )}
        </>
      ) : (
        <p className="text-ink-soft text-sm">Enroll in this course to view its lessons and quiz.</p>
      )}
    </div>
  );
}
