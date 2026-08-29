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
        const [res, resultsRes] = await Promise.all([
          api.get(`/api/quizzes/${id}`),
          api.get('/api/quiz-results').catch(() => ({ data: [] })),
        ]);
        setQuiz(res.data);
        if (resultsRes?.data && Array.isArray(resultsRes.data)) {
          const matched = resultsRes.data.find(
            (r: any) => (r.quiz?.documentId === id || r.quiz?.id === res.data?.id || r.quiz === res.data?.id)
          );
          if (matched) {
            setResult({
              score: matched.score,
              totalQuestions: matched.totalQuestions,
              percentage: matched.totalQuestions === 0 ? 0 : Math.round((matched.score / matched.totalQuestions) * 100),
            });
          }
        }
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
      const payload = res.data || res;
      setResult({
        score: payload.score ?? 0,
        totalQuestions: payload.totalQuestions ?? 0,
        percentage: payload.percentage ?? 0,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (!quiz) return <EmptyState title="Quiz not found" body="The requested quiz could not be found." />;

  const allAnswered = quiz.questions.every((_: any, i: number) => answers[i] !== undefined);

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="glass-card p-10 border border-amber-500/30 shadow-2xl">
          <div className="flex justify-center mb-6">
            <Stamp value={`${result.score}/${result.totalQuestions}`} label="graded" color="gold" />
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-2">{result.percentage}% — Evaluation Complete</h1>
          <p className="text-gray-300 mb-8">Your score has been verified and permanently recorded in your student profile.</p>
          <Link href={`/courses/${quiz.course?.documentId ?? quiz.course}`}>
            <Button className="px-8 py-3">Return to Course Overview →</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <div className="mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Knowledge Check
        </span>
        <h1 className="font-display text-4xl font-bold text-white mt-3 mb-2">{quiz.title}</h1>
        <p className="text-gray-400 text-sm">{quiz.questions.length} Questions · Auto-graded server-side on submit</p>
      </div>

      <ErrorBanner message={error} />

      <div className="space-y-6 my-8">
        {quiz.questions.map((q: any, qi: number) => (
          <div key={qi} className="glass-card p-6 border border-white/10">
            <h3 className="font-display text-lg font-bold text-white mb-4">
              <span className="font-mono text-emerald-400 mr-2">{qi + 1}.</span> {q.questionText}
            </h3>

            <div className="space-y-2.5">
              {(q.options || []).map((opt: string, oi: number) => {
                const isSelected = answers[qi] === oi;
                return (
                  <label
                    key={oi}
                    className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-md shadow-emerald-950/40'
                        : 'border-white/10 bg-black/20 text-gray-300 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      checked={isSelected}
                      onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      className="accent-emerald-500 w-4 h-4"
                    />
                    <span className="text-sm font-medium">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={submit} disabled={!allAnswered || submitting} className="w-full text-base py-3.5">
        {submitting ? 'Grading Answers…' : allAnswered ? 'Submit & Grade Quiz' : 'Please Answer All Questions to Submit'}
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
