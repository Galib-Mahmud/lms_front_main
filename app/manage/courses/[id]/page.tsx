// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import { api } from '@/lib/api';
// import { useAuth } from '@/lib/auth-context';
// import { Button, ErrorBanner, Input, Label, Loading, Textarea, EmptyState } from '@/components/ui';
// import { ProgressBar } from '@/components/Stamp';
// import RoleGuard from '@/components/RoleGuard';

// type Lesson = { id: number; title: string; content?: string; videoUrl?: string; order: number };
// type Question = { questionText: string; options: string[]; correctOptionIndex: number };
// type Quiz = { id: number; title: string; questions: Question[] };

// const emptyQuestion = (): Question => ({ questionText: '', options: ['', ''], correctOptionIndex: 0 });

// function ManageCourseInner() {
//   const { id } = useParams<{ id: string }>();
//   const { user } = useAuth();

//   const [course, setCourse] = useState<any>(null);
//   const [courseForm, setCourseForm] = useState({ title: '', description: '', coverImageUrl: '' });
//   const [lessons, setLessons] = useState<Lesson[]>([]);
//   const [quizzes, setQuizzes] = useState<Quiz[]>([]);
//   const [students, setStudents] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [savingCourse, setSavingCourse] = useState(false);

//   const [showLessonForm, setShowLessonForm] = useState(false);
//   const [lessonForm, setLessonForm] = useState({ title: '', content: '', videoUrl: '', order: 0 });
//   const [editingLessonId, setEditingLessonId] = useState<number | null>(null);

//   const [showQuizForm, setShowQuizForm] = useState(false);
//   const [quizForm, setQuizForm] = useState<{ title: string; questions: Question[] }>({
//     title: '',
//     questions: [emptyQuestion()],
//   });

//   const load = async () => {
//     try {
//       const [courseRes, lessonsRes, quizzesRes] = await Promise.all([
//         api.get(`/api/courses/${id}?populate=owner`),
//         api.get(`/api/lessons?filters[course][id]=${id}&sort=order:asc`),
//         api.get(`/api/quizzes?filters[course][id]=${id}`),
//       ]);
//       setCourse(courseRes.data);
//       setCourseForm({
//         title: courseRes.data.title,
//         description: courseRes.data.description || '',
//         coverImageUrl: courseRes.data.coverImageUrl || '',
//       });
//       setLessons(lessonsRes.data || []);
//       setQuizzes(quizzesRes.data || []);

//       const enrollments = await api.get(`/api/enrollments?filters[course][id]=${id}&populate=user`);
//       const withProgress = await Promise.all(
//         (enrollments.data || []).map(async (e: any) => {
//           try {
//             const p = await api.get(`/api/courses/${id}/progress?studentId=${e.user?.id ?? e.user}`);
//             return { user: e.user, progress: p.data };
//           } catch {
//             return { user: e.user, progress: null };
//           }
//         })
//       );
//       setStudents(withProgress);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const saveCourse = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSavingCourse(true);
//     setError('');
//     try {
//       await api.put(`/api/courses/${id}`, { data: courseForm });
//       await load();
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setSavingCourse(false);
//     }
//   };

//   const startEditLesson = (lesson: Lesson) => {
//     setEditingLessonId(lesson.id);
//     setLessonForm({
//       title: lesson.title,
//       content: lesson.content || '',
//       videoUrl: lesson.videoUrl || '',
//       order: lesson.order || 0,
//     });
//     setShowLessonForm(true);
//   };

//   const resetLessonForm = () => {
//     setEditingLessonId(null);
//     setLessonForm({ title: '', content: '', videoUrl: '', order: lessons.length });
//     setShowLessonForm(false);
//   };

