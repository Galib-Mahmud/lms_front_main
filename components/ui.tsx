'use client';

import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }) {
  const base = 'rounded-full px-5 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const styles = {
    primary: 'bg-forest text-paper hover:bg-forest-light',
    secondary: 'border border-line hover:border-forest hover:text-forest',
    danger: 'bg-brick text-paper hover:opacity-90',
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-line rounded-card px-3.5 py-2.5 bg-white/60 focus:border-forest transition-colors ${props.className || ''}`}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full border border-line rounded-card px-3.5 py-2.5 bg-white/60 focus:border-forest transition-colors ${props.className || ''}`}
    />
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="block text-xs font-mono uppercase tracking-wide text-ink-soft mb-1.5">{children}</label>;
}

export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="bg-brick/10 border border-brick/30 text-brick rounded-card px-4 py-2.5 text-sm">
      {message}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="border border-dashed border-line rounded-card px-6 py-14 text-center">
      <p className="font-display text-xl text-ink mb-1">{title}</p>
      {body && <p className="text-ink-soft text-sm">{body}</p>}
    </div>
  );
}

export function Loading() {
  return <div className="py-16 text-center text-ink-soft font-mono text-sm">Loading…</div>;
}
