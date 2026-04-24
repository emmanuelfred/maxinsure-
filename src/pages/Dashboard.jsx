import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePolicy } from '../PolicyContext'

const MOCK_POLICY = {
  overview: {
    type: 'Health Insurance', typeIcon: 'favorite',
    name: 'ComprehensiveCare Gold Plan', provider: 'BlueCross Shield Nigeria',
    holder: { name: 'Emeka Okafor', id: 'BCN-2024-88221', dob: '14 Mar 1985', email: 'emeka.okafor@email.com' },
    start: 'Jan 1, 2024', end: 'Dec 31, 2024', status: 'Active',
  },
  coverage: {
    risks: ['Hospitalization', 'Surgery & Procedures', 'Emergency Care', 'Outpatient Consultations', 'Diagnostic Tests & Labs', 'Maternity Care'],
    scope: 'Partial – Subject to sub-limits and co-payment',
    benefits: ['In-patient hospital care up to 180 days/year', 'Specialist consultations (up to 12/year)', 'Prescription drugs (formulary-listed only)', 'Annual wellness check-up'],
    addons: ['Dental Care Rider – ₦150,000/year', 'Optical Rider – ₦80,000/year', 'Critical Illness Rider – ₦5,000,000 lump sum'],
  },
  exclusions: {
    notCovered: ['Cosmetic or elective surgery', 'Experimental treatments', 'Self-inflicted injuries', 'War or terrorism-related injuries', 'Alcohol or drug-related conditions'],
    denialSituations: ['Claims filed after 30-day window', 'Treatment at non-panel hospitals', 'Failure to obtain pre-authorization for elective procedures'],
    hidden: ['Mental health coverage capped at 10 sessions/year', 'Physiotherapy requires separate referral', 'Overseas emergency limited to ₦500,000'],
  },
  premium: {
    cost: '₦480,000 / year', monthly: '₦42,000 / month',
    frequency: 'Monthly or Annual (5% discount for annual)',
    factors: ['Age (39)', 'Occupation (Office-based, Low Risk)', 'Pre-existing: None declared', 'Region: Lagos, High-cost zone'],
    penalties: '2.5% surcharge after 15-day grace period. Policy suspended after 30 days non-payment.',
  },
  sumInsured: {
    max: '₦10,000,000',
    sublimits: [
      { label: 'Hospitalization', amount: '₦5,000,000/year' },
      { label: 'Surgery', amount: '₦3,000,000/procedure' },
      { label: 'Outpatient', amount: '₦800,000/year' },
      { label: 'Maternity', amount: '₦1,200,000/delivery' },
      { label: 'Emergency (Overseas)', amount: '₦500,000' },
    ],
    aggregate: '₦10,000,000 total per policy year',
  },
  waiting: [
    { condition: 'General Hospitalization', period: '30 days', severity: 'low' },
    { condition: 'Maternity Benefits', period: '10 months', severity: 'high' },
    { condition: 'Pre-existing Conditions', period: '24 months', severity: 'high' },
    { condition: 'Critical Illness Rider', period: '90 days', severity: 'medium' },
    { condition: 'Dental Rider', period: '6 months', severity: 'medium' },
  ],
  deductibles: {
    inpatient: '10% co-pay after first ₦50,000 deductible', outpatient: '₦5,000 fixed per visit',
    emergency: 'No deductible for genuine emergencies', type: 'Mixed – Fixed + Percentage',
    note: 'Deductible resets each policy year on January 1st.',
  },
  claims: {
    steps: [
      { step: '01', title: 'Notify Provider', desc: 'Call the 24/7 claims hotline or submit via the mobile app within 48 hours of hospitalization.' },
      { step: '02', title: 'Submit Documents', desc: 'Upload discharge summary, itemized bill, lab reports, prescriptions, and ID.' },
      { step: '03', title: 'Adjudication', desc: 'Claims team reviews and verifies within 5–10 business days.' },
      { step: '04', title: 'Settlement', desc: 'Approved claims paid directly to hospital or reimbursed within 14 days.' },
    ],
    documents: ['Completed claim form', 'Original bills & receipts', "Attending physician's report", 'Policy ID card', 'Lab results if applicable'],
    timeline: '5–14 business days from submission',
    rejectionReasons: ['Incomplete documentation', 'Treatment not covered by plan', 'Pre-authorization not obtained', 'Claim filed outside the 30-day window'],
  },
  renewal: {
    terms: 'Policy auto-renews annually unless cancelled 30 days prior to expiry.',
    grace: '30-day grace period post-expiry for premium payment',
    cancellationByInsurer: 'Non-payment, material misrepresentation, or fraudulent claims.',
    cancellationByHolder: 'Written notice required 14 days in advance. Pro-rata refund applicable.',
    noClaimsBonus: '5% premium discount for every claim-free year (max 25%)',
  },
  legal: {
    governingLaw: 'Federal Republic of Nigeria – National Insurance Commission (NAICOM)',
    dispute: 'Mandatory mediation first, then arbitration under Lagos State Arbitration Law 2009. Litigation as last resort.',
    regulatory: 'Compliant with NAICOM Act 2003, NHIA Act 2022, and NDPR 2019.',
    jurisdiction: 'Lagos, Nigeria',
  },
  risks: [
    { severity: 'high', title: 'Hospitalization Underinsurance', desc: 'Current limit of ₦5M is 40% below average Lagos ICU cost of ₦8.5M for complex procedures.', gap: '₦3,500,000' },
    { severity: 'high', title: 'Overseas Emergency Cap', desc: '₦500,000 overseas cap is critically low. A single medical evacuation costs ₦2M+.', gap: '₦1,500,000+' },
    { severity: 'medium', title: 'Mental Health Cap', desc: '10 sessions/year is insufficient for chronic conditions. Therapist costs average ₦25,000/session.', gap: '₦250,000/year' },
    { severity: 'medium', title: 'No Disability Coverage', desc: 'Policy does not cover income loss from long-term disability. Consider a separate disability policy.', gap: 'N/A' },
    { severity: 'low', title: 'Drug Formulary Restriction', desc: 'Only listed drugs covered. Branded or off-formulary prescriptions paid out-of-pocket.', gap: 'Variable' },
  ],
  evaluation: {
    score: 72, scoreLabel: 'Moderate',
    strengths: ['Comprehensive in-patient coverage', 'Strong emergency response network', 'Flexible rider options', 'No-claims bonus incentive'],
    weaknesses: ['Low overseas emergency limit', 'Long maternity waiting period', 'Mental health coverage severely capped', 'No disability or income protection'],
    value: 'Fair – Premium is competitive for Lagos market but coverage limits lag behind healthcare inflation.',
    bestFor: 'Urban professionals aged 25–45 with low-risk occupations and no complex pre-existing conditions.',
  },
}

