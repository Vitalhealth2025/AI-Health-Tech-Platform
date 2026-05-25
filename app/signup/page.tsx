'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth';
import { saveUserProfile } from '@/lib/storage';
import { validateName } from '@/lib/validation';

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = () => {
    setError('');
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    const firstNameError = validateName(formData.firstName, 'First name');
    if (firstNameError) { setError(firstNameError); return; }
    const lastNameError = validateName(formData.lastName, 'Last name');
    if (lastNameError) { setError(lastNameError); return; }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const user = signUp(formData.email, formData.password);
      saveUserProfile(user.uid, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
      });
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      setError(msg === 'email-already-in-use' ? 'An account with this email already exists.' : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-100 bg-white/70 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-200 transition";

  const EyeIcon = ({ open }: { open: boolean }) => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={open
        ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
        : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"}
      />
    </svg>
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: 'linear-gradient(160deg, #FFFDF7 0%, #FFF6E6 100%)' }}>

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-[0.07]" style={{ background: '#F59E0B', filter: 'blur(60px)' }} />
        <div className="absolute bottom-20 -left-16 w-60 h-60 rounded-full opacity-[0.06]" style={{ background: '#86EFAC', filter: 'blur(55px)' }} />
      </div>

      <div className="relative w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-3xl border border-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-8">

        <p className="text-center text-xs font-semibold text-amber-500 uppercase tracking-widest mb-1">HealthSmart AI</p>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">Create account</h1>
        <p className="text-center text-gray-400 text-sm mb-6">Start your health journey today</p>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-2xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">First Name</label>
              <input
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Last Name</label>
              <input
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password (min 8 chars)"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`${inputClass} pr-10`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400 transition">
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-400 mb-1.5 block">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={`${inputClass} pr-10`}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400 transition">
                <EyeIcon open={showConfirm} />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full font-bold py-3 rounded-full transition disabled:opacity-50 text-amber-900 hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%)' }}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{' '}
          <Link href="/" className="font-bold text-gray-700 hover:text-gray-900 transition">
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
}
