import Link from 'next/link';
import { Stamp } from '@/components/Stamp';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-28 grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Modern Academic Platform
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight text-white mb-6">
            Master Skills with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Provable Progress.
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-xl leading-relaxed mb-10">
            Lyceum is a full-stack learning management system built for high engagement. Finish lessons, complete auto-graded quizzes, and track your progress percentage in real time.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-full px-8 py-4 text-base shadow-xl shadow-emerald-950/50 hover:from-emerald-400 hover:to-emerald-500 transition-all hover:scale-105"
            >
              <span>Explore Courses</span>
              <span>→</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-200 font-semibold rounded-full px-8 py-4 text-base hover:bg-white/10 hover:border-emerald-500/40 hover:text-emerald-300 transition-all"
            >
              <span>⚡ Try Demo Accounts</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 mt-14 pt-8 border-t border-white/10">
            <div>
              <div className="font-display text-3xl font-bold text-emerald-400">4 Roles</div>
              <div className="text-xs text-gray-400 font-mono uppercase tracking-wider mt-1">RBAC Enforced</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-amber-400">100%</div>
              <div className="text-xs text-gray-400 font-mono uppercase tracking-wider mt-1">Backend Enforced</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-purple-400">MCQ</div>
              <div className="text-xs text-gray-400 font-mono uppercase tracking-wider mt-1">Auto Graded</div>
            </div>
          </div>
        </div>

        {/* Hero Interactive Card Preview */}
        <div className="flex justify-center lg:justify-end">
          <div className="glass-card p-8 w-full max-w-md border border-white/15 shadow-2xl relative">
            <div className="absolute -top-3 -right-3 bg-amber-500 text-black font-bold font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
              Live Interactive
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Enrolled Student Progress
              </span>
              <span className="text-xs font-mono text-gray-400">Updated just now</span>
            </div>

            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Full-Stack Web Architecture
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Next.js 15 App Router & Strapi 5 Headless CMS integration.
            </p>

            <div className="flex items-center gap-6 p-4 rounded-xl bg-black/40 border border-white/10 mb-6">
              <Stamp value="75%" label="complete" color="gold" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-200">3 of 4 Lessons Marked Done</p>
                <p className="text-xs text-emerald-400 font-mono">Quiz score: 3 / 3 (100%)</p>
                <div className="w-44 h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 w-[75%]" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>01. Introduction to Modern Headless</span>
                </div>
                <span className="font-mono text-[10px]">Completed</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>02. Relational Schemas & Permissions</span>
                </div>
                <span className="font-mono text-[10px]">Completed</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 text-gray-300 text-xs font-medium border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">⏳</span>
                  <span>03. Crafting Glassmorphic UI</span>
                </div>
                <span className="font-mono text-[10px] text-amber-400">Up Next</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Designed for Academic & Enterprise Rigor
            </h2>
            <p className="text-gray-400 text-sm">
              Every detail is engineered to protect course access, automate evaluation, and display real-time analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                n: '01',
                t: 'Enroll & Learn',
                d: 'Students browse available courses, enroll with one click, and access structured lessons in order.',
                icon: '📚',
              },
              {
                n: '02',
                t: 'Sequence Viewing',
                d: 'Video embeds and rich text modules guide students step-by-step through complex subjects.',
                icon: '🎥',
              },
              {
                n: '03',
                t: 'Auto-Graded Quizzes',
                d: 'Take multiple choice quizzes that validate answers server-side and calculate grades automatically.',
                icon: '📝',
              },
              {
                n: '04',
                t: 'Role Management',
                d: 'Instructors manage their own content; Content Managers and Admins oversee the entire platform.',
                icon: '🛡️',
              },
            ].map((s) => (
              <div key={s.n} className="index-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                      Step {s.n}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">{s.t}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
