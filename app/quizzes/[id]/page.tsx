// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';
// import { api } from '@/lib/api';
// import { Button, ErrorBanner, Loading, EmptyState } from '@/components/ui';
// import { Stamp } from '@/components/Stamp';
// import RoleGuard from '@/components/RoleGuard';

// function QuizInner() {
//   const { id } = useParams<{ id: string }>();
//   const [quiz, setQuiz] = useState<any>(null);
//   const [answers, setAnswers] = useState<Record<number, number>>({});
//   const [result, setResult] = useState<{ score: number; totalQuestions: number; percentage: number } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await api.get(`/api/quizzes/${id}`);
//         setQuiz(res.data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [id]);

//   const submit = async () => {
//     if (!quiz) return;
//     const ordered = quiz.questions.map((_: any, i: number) => (answers[i] === undefined ? -1 : answers[i]));
//     setSubmitting(true);
//     setError('');
//     try {
//       const res = await api.post(`/api/quizzes/${id}/submit`, { answers: ordered });
//       setResult(res.data);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (loading) return <Loading />;
//   if (!quiz) return <EmptyState title="Quiz not found" />;

//   const allAnswered = quiz.questions.every((_: any, i: number) => answers[i] !== undefined);

//   if (result) {
//     return (
//       <div className="max-w-2xl mx-auto px-6 py-20 text-center">
//         <div className="flex justify-center mb-6">
//           <Stamp value={`${result.score}/${result.totalQuestions}`} label="graded" color="gold" />
//         </div>
//         <h1 className="font-display text-3xl mb-2">{result.percentage}% — nice work</h1>
//         <p className="text-ink-soft mb-8">Your score has been saved to your quiz results.</p>
//         <Link href={`/courses/${quiz.course?.id ?? quiz.course}`}>
//           <Button>Back to course</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto px-6 py-14">
//       <h1 className="font-display text-3xl mb-1">{quiz.title}</h1>
//       <p className="text-ink-soft mb-8 text-sm">{quiz.questions.length} questions · auto-graded on submit</p>
//       <ErrorBanner message={error} />

//       <div className="space-y-8 my-8">
//         {quiz.questions.map((q: any, qi: number) => (
//           <div key={qi} className="index-card p-6">
//             <p className="font-medium mb-4">
//               {qi + 1}. {q.questionText}
//             </p>
//             <div className="space-y-2">
//               {(q.options || []).map((opt: string, oi: number) => (
//                 <label
//                   key={oi}
//                   className={`flex items-center gap-3 border rounded-card px-4 py-2.5 cursor-pointer transition-colors ${
//                     answers[qi] === oi ? 'border-forest bg-forest/5' : 'border-line hover:border-forest/50'
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name={`q-${qi}`}
//                     checked={answers[qi] === oi}
//                     onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
//                   />
//                   <span className="text-sm">{opt}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       <Button onClick={submit} disabled={!allAnswered || submitting} className="w-full">
//         {submitting ? 'Grading…' : 'Submit quiz'}
//       </Button>
//     </div>
//   );
// }

// export default function QuizPage() {
//   return (
//     <RoleGuard allow={['student']}>
//       <QuizInner />
//     </RoleGuard>
//   );
// }



























'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button, ErrorBanner, Loading, EmptyState } from '@/components/ui';
import { Stamp } from '@/components/Stamp';
import RoleGuard from '@/components/RoleGuard';

function QuizInner() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; totalQuestions: number; percentage: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/quizzes/${id}`);
        setQuiz(res.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const submit = async () => {
    if (!quiz) return;
    const ordered = quiz.questions.map((_: any, i: number) => (answers[i] === undefined ? -1 : answers[i]));
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post(`/api/quizzes/${id}/submit`, { answers: ordered });
      setResult(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (!quiz) return <EmptyState title="Quiz not found" />;

  const allAnswered = quiz.questions.every((_: any, i: number) => answers[i] !== undefined);

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="flex justify-center mb-6">
          <Stamp value={`${result.score}/${result.totalQuestions}`} label="graded" color="gold" />
        </div>
        <h1 className="font-display text-3xl mb-2">{result.percentage}% — nice work</h1>
        <p className="text-ink-soft mb-8">Your score has been saved to your quiz results.</p>
        <Link href={`/courses/${quiz.course?.documentId ?? quiz.course}`}>
          <Button>Back to course</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <h1 className="font-display text-3xl mb-1">{quiz.title}</h1>
      <p className="text-ink-soft mb-8 text-sm">{quiz.questions.length} questions · auto-graded on submit</p>
      <ErrorBanner message={error} />

      <div className="space-y-8 my-8">
        {quiz.questions.map((q: any, qi: number) => (
          <div key={qi} className="index-card p-6">
            <p className="font-medium mb-4">
              {qi + 1}. {q.questionText}
            </p>
            <div className="space-y-2">
              {(q.options || []).map((opt: string, oi: number) => (
                <label
                  key={oi}
                  className={`flex items-center gap-3 border rounded-card px-4 py-2.5 cursor-pointer transition-colors ${
                    answers[qi] === oi ? 'border-forest bg-forest/5' : 'border-line hover:border-forest/50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    checked={answers[qi] === oi}
                    onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={submit} disabled={!allAnswered || submitting} className="w-full">
        {submitting ? 'Grading…' : 'Submit quiz'}
      </Button>
    </div>
  );
}

export default function QuizPage() {
  return (
    <RoleGuard allow={['student']}>
      <QuizInner />
    </RoleGuard>
  );
}
