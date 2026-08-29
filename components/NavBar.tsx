'use strict';

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth, dashboardPathForRole, ROLE_LABELS } from '@/lib/auth-context';

export default function NavBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => pathname === path || (path !== '/' && pathname?.startsWith(path));

  const roleType = (user?.role?.type || (typeof user?.role === 'string' ? user.role : 'student')) as keyof typeof ROLE_LABELS;

  return (
    <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-slate-950 font-extrabold text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            L
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              Learning Management System <span className="text-amber-400 font-sans font-normal text-xs uppercase tracking-widest ml-1"></span>
            </span>
            <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Academic Platform</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10 text-sm font-medium text-gray-300">
          <Link
            href="/courses"
            className={`px-4 py-2 rounded-full transition-all ${isActive('/courses') ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30' : 'hover:text-white hover:bg-white/5'
              }`}
          >
            Courses
          </Link>
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-full transition-all ${isActive('/blog') ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30' : 'hover:text-white hover:bg-white/5'
              }`}
          >
            Journal
          </Link>
          <Link
            href={user ? dashboardPathForRole(roleType as any) : '/my-courses'}
            className={`px-4 py-2 rounded-full transition-all ${isActive('/my-courses') || isActive('/manage/courses')
              ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30'
              : 'hover:text-white hover:bg-white/5'
              }`}
          >
            Dashboard
          </Link>
          {roleType === 'admin' && (
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-full transition-all ${isActive('/admin') ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' : 'hover:text-amber-300 hover:bg-amber-500/10'
                }`}
            >
              Admin Controls
            </Link>
          )}
          {(roleType === 'admin' || roleType === 'content_manager') && (
            <Link
              href="/manage/blog"
              className={`px-4 py-2 rounded-full transition-all ${isActive('/manage/blog') ? 'bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30' : 'hover:text-white hover:bg-white/5'
                }`}
            >
              Manage Blog
            </Link>
          )}
        </nav>

        {/* User Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-black/40 border border-white/10 p-1.5 pl-4 rounded-full">
              <div className="flex flex-col text-right leading-none">
                <span className="text-sm font-semibold text-gray-100">{user.fullName || user.username}</span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wide mt-0.5">
                  {ROLE_LABELS[roleType] || 'Student'}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-red-400 bg-white/5 hover:bg-red-500/10 px-3.5 py-2 rounded-full border border-white/10 transition-all"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-semibold text-gray-300 hover:text-white px-4 py-2 transition-colors">
                Sign in
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-emerald-500 text-slate-950 rounded-full px-5 py-2 shadow-lg shadow-emerald-950/40 hover:bg-emerald-400 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-gray-300 hover:text-white" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-white/10 px-6 py-6 flex flex-col gap-4 bg-black/90 backdrop-blur-xl">
          <Link href="/courses" className="text-lg font-medium text-gray-200" onClick={() => setOpen(false)}>
            Courses
          </Link>
          <Link href="/blog" className="text-lg font-medium text-gray-200" onClick={() => setOpen(false)}>
            Journal
          </Link>
          <Link href={user ? dashboardPathForRole(roleType as any) : '/my-courses'} className="text-lg font-medium text-gray-200" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          {roleType === 'admin' && (
            <Link href="/admin" className="text-lg font-medium text-amber-400" onClick={() => setOpen(false)}>
              Admin Controls
            </Link>
          )}
          {(roleType === 'admin' || roleType === 'content_manager') && (
            <Link href="/manage/blog" className="text-lg font-medium text-gray-200" onClick={() => setOpen(false)}>
              Manage Blog
            </Link>
          )}
          {user ? (
            <button onClick={logout} className="text-left text-red-400 text-lg font-medium pt-2 border-t border-white/10">
              Sign out ({user.username})
            </button>
          ) : (
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              <Link href="/login" className="text-center py-2.5 rounded-xl border border-white/10 text-white font-medium" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link href="/register" className="text-center py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
