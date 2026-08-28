// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { api } from '@/lib/api';
// import { Button, EmptyState, ErrorBanner, Loading } from '@/components/ui';
// import { ProgressBar, Stamp } from '@/components/Stamp';
// import RoleGuard from '@/components/RoleGuard';

// function MyCoursesInner() {
//   const [items, setItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const enrollRes = await api.get('/api/enrollments?populate=course');
//         const withProgress = await Promise.all(
//           (enrollRes.data || []).map(async (e: any) => {
//             const course = e.course;
//             const progressRes = await api.get(`/api/courses/${course.id}/progress`);
//             return { enrollment: e, course, progress: progressRes.data };
//           })
//         );
//         setItems(withProgress);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   if (loading) return <Loading />;

//   return (
//     <div className="max-w-5xl mx-auto px-6 py-14">
//       <h1 className="font-display text-4xl mb-2">My courses</h1>
//       <p className="text-ink-soft mb-8">Pick up where you left off.</p>
//       <ErrorBanner message={error} />

//       {items.length === 0 ? (
//         <EmptyState title="You haven't enrolled in anything yet" body="Browse the library to get started.">
//         </EmptyState>
//       ) : (
//         <div className="space-y-4">
//           {items.map(({ course, progress }) => (
//             <div key={course.id} className="index-card p-6 flex items-center gap-6">
//               <Stamp value={`${progress.percentage}%`} size="sm" />
//               <div className="flex-1">
//                 <Link href={`/courses/${course.id}`} className="font-display text-xl hover:text-forest">
//                   {course.title}
//                 </Link>
//                 <p className="text-xs text-ink-soft mb-2 font-mono">
//                   {progress.completedLessons} / {progress.totalLessons} lessons
//                 </p>
//                 <ProgressBar percentage={progress.percentage} />
//               </div>
//               <Link href={`/courses/${course.id}`}>
//                 <Button variant="secondary">Continue</Button>
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="mt-10">
//         <Link href="/courses" className="text-forest font-medium text-sm">
//           Browse more courses →
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default function MyCoursesPage() {
//   return (
//     <RoleGuard allow={['student']}>
//       <MyCoursesInner />
//     </RoleGuard>
//   );
// }


































'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button, EmptyState, ErrorBanner, Loading } from '@/components/ui';
import { ProgressBar, Stamp } from '@/components/Stamp';
import RoleGuard from '@/components/RoleGuard';

function MyCoursesInner() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const enrollRes = await api.get('/api/enrollments?populate=course');
        const withProgress = await Promise.all(
          (enrollRes.data || []).map(async (e: any) => {
            const course = e.course;
            const progressRes = await api.get(`/api/courses/${course.documentId}/progress`);
            return { enrollment: e, course, progress: progressRes.data };
          })
        );
        setItems(withProgress);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <h1 className="font-display text-4xl mb-2">My courses</h1>
      <p className="text-ink-soft mb-8">Pick up where you left off.</p>
      <ErrorBanner message={error} />

      {items.length === 0 ? (
        <EmptyState title="You haven't enrolled in anything yet" body="Browse the library to get started.">
        </EmptyState>
      ) : (
        <div className="space-y-4">
          {items.map(({ course, progress }) => (
            <div key={course.id} className="index-card p-6 flex items-center gap-6">
              <Stamp value={`${progress.percentage}%`} size="sm" />
              <div className="flex-1">
                <Link href={`/courses/${course.documentId}`} className="font-display text-xl hover:text-forest">
                  {course.title}
                </Link>
                <p className="text-xs text-ink-soft mb-2 font-mono">
                  {progress.completedLessons} / {progress.totalLessons} lessons
                </p>
                <ProgressBar percentage={progress.percentage} />
              </div>
              <Link href={`/courses/${course.documentId}`}>
                <Button variant="secondary">Continue</Button>
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Link href="/courses" className="text-forest font-medium text-sm">
          Browse more courses →
        </Link>
      </div>
    </div>
  );
}

export default function MyCoursesPage() {
  return (
    <RoleGuard allow={['student']}>
      <MyCoursesInner />
    </RoleGuard>
  );
}
