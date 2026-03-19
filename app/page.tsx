'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-md p-8">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 8C18.745 8 8 18.745 8 32C8 40.3 12.5 47.5 19 51.5V32C19 23.716 25.716 17 34 17H51.5C47.5 12.5 40.3 8 32 8Z" fill="#F4C542"/>
            <path d="M32 8C45.255 8 56 18.745 56 32C56 40.3 51.5 47.5 45 51.5V32C45 23.716 38.284 17 30 17H12.5C16.5 12.5 23.7 8 32 8Z" fill="#7FB069"/>
            <path d="M32 54C32 54 52 42 52 28C52 22 48 18 44 18C39 18 36 22 32 26C28 22 25 18 20 18C16 18 12 22 12 28C12 42 32 54 32 54Z" fill="none" stroke="#2C3E2E" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="24" cy="24" r="2" fill="#2C3E2E"/>
            <circle cx="20" cy="32" r="1.5" fill="#2C3E2E"/>
            <circle cx="26" cy="38" r="1.5" fill="#2C3E2E"/>
            <line x1="24" y1="26" x2="24" y2="30" stroke="#2C3E2E" strokeWidth="1.5"/>
            <line x1="24" y1="30" x2="20" y2="32" stroke="#2C3E2E" strokeWidth="1.5"/>
            <line x1="24" y1="30" x2="26" y2="36" stroke="#2C3E2E" strokeWidth="1.5"/>
            <circle cx="40" cy="24" r="2" fill="#2C3E2E"/>
            <circle cx="44" cy="32" r="1.5" fill="#2C3E2E"/>
            <circle cx="38" cy="38" r="1.5" fill="#2C3E2E"/>
            <line x1="40" y1="26" x2="40" y2="30" stroke="#2C3E2E" strokeWidth="1.5"/>
            <line x1="40" y1="30" x2="44" y2="32" stroke="#2C3E2E" strokeWidth="1.5"/>
            <line x1="40" y1="30" x2="38" y2="36" stroke="#2C3E2E" strokeWidth="1.5"/>
          </svg>
        </div>

        {/* Header */}
        <p className="text-center text-gray-500 text-sm font-medium mb-1">HealthSmart AI App</p>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">Welcome Back!</h1>
        <p className="text-center text-gray-400 text-sm mb-6">Log in to continue your health journey.</p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-4">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
            <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* Password Field */}
        <div className="mb-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
            <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
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

        {/* Forgot Password */}
        <div className="flex justify-end mb-6">
          <Link href="/forgot-password" className="text-sm text-gray-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-full transition disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-bold text-gray-800 hover:underline">
            Sign Up
          </Link>
        </p>

      </div>
    </main>
  );
}
