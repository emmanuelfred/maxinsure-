import { createContext, useContext, useState } from 'react'

const PolicyContext = createContext(null)

export function PolicyProvider({ children }) {
  const [policy, setPolicy] = useState(null)
  return (
    <PolicyContext.Provider value={{ policy, setPolicy }}>
      {children}
    </PolicyContext.Provider>
  )
}

export function usePolicy() {
  return useContext(PolicyContext)
}
