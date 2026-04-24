import { useState } from 'react'
import { Link } from 'react-router-dom'

const RISK_FACTORS = [
  { label: 'Property Integrity',  score: 92, color: '#10b981' },
  { label: 'Liability Exposure',  score: 64, color: '#f59e0b' },
  { label: 'Digital Assets',      score: 41, color: '#ba1a1a' },
  { label: 'Flood Risk',          score: 38, color: '#ba1a1a' },
  { label: 'Business Continuity', score: 75, color: '#10b981' },
]

const RECOMMENDATIONS = [
  {
    icon: 'security',
    iconBg: 'bg-[#e1e0ff]',
    iconColor: 'text-[#15157d]',
    title: 'Increase Liability Coverage',
    desc: 'Raise aggregate limit from ₦5M to ₦10M to meet regional industry standards.',
    impact: 'High Impact',
  },
  {
    icon: 'waves',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    title: 'Add Flood Insurance Rider',
    desc: 'Mandatory for compliance with new watershed mapping in Zone B-4.',
    impact: 'High Impact',
  },
  {
    icon: 'lock',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    title: 'Add Cyber Liability Endorsement',
    desc: 'Current policy has no ransomware recovery clause. Exposure is critical.',
    impact: 'Medium Impact',
  },
]

const SCENARIOS = [
  {
    icon: 'thunderstorm',
    title: 'POTENTIAL SCENARIO: FLOODING',
    desc: 'A localized flash flood breaches the main server room on the ground floor.',
    status: 'Uncovered Gaps: Ground-level hardware excludes flood damage under section 4.C.',
    statusType: 'danger',
    loss: '₦1,200,000',
  },
  {
    icon: 'lock_reset',
    title: 'POTENTIAL SCENARIO: DATA BREACH',
    desc: 'Third-party vendor compromise leads to client data exfiltration.',
    status: 'Partial Coverage: Up to ₦500k in forensic costs. Business interruption excluded.',
    statusType: 'warning',
    loss: '₦2,800,000',
  },
]

const CHART_BARS = [
  { month: 'Jul', current: 60, optimized: null },
  { month: 'Aug', current: 72, optimized: null },
  { month: 'Sep', current: 68, optimized: null },
  { month: 'Oct', current: 85, optimized: null, label: 'CURRENT' },
  { month: 'Nov', current: null, optimized: 50, label: 'OPTIMIZED' },
  { month: 'Dec', current: null, optimized: 38 },
]

