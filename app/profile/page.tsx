'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'Moesha',
    lastName: 'Johnson',
    email: 'moesha.johnson@example.com',
    gender: 'Female',
    age: '28 years',
    height: '165 cm',
    weight: '62 kg',
    activityLevel: 'Moderately Active',
    healthGoal: 'Maintain Weight',
  });

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

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
          <h2 className="text-xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h2>
          <p className="text-sm text-gray-400 mt-1">Member since 2026</p>
          <div className="flex items-center gap-2 mt-3">
            <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span className="text-sm text-gray-500">{profile.email}</span>
          </div>

          {/* Edit / Save Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-5 w-64 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-full flex items-center justify-center gap-2 transition"
          >
            {isEditing ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Save Profile
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
              <div>
                <p className="text-xs text-gray-400 mb-1">First Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className="w-full border border-yellow-400 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                ) : (
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900">{profile.firstName}</div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Last Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className="w-full border border-yellow-400 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                ) : (
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900">{profile.lastName}</div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Gender</p>
                {isEditing ? (
                  <select
                    value={profile.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full border border-yellow-400 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                ) : (
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900">{profile.gender}</div>
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
                { label: 'Age', field: 'age' },
                { label: 'Height', field: 'height' },
                { label: 'Weight', field: 'weight' },
              ].map(({ label, field }) => (
                <div key={field}>
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile[field as keyof typeof profile]}
                      onChange={(e) => handleChange(field, e.target.value)}
                      className="w-full border border-yellow-400 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  ) : (
                    <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-900">
                      {profile[field as keyof typeof profile]}
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
              <select
                value={profile.activityLevel}
                onChange={(e) => handleChange('activityLevel', e.target.value)}
                className="w-full border border-yellow-400 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="Sedentary">Sedentary - Little to no exercise</option>
                <option value="Lightly Active">Lightly Active - 1-3 times/week</option>
                <option value="Moderately Active">Moderately Active - Exercise 4-5 times/week</option>
                <option value="Very Active">Very Active - Daily exercise</option>
                <option value="Extra Active">Extra Active - Intense daily exercise</option>
              </select>
            ) : (
              <div className="w-full bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm font-bold text-gray-900">{profile.activityLevel}</p>
                <p className="text-xs text-gray-500 mt-1">Exercise 4-5 times/week</p>
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
              <select
                value={profile.healthGoal}
                onChange={(e) => handleChange('healthGoal', e.target.value)}
                className="w-full border border-yellow-400 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="Lose Weight">Lose Weight</option>
                <option value="Maintain Weight">Maintain Weight</option>
                <option value="Gain Weight">Gain Weight</option>
                <option value="Build Muscle">Build Muscle</option>
                <option value="Improve Energy">Improve Energy</option>
              </select>
            ) : (
              <div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm font-bold text-gray-900">{profile.healthGoal}</p>
                <p className="text-xs text-gray-500 mt-1">Stay consistent with your routine</p>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link href="/log-meals" className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 2v6a3 3 0 006 0V2M6 8v14M15 2a2 2 0 012 2v16M17 2h2M17 10h2"/>
            </svg>
            <span className="text-xs">Meals</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-yellow-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span className="text-xs font-bold">Profile</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="text-xs">Settings</span>
          </Link>
        </div>

      </div>
    </main>
  );
}