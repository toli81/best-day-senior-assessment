import { useTheme } from '../ThemeContext'

export default function Section({ icon, title, children }) {
  const { C } = useTheme()
  return (
    <div style={{
      padding: 20, borderRadius: 16, background: C.card,
      border: `1px solid ${C.border}`, marginBottom: 16,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        paddingBottom: 12, borderBottom: `1px solid ${C.border}`, marginBottom: 16,
      }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <h2 style={{
          margin: 0, fontSize: 15, fontWeight: 800,
          letterSpacing: 1.5, textTransform: 'uppercase', color: C.accent,
        }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}
