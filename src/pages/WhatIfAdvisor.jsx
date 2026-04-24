import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SUGGESTED_QUESTIONS = [
  'What if I\'m hospitalized for 5 days?',
  'What if I travel overseas and need emergency care?',
  'What if I need surgery costing ₦3M?',
  'What if I file two claims this year?',
]

const RECENT_SCENARIOS = [
  '5-day hospitalization scenario',
  'Overseas emergency evacuation',
  'Critical illness lump sum claim',
]

const INITIAL_MESSAGES = [
  {
    role: 'ai',
    text: 'Hello! I\'m your AI Advisor. Describe a scenario below and I\'ll simulate how your current policy would respond — including out-of-pocket costs, coverage percentages, and what gaps you should be aware of.',
    time: '10:24 AM',
  },
]

const SIMULATION_RESULT = {
  scenario: '5-Day Hospitalization',
  metrics: [
    { label: 'Est. Out-of-Pocket',  value: '₦62,500',       sub: 'Limited by ₦100k individual cap' },
    { label: 'Coverage Applied',     value: '85%',           sub: 'In-network hospital stay' },
    { label: 'Deductible Remaining', value: '₦37,500',       sub: 'Post-simulation balance' },
  ],
  breakdown: [
    { item: 'Inpatient Room & Board (5 Days)', cost: '₦375,000', coverage: '90%', coverageType: 'good' },
    { item: 'Diagnostic Lab Tests',            cost: '₦60,000',  coverage: '80%', coverageType: 'good' },
    { item: 'Pharmaceuticals (Tier 2)',         cost: '₦22,500',  coverage: '₦2,500 Co-pay', coverageType: 'warn' },
  ],
  tips: [
    {
      icon: 'info',
      title: 'Pre-Authorization Required',
      desc: 'Hospitalization for non-emergencies requires 48-hour notice to maintain the 90% coverage rate.',
    },
    {
      icon: 'savings',
      title: 'Cost Savings Tip',
      desc: 'Using a Premier Network facility reduces the daily room co-pay from ₦12,500 to ₦5,000.',
    },
  ],
}

function AiMessage({ text, time }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="rounded-2xl rounded-tl-none p-4 text-sm text-[#464652] max-w-[88%]"
        style={{ background: '#F0F4FF', border: '1px solid #D1DBFF' }}
      >
        {text}
      </div>
      <span className="text-[10px] text-slate-400 ml-2">{time}</span>
    </div>
  )
}

function UserMessage({ text, time }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="bg-[#15157d] text-white rounded-2xl rounded-tr-none p-4 text-sm max-w-[88%]">
        {text}
      </div>
      <span className="text-[10px] text-slate-400 mr-2">{time}</span>
    </div>
  )
}

