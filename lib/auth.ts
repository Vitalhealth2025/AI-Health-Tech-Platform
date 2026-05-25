const USERS_KEY = 'hsai_users';
const SESSION_KEY = 'hsai_session';

export interface LocalUser {
  uid: string;
  email: string;
  createdAt: string;
}

interface StoredUser extends LocalUser {
  password: string;
}

function getUsers(): Record<string, StoredUser> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, StoredUser>): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): LocalUser | null {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

export function signUp(email: string, password: string): LocalUser {
  const users = getUsers();
  if (Object.values(users).some((u) => u.email === email)) {
    throw new Error('email-already-in-use');
  }
  const uid = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const createdAt = new Date().toISOString();
  users[uid] = { uid, email, password, createdAt };
  saveUsers(users);
  const user: LocalUser = { uid, email, createdAt };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function signIn(email: string, password: string): LocalUser {
  const users = getUsers();
  const stored = Object.values(users).find((u) => u.email === email);
  if (!stored || stored.password !== password) throw new Error('invalid-credential');
  const user: LocalUser = { uid: stored.uid, email: stored.email, createdAt: stored.createdAt };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function signOut(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(SESSION_KEY);
}

export function onAuthStateChanged(callback: (user: LocalUser | null) => void): () => void {
  const timer = setTimeout(() => callback(getCurrentUser()), 0);
  return () => clearTimeout(timer);
}
