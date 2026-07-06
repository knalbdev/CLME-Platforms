'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login, loginWithFirebase, registerPeserta } from '@/lib/auth'

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
)

type Tab = 'login' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('login')

  // login state
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)

  // register state
  const [regName, setRegName]           = useState('')
  const [regSchool, setRegSchool]       = useState('')
  const [regEmail, setRegEmail]         = useState('')
  const [regPwd, setRegPwd]             = useState('')
  const [regConfirm, setRegConfirm]     = useState('')
  const [showRegPwd, setShowRegPwd]     = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)

  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const s = typeof window !== 'undefined' ? localStorage.getItem('clme_session') : null
    if (s) {
      try { const u = JSON.parse(s); router.push(`/${u.role}`) } catch { /* ignore */ }
    }
  }, [router])

  const switchTab = (t: Tab) => { setTab(t); setError(''); setSuccess('') }

  // ── Login ────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!email || !password) { setError('Mohon isi email dan kata sandi.'); return }
    setLoading(true); setError('')

    // 1. Coba local testing accounts dulu (sync, cepat)
    const local = login(email, password)
    if (local.success && local.user) {
      router.push(`/${local.user.role}`)
      return
    }

    // 2. Kalau bukan local account, coba Firebase
    const result = await loginWithFirebase(email, password)
    if (result.success && result.user) {
      router.push(`/${result.user.role}`)
    } else {
      setError(result.error || 'Email atau kata sandi salah.')
      setLoading(false)
    }
  }

  // ── Register ─────────────────────────────────────────────
  const handleRegister = async () => {
    if (!regName.trim() || !regSchool.trim() || !regEmail.trim() || !regPwd) {
      setError('Mohon lengkapi semua isian.'); return
    }
    if (regPwd.length < 6) { setError('Kata sandi minimal 6 karakter.'); return }
    if (regPwd !== regConfirm) { setError('Konfirmasi kata sandi tidak cocok.'); return }

    setLoading(true); setError('')
    const result = await registerPeserta({
      name: regName.trim(),
      school: regSchool.trim(),
      email: regEmail.trim(),
      password: regPwd,
    })

    if (result.error === '__PENDING__') {
      setSuccess('Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan admin atau fasilitator. Anda akan mendapat notifikasi setelah disetujui.')
      setLoading(false)
    } else if (result.success && result.user) {
      router.push('/peserta')
    } else {
      setError(result.error || 'Pendaftaran gagal.')
      setLoading(false)
    }
  }

  const inputClass = 'w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition bg-white'
  const labelClass = 'block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition">
            ← Kembali ke Beranda
          </Link>
        </div>

        <div className="text-center mb-6">
          <img src="/logo.png" alt="CLME" className="w-16 h-16 object-contain mx-auto mb-4 drop-shadow-md" />
          <h1 className="text-2xl font-black text-slate-900">CLME Platform</h1>
          <p className="text-sm text-slate-500 mt-1.5">Literasi keamanan siber untuk pendidik Indonesia</p>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-5">
          <button onClick={() => switchTab('login')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${tab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            Masuk
          </button>
          <button onClick={() => switchTab('register')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${tab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            Daftar Akun
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-7">

          {error && (
            <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              <span className="mt-0.5 flex-none">⚠️</span><span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-5 flex items-start gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">
              <span className="mt-0.5 flex-none">✅</span><span>{success}</span>
            </div>
          )}

          {/* ── LOGIN ─────────────────────────────────────── */}
          {tab === 'login' && (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Alamat Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="email@sekolah.sch.id"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className={`${inputClass} pr-11`}
                  />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition p-0.5">
                    {showPwd ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button onClick={handleLogin} disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm shadow-primary-200 text-sm mt-2">
                {loading ? 'Memproses…' : 'Masuk ke Platform →'}
              </button>
            </div>
          )}

          {/* ── REGISTER ──────────────────────────────────── */}
          {tab === 'register' && (
            <div className="space-y-4">
              <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 text-xs text-primary-700 leading-relaxed">
                Pendaftaran terbuka untuk <strong>Peserta (Guru / Pendidik)</strong>. Akun fasilitator, peneliti, dan admin diberikan langsung oleh tim CLME.
              </div>

              <div>
                <label className={labelClass}>Nama Lengkap</label>
                <input value={regName} onChange={e => setRegName(e.target.value)}
                  placeholder="Contoh: Budi Santoso, S.Pd."
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Asal Sekolah / Institusi</label>
                <input value={regSchool} onChange={e => setRegSchool(e.target.value)}
                  placeholder="SMA Negeri 1 Bandung"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Alamat Email</label>
                <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                  placeholder="nama@sekolah.sch.id"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showRegPwd ? 'text' : 'password'} value={regPwd}
                    onChange={e => setRegPwd(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className={`${inputClass} pr-11`}
                  />
                  <button type="button" onClick={() => setShowRegPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition p-0.5">
                    {showRegPwd ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Konfirmasi Kata Sandi</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'} value={regConfirm}
                    onChange={e => setRegConfirm(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    onKeyDown={e => e.key === 'Enter' && handleRegister()}
                    className={`${inputClass} pr-11`}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition p-0.5">
                    {showConfirm ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <button onClick={handleRegister} disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm shadow-primary-200 text-sm mt-2">
                {loading ? 'Mendaftarkan akun…' : 'Buat Akun Peserta →'}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          © 2026 CLME Platform · PPS PTK UPI Bandung
        </p>
      </div>
    </div>
  )
}
