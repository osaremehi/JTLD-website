// client/src/pages/careers/CareersProfilePage.tsx
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { User, FileText, Upload, Trash2, LogOut, CheckCircle, AlertCircle, Download } from 'lucide-react'
import Logo from '@/components/layout/Logo'

type Candidate = {
  id: string; full_name: string; email: string;
  phone: string | null; location: string | null;
  linkedin_url: string | null; bio: string | null;
}

type Resume = {
  id: string; file_name: string; storage_path: string;
  file_size: number | null; uploaded_at: string;
}

export default function CareersProfilePage() {
  const [tab, setTab] = useState<'profile' | 'resumes'>('profile')
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/careers/login'); return }

      const { data } = await supabase.from('candidates').select('*').eq('user_id', user.id).single()
      if (!data) { navigate('/careers/signup'); return }
      setCandidate(data)

      const { data: resumeData } = await supabase.from('resumes').select('*')
        .eq('candidate_id', data.id).order('uploaded_at', { ascending: false })
      setResumes(resumeData || [])
      setLoading(false)
    }
    load()
  }, [navigate])

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!candidate) return
    setSaving(true)
    const { error } = await supabase.from('candidates')
      .update({
        full_name: candidate.full_name,
        phone: candidate.phone,
        location: candidate.location,
        linkedin_url: candidate.linkedin_url,
        bio: candidate.bio,
      })
      .eq('id', candidate.id)
    setSaving(false)
    if (error) showToast('error', 'Failed to save. Please try again.')
    else showToast('success', 'Profile updated successfully.')
  }

  async function uploadResume(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !candidate) return
    if (file.size > 10 * 1024 * 1024) { showToast('error', 'File must be under 10MB.'); return }

    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const path = `${user!.id}/${Date.now()}_${file.name}`

    const { error: storageError } = await supabase.storage.from('resumes').upload(path, file)
    if (storageError) { showToast('error', 'Upload failed: ' + storageError.message); setUploading(false); return }

    const { data, error: dbError } = await supabase.from('resumes').insert({
      candidate_id: candidate.id,
      file_name: file.name,
      storage_path: path,
      file_size: file.size,
    }).select().single()

    if (dbError) { showToast('error', 'Failed to save resume record.'); }
    else { setResumes(r => [data, ...r]); showToast('success', 'Resume uploaded successfully.') }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function deleteResume(resume: Resume) {
    await supabase.storage.from('resumes').remove([resume.storage_path])
    await supabase.from('resumes').delete().eq('id', resume.id)
    setResumes(r => r.filter(x => x.id !== resume.id))
    showToast('success', 'Resume removed.')
  }

  async function downloadResume(resume: Resume) {
    const { data } = await supabase.storage.from('resumes').createSignedUrl(resume.storage_path, 60)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/careers')
  }

  function formatSize(bytes: number | null) {
    if (!bytes) return ''
    return bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center pt-[100px]">
      <div className="animate-spin w-8 h-8 border-4 border-navy-500 border-t-transparent rounded-full" />
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-navy-950 pt-[100px] pb-16">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-28 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium
          ${toast.type === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
            : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/careers"><Logo className="text-navy-900 dark:text-white" /></Link>
          </div>
          <button onClick={signOut}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-navy-800 dark:hover:text-white transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-navy-900 dark:text-white">My Career Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{candidate?.email}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          {(['profile', 'resumes'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors capitalize
                ${tab === t
                  ? 'border-navy-800 dark:border-gold-400 text-navy-900 dark:text-white'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-navy-800 dark:hover:text-white'}`}>
              {t === 'profile' ? <User size={16} /> : <FileText size={16} />}
              {t === 'profile' ? 'Personal Info' : 'My Resumes'}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && candidate && (
          <form onSubmit={saveProfile} className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { label: 'Full Name', key: 'full_name', type: 'text', required: true },
                { label: 'Email', key: 'email', type: 'email', required: true, disabled: true },
                { label: 'Phone', key: 'phone', type: 'tel', required: false },
                { label: 'Location', key: 'location', type: 'text', required: false },
                { label: 'LinkedIn URL', key: 'linkedin_url', type: 'url', required: false },
              ].map(f => (
                <div key={f.key} className={f.key === 'linkedin_url' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    {f.label}{!f.required && <span className="text-gray-400 font-normal ml-1">(optional)</span>}
                  </label>
                  <input type={f.type} required={f.required} disabled={f.disabled}
                    value={(candidate as Record<string, string | null>)[f.key] ?? ''}
                    onChange={e => setCandidate(c => c ? { ...c, [f.key]: e.target.value } : c)}
                    className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition disabled:opacity-50 disabled:cursor-not-allowed" />
                </div>
              ))}

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Bio <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea rows={4}
                  value={candidate.bio ?? ''}
                  onChange={e => setCandidate(c => c ? { ...c, bio: e.target.value } : c)}
                  placeholder="Brief summary of your experience, skills, and career goals..."
                  className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition resize-none" />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-navy-800 text-white hover:bg-navy-700 dark:bg-gold-400 dark:text-navy-950 dark:hover:bg-gold-300 disabled:opacity-60 transition-all">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Resumes Tab */}
        {tab === 'resumes' && (
          <div className="space-y-4">
            {/* Upload box */}
            <div className="bg-white dark:bg-navy-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-navy-400 dark:hover:border-navy-500 transition-colors">
              <Upload size={32} className="mx-auto mb-3 text-gray-400 dark:text-gray-500" />
              <p className="font-semibold text-navy-900 dark:text-white mb-1">Upload your resume</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">PDF or Word — max 10 MB</p>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={uploadResume} />
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-navy-800 text-white hover:bg-navy-700 dark:bg-gold-400 dark:text-navy-950 dark:hover:bg-gold-300 disabled:opacity-60 transition-all">
                <Upload size={15} /> {uploading ? 'Uploading...' : 'Choose File'}
              </button>
            </div>

            {/* Resume list */}
            {resumes.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-8">No resumes uploaded yet.</p>
            ) : (
              resumes.map(r => (
                <div key={r.id}
                  className="flex items-center justify-between gap-4 bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl px-5 py-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={20} className="text-navy-600 dark:text-blue-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-navy-900 dark:text-white truncate text-sm">{r.file_name}</p>
                      <p className="text-xs text-gray-400">
                        {formatSize(r.file_size)} · {new Date(r.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => downloadResume(r)}
                      className="p-2 rounded-lg text-gray-500 hover:text-navy-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors" title="Download">
                      <Download size={16} />
                    </button>
                    <button onClick={() => deleteResume(r)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  )
}
