import {
  collection, getDocs, doc, getDoc, setDoc, addDoc,
  query, orderBy, serverTimestamp, Timestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'
import type { User, UserProgress, Discussion, DiscussionReply, Lesson } from '@/types'

export async function uploadLessonImage(file: File, moduleId: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `lesson-images/${moduleId}/${Date.now()}.${ext}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export interface ModuleMeta {
  id: string
  title: string
  icon: string
  desc: string
  objective: string
  time: string
  dimension: string
  status: 'active' | 'coming' | 'draft'
}

export interface FieldNote {
  id?: string
  facilitatorId: string
  date: string
  category: 'aktivitas' | 'kendala' | 'temuan' | 'rekomendasi'
  body: string
  location: string
  createdAt?: string
}

export interface FasilitatorReport {
  id?: string
  facilitatorId: string
  facilitatorName: string
  period: string
  highlights: string
  obstacles: string
  recommendation: string
  nextPlan: string
  sentAt: string
}

// ── Users ────────────────────────────────────────────────────

export async function getFirestoreUsers(): Promise<User[]> {
  try {
    const snap = await getDocs(collection(db, 'users'))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as User))
  } catch {
    return []
  }
}

// ── Progress ─────────────────────────────────────────────────

export async function getFirestoreProgress(uid: string): Promise<UserProgress | null> {
  try {
    const snap = await getDoc(doc(db, 'progress', uid))
    return snap.exists() ? (snap.data() as UserProgress) : null
  } catch {
    return null
  }
}

export async function saveProgressToFirestore(uid: string, progress: UserProgress): Promise<void> {
  try {
    await setDoc(doc(db, 'progress', uid), progress)
  } catch { /* silent — localStorage tetap jadi sumber primer */ }
}

// ── Module metadata ──────────────────────────────────────────

export async function getFirestoreModuleMetas(): Promise<ModuleMeta[]> {
  try {
    const snap = await getDocs(collection(db, 'modules'))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ModuleMeta))
  } catch {
    return []
  }
}

export async function saveModuleMetaToFirestore(meta: ModuleMeta): Promise<void> {
  try {
    await setDoc(doc(db, 'modules', meta.id), meta)
  } catch { /* silent */ }
}

// ── Lesson content (admin overrides) ─────────────────────────

export async function getFirestoreModuleLessons(moduleId: string): Promise<Lesson[] | null> {
  try {
    const snap = await getDoc(doc(db, 'moduleLessons', moduleId))
    if (!snap.exists()) return null
    return (snap.data().lessons as Lesson[]) ?? null
  } catch { return null }
}

export async function saveFirestoreModuleLessons(moduleId: string, lessons: Lesson[]): Promise<void> {
  try {
    await setDoc(doc(db, 'moduleLessons', moduleId), { lessons })
  } catch { /* silent */ }
}

// ── Discussions ──────────────────────────────────────────────

function toDiscussion(id: string, data: Record<string, unknown>): Discussion {
  const ts = data.createdAt as Timestamp | undefined
  return {
    id,
    moduleId: data.moduleId as string,
    userId: data.userId as string,
    userName: data.userName as string,
    avatar: data.avatar as string,
    title: data.title as string,
    body: data.body as string,
    time: ts ? new Date(ts.toMillis()).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : (data.time as string ?? ''),
    likes: (data.likes as number) ?? 0,
    replies: (data.replies as DiscussionReply[]) ?? [],
  }
}

export async function getFirestoreDiscussions(): Promise<Discussion[]> {
  try {
    const q = query(collection(db, 'discussions'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => toDiscussion(d.id, d.data() as Record<string, unknown>))
  } catch {
    return []
  }
}

export async function addFirestoreDiscussion(d: Omit<Discussion, 'id' | 'time' | 'likes' | 'replies'>): Promise<string> {
  const ref = await addDoc(collection(db, 'discussions'), {
    ...d,
    likes: 0,
    replies: [],
    createdAt: serverTimestamp(),
    time: '',
  })
  return ref.id
}

export async function addFirestoreReply(discussionId: string, reply: DiscussionReply): Promise<void> {
  try {
    const ref = doc(db, 'discussions', discussionId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return
    const replies: DiscussionReply[] = (snap.data().replies as DiscussionReply[]) ?? []
    await setDoc(ref, { ...snap.data(), replies: [...replies, reply] })
  } catch { /* silent */ }
}

// ── User management ──────────────────────────────────────────

export async function approveUser(uid: string): Promise<void> {
  try {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if (snap.exists()) await setDoc(ref, { ...snap.data(), status: 'active' })
  } catch { /* silent */ }
}

export async function getPendingUsers(): Promise<User[]> {
  try {
    const snap = await getDocs(collection(db, 'users'))
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() } as User & { status?: string }))
      .filter(u => (u as unknown as { status?: string }).status === 'pending')
  } catch { return [] }
}

// ── Forward discussions to peneliti ──────────────────────────

export interface ForwardedDiscussion {
  id?: string
  discussionId: string
  title: string
  body: string
  userName: string
  moduleId: string
  forwardedBy: string
  forwardedAt: string
  note: string
}

export async function forwardDiscussionToPeneliti(fd: Omit<ForwardedDiscussion, 'id'>): Promise<void> {
  try {
    await addDoc(collection(db, 'forwardedDiscussions'), fd)
  } catch { /* silent */ }
}

export async function getForwardedDiscussions(): Promise<ForwardedDiscussion[]> {
  try {
    const q = query(collection(db, 'forwardedDiscussions'), orderBy('forwardedAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ForwardedDiscussion))
  } catch { return [] }
}

// ── AI Config ────────────────────────────────────────────────

export interface AIConfig {
  model: string
  prompt: string
}

const AI_CONFIG_DEFAULTS: AIConfig = {
  model: 'gemini-2.5-flash',
  prompt: 'Kamu adalah CLME AI Tutor, asisten pintar untuk platform literasi keamanan siber CLME. Tugasmu membantu pendidik Indonesia (guru SMA/SMK) memahami konsep keamanan siber dengan cara yang jelas dan praktis.\n\nPanduan menjawab:\n- Jawab selalu dalam Bahasa Indonesia\n- Gunakan bahasa yang mudah dipahami oleh guru, bukan teknisi\n- Berikan contoh konkret dari konteks sekolah dan kehidupan sehari-hari\n- Maksimal 3-4 paragraf agar tidak terlalu panjang\n- Jika pertanyaan di luar topik keamanan siber dan pendidikan, arahkan kembali dengan sopan',
}

export async function getAIConfig(): Promise<AIConfig> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'ai'))
    if (snap.exists()) return { ...AI_CONFIG_DEFAULTS, ...snap.data() } as AIConfig
    return AI_CONFIG_DEFAULTS
  } catch {
    return AI_CONFIG_DEFAULTS
  }
}

export async function saveAIConfig(config: AIConfig): Promise<void> {
  try {
    await setDoc(doc(db, 'settings', 'ai'), config)
  } catch { /* silent */ }
}

// ── Field notes (fasilitator) ────────────────────────────────

export async function getFieldNotes(facilitatorId: string): Promise<FieldNote[]> {
  try {
    const q = query(collection(db, 'fieldNotes'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() } as FieldNote))
      .filter(n => n.facilitatorId === facilitatorId)
  } catch {
    return []
  }
}

export async function saveFieldNote(note: Omit<FieldNote, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'fieldNotes'), {
    ...note,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

// ── Reports (fasilitator → peneliti) ────────────────────────

export async function getFasilitatorReports(): Promise<FasilitatorReport[]> {
  try {
    const q = query(collection(db, 'reports'), orderBy('sentAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as FasilitatorReport))
  } catch {
    return []
  }
}

export async function saveFasilitatorReport(report: Omit<FasilitatorReport, 'id'>): Promise<void> {
  try {
    await addDoc(collection(db, 'reports'), report)
  } catch { /* silent */ }
}
