'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from '@/lib/auth';
import { getUserProfile, saveUserProfile } from '@/lib/storage';
import BottomNav from '@/components/BottomNav';
import { UserProfile } from '@/lib/types';
import { validateName, validateNumber, sanitizeText } from '@/lib/validation';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState('');
  const [memberSince, setMemberSince] = useState('');
  const [saveError, setSaveError] = useState('');
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '', lastName: '', email: '', gender: '',
    age: '', height: '', weight: '', activityLevel: '', healthGoal: '', calorieGoal: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      if (!user) { router.push('/'); return; }
      setUserId(user.uid);
      setMemberSince(String(new Date(user.createdAt).getFullYear()));
      const data = getUserProfile(user.uid);
      setProfile({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || user.email || '',
        gender: data.gender || '',
        age: data.age || '',
        height: data.height || '',
        weight: data.weight || '',
        activityLevel: data.activityLevel || '',
        healthGoal: data.healthGoal || '',
        calorieGoal: data.calorieGoal || '',
      });
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaveError('');
    const firstNameError = validateName(profile.firstName, 'First name');
    if (firstNameError) { setSaveError(firstNameError); return; }
    const lastNameError = validateName(profile.lastName, 'Last name');
    if (lastNameError) { setSaveError(lastNameError); return; }
    if (profile.calorieGoal) {
      const calorieError = validateNumber(profile.calorieGoal, 500, 10000, 'Calorie goal');
      if (calorieError) { setSaveError(calorieError); return; }
    }
    const sanitized = {
      ...profile,
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      age: sanitizeText(profile.age),
      height: sanitizeText(profile.height),
      weight: sanitizeText(profile.weight),
    };
    setSaving(true);
    try {
      saveUserProfile(userId, sanitized);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      setSaveError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { signOut(); router.push('/'); };

  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() || 'U';

  const inputClass = "w-full border border-amber-200 bg-white/80 rounded-2xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-200 transition";
  const viewClass = "w-full bg-gray-50/80 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-800";

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #FFFDF7 0%, #FFF6E6 100%)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex justify-center" style={{ background: 'linear-gradient(160deg, #FFFDF7 0%, #FFF6E6 100%)' }}>
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="px-6 pt-10 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your health information</p>
        </div>

        {/* Avatar + Name */}
        <div className="flex flex-col items-center py-6 px-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-md" style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%)' }}>
            <span className="text-2xl font-bold text-amber-900">{initials}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {profile.firstName || 'Your'} {profile.lastName || 'Name'}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Member since {memberSince}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span className="text-xs text-gray-400">{profile.email}</span>
          </div>

          {saveError && (
            <div className="w-full bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-2xl px-3 py-2 mt-3 text-center">
              {saveError}
            </div>
          )}

          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={saving}
            className="mt-5 w-full font-bold py-3 rounded-full flex items-center justify-center gap-2 transition disabled:opacity-50 text-amber-900 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #FDE68A 0%, #FCD34D 100%)' }}
          >
            {isEditing ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                {saving ? 'Saving...' : 'Save Profile'}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
                Edit Profile
              </>
            )}
          </button>
        </div>

        <div className="px-6 space-y-4 pb-28">

          {/* Personal Information */}
          <div className="rounded-3xl p-5 bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Personal Information</h3>
            <div className="space-y-3">
              {[{ label: 'First Name', field: 'firstName' }, { label: 'Last Name', field: 'lastName' }].map(({ label, field }) => (
                <div key={field}>
                  <p className="text-xs font-medium text-gray-400 mb-1.5">{label}</p>
                  {isEditing ? (
                    <input type="text" value={profile[field as keyof UserProfile]} onChange={(e) => handleChange(field, e.target.value)} className={inputClass}/>
                  ) : (
                    <div className={viewClass}>{profile[field as keyof UserProfile] || <span className="text-gray-300">Not set</span>}</div>
                  )}
                </div>
              ))}
              <div>
                <p className="text-xs font-medium text-gray-400 mb-1.5">Gender</p>
                {isEditing ? (
                  <select value={profile.gender} onChange={(e) => handleChange('gender', e.target.value)} className={inputClass}>
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                ) : (
                  <div className={viewClass}>{profile.gender || <span className="text-gray-300">Not set</span>}</div>
                )}
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="rounded-3xl p-5 bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Health Metrics</h3>
            <div className="space-y-3">
              {[
                { label: 'Age', field: 'age', placeholder: 'e.g. 28 years' },
                { label: 'Height', field: 'height', placeholder: 'e.g. 165 cm' },
                { label: 'Weight', field: 'weight', placeholder: 'e.g. 62 kg' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <p className="text-xs font-medium text-gray-400 mb-1.5">{label}</p>
                  {isEditing ? (
                    <input type="text" value={profile[field as keyof UserProfile]} placeholder={placeholder} onChange={(e) => handleChange(field, e.target.value)} className={inputClass}/>
                  ) : (
                    <div className={viewClass}>{profile[field as keyof UserProfile] || <span className="text-gray-300">Not set</span>}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div className="rounded-3xl p-5 bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Activity Level</h3>
            {isEditing ? (
              <select value={profile.activityLevel} onChange={(e) => handleChange('activityLevel', e.target.value)} className={inputClass}>
                <option value="">Select activity level</option>
                <option value="Sedentary">Sedentary — little to no exercise</option>
                <option value="Lightly Active">Lightly Active — 1–3 times/week</option>
                <option value="Moderately Active">Moderately Active — 4–5 times/week</option>
                <option value="Very Active">Very Active — daily exercise</option>
                <option value="Extra Active">Extra Active — intense daily exercise</option>
              </select>
            ) : (
              <div className={viewClass}>{profile.activityLevel || <span className="text-gray-300">Not set</span>}</div>
            )}
          </div>

          {/* Health Goal */}
          <div className="rounded-3xl p-5 bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Health Goal</h3>
            {isEditing ? (
              <select value={profile.healthGoal} onChange={(e) => handleChange('healthGoal', e.target.value)} className={inputClass}>
                <option value="">Select health goal</option>
                <option value="Lose Weight">Lose Weight</option>
                <option value="Maintain Weight">Maintain Weight</option>
                <option value="Gain Weight">Gain Weight</option>
                <option value="Build Muscle">Build Muscle</option>
                <option value="Improve Energy">Improve Energy</option>
              </select>
            ) : (
              <div className={viewClass}>{profile.healthGoal || <span className="text-gray-300">Not set</span>}</div>
            )}
          </div>

          {/* Calorie Goal */}
          <div className="rounded-3xl p-5 bg-white/80 backdrop-blur-sm border border-white shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Daily Calorie Goal</h3>
            {isEditing ? (
              <input type="number" value={profile.calorieGoal} placeholder="e.g. 2000" min="500" max="10000" onChange={(e) => handleChange('calorieGoal', e.target.value)} className={inputClass}/>
            ) : (
              <div className={viewClass}>
                {profile.calorieGoal ? `${profile.calorieGoal} cal / day` : <span className="text-gray-300">Not set (default: 2000 cal)</span>}
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full border border-rose-200 text-rose-500 hover:bg-rose-50 font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition bg-white/60"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign Out
          </button>

        </div>

        <BottomNav active="profile" />
      </div>
    </main>
  );
}
