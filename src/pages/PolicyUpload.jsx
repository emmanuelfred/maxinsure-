import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePolicy } from '../PolicyContext'

const API_URL = 'http://localhost:3001/api/analyze'

const STEPS = [
  'Extracting document text...',
  'Parsing policy clauses...',
  'Identifying coverage gaps...',
  'Running risk assessment...',
  'Scoring policy value...',
  'Finalizing analysis...',
]

export default function PolicyUpload() {
  const navigate = useNavigate()
  const { setPolicy } = usePolicy()
  const fileInputRef = useRef(null)

  const [dragging, setDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [policyText, setPolicyText] = useState('')
  const [analysisState, setAnalysisState] = useState('idle') // idle | analyzing | complete | error
  const [progress, setProgress] = useState(0)
  const [stepLabel, setStepLabel] = useState('')
  const [gapsFound, setGapsFound] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  // ─── Fake progress ticker (keeps UI lively while API runs) ───────────────────
  const startProgressTicker = () => {
    let p = 0
    let stepIdx = 0
    setStepLabel(STEPS[0])

    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 4) + 1
      if (p >= 90) { p = 90; clearInterval(interval) } // hold at 90 until API responds
      setProgress(p)

      const newStep = Math.floor((p / 90) * (STEPS.length - 1))
      if (newStep !== stepIdx && newStep < STEPS.length) {
        stepIdx = newStep
        setStepLabel(STEPS[stepIdx])
      }
    }, 300)

    return interval
  }

  // ─── Main analysis runner ────────────────────────────────────────────────────
  const runAnalysis = async (file, text) => {
    setAnalysisState('analyzing')
    setProgress(0)
    setErrorMsg('')

    const ticker = startProgressTicker()

    try {
      let response

      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        response = await fetch(API_URL, { method: 'POST', body: formData })
      } else {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        })
      }

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Analysis failed. Please try again.')
      }

      clearInterval(ticker)

      // Animate to 100%
      setProgress(100)
      setStepLabel('Analysis complete!')
      setPolicy(data.policy)
      setGapsFound(data.policy?.risks?.length || 0)

      setTimeout(() => setAnalysisState('complete'), 600)

    } catch (err) {
      clearInterval(ticker)
      setErrorMsg(err.message)
      setAnalysisState('error')
    }
  }

  const handleFile = (file) => {
    if (!file) return
    setUploadedFile(file)
    runAnalysis(file, null)
  }

  const handleTextAnalyze = () => {
    if (!policyText.trim()) return
    runAnalysis(null, policyText)
  }

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  const resetState = () => {
    setAnalysisState('idle')
    setUploadedFile(null)
    setPolicyText('')
    setProgress(0)
    setErrorMsg('')
  }

  return (
    <div className="bg-[#fcf8ff] font-sans text-[#1b1b21] min-h-screen">
      <main className="pt-32 pb-24 px-8 max-w-[1440px] mx-auto min-h-screen">

        {/* Hero */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-semibold tracking-widest text-[#2e3192] bg-[#e1e0ff] px-3 py-1 rounded-full inline-block mb-4 uppercase">
            AI-Powered Extraction
          </span>
          <h1 className="font-display text-5xl font-bold text-[#1b1b21] mb-6 leading-tight">
            Policy Intelligence Intake
          </h1>
          <p className="text-base text-[#464652] leading-relaxed">
            Upload policy documents for instant AI-driven risk assessment and coverage gap detection. Our neural engine extracts complex clauses in seconds.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-10">

          {/* Drop Zone — disabled while analyzing */}
          <div
            onDrop={analysisState === 'idle' ? onDrop : undefined}
            onDragOver={analysisState === 'idle' ? onDragOver : undefined}
            onDragLeave={analysisState === 'idle' ? onDragLeave : undefined}
            onClick={() => analysisState === 'idle' && fileInputRef.current?.click()}
            className={`bg-white border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-all group
              ${analysisState !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${dragging ? 'border-[#15157d] bg-[#F0F4FF]' : 'border-[#c7c5d4] hover:border-[#15157d]/40'}`}
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #e4e1ea 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors ${dragging ? 'bg-[#e1e0ff]' : 'bg-[#f5f2fb] group-hover:bg-[#e1e0ff]'}`}>
              <span className="material-symbols-outlined text-[#15157d] text-3xl">upload_file</span>
            </div>
            {uploadedFile ? (
              <>
                <h3 className="font-display text-xl font-semibold text-[#1b1b21] mb-2">{uploadedFile.name}</h3>
                <p className="text-sm text-[#777683]">{(uploadedFile.size / 1024).toFixed(1)} KB — analyzing...</p>
              </>
            ) : (
              <>
                <h3 className="font-display text-xl font-semibold text-[#1b1b21] mb-2">Drop your policy here</h3>
                <p className="text-sm text-[#777683] mb-8">Supports PDF, DOCX, and TXT files</p>
                <button
                  className="bg-[#15157d] text-white px-6 py-3 rounded-xl font-semibold text-base hover:brightness-110 transition-all shadow-sm active:scale-95"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                >
                  Select Files
                </button>
              </>
            )}
          </div>

          {/* OR Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-4 text-xs font-semibold tracking-widest text-[#777683] uppercase">or</span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {/* Manual Text Entry */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#515f74] text-xl">description</span>
              <h4 className="font-display text-lg font-semibold text-[#1b1b21]">Paste Policy Text Manually</h4>
            </div>
            <textarea
              className="w-full h-40 p-4 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#15157d] focus:border-transparent outline-none transition-all resize-none text-[#1b1b21] placeholder-slate-400 disabled:opacity-50"
              placeholder="Enter raw policy text or specific clauses for instant analysis..."
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              disabled={analysisState !== 'idle'}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleTextAnalyze}
                className="text-[#15157d] font-semibold text-sm hover:underline disabled:opacity-40"
                disabled={!policyText.trim() || analysisState !== 'idle'}
              >
                Analyze Text Snippet
              </button>
            </div>
          </div>
        </div>

        {/* ─── Analysis States ─────────────────────────────────────────────────── */}
        {analysisState !== 'idle' && (
          <div className="mt-16 max-w-4xl mx-auto space-y-6">

            {/* Analyzing */}
            {analysisState === 'analyzing' && (
              <div className="bg-[#eae7f0] rounded-xl p-8 border border-[#c7c5d4]/30">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 shrink-0">
                      <div className="absolute inset-0 border-4 border-[#e1e0ff] rounded-full" />
                      <div className="absolute inset-0 border-4 border-[#15157d] border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1b1b21]">AI Analysis in Progress...</p>
                      <p className="text-xs text-[#777683] mt-0.5">{stepLabel}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold tracking-widest text-[#15157d] uppercase shrink-0">{progress}%</span>
                </div>
                <div className="w-full bg-[#e4e1ea] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#15157d] h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Success */}
            {analysisState === 'complete' && (
              <div className="bg-indigo-50 border border-[#D1DBFF] rounded-xl p-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1b1b21]">Policy Analyzed Successfully</h4>
                    <p className="text-sm text-[#464652]">
                      {gapsFound} potential coverage {gapsFound === 1 ? 'gap' : 'gaps'} identified.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-[#15157d] text-white px-6 py-2 rounded-lg font-semibold hover:brightness-110 transition-all flex items-center gap-2 active:scale-95 shrink-0"
                >
                  View Dashboard
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            )}

            {/* Error */}
            {analysisState === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-red-600">error</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1b1b21]">Analysis Failed</h4>
                    <p className="text-sm text-red-600 mt-0.5">{errorMsg}</p>
                  </div>
                </div>
                <button
                  onClick={resetState}
                  className="border border-red-300 text-red-600 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-red-50 transition-all shrink-0"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Trust Cards */}
        <section className="mt-24 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'lock',          title: 'Encryption',  desc: 'Enterprise-grade AES-256 encryption for all data at rest and in transit.' },
              { icon: 'bolt',          title: 'Speed',       desc: 'Proprietary LLMs process a 50-page document in under 12 seconds.' },
              { icon: 'verified_user', title: 'Compliance',  desc: 'Fully SOC2 Type II, GDPR, and HIPAA compliant infrastructure.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-8 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="mb-4 text-[#15157d]">
                  <span className="material-symbols-outlined text-3xl">{icon}</span>
                </div>
                <h5 className="font-display text-lg font-semibold mb-2 text-[#1b1b21]">{title}</h5>
                <p className="text-sm text-[#777683]">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 w-full py-12">
        <div className="max-w-[1440px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-slate-900 font-display">MassInsure</div>
            <div className="text-sm text-slate-500">© 2024 MassInsure AI Systems. All rights reserved.</div>
          </div>
          <div className="flex gap-8">
            {['Privacy Policy', 'Terms of Service', 'Compliance', 'Security'].map(link => (
              <a key={link} href="#" className="text-sm text-slate-500 hover:text-[#15157d] transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
