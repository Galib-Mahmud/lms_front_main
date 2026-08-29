import AuthCard from '@/components/AuthCard';

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-12 sm:py-16">
      <AuthCard initialMode="register" />
    </div>
  );
}
