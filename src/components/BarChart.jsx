import { useTheme } from '../ThemeContext'

function parseNum(v) {
  const n = parseFloat(v)
  return isNaN(n) ? null : n
}

export default function BarChart({ items }) {
  const { C } = useTheme()
  return (
    <div>
      {items.filter(i => i.value !== '' && i.value !== null).map((item, i) => {
        const val = parseNum(item.value) || 0
        const norm = parseNum(item.norm) || 0
        const mx = Math.max(val, norm) * 1.3 || 1
        const vp = Math.min(100, (val / mx) * 100)
        const np = norm > 0 ? Math.min(100, (norm / mx) * 100) : 0
        const bad = item.risk === 'risk'
        return (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.label}</span>
              <span style={{ fontSize: 12, color: C.dim }}>
                {val} {item.unit}{norm ? ` / norm: ${norm}` : ''}
              </span>
            </div>
            <div style={{
              position: 'relative', height: 22, borderRadius: 6,
              background: C.bg, border: `1px solid ${C.border}`,
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 6,
                width: `${vp}%`,
                background: bad
                  ? `linear-gradient(90deg, ${C.redBdr}, ${C.red})`
                  : `linear-gradient(90deg, ${C.greenBdr}, ${C.green})`,
                transition: 'width 0.5s',
              }} />
              {np > 0 && (
                <div style={{
                  position: 'absolute', left: `${np}%`, top: -2, bottom: -2,
                  width: 2, background: C.yellow, borderRadius: 1,
                }} />
              )}
            </div>
          </div>
        )
      })}
      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: C.muted, marginTop: 8 }}>
        <span style={{ color: C.green }}>● Meets Standard</span>
        <span style={{ color: C.red }}>● Below Standard</span>
        <span style={{ color: C.yellow }}>| Norm Line</span>
      </div>
    </div>
  )
}
