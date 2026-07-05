import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { getAIConfig } from '@/lib/db'

const DEFAULT_SYSTEM_PROMPT = `Kamu adalah CLME AI Tutor, asisten pintar untuk platform literasi keamanan siber CLME.
Tugasmu membantu pendidik Indonesia (guru SMA/SMK) memahami konsep keamanan siber dengan cara yang jelas dan praktis.

Panduan menjawab:
- Jawab selalu dalam Bahasa Indonesia
- Gunakan bahasa yang mudah dipahami oleh guru, bukan teknisi
- Berikan contoh konkret dari konteks sekolah dan kehidupan sehari-hari
- Maksimal 3-4 paragraf agar tidak terlalu panjang
- Jika pertanyaan di luar topik keamanan siber dan pendidikan, arahkan kembali dengan sopan`

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI Tutor belum dikonfigurasi. Hubungi admin untuk mengatur API key.' },
        { status: 503 }
      )
    }

    // Read model + prompt from Firestore (admin-configurable), fall back to defaults
    const aiConfig = await getAIConfig()
    const systemPrompt = aiConfig.prompt || DEFAULT_SYSTEM_PROMPT
    const modelName = aiConfig.model || 'gemini-2.5-flash'

    const systemHistory = [
      {
        role: 'user',
        parts: [{ text: `Ikuti panduan ini selama percakapan: ${systemPrompt}` }],
      },
      {
        role: 'model',
        parts: [{ text: 'Baik, saya mengerti. Saya siap membantu sebagai CLME AI Tutor untuk pendidik Indonesia.' }],
      },
    ]

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: modelName })

    const userHistory = (history ?? [])
      .filter((_: unknown, i: number) => i > 0)
      .map((m: { role: string; text: string }) => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }))

    const chat = model.startChat({
      history: [...systemHistory, ...userHistory],
    })

    const result = await chat.sendMessage(message)
    return NextResponse.json({ text: result.response.text() })
  } catch (err: unknown) {
    const raw = err instanceof Error ? err.message : String(err)
    console.error('[AI Chat]', raw)
    let msg = 'Terjadi kesalahan pada AI. Silakan coba lagi.'
    if (raw.includes('429') || raw.includes('quota') || raw.includes('Too Many Requests')) {
      msg = 'AI sedang sibuk (batas kuota tercapai). Tunggu beberapa saat lalu coba lagi.'
    } else if (raw.includes('API_KEY') || raw.includes('403') || raw.includes('400')) {
      msg = 'API key Gemini tidak valid. Hubungi admin untuk memperbarui konfigurasi.'
    } else if (raw.includes('404') || raw.includes('not found')) {
      msg = 'Model AI tidak tersedia. Hubungi admin untuk memperbarui konfigurasi.'
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
