import Link from 'next/link';
import { Stamp } from '@/components/Stamp';

export default function HomePage() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-[1.3fr_1fr] gap-14 items-center">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-gold">
            Courses · Quizzes · Progress that persists
          </span>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mt-4 mb-6 text-ink">
            Learning that gets <em className="italic text-forest">marked</em> as done.
          </h1>
          <p className="text-lg text-ink-soft max-w-xl mb-8">
            Lyceum is a course platform built around one idea: progress should be provable.
            Every lesson you finish, every quiz you pass, gets stamped, stored, and shown back to
            you — accurately, every time you return.
          </p>
          <div className="flex gap-4">
            <Link
              href="/courses"
              className="bg-forest text-paper rounded-full px-6 py-3 text-sm font-medium hover:bg-forest-light transition-colors"
            >
              Browse courses
            </Link>
            <Link
              href="/register"
              className="border border-line rounded-full px-6 py-3 text-sm font-medium hover:border-forest hover:text-forest transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="index-card p-8 w-full max-w-sm">
            <p className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-4">
              Intro to Applied Statistics
            </p>
            <div className="flex items-center gap-5">
              <Stamp value="80%" label="complete" />
              <div className="text-sm text-ink-soft">
                <p className="text-ink font-medium">4 of 5 lessons done</p>
                <p>Quiz score: 9/10</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-dim">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-8">
          {[
            { n: '01', t: 'Enroll', d: 'Browse the library and enroll in any course in one click.' },
            { n: '02', t: 'Learn', d: 'Move through lessons in sequence — text or video, your pace.' },
            { n: '03', t: 'Test', d: 'Take an MCQ quiz per course and get graded the instant you submit.' },
            { n: '04', t: 'Track', d: 'Your percentage complete persists — no matter how often you leave.' },
          ].map((s) => (
            <div key={s.n}>
              <p className="font-mono text-xs text-gold mb-2">{s.n}</p>
              <p className="font-display text-xl mb-1">{s.t}</p>
              <p className="text-sm text-ink-soft">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
