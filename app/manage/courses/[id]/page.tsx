'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Button, ErrorBanner, Input, Label, Loading, Textarea, EmptyState } from '@/components/ui';
import { ProgressBar } from '@/components/Stamp';
import RoleGuard from '@/components/RoleGuard';

type Lesson = { id: number; documentId: string; title: string; content?: string; videoUrl?: string; order: number };
type Question = { questionText: string; options: string[]; correctOptionIndex: number };
type Quiz = { id: number; documentId: string; title: string; questions: Question[] };

const emptyQuestion = (): Question => ({ questionText: '', options: ['', ''], correctOptionIndex: 0 });

function ManageCourseInner() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [course, setCourse] = useState<any>(null);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', coverImageUrl: '' });
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingCourse, setSavingCourse] = useState(false);

  const [showLessonForm, setShowLessonForm] = useState(false);
  const [lessonForm, setLessonForm] = useState({ title: '', content: '', videoUrl: '', order: 0 });
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizForm, setQuizForm] = useState<{ title: string; questions: Question[] }>({
    title: '',
    questions: [emptyQuestion()],
  });

  const load = async () => {
    try {
      const courseRes = await api.get(`/api/courses/${id}?populate=owner`);
      setCourse(courseRes.data);
      setCourseForm({
        title: courseRes.data.title,
        description: courseRes.data.description || '',
        coverImageUrl: courseRes.data.coverImageUrl || '',
      });

      const courseNumericId = courseRes.data.id;

      const [lessonsRes, quizzesRes] = await Promise.all([
        api.get(`/api/lessons?filters[course][id]=${courseNumericId}&sort=order:asc`),
        api.get(`/api/quizzes?filters[course][id]=${courseNumericId}`),
      ]);
      setLessons(lessonsRes.data || []);
      setQuizzes(quizzesRes.data || []);

      const enrollments = await api.get(
        `/api/enrollments?filters[course][id]=${courseNumericId}&populate=user`
      );
      const withProgress = await Promise.all(
        (enrollments.data || []).map(async (e: any) => {
          try {
            const p = await api.get(`/api/courses/${id}/progress?studentId=${e.user?.id ?? e.user}`);
            return { user: e.user, progress: p.data };
          } catch {
            return { user: e.user, progress: null };
          }
        })
      );
      setStudents(withProgress);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const saveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCourse(true);
    setError('');
    try {
      await api.put(`/api/courses/${id}`, { data: courseForm });
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingCourse(false);
    }
  };

  const startEditLesson = (lesson: Lesson) => {
    setEditingLessonId(lesson.documentId);
    setLessonForm({
      title: lesson.title,
      content: lesson.content || '',
      videoUrl: lesson.videoUrl || '',
      order: lesson.order || 0,
    });
    setShowLessonForm(true);
  };

  const resetLessonForm = () => {
    setEditingLessonId(null);
    setLessonForm({ title: '', content: '', videoUrl: '', order: lessons.length + 1 });
    setShowLessonForm(false);
  };

  const saveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingLessonId) {
        await api.put(`/api/lessons/${editingLessonId}`, { data: lessonForm });
      } else {
        await api.post('/api/lessons', { data: { ...lessonForm, course: id } });
      }
      resetLessonForm();
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteLesson = async (lessonDocId: string) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await api.del(`/api/lessons/${lessonDocId}`);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateQuestion = (qi: number, patch: Partial<Question>) => {
    setQuizForm((f) => ({
      ...f,
      questions: f.questions.map((q, i) => (i === qi ? { ...q, ...patch } : q)),
    }));
  };

  const updateOption = (qi: number, oi: number, value: string) => {
    setQuizForm((f) => ({
      ...f,
      questions: f.questions.map((q, i) =>
        i === qi ? { ...q, options: q.options.map((o, j) => (j === oi ? value : o)) } : q
      ),
    }));
  };

  const addOption = (qi: number) => {
    setQuizForm((f) => ({
      ...f,
      questions: f.questions.map((q, i) => (i === qi ? { ...q, options: [...q.options, ''] } : q)),
    }));
  };

  const addQuestion = () => setQuizForm((f) => ({ ...f, questions: [...f.questions, emptyQuestion()] }));

  const removeQuestion = (qi: number) =>
    setQuizForm((f) => ({ ...f, questions: f.questions.filter((_, i) => i !== qi) }));

  const saveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/quizzes', { data: { title: quizForm.title, questions: quizForm.questions, course: id } });
      setQuizForm({ title: '', questions: [emptyQuestion()] });
      setShowQuizForm(false);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteQuiz = async (quizDocId: string) => {
    if (!confirm('Delete this quiz?')) return;
    try {
      await api.del(`/api/quizzes/${quizDocId}`);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (!course) return <EmptyState title="Course not found" />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <Link href="/manage/courses" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-emerald-400 hover:underline mb-6">
        ← Back to managed courses list
      </Link>

      <div className="mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Course Curriculum Editor
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3">{course.title}</h1>
      </div>

      <ErrorBanner message={error} />

      {/* Course Details Settings Form */}
      <section className="glass-card p-8 mb-10 border border-white/10">
        <h2 className="font-display text-2xl font-bold text-white mb-4">Course General Information</h2>
        <form onSubmit={saveCourse} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} required />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={3} value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} />
          </div>
          <div>
            <Label>Cover Image URL</Label>
            <Input value={courseForm.coverImageUrl} onChange={(e) => setCourseForm({ ...courseForm, coverImageUrl: e.target.value })} placeholder="https://…" />
          </div>
          <Button type="submit" disabled={savingCourse}>{savingCourse ? 'Saving Changes…' : 'Save General Details'}</Button>
        </form>
      </section>

      {/* Lessons Management Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl font-bold text-white">Lessons ({lessons.length})</h2>
          <Button variant="secondary" onClick={() => (showLessonForm ? resetLessonForm() : (setLessonForm({ title: '', content: '', videoUrl: '', order: lessons.length + 1 }), setShowLessonForm(true)))}>
            {showLessonForm ? 'Cancel' : '+ Add Lesson'}
          </Button>
        </div>

        {showLessonForm && (
          <form onSubmit={saveLesson} className="glass-card p-8 mb-6 space-y-4 border border-emerald-500/30">
            <h3 className="font-display text-xl font-bold text-white">{editingLessonId ? 'Edit Lesson' : 'Add New Lesson'}</h3>
            <div>
              <Label>Lesson Title</Label>
              <Input value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required placeholder="e.g. 01. Introduction to Headless CMS" />
            </div>
            <div>
              <Label>Lesson Content (Text / Markdown)</Label>
              <Textarea rows={6} value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} placeholder="Detailed text content for students..." />
            </div>
            <div>
              <Label>Embed Video URL (YouTube / MP4)</Label>
              <Input value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} placeholder="https://www.youtube.com/embed/..." />
            </div>
            <div>
              <Label>Display Order Position</Label>
              <Input type="number" value={lessonForm.order} onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) })} />
            </div>
            <Button type="submit" className="w-full text-base py-3">{editingLessonId ? 'Update Lesson' : 'Save & Append Lesson'}</Button>
          </form>
        )}

        {lessons.length === 0 ? (
          <EmptyState title="No lessons in this course yet" body="Click '+ Add Lesson' above to create your first lesson." />
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, i) => (
              <div key={lesson.id} className="index-card p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    #{String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-bold text-white">{lesson.title}</h4>
                    {lesson.videoUrl && <span className="text-[10px] font-mono text-amber-400">🎥 Video included</span>}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => startEditLesson(lesson)}>Edit</Button>
                  <Button variant="danger" onClick={() => deleteLesson(lesson.documentId)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quizzes Management Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl font-bold text-white">Quizzes ({quizzes.length})</h2>
          <Button variant="secondary" onClick={() => setShowQuizForm((s) => !s)}>
            {showQuizForm ? 'Cancel' : '+ Add Quiz'}
          </Button>
        </div>

        {showQuizForm && (
          <form onSubmit={saveQuiz} className="glass-card p-8 mb-6 space-y-6 border border-amber-500/30">
            <h3 className="font-display text-xl font-bold text-white">Build Multiple Choice Quiz</h3>
            <div>
              <Label>Quiz Title</Label>
              <Input value={quizForm.title} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} required placeholder="e.g. Midterm Evaluation Assessment" />
            </div>

            {quizForm.questions.map((q, qi) => (
              <div key={qi} className="border border-white/10 rounded-xl p-5 space-y-3 bg-black/20">
                <div className="flex items-center justify-between">
                  <Label>Question {qi + 1}</Label>
                  {quizForm.questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestion(qi)} className="text-xs text-red-400 font-mono hover:underline">
                      Remove Question
                    </button>
                  )}
                </div>
                <Input
                  value={q.questionText}
                  onChange={(e) => updateQuestion(qi, { questionText: e.target.value })}
                  placeholder="Enter question prompt..."
                  required
                />
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono text-gray-400">Options (Select radio button next to correct answer):</span>
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={q.correctOptionIndex === oi}
                        onChange={() => updateQuestion(qi, { correctOptionIndex: oi })}
                        className="accent-emerald-500 w-4 h-4 cursor-pointer"
                        title="Mark option as correct answer"
                      />
                      <Input value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} required />
                    </div>
                  ))}
                  <button type="button" onClick={() => addOption(qi)} className="text-xs font-mono text-emerald-400 hover:underline pt-1">
                    + Add option choice
                  </button>
                </div>
              </div>
            ))}

            <button type="button" onClick={addQuestion} className="text-sm font-mono text-emerald-400 hover:underline block">
              + Add another question item
            </button>

            <Button type="submit" className="w-full text-base py-3">Save Quiz Assessment</Button>
          </form>
        )}

        {quizzes.length === 0 ? (
          <EmptyState title="No quizzes created" body="Click '+ Add Quiz' to add multiple choice questions." />
        ) : (
          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="index-card p-5 flex items-center justify-between border-amber-500/30">
                <div>
                  <h4 className="font-display text-lg font-bold text-white">{quiz.title}</h4>
                  <p className="text-xs text-amber-400 font-mono">{quiz.questions?.length || 0} Multiple Choice Questions</p>
                </div>
                <Button variant="danger" onClick={() => deleteQuiz(quiz.documentId)}>Delete Quiz</Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Enrolled Students & Live Progress */}
      <section className="glass-card p-8 border border-white/10">
        <h2 className="font-display text-2xl font-bold text-white mb-4">Enrolled Students & Progress Ledger ({students.length})</h2>
        {students.length === 0 ? (
          <EmptyState title="No students enrolled yet" body="Students will appear here once they enroll in this course." />
        ) : (
          <div className="overflow-x-auto">
            <table className="ledger">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Completion Progress</th>
                  <th>Completed Count</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.user?.id}>
                    <td className="font-semibold text-white">{s.user?.fullName || s.user?.username}</td>
                    <td className="w-64">
                      {s.progress ? (
                        <div className="flex items-center gap-3">
                          <div className="w-32"><ProgressBar percentage={s.progress.percentage} /></div>
                          <span className="font-mono text-xs font-bold text-emerald-400">{s.progress.percentage}%</span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="font-mono text-xs text-gray-400">
                      {s.progress ? `${s.progress.completedLessons}/${s.progress.totalLessons} lessons` : '0 lessons'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default function ManageCoursePage() {
  return (
    <RoleGuard allow={['admin', 'content_manager', 'instructor']}>
      <ManageCourseInner />
    </RoleGuard>
  );
}
