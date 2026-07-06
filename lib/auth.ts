import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import type { User, UserRole, UserProgress } from '@/types'

function defaultProgress(uid: string): UserProgress {
  return { uid, xp: 0, level: 1, streak: 1, badges: ['pemula'], done: [], modules: [], scores: {}, dates: [new Date().toDateString()] }
}

// ── Local testing accounts (always available) ───────────────
const LOCAL_USERS: (User & { password: string })[] = [
  { id: 'P001', email: 'sari@clme.id',       password: 'peserta123', role: 'peserta',  name: 'Sari Rahayu, S.Pd.',    avatar: 'SR', school: 'SMP Negeri 1 Bandung',    subject: 'IPA' },
  { id: 'P002', email: 'budi@clme.id',       password: 'peserta123', role: 'peserta',  name: 'Budi Hartono, M.Pd.',   avatar: 'BH', school: 'SMAN 5 Bandung',           subject: 'Matematika' },
  { id: 'P003', email: 'rini@clme.id',       password: 'peserta123', role: 'peserta',  name: 'Rini Wulandari, S.Pd.', avatar: 'RW', school: 'SMPN 3 Bandung',           subject: 'Bhs. Indonesia' },
  { id: 'E001', email: 'fasilitator@clme.id', password: 'ahli123',    role: 'ahli',     name: 'Prof. Ahmad Fauzan',    avatar: 'AF', institution: 'UPI Bandung' },
  { id: 'R001', email: 'peneliti@clme.id',   password: 'peneliti123',role: 'peneliti', name: 'Yudi Setiawan, M.Pd.',  avatar: 'YS', institution: 'PPS PTK UPI Bandung' },
  { id: 'A001', email: 'admin@clme.id',      password: 'admin123',   role: 'admin',    name: 'Super Admin',           avatar: 'SA', institution: 'CLME Platform' },
]

const SESSION_KEY = 'clme_session'

// ── Session helpers ─────────────────────────────────────────
export function getSession(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const s = localStorage.getItem(SESSION_KEY)
    return s ? JSON.parse(s) : null
  } catch { return null }
}

function saveSession(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  }
}

// ── Get all users (local only — for admin/peneliti views) ───
export function getAllUsers(): User[] {
  return LOCAL_USERS.map(({ password: _, ...u }) => u)
}

// ── Login: local first, then Firebase ──────────────────────
export function login(
  email: string,
  password: string
): { success: boolean; user?: User; error?: string } {
  const localUser = LOCAL_USERS.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  if (localUser) {
    const { password: _, ...user } = localUser
    saveSession(user)
    // Sign into Firebase in background so Firestore rules (request.auth != null) work
    signInWithEmailAndPassword(auth, email, password).catch(() => {})
    return { success: true, user }
  }
  // Not a local account — caller should use loginWithFirebase() instead
  return { success: false, error: '__USE_FIREBASE__' }
}

// ── Firebase login (for registered users) ──────────────────
export async function loginWithFirebase(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const snap = await getDoc(doc(db, 'users', cred.user.uid))

    if (!snap.exists()) {
      await firebaseSignOut(auth)
      return { success: false, error: 'Akun ditemukan tapi profil belum dibuat. Hubungi admin.' }
    }

    const data = snap.data()

    if (data.status === 'pending') {
      await firebaseSignOut(auth)
      return { success: false, error: 'Akun Anda sedang menunggu persetujuan admin. Silakan tunggu konfirmasi.' }
    }

    const user: User = {
      id: cred.user.uid,
      name: data.name,
      email: data.email,
      role: data.role as UserRole,
      avatar: data.avatar,
      school: data.school,
      institution: data.institution,
      subject: data.subject,
    }

    saveSession(user)
    return { success: true, user }
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? ''
    if (['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(code)) {
      return { success: false, error: 'Email atau kata sandi salah.' }
    }
    if (code === 'auth/too-many-requests') {
      return { success: false, error: 'Terlalu banyak percobaan. Coba lagi beberapa saat.' }
    }
    if (code === 'auth/network-request-failed') {
      return { success: false, error: 'Tidak ada koneksi internet.' }
    }
    return { success: false, error: 'Login gagal. Periksa koneksi dan coba lagi.' }
  }
}

// ── Register peserta (Firebase only) ───────────────────────
export async function registerPeserta(data: {
  name: string
  school: string
  email: string
  password: string
}): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password)

    const avatar = data.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    const user: User = {
      id: cred.user.uid,
      name: data.name,
      email: data.email,
      role: 'peserta',
      avatar,
      school: data.school,
    }

    await setDoc(doc(db, 'users', cred.user.uid), {
      name: data.name,
      email: data.email,
      role: 'peserta',
      avatar,
      school: data.school,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    await setDoc(doc(db, 'progress', cred.user.uid), defaultProgress(cred.user.uid))
    await firebaseSignOut(auth)

    return { success: false, error: '__PENDING__' }
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? ''
    if (code === 'auth/email-already-in-use') {
      return { success: false, error: 'Email sudah terdaftar. Silakan masuk.' }
    }
    if (code === 'auth/invalid-email') {
      return { success: false, error: 'Format email tidak valid.' }
    }
    if (code === 'auth/weak-password') {
      return { success: false, error: 'Kata sandi terlalu lemah. Minimal 6 karakter.' }
    }
    if (code === 'auth/network-request-failed') {
      return { success: false, error: 'Tidak ada koneksi internet.' }
    }
    return { success: false, error: 'Pendaftaran gagal. Coba lagi.' }
  }
}

// ── Logout ──────────────────────────────────────────────────
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
  firebaseSignOut(auth).catch(() => {})
}

// ── For reference (not shown in UI) ────────────────────────
export const DEMO_ACCOUNTS = [
  { role: 'peserta'  as UserRole, label: 'Peserta',      emoji: '👩‍🏫', email: 'sari@clme.id',       password: 'peserta123' },
  { role: 'ahli'     as UserRole, label: 'Fasilitator',  emoji: '🤝',  email: 'fasilitator@clme.id', password: 'ahli123'    },
  { role: 'peneliti' as UserRole, label: 'Peneliti',     emoji: '📊',  email: 'peneliti@clme.id',   password: 'peneliti123'},
  { role: 'admin'    as UserRole, label: 'Administrator',emoji: '⚙️',  email: 'admin@clme.id',      password: 'admin123'   },
]
