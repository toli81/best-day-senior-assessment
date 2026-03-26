import { useTheme } from '../ThemeContext'

export default function ThemeToggle() {
  const { mode, toggle, C } = useTheme()
  return (
    <button onClick={toggle} style={{
      background: 'transparent', border: `1px solid ${C.border}`,
      borderRadius: 8, padding: '6px 10px', cursor: 'pointer',
      fontSize: 18, minHeight: 40, minWidth: 40,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
      {mode === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
    </button>
  )
}