const SECTIONS = [
  { id: 'overview',    icon: 'policy',           label: 'Policy Overview'        },
  { id: 'coverage',   icon: 'shield',            label: 'Coverage Details'       },
  { id: 'exclusions', icon: 'block',             label: 'Exclusions'             },
  { id: 'premium',    icon: 'payments',          label: 'Premium Structure'      },
  { id: 'sumInsured', icon: 'account_balance',   label: 'Sum Insured / Limits'   },
  { id: 'waiting',    icon: 'schedule',          label: 'Waiting Periods'        },
  { id: 'deductibles',icon: 'price_change',      label: 'Deductibles & Excess'   },
  { id: 'claims',     icon: 'assignment',        label: 'Claims Process'         },
  { id: 'renewal',    icon: 'autorenew',         label: 'Renewal & Cancellation' },
  { id: 'legal',      icon: 'gavel',             label: 'Legal & Compliance'     },
  { id: 'risks',      icon: 'crisis_alert',      label: 'Risks & Gaps Analysis'  },
  { id: 'evaluation', icon: 'workspace_premium', label: 'Overall Evaluation'     },
]

const Card = ({ children, className = '', ai = false }) => (
  <div className={`rounded-xl border p-4 md:p-6 ${ai ? 'bg-[#F0F4FF] border-[#D1DBFF]' : 'bg-white border-slate-200'} ${className}`}
    style={ai ? { boxShadow: '0 0 15px rgba(209,219,255,0.4)' } : {}}>
    {children}
  </div>
)

