import { Link, useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="bg-[#fcf8ff] font-sans text-[#1b1b21] min-h-screen">
      {/* Navbar 
      <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center px-8 h-16">
          <div className="text-xl font-extrabold text-[#15157d] tracking-tighter font-display">MassInsure</div>
          <nav className="hidden md:flex items-center gap-8">
            {['Platform', 'Solutions', 'Risk Engine', 'Resources'].map((item, i) => (
              <a
                key={item}
                href="#"
                className={`font-display text-sm font-medium tracking-tight transition-colors duration-200 ${
                  i === 0
                    ? 'text-[#15157d] border-b-2 border-[#15157d] pb-1'
                    : 'text-slate-600 hover:text-[#15157d]'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button className="font-display text-sm font-medium text-slate-600 hover:bg-slate-50 px-4 py-2 transition-colors duration-200 rounded-lg">
              Login
            </button>
            <button
              onClick={() => navigate('/policy-upload')}
              className="font-display text-sm font-semibold bg-[#15157d] text-white px-4 py-2 rounded-lg transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>*/}

      <main className="max-w-[1200px] mx-auto px-8">
        {/* Hero */}
        <section className="py-16 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_#F0F4FF_0%,_transparent_50%),_radial-gradient(circle_at_bottom_left,_#FCF8FF_0%,_transparent_50%)]" />
          <div className="max-w-3xl space-y-6">
            <h1 className="font-display text-5xl font-bold text-[#15157d] tracking-tight leading-tight">
              Understand Your Insurance.<br />Instantly.
            </h1>
            <p className="text-base text-[#515f74] max-w-2xl mx-auto leading-relaxed">
              Upload your policy, analyze risks, and get AI-powered insights in seconds. Precision risk assessment for the modern enterprise.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/policy-upload')}
                className="bg-[#15157d] text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:brightness-110 active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-xl">upload</span>
                Upload Policy
              </button>
              <button className="border border-slate-200 bg-white text-[#1b1b21] px-8 py-3 rounded-xl font-semibold transition-all hover:bg-slate-50 active:scale-95">
                See Example
              </button>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div className="mt-12 w-full max-w-5xl rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="h-8 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="bg-[#0f1117] p-6 min-h-[320px] flex items-center justify-center">
              <div className="w-full">
                <p className="text-[#c0c1ff] font-display text-2xl font-bold mb-6">Dashboard preview</p>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {['1M/1M', '20,143', '1.0 PMS', '6,943 $'].map((val, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                      <p className="text-[#c0c1ff] text-lg font-bold font-display">{val}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 h-24 flex items-end gap-1">
                  {[40, 55, 35, 70, 50, 85, 60, 90, 65, 80, 95, 75].map((h, i) => (
                    <div key={i} className="flex-1 bg-[#c0c1ff]/40 rounded-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="flex flex-col items-center mb-12">
            <span className="text-xs font-semibold tracking-widest text-[#15157d] uppercase mb-2">Process</span>
            <h2 className="font-display text-2xl font-semibold text-[#1b1b21]">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'description', title: 'Step 1: Upload Policy', desc: 'Securely drop your PDF or digital documents into our encrypted vault.' },
              { icon: 'psychology', title: 'Step 2: AI Analyzes', desc: 'Our proprietary risk engine parses every clause and exclusion in real-time.' },
              { icon: 'insights', title: 'Step 3: Get Insights', desc: 'Receive a comprehensive risk score and actionable mitigation strategies.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#e1e0ff] rounded-full flex items-center justify-center text-[#15157d]">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <h3 className="font-bold text-base text-[#1b1b21]">{title}</h3>
                <p className="text-sm text-[#515f74]">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="py-16 bg-slate-50/50 -mx-8 px-8 rounded-3xl">
          <div className="flex flex-col mb-6">
            <span className="text-xs font-semibold tracking-widest text-[#15157d] uppercase mb-2">Capabilities</span>
            <h2 className="font-display text-2xl font-semibold text-[#1b1b21]">Advanced Risk Intelligence</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'analytics', title: 'AI Policy Breakdown', desc: 'Extraction of complex legal terms into plain language.' },
              { icon: 'report_problem', title: 'Risk Score & Alerts', desc: 'Real-time alerts for critical coverage gaps and overlaps.' },
              { icon: 'model_training', title: 'What-If Simulation', desc: 'Predict claim outcomes based on historical disaster data.' },
              { icon: 'auto_awesome', title: 'AI Advisor', desc: '24/7 intelligent assistant for policy queries and renewals.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-[#15157d] mb-2 block">{icon}</span>
                <h4 className="font-bold text-sm mb-1 text-[#1b1b21]">{title}</h4>
                <p className="text-xs text-[#515f74]">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Alert Panel */}
        <section className="py-16">
          <div
            className="rounded-3xl p-12 flex flex-col md:flex-row items-center gap-12"
            style={{ background: '#F0F4FF', border: '1px solid #D1DBFF', boxShadow: '0 0 20px rgba(209,219,255,0.4)' }}
          >
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-[#15157d] text-xs font-semibold tracking-widest uppercase">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                AI Analysis Active
              </div>
              <h2 className="font-display text-2xl font-semibold text-indigo-900">Immediate Coverage Alert</h2>
              <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl border border-blue-100">
                <span className="material-symbols-outlined text-[#f19160] mt-1">error</span>
                <p className="text-base text-indigo-900 font-medium">
                  "You are underinsured for hospitalization coverage."
                  <span className="block text-sm text-[#515f74] font-normal mt-1">
                    Current policy limit: $50,000. Regional average for critical care: $125,000.
                  </span>
                </p>
              </div>
              <button className="text-[#15157d] font-semibold text-sm flex items-center gap-2 hover:translate-x-1 transition-transform">
                Review coverage gap details
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div
              className="flex flex-col items-center justify-center bg-white rounded-full border-8 border-[#D1DBFF]"
              style={{ width: 200, height: 200 }}
            >
              <div className="text-center">
                <span className="font-display text-5xl font-bold text-indigo-900 leading-none">72</span>
                <span className="text-base text-slate-400 font-bold">/100</span>
              </div>
              <span className="text-xs font-semibold tracking-widest text-[#f19160] mt-1 uppercase">Moderate Risk</span>
            </div>
          </div>
        </section>

        {/* CTA Row */}
        <section className="py-12 mb-12 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/policy-upload')}
              className="flex items-center justify-between p-6 bg-[#15157d] text-white rounded-2xl hover:brightness-110 transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined">upload_file</span>
                <span className="font-semibold">Upload Policy</span>
              </div>
              <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </button>
            <button className="flex items-center justify-between p-6 bg-[#d5e3fc] text-[#0d1c2e] rounded-2xl hover:brightness-105 transition-all group">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined">folder_zip</span>
                <span className="font-semibold">Try Sample Policy</span>
              </div>
              <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </button>
            <button className="flex items-center justify-between p-6 border border-slate-200 bg-white rounded-2xl hover:bg-slate-50 transition-all group">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[#15157d]">chat_bubble</span>
                <span className="font-semibold">Ask AI a Question</span>
              </div>
              <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-[1440px] mx-auto py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-slate-900 font-display">MassInsure</div>
            <p className="text-xs text-slate-500">© 2024 MassInsure AI. Corporate Modern Precision.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Security', 'API Documentation'].map(link => (
              <a key={link} href="#" className="text-xs text-slate-500 hover:text-[#15157d] transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
