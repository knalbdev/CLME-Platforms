import type { User, UserRole } from '@/types'

const USERS: (User & { password: string })[] = [
  { id: 'P001', email: 'sari@clme.id',         password: 'peserta123', role: 'peserta',  name: 'Sari Rahayu, S.Pd.',    avatar: 'SR', school: 'SMP Negeri 1 Bandung',    subject: 'IPA' },
  { id: 'P002', email: 'budi@clme.id',         password: 'peserta123', role: 'peserta',  name: 'Budi Hartono, M.Pd.',   avatar: 'BH', school: 'SMAN 5 Bandung',           subject: 'Matematika' },
  { id: 'P003', email: 'rini@clme.id',         password: 'peserta123', role: 'peserta',  name: 'Rini Wulandari, S.Pd.', avatar: 'RW', school: 'SMPN 3 Bandung',           subject: 'Bhs. Indonesia' },
  { id: 'E001', email: 'prof.ahmad@clme.id',   password: 'ahli123',    role: 'ahli',     name: 'Prof. Ahmad Fauzan',    avatar: 'AF', institution: 'UPI Bandung' },
  { id: 'R001', email: 'yudi@clme.id',         password: 'peneliti123',role: 'peneliti', name: 'Yudi Setiawan, M.Pd.',  avatar: 'YS', institution: 'PPS PTK UPI Bandung' },
  { id: 'A001', email: 'admin@clme.id',        password: 'admin123',   role: 'admin',    name: 'Super Admin',           avatar: 'SA', institution: 'CLME Platform' },
]

export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const u = USERS.find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password)
  if (!u) return { success: false, error: 'Email atau kata sandi tidak valid.' }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...user } = u
  if (typeof window !== 'undefined') localStorage.setItem('clme_session', JSON.stringify(user))
  return { success: true, user }
}

export function logout() {
  if (typeof window !== 'undefined') localStorage.removeItem('clme_session')
}

export function getSession(): User | null {
  if (typeof window === 'undefined') return null
  try {
    const s = localStorage.getItem('clme_session')
    return s ? JSON.parse(s) : null
  } catch { return null }
}

export function getAllUsers(): User[] {
  return USERS.map(({ password: _, ...u }) => u)
}

export const DEMO_ACCOUNTS = [
  { role: 'peserta'  as UserRole, label: 'Peserta',        emoji: '👩‍🏫', email: 'sari@clme.id',       password: 'peserta123' },
  { role: 'ahli'     as UserRole, label: 'Fasilitator',     emoji: '🤝', email: 'prof.ahmad@clme.id', password: 'ahli123'    },
  { role: 'peneliti' as UserRole, label: 'Peneliti',       emoji: '📊', email: 'yudi@clme.id',       password: 'peneliti123'},
  { role: 'admin'    as UserRole, label: 'Administrator',  emoji: '⚙️', email: 'admin@clme.id',      password: 'admin123'   },
]
