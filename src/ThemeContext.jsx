import { createContext, useContext, useState, useEffect } from 'react'

const dark = {
  bg: '#0a0e17', card: '#111827', cardAlt: '#0d1420',
  border: '#1e293b', accent: '#38bdf8', accentDim: '#0c4a6e',
  green: '#22c55e', greenDim: '#052e16', greenBdr: '#15803d',
  red: '#ef4444', redDim: '#2a0a0a', redBdr: '#b91c1c',
  yellow: '#eab308', yellowDim: '#1a1500',
  text: '#e2e8f0', dim: '#94a3b8', muted: '#64748b', white: '#f8fafc',
  stickyBg: 'rgba(10,14,23,0.95)',
}

const light = {
  bg: '#f8fafc', card: '#ffffff', cardAlt: '#f1f5f9',
  border: '#e2e8f0', accent: '#0284c7', accentDim: '#e0f2fe',
  green: '#16a34a', greenDim: '#dcfce7', greenBdr: '#86efac',
  red: '#dc2626', redDim: '#fef2f2', redBdr: '#fca5a5',
  yellow: '#ca8a04', yellowDim: '#fefce8',
  text: '#1e293b', dim: '#64748b', muted: '#94a3b8', white: '#ffffff',
  stickyBg: 'rgba(248,250,252,0.95)',
}

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('bd-theme') || 'dark' } catch { return 'dark' }
  })

  useEffect(() => {
    try { localStorage.setItem('bd-theme', mode) } catch {}
  }, [mode])

  const toggle = () => setMode(m => m === 'dark' ? 'light' : 'dark')
  const C = mode === 'dark' ? dark : light

  return (
    <ThemeContext.Provider value={{ C, mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
