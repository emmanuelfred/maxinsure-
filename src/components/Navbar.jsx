import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  
  { label: 'Policy Upload',   path: '/policy-upload',   icon: 'cloud_upload' },
  { label: 'Risk Analysis',   path: '/risk-analysis',   icon: 'analytics' },
  { label: 'What-If Advisor', path: '/what-if-advisor', icon: 'biotech' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className="bg-white sticky top-0 z-50 w-full border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 md:px-8 h-16 gap-9">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-[#15157d] rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              security
            </span>
          </div>
          <span className="font-display text-lg font-extrabold text-[#15157d] tracking-tighter">
            MassInsure
          </span>
        </Link>

        {/* Nav Links — desktop */}
        <nav className="hidden md:flex items-center gap-1 ">
          {NAV_LINKS.map(({ label, path, icon }) => {
            const active = pathname === path || (path !== '/' && pathname.startsWith(path))
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                  ${active ? 'bg-[#e1e0ff] text-[#15157d] font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-[#15157d]'}`}
              >
                <span className="material-symbols-outlined text-base">{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Analyze CTA */}
        <Link to="/policy-upload"
          className="hidden md:flex items-center gap-2 bg-[#15157d] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:brightness-110 transition-all active:scale-95 shrink-0">
          <span className="material-symbols-outlined text-base">add</span>
          Analyze Policy
        </Link>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex gap-1 overflow-x-auto">
        {NAV_LINKS.map(({ label, path, icon }) => {
          const active = pathname === path || (path !== '/' && pathname.startsWith(path))
          return (
            <Link key={path} to={path}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                ${active ? 'bg-[#15157d] text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              <span className="material-symbols-outlined text-sm">{icon}</span>
              {label}
            </Link>
          )
        })}
      </div>
    </header>
  )
}