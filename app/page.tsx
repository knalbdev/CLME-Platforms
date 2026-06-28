'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login, DEMO_ACCOUNTS } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem('clme_session')
    if (s) {
      const u = JSON.parse(s)
      router.push(`/${u.role}`)
    }
  }, [router])

  const handleLogin = async () => {
    if (!email || !password) { setError('Mohon isi email dan kata sandi.'); return }
    setLoading(true); setError('')
    await new Promise(r => setTimeout(r, 400))
    const result = login(email, password)
    if (result.success && result.user) {
      router.push(`/${result.user.role}`)
    } else {
      setError(result.error || 'Login gagal.')
      setLoading(false)
    }
  }

  const fill = (e: string, p: string) => { setEmail(e); setPassword(p) }

  const roleColors: Record<string, string> = {
    peserta: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    ahli: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    peneliti: 'bg-violet-50 border-violet-200 hover:bg-violet-100',
    admin: 'bg-slate-50 border-slate-200 hover:bg-slate-100',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 shadow-lg shadow-primary-200 mb-4">
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">CLME</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1 font-semibold">Cybersecurity Literacy for Educators</p>
          <p className="text-sm text-slate-500 mt-2">Platform literasi keamanan siber berbasis gamifikasi untuk pendidik Indonesia</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">
          {error && (
            <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Alamat Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="email@sekolah.sch.id"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Kata Sandi</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition"
              />
            </div>
          </div>

          <button
            onClick={handleLogin} disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm shadow-primary-200 text-sm"
          >
            {loading ? 'Memproses…' : 'Masuk ke Platform →'}
          </button>

          {/* Demo accounts */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Akun Demo — Klik untuk isi otomatis</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role} onClick={() => fill(acc.email, acc.password)}
                  className={`border rounded-xl p-3 text-left transition cursor-pointer ${roleColors[acc.role]}`}
                >
                  <div className="text-sm font-bold text-slate-700">{acc.emoji} {acc.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">{acc.email}</div>
                  <div className="text-xs text-slate-400">{acc.password}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">PPS-PDD Prototype Interaktif · Tahap 2 · Data tidak nyata</p>
      </div>
    </div>
  )
}
