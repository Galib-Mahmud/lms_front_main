'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth, dashboardPathForRole, ROLE_LABELS } from '@/lib/auth-context';

export default function NavBar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-line bg-paper sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-semibold text-forest tracking-tight">
          Learning Management System
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/courses" className="hover:text-forest">
            Courses
          </Link>
          <Link href="/blog" className="hover:text-forest">
            Blog
          </Link>
          {user && (
            <Link href={dashboardPathForRole(user.role.type)} className="hover:text-forest">
              Dashboard
            </Link>
          )}
          {user?.role.type === 'admin' && (
            <Link href="/admin" className="hover:text-forest">
              Admin
            </Link>
          )}
          {(user?.role.type === 'admin' || user?.role.type === 'content_manager') && (
            <Link href="/manage/blog" className="hover:text-forest">
              Manage blog
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs font-mono uppercase tracking-wide bg-forest text-paper px-2.5 py-1 rounded-full">
                {ROLE_LABELS[user.role.type]}
              </span>
              <button
                onClick={logout}
                className="text-sm font-medium border border-line rounded-full px-4 py-1.5 hover:border-forest hover:text-forest transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-forest">
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-forest text-paper rounded-full px-4 py-1.5 hover:bg-forest-light transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line px-6 py-4 flex flex-col gap-3 bg-paper">
          <Link href="/courses" onClick={() => setOpen(false)}>
            Courses
          </Link>
          <Link href="/blog" onClick={() => setOpen(false)}>
            Blog
          </Link>
          {user && (
            <Link href={dashboardPathForRole(user.role.type)} onClick={() => setOpen(false)}>
              Dashboard
            </Link>
          )}
          {user?.role.type === 'admin' && (
            <Link href="/admin" onClick={() => setOpen(false)}>
              Admin
            </Link>
          )}
          {(user?.role.type === 'admin' || user?.role.type === 'content_manager') && (
            <Link href="/manage/blog" onClick={() => setOpen(false)}>
              Manage blog
            </Link>
          )}
          {user ? (
            <button onClick={logout} className="text-left">
              Log out
            </button>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