//   const saveLesson = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     try {
//       if (editingLessonId) {
//         await api.put(`/api/lessons/${editingLessonId}`, { data: lessonForm });
//       } else {
//         await api.post('/api/lessons', { data: { ...lessonForm, course: id } });
//       }
//       resetLessonForm();
//       await load();
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const deleteLesson = async (lessonId: number) => {
//     if (!confirm('Delete this lesson?')) return;
//     try {
//       await api.del(`/api/lessons/${lessonId}`);
//       await load();
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const updateQuestion = (qi: number, patch: Partial<Question>) => {
//     setQuizForm((f) => ({
//       ...f,
//       questions: f.questions.map((q, i) => (i === qi ? { ...q, ...patch } : q)),
//     }));
//   };

//   const updateOption = (qi: number, oi: number, value: string) => {
//     setQuizForm((f) => ({
//       ...f,
//       questions: f.questions.map((q, i) =>
//         i === qi ? { ...q, options: q.options.map((o, j) => (j === oi ? value : o)) } : q
//       ),
//     }));
//   };

//   const addOption = (qi: number) => {
//     setQuizForm((f) => ({
//       ...f,
//       questions: f.questions.map((q, i) => (i === qi ? { ...q, options: [...q.options, ''] } : q)),
//     }));
//   };

//   const addQuestion = () => setQuizForm((f) => ({ ...f, questions: [...f.questions, emptyQuestion()] }));

//   const removeQuestion = (qi: number) =>
//     setQuizForm((f) => ({ ...f, questions: f.questions.filter((_, i) => i !== qi) }));

//   const saveQuiz = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     try {
//       await api.post('/api/quizzes', { data: { title: quizForm.title, questions: quizForm.questions, course: id } });
//       setQuizForm({ title: '', questions: [emptyQuestion()] });
//       setShowQuizForm(false);
//       await load();
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const deleteQuiz = async (quizId: number) => {
//     if (!confirm('Delete this quiz?')) return;
//     try {
//       await api.del(`/api/quizzes/${quizId}`);
//       await load();
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   if (loading) return <Loading />;
//   if (!course) return <EmptyState title="Course not found" />;

//   return (
//     <div className="max-w-4xl mx-auto px-6 py-14">
//       <span className="font-mono text-xs uppercase tracking-wide text-gold">Managing</span>
//       <h1 className="font-display text-4xl mt-2 mb-8">{course.title}</h1>
//       <ErrorBanner message={error} />

//       {/* Course details */}
//       <section className="index-card p-6 mb-10">
//         <h2 className="font-display text-xl mb-4">Course details</h2>
//         <form onSubmit={saveCourse} className="space-y-4">
//           <div>
//             <Label>Title</Label>
//             <Input value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} required />
//           </div>
//           <div>
//             <Label>Description</Label>
//             <Textarea rows={3} value={courseForm.description} onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} />
//           </div>
//           <div>
//             <Label>Cover image URL</Label>
//             <Input value={courseForm.coverImageUrl} onChange={(e) => setCourseForm({ ...courseForm, coverImageUrl: e.target.value })} placeholder="https://…" />
//           </div>
//           <Button type="submit" disabled={savingCourse}>{savingCourse ? 'Saving…' : 'Save changes'}</Button>
//         </form>
//       </section>

//       {/* Lessons */}
//       <section className="mb-10">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="font-display text-xl">Lessons ({lessons.length})</h2>
//           <Button variant="secondary" onClick={() => (showLessonForm ? resetLessonForm() : (setLessonForm({ title: '', content: '', videoUrl: '', order: lessons.length }), setShowLessonForm(true)))}>
//             {showLessonForm ? 'Cancel' : '+ Add lesson'}
//           </Button>
//         </div>

//         {showLessonForm && (
//           <form onSubmit={saveLesson} className="index-card p-6 mb-4 space-y-4">
//             <div>
//               <Label>Title</Label>
//               <Input value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required />
//             </div>
//             <div>
//               <Label>Content (text)</Label>
//               <Textarea rows={4} value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} />
//             </div>
//             <div>
//               <Label>Video URL (optional)</Label>
//               <Input value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} placeholder="https://…" />
//             </div>
//             <div>
//               <Label>Order</Label>
//               <Input type="number" value={lessonForm.order} onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) })} />
//             </div>
//             <Button type="submit">{editingLessonId ? 'Update lesson' : 'Add lesson'}</Button>
//           </form>
//         )}

//         {lessons.length === 0 ? (
//           <EmptyState title="No lessons yet" body="Add the first one above." />
//         ) : (
//           <div className="space-y-2">
//             {lessons.map((lesson, i) => (
//               <div key={lesson.id} className="index-card px-5 py-3.5 flex items-center justify-between">
//                 <div className="flex items-center gap-4">
//                   <span className="font-mono text-xs text-ink-soft w-6">{String(i + 1).padStart(2, '0')}</span>
//                   <span className="font-medium">{lesson.title}</span>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button variant="secondary" onClick={() => startEditLesson(lesson)}>Edit</Button>
//                   <Button variant="danger" onClick={() => deleteLesson(lesson.id)}>Delete</Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Quizzes */}
//       <section className="mb-10">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="font-display text-xl">Quizzes ({quizzes.length})</h2>
//           <Button variant="secondary" onClick={() => setShowQuizForm((s) => !s)}>
//             {showQuizForm ? 'Cancel' : '+ Add quiz'}
//           </Button>
//         </div>

//         {showQuizForm && (
//           <form onSubmit={saveQuiz} className="index-card p-6 mb-4 space-y-6">
//             <div>
//               <Label>Quiz title</Label>
//               <Input value={quizForm.title} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} required />
//             </div>

//             {quizForm.questions.map((q, qi) => (
//               <div key={qi} className="border border-line rounded-card p-4 space-y-3">
//                 <div className="flex items-center justify-between">
//                   <Label>Question {qi + 1}</Label>
//                   {quizForm.questions.length > 1 && (
//                     <button type="button" onClick={() => removeQuestion(qi)} className="text-xs text-brick">
//                       Remove
//                     </button>
//                   )}
//                 </div>
//                 <Input
//                   value={q.questionText}
//                   onChange={(e) => updateQuestion(qi, { questionText: e.target.value })}
//                   placeholder="Question text"
//                   required
//                 />
//                 <div className="space-y-2">
//                   {q.options.map((opt, oi) => (
//                     <div key={oi} className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         name={`correct-${qi}`}
//                         checked={q.correctOptionIndex === oi}
//                         onChange={() => updateQuestion(qi, { correctOptionIndex: oi })}
//                         title="Mark as correct answer"
//                       />
//                       <Input value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} required />
//                     </div>
//                   ))}
//                   <button type="button" onClick={() => addOption(qi)} className="text-xs font-mono text-forest hover:underline">
//                     + add option
//                   </button>
//                 </div>
//                 <p className="text-xs text-ink-soft">Select the radio button next to the correct answer.</p>
//               </div>
//             ))}

//             <button type="button" onClick={addQuestion} className="text-sm font-mono text-forest hover:underline">
//               + add another question
//             </button>

//             <Button type="submit" className="w-full">Save quiz</Button>
//           </form>
//         )}

//         {quizzes.length === 0 ? (
//           <EmptyState title="No quiz yet" body="Add MCQ questions above to create one." />
//         ) : (
//           <div className="space-y-2">
//             {quizzes.map((quiz) => (
//               <div key={quiz.id} className="index-card px-5 py-3.5 flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">{quiz.title}</p>
//                   <p className="text-xs text-ink-soft font-mono">{quiz.questions?.length || 0} questions</p>
//                 </div>
//                 <Button variant="danger" onClick={() => deleteQuiz(quiz.id)}>Delete</Button>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Student progress */}
//       <section>
//         <h2 className="font-display text-xl mb-4">Enrolled students ({students.length})</h2>
//         {students.length === 0 ? (
//           <EmptyState title="No students enrolled yet" />
//         ) : (
//           <table className="ledger">
//             <thead>
//               <tr>
//                 <th>Student</th>
//                 <th>Progress</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((s) => (
//                 <tr key={s.user?.id}>
//                   <td>{s.user?.fullName || s.user?.username}</td>
//                   <td className="w-64">
//                     {s.progress ? (
//                       <div className="flex items-center gap-3">
//                         <div className="w-32"><ProgressBar percentage={s.progress.percentage} /></div>
//                         <span className="font-mono text-xs">{s.progress.percentage}%</span>
//                       </div>
//                     ) : (
//                       '—'
//                     )}
//                   </td>
//                   <td className="font-mono text-xs text-ink-soft">
//                     {s.progress ? `${s.progress.completedLessons}/${s.progress.totalLessons} lessons` : ''}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </section>
//     </div>
//   );
// }

// export default function ManageCoursePage() {
//   return (
//     <RoleGuard allow={['admin', 'content_manager', 'instructor']}>
//       <ManageCourseInner />
//     </RoleGuard>
//   );
// }































































'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
      // Fetch the course first (with its numeric id) since the lesson/quiz/enrollment
      // list filters need that numeric id, not the documentId from the URL.
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
    setLessonForm({ title: '', content: '', videoUrl: '', order: lessons.length });
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

  const deleteLesson = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await api.del(`/api/lessons/${lessonId}`);
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

  const deleteQuiz = async (quizId: string) => {
    if (!confirm('Delete this quiz?')) return;
    try {
      await api.del(`/api/quizzes/${quizId}`);
      await load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (!course) return <EmptyState title="Course not found" />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <span className="font-mono text-xs uppercase tracking-wide text-gold">Managing</span>
      <h1 className="font-display text-4xl mt-2 mb-8">{course.title}</h1>
      <ErrorBanner message={error} />

      {/* Course details */}
      <section className="index-card p-6 mb-10">
        <h2 className="font-display text-xl mb-4">Course details</h2>
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
            <Label>Cover image URL</Label>
            <Input value={courseForm.coverImageUrl} onChange={(e) => setCourseForm({ ...courseForm, coverImageUrl: e.target.value })} placeholder="https://…" />
          </div>
          <Button type="submit" disabled={savingCourse}>{savingCourse ? 'Saving…' : 'Save changes'}</Button>
        </form>
      </section>

      {/* Lessons */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Lessons ({lessons.length})</h2>
          <Button variant="secondary" onClick={() => (showLessonForm ? resetLessonForm() : (setLessonForm({ title: '', content: '', videoUrl: '', order: lessons.length }), setShowLessonForm(true)))}>
            {showLessonForm ? 'Cancel' : '+ Add lesson'}
          </Button>
        </div>

        {showLessonForm && (
          <form onSubmit={saveLesson} className="index-card p-6 mb-4 space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required />
            </div>
            <div>
              <Label>Content (text)</Label>
              <Textarea rows={4} value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} />
            </div>
            <div>
              <Label>Video URL (optional)</Label>
              <Input value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} placeholder="https://…" />
            </div>
            <div>
              <Label>Order</Label>
              <Input type="number" value={lessonForm.order} onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) })} />
            </div>
            <Button type="submit">{editingLessonId ? 'Update lesson' : 'Add lesson'}</Button>
          </form>
        )}

        {lessons.length === 0 ? (
          <EmptyState title="No lessons yet" body="Add the first one above." />
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson, i) => (
              <div key={lesson.id} className="index-card px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-ink-soft w-6">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-medium">{lesson.title}</span>
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

      {/* Quizzes */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Quizzes ({quizzes.length})</h2>
          <Button variant="secondary" onClick={() => setShowQuizForm((s) => !s)}>
            {showQuizForm ? 'Cancel' : '+ Add quiz'}
          </Button>
        </div>

        {showQuizForm && (
          <form onSubmit={saveQuiz} className="index-card p-6 mb-4 space-y-6">
            <div>
              <Label>Quiz title</Label>
              <Input value={quizForm.title} onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })} required />
            </div>

            {quizForm.questions.map((q, qi) => (
              <div key={qi} className="border border-line rounded-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Question {qi + 1}</Label>
                  {quizForm.questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestion(qi)} className="text-xs text-brick">
                      Remove
                    </button>
                  )}
                </div>
                <Input
                  value={q.questionText}
                  onChange={(e) => updateQuestion(qi, { questionText: e.target.value })}
                  placeholder="Question text"
                  required
                />
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={q.correctOptionIndex === oi}
                        onChange={() => updateQuestion(qi, { correctOptionIndex: oi })}
                        title="Mark as correct answer"
                      />
                      <Input value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} required />
                    </div>
                  ))}
                  <button type="button" onClick={() => addOption(qi)} className="text-xs font-mono text-forest hover:underline">
                    + add option
                  </button>
                </div>
                <p className="text-xs text-ink-soft">Select the radio button next to the correct answer.</p>
              </div>
            ))}

            <button type="button" onClick={addQuestion} className="text-sm font-mono text-forest hover:underline">
              + add another question
            </button>

            <Button type="submit" className="w-full">Save quiz</Button>
          </form>
        )}

        {quizzes.length === 0 ? (
          <EmptyState title="No quiz yet" body="Add MCQ questions above to create one." />
        ) : (
          <div className="space-y-2">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="index-card px-5 py-3.5 flex items-center justify-between">
                <div>
                  <p className="font-medium">{quiz.title}</p>
                  <p className="text-xs text-ink-soft font-mono">{quiz.questions?.length || 0} questions</p>
                </div>
                <Button variant="danger" onClick={() => deleteQuiz(quiz.documentId)}>Delete</Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Student progress */}
      <section>
        <h2 className="font-display text-xl mb-4">Enrolled students ({students.length})</h2>
        {students.length === 0 ? (
          <EmptyState title="No students enrolled yet" />
        ) : (
          <table className="ledger">
            <thead>
              <tr>
                <th>Student</th>
                <th>Progress</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.user?.id}>
                  <td>{s.user?.fullName || s.user?.username}</td>
                  <td className="w-64">
                    {s.progress ? (
                      <div className="flex items-center gap-3">
                        <div className="w-32"><ProgressBar percentage={s.progress.percentage} /></div>
                        <span className="font-mono text-xs">{s.progress.percentage}%</span>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="font-mono text-xs text-ink-soft">
                    {s.progress ? `${s.progress.completedLessons}/${s.progress.totalLessons} lessons` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
