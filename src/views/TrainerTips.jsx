import { useState } from 'react'
import { useTheme } from '../ThemeContext'
import { MI_TECHNIQUES } from '../data/trainerTips'

function TipCard({ tip }) {
  const { C } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      borderRadius: 12, border: `1px solid ${C.border}`,
      background: C.card, marginBottom: 10, overflow: 'hidden',
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '14px 16px', border: 'none',
        background: 'transparent', cursor: 'pointer', textAlign: 'left',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        minHeight: 48,
      }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{tip.title}</span>
        <span style={{ fontSize: 18, color: C.muted, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 13, color: C.dim, lineHeight: 1.6, margin: '12px 0' }}>
            {tip.rationale}
          </p>
          <div style={{
            fontSize: 10, fontWeight: 800, letterSpacing: 1.5,
            color: C.accent, marginBottom: 8,
          }}>
            EXAMPLE PHRASES
          </div>
          {tip.examples.map((ex, i) => (
            <div key={i} style={{
              padding: '8px 12px', borderRadius: 8, marginBottom: 6,
              background: C.cardAlt, border: `1px solid ${C.border}`,
              fontSize: 13, color: C.text, lineHeight: 1.5, fontStyle: 'italic',
            }}>
              {ex}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TrainerTips({ onClose }) {
  const { C } = useTheme()

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 16,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.text }}>
            Trainer Tips
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: C.dim }}>
            Motivational Interviewing techniques for discussing results
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} style={{
            padding: '8px 16px', borderRadius: 8,
            border: `1px solid ${C.border}`, background: 'transparent',
            color: C.text, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            minHeight: 40,
          }}>
            Close
          </button>
        )}
      </div>

      <div style={{
        padding: 12, borderRadius: 10, marginBottom: 16,
        background: C.accentDim, border: `1px solid ${C.accent}30`,
      }}>
        <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6, margin: 0 }}>
          These techniques help you discuss assessment results in a way that motivates clients
          to take action. The goal is to have the client voice their own reasons for change,
          rather than being told what to do.
        </p>
      </div>

      {MI_TECHNIQUES.map((tip, i) => (
        <TipCard key={i} tip={tip} />
      ))}
    </div>
  )
}