const SectionHeader = ({ icon, label, sub }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-1">
      <div className="w-9 h-9 rounded-lg bg-[#e1e0ff] flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[#15157d] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <h2 className="font-display text-xl md:text-2xl font-bold text-[#15157d]">{label}</h2>
    </div>
    {sub && <p className="text-sm text-[#515f74] ml-12">{sub}</p>}
  </div>
)

const Badge = ({ color, children }) => {
  const colors = {
    green:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
    amber:  'bg-amber-50 text-amber-700 border border-amber-200',
    red:    'bg-red-50 text-red-700 border border-red-200',
    blue:   'bg-blue-50 text-blue-700 border border-blue-200',
    indigo: 'bg-[#e1e0ff] text-[#15157d] border border-[#c0c1ff]',
  }
  return <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors[color] || colors.blue}`}>{children}</span>
}

const InfoRow = ({ label, value, mono = false }) => (
  <div className="flex justify-between items-start py-3 border-b border-slate-100 last:border-0 gap-4">
    <span className="text-xs font-semibold tracking-widest text-[#777683] uppercase shrink-0">{label}</span>
    <span className={`text-sm text-right text-[#1b1b21] font-medium ${mono ? 'font-mono' : ''}`}>{value}</span>
  </div>
)

const RiskChip = ({ severity }) => {
  const map = { high: 'red', medium: 'amber', low: 'green' }
  return <Badge color={map[severity]}>{severity.charAt(0).toUpperCase() + severity.slice(1)} Risk</Badge>
}

function PolicyOverview({ policy }) {
  const { overview } = policy
  return (
    <div className="space-y-6">
      <SectionHeader icon="policy" label="Policy Overview" sub="Core identification and classification details for this policy." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 space-y-1">
          <h3 className="font-display text-lg font-semibold text-[#1b1b21] mb-4">Policy Identification</h3>
          <InfoRow label="Policy Name" value={overview.name} />
          <InfoRow label="Provider" value={overview.provider} />
          <InfoRow label="Type" value={overview.type} />
          <InfoRow label="Status" value={<Badge color="green">{overview.status}</Badge>} />
          <InfoRow label="Start Date" value={overview.start} />
          <InfoRow label="End Date" value={overview.end} />
        </Card>
        <Card ai className="flex flex-col items-center justify-center text-center gap-4 py-8">
          <span className="material-symbols-outlined text-5xl text-[#15157d]">{overview.typeIcon}</span>
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#777683] uppercase mb-1">Insurance Type</p>
            <p className="font-display text-xl font-bold text-[#15157d]">{overview.type}</p>
          </div>
          <div className="w-full border-t border-[#D1DBFF] pt-4">
            <p className="text-xs text-[#464652]">Valid until <strong>{overview.end}</strong></p>
          </div>
        </Card>
      </div>
      <Card>
        <h3 className="font-display text-lg font-semibold text-[#1b1b21] mb-4">Policyholder Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Full Name', value: overview.holder.name },
            { label: 'Policy ID', value: overview.holder.id },
            { label: 'Date of Birth', value: overview.holder.dob },
            { label: 'Email', value: overview.holder.email },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#f5f2fb] rounded-lg p-3">
              <p className="text-xs font-semibold tracking-widest text-[#777683] uppercase mb-1">{label}</p>
              <p className="text-sm font-semibold text-[#1b1b21] break-all">{value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function CoverageDetails({ policy }) {
  const { coverage } = policy
  return (
    <div className="space-y-6">
      <SectionHeader icon="shield" label="Coverage Details" sub="What this policy protects against and the extent of that protection." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-4">Covered Risks & Events</h3>
          <div className="space-y-2">
            {coverage.risks.map(r => (
              <div key={r} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <span className="material-symbols-outlined text-emerald-500 text-lg shrink-0">check_circle</span>
                <span className="text-sm text-[#1b1b21]">{r}</span>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-6">
          <Card>
            <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-3">Scope of Coverage</h3>
            <p className="text-sm text-[#464652] bg-amber-50 border border-amber-100 rounded-lg p-3">{coverage.scope}</p>
          </Card>
          <Card>
            <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-3">Specific Benefits</h3>
            <ul className="space-y-2">
              {coverage.benefits.map(b => (
                <li key={b} className="text-sm text-[#464652] flex gap-2">
                  <span className="text-[#15157d] mt-0.5 shrink-0">›</span>{b}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
      <Card ai>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#15157d]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <h3 className="font-display text-base font-semibold text-[#15157d]">Optional Add-ons (Riders)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {coverage.addons.map(a => (
            <div key={a} className="bg-white/70 border border-[#D1DBFF] rounded-lg p-4">
              <span className="material-symbols-outlined text-[#15157d] mb-2 block">add_circle</span>
              <p className="text-sm font-semibold text-[#1b1b21]">{a}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function Exclusions({ policy }) {
  const { exclusions } = policy
  return (
    <div className="space-y-6">
      <SectionHeader icon="block" label="Exclusions" sub="Events, conditions and situations not covered by this policy." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-4">What Is Not Covered</h3>
          <div className="space-y-2">
            {exclusions.notCovered.map(e => (
              <div key={e} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                <span className="material-symbols-outlined text-red-400 text-lg shrink-0">cancel</span>
                <span className="text-sm text-[#1b1b21]">{e}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-4">Claim Denial Situations</h3>
          <div className="space-y-3">
            {exclusions.denialSituations.map(d => (
              <div key={d} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg p-3">
                <span className="material-symbols-outlined text-red-500 text-base mt-0.5 shrink-0">block</span>
                <span className="text-sm text-red-800">{d}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card ai>
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-amber-500">visibility</span>
          <h3 className="font-display text-base font-semibold text-[#15157d]">Hidden & Tricky Exclusions — AI Detected</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {exclusions.hidden.map(h => (
            <div key={h} className="bg-white/70 border border-amber-200 rounded-lg p-4">
              <span className="material-symbols-outlined text-amber-500 mb-2 block">warning</span>
              <p className="text-sm text-[#1b1b21]">{h}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function PremiumStructure({ policy }) {
  const { premium } = policy
  return (
    <div className="space-y-6">
      <SectionHeader icon="payments" label="Premium Structure" sub="Cost breakdown, payment terms, and pricing factors." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card ai className="text-center py-6">
          <p className="text-xs font-semibold tracking-widest text-[#777683] uppercase mb-2">Annual Premium</p>
          <p className="font-display text-3xl font-bold text-[#15157d]">{premium.cost}</p>
          <p className="text-sm text-[#515f74] mt-1">{premium.monthly}</p>
        </Card>
        <Card className="md:col-span-2 space-y-1">
          <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-4">Payment Details</h3>
          <InfoRow label="Frequency" value={premium.frequency} />
          <InfoRow label="Late Payment Penalty" value={premium.penalties} />
        </Card>
      </div>
      <Card>
        <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-4">Premium Rating Factors</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {premium.factors.map(f => (
            <div key={f} className="bg-[#f5f2fb] rounded-lg p-3 text-sm text-[#464652]">{f}</div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function SumInsured({ policy }) {
  const { sumInsured } = policy
  return (
    <div className="space-y-6">
      <SectionHeader icon="account_balance" label="Sum Insured / Limits" sub="Maximum coverage amounts and individual sub-limits per category." />
      <Card ai className="text-center py-8">
        <p className="text-xs font-semibold tracking-widest text-[#777683] uppercase mb-2">Total Maximum Coverage</p>
        <p className="font-display text-4xl font-bold text-[#15157d]">{sumInsured.max}</p>
        <p className="text-sm text-[#515f74] mt-2">{sumInsured.aggregate}</p>
      </Card>
      <Card>
        <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-4">Sub-Limits by Category</h3>
        <div className="space-y-1">
          {sumInsured.sublimits.map(({ label, amount }) => (
            <InfoRow key={label} label={label} value={amount} mono />
          ))}
        </div>
      </Card>
    </div>
  )
}

function WaitingPeriods({ policy }) {
  const { waiting } = policy
  const severityStyle = {
    high:   { bar: 'bg-red-500',     badge: 'red',   width: 'w-full' },
    medium: { bar: 'bg-amber-400',   badge: 'amber', width: 'w-2/3' },
    low:    { bar: 'bg-emerald-400', badge: 'green', width: 'w-1/3' },
  }
  return (
    <div className="space-y-6">
      <SectionHeader icon="schedule" label="Waiting Periods" sub="Time you must wait before specific benefits become active." />
      <div className="space-y-4">
        {waiting.map(({ condition, period, severity }) => {
          const s = severityStyle[severity]
          return (
            <Card key={condition}>
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-display text-base font-semibold text-[#1b1b21]">{condition}</h4>
                  <Badge color={s.badge}>{severity}</Badge>
                </div>
                <span className="font-display text-lg font-bold text-[#15157d]">{period}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className={`${s.bar} ${s.width} h-2 rounded-full`} />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function Deductibles({ policy }) {
  const { deductibles } = policy
  return (
    <div className="space-y-6">
      <SectionHeader icon="price_change" label="Deductibles & Excess" sub="Your out-of-pocket costs before insurance kicks in." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-1">
          <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-4">Deductible Breakdown</h3>
          <InfoRow label="In-patient" value={deductibles.inpatient} />
          <InfoRow label="Out-patient" value={deductibles.outpatient} />
          <InfoRow label="Emergency" value={deductibles.emergency} />
          <InfoRow label="Type" value={<Badge color="indigo">{deductibles.type}</Badge>} />
        </Card>
        <Card ai>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[#15157d]">info</span>
            <h3 className="font-display text-base font-semibold text-[#15157d]">Important Note</h3>
          </div>
          <p className="text-sm text-[#464652]">{deductibles.note}</p>
        </Card>
      </div>
    </div>
  )
}

function ClaimsProcess({ policy }) {
  const { claims } = policy
  return (
    <div className="space-y-6">
      <SectionHeader icon="assignment" label="Claims Process" sub="Step-by-step guide to filing and tracking a claim." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {claims.steps.map(({ step, title, desc }) => (
          <Card key={step}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#e1e0ff] flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-[#15157d] text-sm">{step}</span>
              </div>
              <div>
                <h4 className="font-display text-base font-semibold text-[#1b1b21] mb-1">{title}</h4>
                <p className="text-sm text-[#515f74]">{desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-4">Required Documents</h3>
          <ul className="space-y-2">
            {claims.documents.map(d => (
              <li key={d} className="flex items-center gap-3 text-sm text-[#464652]">
                <span className="material-symbols-outlined text-[#15157d] text-base shrink-0">description</span>{d}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-3">Timeline</h3>
          <div className="bg-[#f5f2fb] rounded-lg p-4 mb-4">
            <p className="font-display text-lg font-bold text-[#15157d]">{claims.timeline}</p>
          </div>
          <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-3">Rejection Reasons</h3>
          <ul className="space-y-2">
            {claims.rejectionReasons.map(r => (
              <li key={r} className="flex items-start gap-2 text-sm text-red-700">
                <span className="material-symbols-outlined text-red-400 text-base mt-0.5 shrink-0">close</span>{r}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

function RenewalCancellation({ policy }) {
  const { renewal } = policy
  return (
    <div className="space-y-6">
      <SectionHeader icon="autorenew" label="Renewal & Cancellation" sub="Terms governing policy continuation, lapse, and termination." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-1">
          <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-4">Renewal Terms</h3>
          <InfoRow label="Auto-Renewal" value={renewal.terms} />
          <InfoRow label="Grace Period" value={renewal.grace} />
          <InfoRow label="No-Claims Bonus" value={renewal.noClaimsBonus} />
        </Card>
        <Card>
          <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-4">Cancellation Conditions</h3>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <p className="text-xs font-semibold tracking-widest text-red-600 uppercase mb-2">By Insurer</p>
              <p className="text-sm text-red-800">{renewal.cancellationByInsurer}</p>
            </div>
            <div className="bg-[#f5f2fb] border border-[#c7c5d4] rounded-lg p-4">
              <p className="text-xs font-semibold tracking-widest text-[#15157d] uppercase mb-2">By Policyholder</p>
              <p className="text-sm text-[#464652]">{renewal.cancellationByHolder}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function LegalCompliance({ policy }) {
  const { legal } = policy
  return (
    <div className="space-y-6">
      <SectionHeader icon="gavel" label="Legal & Compliance Terms" sub="Governing jurisdiction, regulatory framework, and dispute resolution." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="space-y-1">
          <h3 className="font-display text-base font-semibold text-[#1b1b21] mb-4">Jurisdiction & Law</h3>
          <InfoRow label="Governing Law" value={legal.governingLaw} />
          <InfoRow label="Jurisdiction" value={legal.jurisdiction} />
          <InfoRow label="Regulatory Compliance" value={legal.regulatory} />
        </Card>
        <Card ai>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#15157d]">gavel</span>
            <h3 className="font-display text-base font-semibold text-[#15157d]">Dispute Resolution Path</h3>
          </div>
          <p className="text-sm text-[#464652]">{legal.dispute}</p>
        </Card>
      </div>
    </div>
  )
}

function RisksGaps({ policy }) {
  const { risks } = policy
  const counts = {
    high:   risks.filter(r => r.severity === 'high').length,
    medium: risks.filter(r => r.severity === 'medium').length,
    low:    risks.filter(r => r.severity === 'low').length,
  }
  return (
    <div className="space-y-6">
      <SectionHeader icon="crisis_alert" label="Risks & Gaps Analysis" sub="AI-identified vulnerabilities, coverage gaps, and underinsurance scenarios." />
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'High Risk', count: counts.high, color: 'red' },
          { label: 'Medium Risk', count: counts.medium, color: 'amber' },
          { label: 'Low Risk', count: counts.low, color: 'green' },
        ].map(({ label, count, color }) => {
          const bg   = { red: 'bg-red-50 border-red-200', amber: 'bg-amber-50 border-amber-200', green: 'bg-emerald-50 border-emerald-200' }
          const text = { red: 'text-red-700', amber: 'text-amber-700', green: 'text-emerald-700' }
          return (
            <div key={label} className={`rounded-xl border p-3 md:p-4 text-center ${bg[color]}`}>
              <p className={`font-display text-2xl md:text-3xl font-bold ${text[color]}`}>{count}</p>
              <p className={`text-xs font-semibold tracking-widest uppercase mt-1 ${text[color]}`}>{label}</p>
            </div>
          )
        })}
      </div>
      <div className="space-y-4">
        {risks.map(({ severity, title, desc, gap }) => (
          <Card key={title} className={severity === 'high' ? 'border-red-200' : severity === 'medium' ? 'border-amber-200' : ''}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <span className={`material-symbols-outlined mt-0.5 shrink-0 ${severity === 'high' ? 'text-red-500' : severity === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {severity === 'high' ? 'error' : severity === 'medium' ? 'warning' : 'info'}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-display text-base font-semibold text-[#1b1b21]">{title}</h4>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${severity === 'high' ? 'bg-red-50 text-red-700 border-red-200' : severity === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {severity.charAt(0).toUpperCase() + severity.slice(1)} Risk
                    </span>
                  </div>
                  <p className="text-sm text-[#515f74]">{desc}</p>
                </div>
              </div>
              <div className="sm:text-right shrink-0 pl-8 sm:pl-0">
                <p className="text-xs font-semibold tracking-widest text-[#777683] uppercase">Coverage Gap</p>
                <p className="font-display text-base font-bold text-[#15157d]">{gap}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function OverallEvaluation({ policy }) {
  const { evaluation } = policy
  const scoreColor = evaluation.score >= 80 ? 'text-emerald-600' : evaluation.score >= 60 ? 'text-amber-600' : 'text-red-600'
  const arcColor   = evaluation.score >= 80 ? '#10b981' : evaluation.score >= 60 ? '#f59e0b' : '#ef4444'
  return (
    <div className="space-y-6">
      <SectionHeader icon="workspace_premium" label="Overall Evaluation" sub="AI-generated summary of this policy's strengths, weaknesses, and suitability." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card ai className="flex flex-col items-center justify-center gap-4 text-center py-8">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e4e1ea" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke={arcColor} strokeWidth="8"
                strokeDasharray={`${evaluation.score * 2.64} 264`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-display text-3xl font-bold ${scoreColor}`}>{evaluation.score}</span>
              <span className="text-xs text-[#777683]">/ 100</span>
            </div>
          </div>
          <div>
            <p className="font-display text-lg font-bold text-[#15157d]">{evaluation.scoreLabel} Coverage</p>
            <p className="text-xs text-[#515f74] mt-1">Overall Policy Score</p>
          </div>
        </Card>
        <Card>
          <h3 className="font-display text-base font-semibold text-emerald-700 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">thumb_up</span> Strengths
          </h3>
          <ul className="space-y-2">
            {evaluation.strengths.map(s => (
              <li key={s} className="flex items-start gap-2 text-sm text-[#464652]">
                <span className="material-symbols-outlined text-emerald-500 text-base mt-0.5 shrink-0">check</span>{s}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="font-display text-base font-semibold text-red-600 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">thumb_down</span> Weaknesses
          </h3>
          <ul className="space-y-2">
            {evaluation.weaknesses.map(w => (
              <li key={w} className="flex items-start gap-2 text-sm text-[#464652]">
                <span className="material-symbols-outlined text-red-400 text-base mt-0.5 shrink-0">close</span>{w}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card ai>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[#15157d]">payments</span>
            <h3 className="font-display text-base font-semibold text-[#15157d]">Value for Money</h3>
          </div>
          <p className="text-sm text-[#464652]">{evaluation.value}</p>
        </Card>
        <Card ai>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[#15157d]">person_check</span>
            <h3 className="font-display text-base font-semibold text-[#15157d]">Best Suited For</h3>
          </div>
          <p className="text-sm text-[#464652]">{evaluation.bestFor}</p>
        </Card>
      </div>
    </div>
  )
}

const PAGE_MAP = {
  overview: PolicyOverview, coverage: CoverageDetails, exclusions: Exclusions,
  premium: PremiumStructure, sumInsured: SumInsured, waiting: WaitingPeriods,
  deductibles: Deductibles, claims: ClaimsProcess, renewal: RenewalCancellation,
  legal: LegalCompliance, risks: RisksGaps, evaluation: OverallEvaluation,
}

export default function Dashboard() {
  const [active, setActive]     = useState('overview')
  const [drawerOpen, setDrawer] = useState(false)
  const navigate                = useNavigate()
  const { policy }              = usePolicy()

  const POLICY        = policy || MOCK_POLICY
  const isLive        = !!policy
  const ActivePage    = PAGE_MAP[active]
  const activeSection = SECTIONS.find(s => s.id === active)

  const handleNav = (id) => { setActive(id); setDrawer(false) }

  return (
    <div className="flex h-full bg-[#fcf8ff] font-sans overflow-hidden relative">

      {/* Mobile overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setDrawer(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static top-0 left-0 h-full w-64 bg-slate-900 flex flex-col py-6 overflow-y-auto z-50
        transition-transform duration-300
        ${drawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="px-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            </div>
            <div>
              <div className="text-white font-display font-black tracking-tighter text-lg">MassInsure</div>
              <div className="text-slate-400 text-xs">AI Intelligence</div>
            </div>
          </div>
          <button onClick={() => setDrawer(false)} className="md:hidden text-slate-400 hover:text-white p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Policy badge */}
        <div className="mx-4 mb-6 bg-slate-800 border border-slate-700 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-slate-400">Loaded Policy</p>
            {isLive && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-semibold">LIVE</span>}
          </div>
          <p className="text-white text-xs font-semibold truncate">{POLICY.overview.name}</p>
          <p className="text-indigo-400 text-xs">{POLICY.overview.holder.id}</p>
        </div>

        <nav className="flex-1 space-y-0.5 px-2">
          {SECTIONS.map(({ id, icon, label }) => (
            <button key={id} onClick={() => handleNav(id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center gap-3 text-sm font-medium transition-all
                ${active === id ? 'bg-indigo-600/20 text-indigo-400 border-r-2 border-indigo-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <span className="material-symbols-outlined text-lg shrink-0">{icon}</span>
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>

        <div className="px-4 mt-6">
          <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
            <p className="text-xs text-slate-500 mb-2 font-semibold tracking-widest uppercase">New Analysis</p>
            <button onClick={() => navigate('/policy-upload')}
              className="w-full py-2 bg-indigo-600 text-white rounded font-semibold text-xs hover:brightness-110 transition-all active:scale-95">
              + Analyze Another Policy
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="shrink-0 h-14 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-6 gap-4">
          <button onClick={() => setDrawer(true)} className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
            <span className="material-symbols-outlined text-slate-600">menu</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-400 flex-1 min-w-0">
            <span className="hidden sm:inline shrink-0">Dashboard</span>
            <span className="material-symbols-outlined text-xs hidden sm:inline">chevron_right</span>
            <span className="text-[#15157d] font-semibold truncate">{activeSection?.label}</span>
          </div>
          {isLive && (
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700 hidden sm:inline">AI Analysis Live</span>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto">
          {/* Pills */}
          <div className="bg-white border-b border-slate-100 px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
            {SECTIONS.map(({ id, icon, label }) => (
              <button key={id} onClick={() => setActive(id)}
                className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap
                  ${active === id ? 'bg-[#15157d] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                <span className="material-symbols-outlined text-sm">{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <ActivePage policy={POLICY} />
          </div>
        </div>
      </div>
    </div>
  )
}