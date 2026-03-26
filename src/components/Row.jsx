import { useTheme } from '../ThemeContext'
import InfoBubble from './InfoBubble'

export default function Row({ label, children, info }) {
  const { C } = useTheme()
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ color: C.text, fontSize: 14, fontWeight: 600, minWidth: 140 }}>{label}</span>
        {children}
      </div>
      {info && <InfoBubble id={info} />}
    </div>
  )
}
