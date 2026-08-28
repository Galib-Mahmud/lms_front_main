import type { Metadata } from 'next';
import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import NavBar from '@/components/NavBar';

const display = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Learning Management System — Learn, teach, and track progress that shows',
  description:
    'A course platform with real progress tracking, auto-graded quizzes, and a role for everyone: admin, content manager, instructor, and student.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <NavBar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-line py-8 mt-16">
            <div className="max-w-6xl mx-auto px-6 text-sm text-ink-soft font-mono flex items-center justify-between flex-wrap gap-2">
              <span>Learning Management System— Galib Mahmud, Whatsapp: 01581027072</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
