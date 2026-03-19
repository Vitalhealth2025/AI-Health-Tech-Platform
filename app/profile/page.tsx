'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
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
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: '',
    healthGoal: '',
    calorieGoal: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/');
        return;
      }

      setUserId(user.uid);

      // Get member since date
      const createdAt = user.metadata.creationTime;
      if (createdAt) {
        const year = new Date(createdAt).getFullYear();
        setMemberSince(String(year));
      }

      // Load user data from Firestore
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
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
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const [saveError, setSaveError] = useState('');

  const handleSave = async () => {
    setSaveError('');

    const firstNameError = validateName(profile.firstName, 'First name');
    if (firstNameError) { setSaveError(firstNameError); return; }
    const lastNameError = validateName(profile.lastName, 'Last name');
    if (lastNameError) { setSaveError(lastNameError); return; }

    if (profile.calorieGoal) {
      const calorieError = validateNumber(profile.calorieGoal, 500, 10000, 'Calorie goal');
      if (calorieError) { setSaveError(calorieError); return; }
    }

    const sanitizedProfile = {
      ...profile,
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      age: sanitizeText(profile.age),
      height: sanitizeText(profile.height),
      weight: sanitizeText(profile.weight),
    };

    setSaving(true);
    try {
      await setDoc(doc(db, 'users', userId), sanitizedProfile, { merge: true });
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="bg-white px-6 pt-10 pb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your health information</p>
        </div>

        {/* Avatar + Name */}
        <div className="bg-white flex flex-col items-center py-6 border-b border-gray-100">
          <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center mb-3">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {profile.firstName || 'Your'} {profile.lastName || 'Name'}
          </h2>
          <p className="text-sm text-gray-400 mt-1">Member since {memberSince}</p>
          <div className="flex items-center gap-2 mt-3">
            <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span className="text-sm text-gray-500">{profile.email}</span>
          </div>

          {/* Save Error */}
          {saveError && (
            <div className="w-64 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-3 py-2 mt-3 text-center">
              {saveError}
            </div>
          )}

          {/* Edit / Save Button */}
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={saving}
            className="mt-5 w-64 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-full flex items-center justify-center gap-2 transition disabled:opacity-50"
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

        <div className="px-6 mt-6 space-y-6 pb-24">

          {/* Personal Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <h3 className="text-base font-bold text-gray-900">Personal Information</h3>
            </div>
            <div className="space-y-3">
              {/* First Name */}
              <div>
                <p className="text-xs text-gray-400 mb-1">First Name</p>
                {isEditing ? (
                  <input type="text" value={profile.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full border border-yellow-400 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"/>
                ) : (
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900">
                    {profile.firstName || <span className="text-gray-400">Not set</span>}
                  </div>
                )}
              </div>
              {/* Last Name */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Last Name</p>
                {isEditing ? (
                  <input type="text" value={profile.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full border border-yellow-400 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"/>
                ) : (
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900">
                    {profile.lastName || <span className="text-gray-400">Not set</span>}
                  </div>
                )}
              </div>
              {/* Gender */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Gender</p>
                {isEditing ? (
                  <select value={profile.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full border border-yellow-400 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                ) : (
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900">
                    {profile.gender || <span className="text-gray-400">Not set</span>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <h3 className="text-base font-bold text-gray-900">Health Metrics</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Age', field: 'age', placeholder: 'e.g. 28 years' },
                { label: 'Height', field: 'height', placeholder: 'e.g. 165 cm' },
                { label: 'Weight', field: 'weight', placeholder: 'e.g. 62 kg' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  {isEditing ? (
                    <input type="text" value={profile[field as keyof typeof profile]}
                      placeholder={placeholder}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="w-full border border-yellow-400 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"/>
                  ) : (
                    <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900">
                      {profile[field as keyof typeof profile] || <span className="text-gray-400">Not set</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <h3 className="text-base font-bold text-gray-900">Activity Level</h3>
            </div>
            {isEditing ? (
              <select value={profile.activityLevel}
                onChange={(e) => handleChange('activityLevel', e.target.value)}
                className="w-full border border-yellow-400 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                <option value="">Select activity level</option>
                <option value="Sedentary">Sedentary - Little to no exercise</option>
                <option value="Lightly Active">Lightly Active - 1-3 times/week</option>
                <option value="Moderately Active">Moderately Active - 4-5 times/week</option>
                <option value="Very Active">Very Active - Daily exercise</option>
                <option value="Extra Active">Extra Active - Intense daily exercise</option>
              </select>
            ) : (
              <div className="w-full bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm font-bold text-gray-900">
                  {profile.activityLevel || <span className="text-gray-400">Not set</span>}
                </p>
              </div>
            )}
          </div>

          {/* Health Goal */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
              <h3 className="text-base font-bold text-gray-900">Health Goal</h3>
            </div>
            {isEditing ? (
              <select value={profile.healthGoal}
                onChange={(e) => handleChange('healthGoal', e.target.value)}
                className="w-full border border-yellow-400 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400">
                <option value="">Select health goal</option>
                <option value="Lose Weight">Lose Weight</option>
                <option value="Maintain Weight">Maintain Weight</option>
                <option value="Gain Weight">Gain Weight</option>
                <option value="Build Muscle">Build Muscle</option>
                <option value="Improve Energy">Improve Energy</option>
              </select>
            ) : (
              <div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm font-bold text-gray-900">
                  {profile.healthGoal || <span className="text-gray-400">Not set</span>}
                </p>
              </div>
            )}
          </div>

          {/* Calorie Goal */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <h3 className="text-base font-bold text-gray-900">Daily Calorie Goal</h3>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={profile.calorieGoal}
                placeholder="e.g. 2000"
                min="500"
                max="10000"
                onChange={(e) => handleChange('calorieGoal', e.target.value)}
                className="w-full border border-yellow-400 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            ) : (
              <div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm font-bold text-gray-900">
                  {profile.calorieGoal
                    ? `${profile.calorieGoal} cal / day`
                    : <span className="text-gray-400">Not set (default: 2000 cal)</span>}
                </p>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full border-2 border-red-400 text-red-400 hover:bg-red-50 font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>

        </div>

        <BottomNav active="profile" />

      </div>
    </main>
  );
}