export default function WhatIfAdvisor() {
  const [scenario, setScenario] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [chatInput, setChatInput] = useState('')
  const [showRecent, setShowRecent] = useState(false)
  const chatBottomRef = useRef(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const runSimulation = () => {
    if (!scenario.trim()) return
    setIsRunning(true)
    setShowResult(false)
    setTimeout(() => {
      setIsRunning(false)
      setShowResult(true)
    }, 1800)
  }

  const sendChat = () => {
    if (!chatInput.trim()) return
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { role: 'user', text: chatInput, time: now }])
    setChatInput('')
    setTimeout(() => {
      const now2 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Based on your current ComprehensiveCare Gold policy, here\'s what I found. Your coverage applies to most standard scenarios, but there are specific exclusions and sub-limits you should review. Would you like me to run a detailed simulation?',
        time: now2,
      }])
    }, 1200)
  }

  return (
    <div className="bg-[#fcf8ff] min-h-screen font-sans text-[#1b1b21]">
      <div className="max-w-[1440px] mx-auto px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-xs font-semibold tracking-widest text-slate-400 uppercase">
          <Link to="/dashboard" className="hover:text-[#15157d] transition-colors">Dashboard</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-[#15157d]">What-If Advisor</span>
        </nav>

        <div className="grid grid-cols-12 gap-6">

          {/* ── Left: Simulation ── */}
          <div className="col-span-12 lg:col-span-8 space-y-6">

            {/* Header */}
            <div>
              <h2 className="font-display text-2xl font-bold text-[#1b1b21]">What-If Simulation</h2>
              <p className="text-sm text-[#515f74] mt-1">
                Model potential scenarios against your current policy to forecast liability and out-of-pocket exposure.
              </p>
            </div>

            {/* Input Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <label className="text-xs font-bold tracking-widest text-[#777683] uppercase mb-3 block">
                Scenario Description
              </label>
              <textarea
                className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#15157d] focus:border-transparent outline-none transition-all resize-none text-[#1b1b21] placeholder-slate-400"
                placeholder="e.g. 'What happens if I get hospitalized for 5 days following a localized emergency?'"
                value={scenario}
                onChange={e => setScenario(e.target.value)}
              />
              <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex gap-2 flex-wrap">
                  <div className="relative">
                    <button
                      onClick={() => setShowRecent(r => !r)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f0ecf5] text-[#15157d] text-xs font-semibold rounded-full hover:bg-[#e1e0ff] transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs">history</span>
                      Recent Scenarios
                    </button>
                    {showRecent && (
                      <div className="absolute top-full mt-2 left-0 bg-white border border-slate-200 rounded-xl shadow-lg z-10 min-w-[220px] overflow-hidden">
                        {RECENT_SCENARIOS.map(s => (
                          <button
                            key={s}
                            onClick={() => { setScenario(s); setShowRecent(false) }}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-[#f5f2fb] hover:text-[#15157d] transition-colors border-b border-slate-50 last:border-0"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={runSimulation}
                  disabled={!scenario.trim() || isRunning}
                  className="bg-[#15157d] text-white px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">play_arrow</span>
                      Run Simulation
                    </>
                  )}
                </button>
              </div>

              {/* Suggested chips */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Quick Scenarios</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => setScenario(q)}
                      className="text-xs font-medium bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:border-[#15157d] hover:text-[#15157d] transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Panel */}
            {showResult && (
              <div
                className="rounded-xl p-8 relative overflow-hidden"
                style={{ background: '#F0F4FF', border: '1px solid #D1DBFF', boxShadow: '0 0 24px rgba(209,219,255,0.5)' }}
              >
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <span className="material-symbols-outlined text-8xl text-[#15157d]">auto_awesome</span>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-[#15157d]" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
                  <h3 className="font-display text-xl font-bold text-[#15157d]">
                    Simulation Result: {SIMULATION_RESULT.scenario}
                  </h3>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {SIMULATION_RESULT.metrics.map(({ label, value, sub }) => (
                    <div key={label} className="bg-white/70 backdrop-blur p-4 rounded-xl border border-white">
                      <p className="text-xs font-bold text-[#777683] uppercase tracking-widest mb-1">{label}</p>
                      <p className="font-display text-2xl font-bold text-[#1b1b21]">{value}</p>
                      <p className="text-xs text-[#515f74] mt-1">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Breakdown table */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-[#1b1b21] mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">fact_check</span>
                    Detailed Breakdown
                  </h4>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-bold tracking-widest text-[#777683] uppercase">Service Item</th>
                          <th className="text-right px-4 py-3 text-xs font-bold tracking-widest text-[#777683] uppercase">Total Cost</th>
                          <th className="text-right px-4 py-3 text-xs font-bold tracking-widest text-[#777683] uppercase">Coverage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {SIMULATION_RESULT.breakdown.map(({ item, cost, coverage, coverageType }) => (
                          <tr key={item} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-[#1b1b21]">{item}</td>
                            <td className="px-4 py-3 text-right font-semibold text-[#1b1b21]">{cost}</td>
                            <td className={`px-4 py-3 text-right font-bold ${
                              coverageType === 'good' ? 'text-emerald-600' : 'text-amber-600'
                            }`}>
                              {coverage}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h4 className="text-sm font-bold text-[#1b1b21] mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">lightbulb</span>
                    AI Advisor Recommendations
                  </h4>
                  <div className="space-y-3">
                    {SIMULATION_RESULT.tips.map(({ icon, title, desc }) => (
                      <div key={title} className="flex gap-3 bg-white/60 p-4 rounded-xl border border-white">
                        <span className="material-symbols-outlined text-[#15157d] mt-0.5 shrink-0">{icon}</span>
                        <p className="text-sm text-[#464652]">
                          <strong className="text-[#1b1b21]">{title}: </strong>{desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: AI Chat ── */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-24 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 160px)' }}>

              {/* Chat header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#2e3192] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#9da1ff] text-lg">smart_toy</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1b1b21]">AI Advisor</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Online</span>
                    </div>
                  </div>
                </div>
                <button className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-slate-400 text-xl">more_vert</span>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) =>
                  msg.role === 'ai'
                    ? <AiMessage key={i} text={msg.text} time={msg.time} />
                    : <UserMessage key={i} text={msg.text} time={msg.time} />
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Suggested chips */}
              <div className="px-4 pb-2 shrink-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Suggested Questions</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Does this cover dental?', 'How do I file a claim?', 'Summarize exclusions'].map(q => (
                    <button
                      key={q}
                      onClick={() => setChatInput(q)}
                      className="text-[11px] font-medium bg-white border border-slate-200 px-3 py-1 rounded-full hover:border-[#15157d] hover:text-[#15157d] transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat input */}
              <div className="p-4 border-t border-slate-200 shrink-0">
                <div className="relative">
                  <input
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#15157d] focus:border-transparent transition-all"
                    placeholder="Ask AI Advisor..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChat()}
                  />
                  <button
                    onClick={sendChat}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#15157d] text-white rounded-lg flex items-center justify-center hover:brightness-110 transition-all active:scale-90"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
