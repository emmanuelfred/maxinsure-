// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import PolicyUpload from './pages/PolicyUpload'
import WhatIfAdvisor from './pages/WhatIfAdvisor'
import RiskAnalysis from './pages/RiskAnalysis'
import { PolicyProvider } from './PolicyContext'

export default function App() {
  const { pathname } = useLocation()
  const hideNav = pathname === '/dashboard'

  return (
    <PolicyProvider>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/dashboard"       element={<Dashboard />} />
        <Route path="/policy-upload"   element={<PolicyUpload />} />
        <Route path="/risk-analysis"   element={<RiskAnalysis/>} />
        <Route path="/what-if-advisor" element={<WhatIfAdvisor/>} />
      </Routes>
    </PolicyProvider>
  )
}