export default function RiskAnalysis() {
  const [expanded, setExpanded] = useState(null)

  const arcLength = 2 * Math.PI * 88
  const offset = arcLength - (85 / 100) * arcLength

  return (
    <div className="bg-[#fcf8ff] min-h-screen font-sans text-[#1b1b21]">
      <div className="max-w-[1440px] mx-auto px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6 text-xs font-semibold tracking-widest text-slate-400 uppercase">
          <Link to="/dashboard" className="hover:text-[#15157d] transition-colors">Dashboard</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-[#15157d]">Risk Analysis #82104</span>
        </nav>

        <div className="grid grid-cols-12 gap-6">

          {/* ── Left column ── */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

            {/* Hero: Score + Narrative */}
            <section className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#ffb692]" />

              {/* Gauge */}
              <div className="relative flex items-center justify-center w-44 h-44 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                  <circle cx="96" cy="96" r="88" fill="none" stroke="#e4e1ea" strokeWidth="12" />
                  <circle
                    cx="96" cy="96" r="88" fill="none"
                    stroke="#ffb692" strokeWidth="12"
                    strokeDasharray={arcLength}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-5xl font-bold text-slate-900">85</span>
                  <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Moderate</span>
                </div>
              </div>

              {/* Narrative */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#ffb692]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <h2 className="font-display text-xl font-bold text-slate-900">AI Risk Assessment Narrative</h2>
                </div>
                <p className="text-sm text-[#464652] mb-5 leading-relaxed">
                  The current policy for <strong className="text-slate-900">TechFlow Logistics HQ</strong> presents a Moderate Risk profile.
                  While primary property coverage is robust, significant exposure exists in the{' '}
                  <span className="text-red-600 font-medium underline decoration-red-200 underline-offset-4">Cyber Liability</span> and{' '}
                  <span className="text-red-600 font-medium underline decoration-red-200 underline-offset-4">Flood Supplementary</span> domains.
                  The 85/100 score is primarily driven by recent local zoning changes and a lack of ransomware recovery endorsements.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    Critical Gaps Found
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
                    Last Updated: Oct 24, 2024
                  </span>
                </div>
              </div>
            </section>

            {/* Scenarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SCENARIOS.map(({ icon, title, desc, status, statusType, loss }) => (
                <div key={title} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <h3 className="text-xs font-semibold tracking-widest text-[#464652] uppercase flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">{icon}</span>
                      {title}
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-sm text-slate-600">{desc}</p>
                    <div className={`p-3 rounded-lg border text-sm font-medium ${
                      statusType === 'danger'
                        ? 'bg-red-50 border-red-200 text-red-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}>
                      <span className={`text-xs font-bold tracking-widest block mb-1 uppercase ${
                        statusType === 'danger' ? 'text-red-500' : 'text-amber-500'
                      }`}>Policy Status</span>
                      {status}
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                      <span className="text-xs text-slate-400">Potential Loss: <strong className="text-slate-700">{loss}</strong></span>
                      <button className="text-[#15157d] text-xs font-semibold hover:underline">View Mitigation →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Projected Risk Trajectory Chart */}
            <section className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">Projected Risk Trajectory</h3>
                  <p className="text-sm text-[#515f74]">Estimated loss impact over 24 months — current policy vs. recommendations.</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                    Export PDF
                  </button>
                  <button className="px-4 py-2 bg-[#e1e0ff] text-[#15157d] rounded-lg text-xs font-semibold hover:brightness-95 transition-colors">
                    Simulate New Event
                  </button>
                </div>
              </div>

              {/* Chart */}
              <div className="relative bg-slate-50 border border-slate-100 rounded-xl p-6 h-52 flex items-end gap-3">
                {CHART_BARS.map(({ month, current, optimized, label }) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="relative w-full flex items-end justify-center" style={{ height: 140 }}>
                      {current && (
                        <div
                          className="w-full bg-[#15157d]/20 border-t-2 border-[#15157d] rounded-t-sm relative"
                          style={{ height: `${current}%` }}
                        >
                          {label === 'CURRENT' && (
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded whitespace-nowrap font-bold">
                              CURRENT
                            </div>
                          )}
                        </div>
                      )}
                      {optimized && (
                        <div
                          className="w-full bg-emerald-500/20 border-t-2 border-emerald-500 rounded-t-sm relative"
                          style={{ height: `${optimized}%` }}
                        >
                          {label === 'OPTIMIZED' && (
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded whitespace-nowrap font-bold">
                              OPTIMIZED
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{month}</span>
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute top-3 right-3 flex gap-4 bg-white/90 border border-white shadow-sm rounded-lg px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#15157d]" />
                    <span className="text-[10px] font-bold text-slate-700">Current Exposure</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-700">Optimized Risk</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ── Right column ── */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* AI Recommendations */}
            <div
              className="rounded-xl p-6 flex flex-col gap-4"
              style={{ background: '#F0F4FF', border: '1px solid #D1DBFF', boxShadow: '0 0 20px rgba(209,219,255,0.4)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#15157d]">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                  <h3 className="font-display text-lg font-bold">AI Recommendations</h3>
                </div>
                <span className="bg-[#e1e0ff] text-[#15157d] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  High Impact
                </span>
              </div>

              <div className="space-y-3">
                {RECOMMENDATIONS.map(({ icon, iconBg, iconColor, title, desc }) => (
                  <div
                    key={title}
                    className="group flex gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-[#c0c1ff] transition-all cursor-pointer"
                  >
                    <div className={`${iconBg} w-9 h-9 rounded-lg flex items-center justify-center shrink-0`}>
                      <span className={`material-symbols-outlined text-lg ${iconColor}`}>{icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-[#15157d] transition-colors">{title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-3 bg-[#15157d] text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:brightness-110 transition-all active:scale-95">
                Apply All Changes
              </button>
            </div>

            {/* Risk Factor Breakdown */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h4 className="text-xs font-bold tracking-widest text-[#777683] uppercase mb-5">Risk Factor Breakdown</h4>
              <div className="space-y-5">
                {RISK_FACTORS.map(({ label, score, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-slate-600">{label}</span>
                      <span className="text-slate-900">{score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${score}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h4 className="text-xs font-bold tracking-widest text-[#777683] uppercase mb-4">Quick Actions</h4>
              <div className="space-y-2">
                {[
                  { icon: 'upload_file', label: 'Upload New Policy', path: '/policy-upload' },
                  { icon: 'biotech',     label: 'Run What-If Simulation', path: '/what-if-advisor' },
                  { icon: 'dashboard',   label: 'View Full Dashboard', path: '/dashboard' },
                ].map(({ icon, label, path }) => (
                  <Link
                    key={label}
                    to={path}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#f5f2fb] transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[#15157d] text-base">{icon}</span>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-[#15157d] transition-colors">{label}</span>
                    <span className="material-symbols-outlined text-slate-300 text-base ml-auto group-hover:text-[#15157d] transition-colors">chevron_right</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI button */}
      <button className="fixed bottom-8 right-8 h-14 w-14 bg-[#15157d] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform active:scale-95 group z-50">
        <span className="material-symbols-outlined">smart_toy</span>
        <div className="absolute right-full mr-4 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-900 font-semibold text-xs whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Ask AI Advisor
        </div>
      </button>
    </div>
  )
}
