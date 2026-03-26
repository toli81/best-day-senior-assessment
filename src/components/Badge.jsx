import { useTheme } from '../ThemeContext'

export default function Badge({ level, label }) {
  const { C } = useTheme()
  if (!level || level === 'none') return null
  const bad = level === 'risk'
  return (
    <span style={{
      display: 'inline-block', padding: '3px 12px', borderRadius: 20,
      fontSize: 11, fontWeight: 700,
      background: bad ? C.redDim : C.greenDim,
      border: `1px solid ${bad ? C.redBdr : C.greenBdr}`,
      color: bad ? C.red : C.green,
    }}>
      {label || (bad ? 'AT RISK' : 'NORMAL')}
    </span>
  )
}
