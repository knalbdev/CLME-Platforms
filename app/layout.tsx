import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CLME Platform — Cybersecurity Literacy for Educators',
  description: 'Platform literasi keamanan siber berbasis gamifikasi untuk pendidik Indonesia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-slate-50 antialiased">{children}</body>
    </html>
  )
}
