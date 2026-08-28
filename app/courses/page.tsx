// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { api, mediaUrl } from '@/lib/api';
// import { useAuth } from '@/lib/auth-context';
// import { Button, EmptyState, ErrorBanner, Loading } from '@/components/ui';

// type Course = {
//   id: number;
//   documentId?: string;
//   title: string;
//   slug: string;
//   description: string;
//   coverImageUrl?: string;
// };

// export default function CoursesPage() {
//   const { user } = useAuth();
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [enrollingId, setEnrollingId] = useState<number | null>(null);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await api.get('/api/courses?populate=*&sort=createdAt:desc');
//         setCourses(
//           (res.data || []).map((c: any) => ({
//             id: c.id,
//             title: c.title || c.attributes?.title,
//             slug: c.slug || c.attributes?.slug,
//             description: c.description || c.attributes?.description,
//             coverImageUrl: c.coverImageUrl || c.attributes?.coverImageUrl,
//           }))
//         );

//         if (user?.role.type === 'student') {
//           const enrollments = await api.get('/api/enrollments?populate=course');
//           setEnrolledIds((enrollments.data || []).map((e: any) => e.course?.id || e.attributes?.course?.data?.id));
//         }
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [user]);

//   const handleEnroll = async (courseId: number) => {
//     setEnrollingId(courseId);
//     setError('');
//     try {
//       await api.post(`/api/courses/${courseId}/enroll`, {});
//       setEnrolledIds((ids) => [...ids, courseId]);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setEnrollingId(null);
//     }
//   };

//   if (loading) return <Loading />;

//   return (
//     <div className="max-w-6xl mx-auto px-6 py-14">
//       <h1 className="font-display text-4xl mb-2">Course library</h1>
//       <p className="text-ink-soft mb-8">Everything currently open for enrollment.</p>
//       <ErrorBanner message={error} />

//       {courses.length === 0 ? (
//         <EmptyState title="No courses yet" body="Check back soon — the library is just getting started." />
//       ) : (
//         <div className="grid md:grid-cols-3 gap-6 mt-6">
//           {courses.map((course) => {
//             const isEnrolled = enrolledIds.includes(course.id);
//             return (
//               <div key={course.id} className="index-card p-6 flex flex-col">
//                 {course.coverImageUrl && (
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img
//                     src={mediaUrl(course.coverImageUrl)}
//                     alt=""
//                     className="w-full h-36 object-cover rounded-card mb-4"
//                   />
//                 )}
//                 <Link href={`/courses/${course.id}`} className="font-display text-xl mb-2 hover:text-forest">
//                   {course.title}
//                 </Link>
//                 <p className="text-sm text-ink-soft mb-4 line-clamp-3 flex-1">{course.description}</p>
//                 {user?.role.type === 'student' ? (
//                   isEnrolled ? (
//                     <Link href={`/courses/${course.id}`}>
//                       <Button variant="secondary" className="w-full">
//                         Continue course
//                       </Button>
//                     </Link>
//                   ) : (
//                     <Button
//                       onClick={() => handleEnroll(course.id)}
//                       disabled={enrollingId === course.id}
//                       className="w-full"
//                     >
//                       {enrollingId === course.id ? 'Enrolling…' : 'Enroll'}
//                     </Button>
//                   )
//                 ) : (
//                   <Link href={`/courses/${course.id}`}>
//                     <Button variant="secondary" className="w-full">
//                       View course
//                     </Button>
//                   </Link>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }


































'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, mediaUrl } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Button, EmptyState, ErrorBanner, Loading } from '@/components/ui';

type Course = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl?: string;
};

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

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

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-14">
      <h1 className="font-display text-4xl mb-2">Course library</h1>
      <p className="text-ink-soft mb-8">Everything currently open for enrollment.</p>
      <ErrorBanner message={error} />

      {courses.length === 0 ? (
        <EmptyState title="No courses yet" body="Check back soon — the library is just getting started." />
      ) : (
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {courses.map((course) => {
            const isEnrolled = enrolledIds.includes(course.id);
            return (
              <div key={course.id} className="index-card p-6 flex flex-col">
                {course.coverImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(course.coverImageUrl)}
                    alt=""
                    className="w-full h-36 object-cover rounded-card mb-4"
                  />
                )}
                <Link href={`/courses/${course.documentId}`} className="font-display text-xl mb-2 hover:text-forest">
                  {course.title}
                </Link>
                <p className="text-sm text-ink-soft mb-4 line-clamp-3 flex-1">{course.description}</p>
                {user?.role.type === 'student' ? (
                  isEnrolled ? (
                    <Link href={`/courses/${course.documentId}`}>
                      <Button variant="secondary" className="w-full">
                        Continue course
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={() => handleEnroll(course)}
                      disabled={enrollingId === course.id}
                      className="w-full"
                    >
                      {enrollingId === course.id ? 'Enrolling…' : 'Enroll'}
                    </Button>
                  )
                ) : (
                  <Link href={`/courses/${course.documentId}`}>
                    <Button variant="secondary" className="w-full">
                      View course
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
