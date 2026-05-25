'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      signIn(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      setError(msg === 'invalid-credential' ? 'Invalid email or password.' : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-100 bg-white/70 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-200 transition";

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(160deg, #FFFDF7 0%, #FFF6E6 100%)' }}>

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.07]" style={{ background: '#F59E0B', filter: 'blur(60px)' }} />
        <div className="absolute bottom-20 -left-16 w-60 h-60 rounded-full opacity-[0.06]" style={{ background: '#86EFAC', filter: 'blur(55px)' }} />
      </div>

      <div className="relative w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 8C18.745 8 8 18.745 8 32C8 40.3 12.5 47.5 19 51.5V32C19 23.716 25.716 17 34 17H51.5C47.5 12.5 40.3 8 32 8Z" fill="#FDE68A"/>
            <path d="M32 8C45.255 8 56 18.745 56 32C56 40.3 51.5 47.5 45 51.5V32C45 23.716 38.284 17 30 17H12.5C16.5 12.5 23.7 8 32 8Z" fill="#86EFAC"/>
            <path d="M32 54C32 54 52 42 52 28C52 22 48 18 44 18C39 18 36 22 32 26C28 22 25 18 20 18C16 18 12 22 12 28C12 42 32 54 32 54Z" fill="none" stroke="#78350F" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="24" cy="24" r="2" fill="#78350F"/>
            <circle cx="20" cy="32" r="1.5" fill="#78350F"/>
            <circle cx="26" cy="38" r="1.5" fill="#78350F"/>
            <line x1="24" y1="26" x2="24" y2="30" stroke="#78350F" strokeWidth="1.5"/>
            <line x1="24" y1="30" x2="20" y2="32" stroke="#78350F" strokeWidth="1.5"/>
            <line x1="24" y1="30" x2="26" y2="36" stroke="#78350F" strokeWidth="1.5"/>
            <circle cx="40" cy="24" r="2" fill="#78350F"/>
            <circle cx="44" cy="32" r="1.5" fill="#78350F"/>
            <circle cx="38" cy="38" r="1.5" fill="#78350F"/>
            <line x1="40" y1="26" x2="40" y2="30" stroke="#78350F" strokeWidth="1.5"/>
            <line x1="40" y1="30" x2="44" y2="32" stroke="#78350F" strokeWidth="1.5"/>
            <line x1="40" y1="30" x2="38" y2="36" stroke="#78350F" strokeWidth="1.5"/>
          </svg>
        </div>

        <p className="text-center text-xs font-semibold text-amber-500 uppercase tracking-widest mb-1">HealthSmart AI</p>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">Welcome back</h1>
        <p className="text-center text-gray-400 text-sm mb-6">Log in to continue your health journey</p>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-2xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={showPassword
                    ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
                    : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-300 text-right mb-4">Demo app — use any account you create</p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full font-bold py-3 rounded-full transition disabled:opacity-50 text-amber-900 hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%)' }}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="text-center text-sm text-gray-400 mt-5">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-bold text-gray-700 hover:text-gray-900 transition">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
