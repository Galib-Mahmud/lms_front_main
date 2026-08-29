'use client';

import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm';
  const styles = {
    primary:
      'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-950/30 hover:shadow-lg',
    secondary:
      'bg-white/5 text-gray-200 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 hover:text-emerald-400',
    danger:
      'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-red-950/30',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-white/10 rounded-xl px-4 py-3 bg-black/30 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
        props.className || ''
      }`}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full border border-white/10 rounded-xl px-4 py-3 bg-black/30 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all ${
        props.className || ''
      }`}
    />
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="block text-xs font-mono uppercase tracking-wider text-emerald-400/90 mb-1.5 font-semibold">
      {children}
    </label>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm flex items-center gap-3 my-4">
      <span className="text-base">⚠️</span>
      <span>{message}</span>
    </div>
  );
}

export function EmptyState({ title, body, children }: { title: string; body?: string; children?: ReactNode }) {
  return (
    <div className="border border-dashed border-white/10 rounded-2xl px-6 py-16 text-center bg-white/[0.02]">
      <div className="text-4xl mb-3">📚</div>
      <p className="font-display text-2xl text-gray-100 mb-2">{title}</p>
      {body && <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">{body}</p>}
      {children}
    </div>
  );
}

export function Loading() {
  return (
    <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      <span className="text-gray-400 font-mono text-xs uppercase tracking-widest">Loading content...</span>
    </div>
  );
}
