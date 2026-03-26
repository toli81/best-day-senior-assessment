import { useState, useEffect, useMemo } from 'react'
import { ThemeProvider, useTheme } from './ThemeContext'
import Timer from './components/Timer'
import InfoBubble from './components/InfoBubble'
import NumberInput from './components/NumberInput'
import YesNo from './components/YesNo'
import Badge from './components/Badge'
import Section from './components/Section'
import Row from './components/Row'
import BarChart from './components/BarChart'
import ThemeToggle from './components/ThemeToggle'
import { calculatePoints, getRisks, getBarData } from './utils/scoring'
import { saveSession, getAllSessions, saveClient, getAllClients } from './db/store'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import TrainerTips from './views/TrainerTips'

const emptyClient = {
  name: '', age: '', sex: 'M', email: '', trainer: '', date: '', notes: '',
  f1: '', f2: '', f3: '', f4: '',
  hr: '', bpSys: '', bpDia: '', o2: '', bmi: '',
}

const emptyResults = {
  na: '', sR: '', sL: '', aV: '', aD: '',
  oR: '', oL: '', vT: '', vN: '',
  tug: '', tE: '', tEC: '', st: '',
  gR: '', gL: '', cR: '', cL: '',
  sts: '', plk: '', cu: '', be: '',
  jmp: '', gnd: '',
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

/* ───────────────────────── INNER APP ───────────────────────── */

function AppInner() {
  const { C } = useTheme()

  // views: form | results | history | trends
  const [view, setView] = useState('form')
  const [client, setClient] = useState({ ...emptyClient, date: new Date().toISOString().split('T')[0] })
  const [results, setResults] = useState({ ...emptyResults })
  const [sessions, setSessions] = useState([])
  const [consent, setConsent] = useState(false)
  const [services, setServices] = useState({ pt: false, ot: false, group: false, personal: false })
  const [trendClient, setTrendClient] = useState(null)

  // Load saved sessions on mount
  useEffect(() => {
    getAllSessions().then(s => setSessions(s || []))
  }, [])

  const setC = (k, v) => setClient(p => ({ ...p, [k]: v }))
  const setR = (k, v) => setResults(p => ({ ...p, [k]: v }))

  const pts = useMemo(() => calculatePoints(results, client.age, client.sex), [results, client.age, client.sex])

  /* ──── SAVE ──── */
  async function handleSave() {
    const clientId = client.id || uid()
    const sessionId = uid()
    const clientData = { ...client, id: clientId }
    const session = {
      id: sessionId,
      clientId,
      clientName: client.name || 'Unknown',
      date: client.date || new Date().toISOString().split('T')[0],
      client: clientData,
      results: { ...results },
      points: pts,
      consent,
      services: { ...services },
      createdAt: Date.now(),
    }
    await saveClient(clientData)
    await saveSession(session)
    const all = await getAllSessions()
    setSessions(all || [])
    setClient(prev => ({ ...prev, id: clientId }))
    setView('results')
  }

  /* ──── LOAD SESSION ──── */
  function loadSession(s) {
    setClient(s.client || { ...emptyClient })
    setResults(s.results || { ...emptyResults })
    setView('form')
  }

  /* ──── NEW ASSESSMENT ──── */
  function newAssessment() {
    setClient({ ...emptyClient, date: new Date().toISOString().split('T')[0] })
    setResults({ ...emptyResults })
    setConsent(false)
    setServices({ pt: false, ot: false, group: false, personal: false })
    setView('form')
  }

  /* ──── TREND DATA ──── */
  function showTrends(clientName) {
    setTrendClient(clientName)
    setView('trends')
  }

  const trendSessions = useMemo(() => {
    if (!trendClient) return []
    return sessions
      .filter(s => s.clientName === trendClient)
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  }, [sessions, trendClient])

  // ─── Shared styles ───
  const input = (w) => ({
    width: w || 120, padding: '10px 8px', borderRadius: 8,
    border: `1px solid ${C.border}`, background: C.bg, color: C.text,
    fontSize: 14, minHeight: 44,
  })
  const select = {
    ...input(90), cursor: 'pointer', appearance: 'auto',
  }
  const label = { color: C.dim, fontSize: 12, fontWeight: 600, marginBottom: 4, display: 'block' }
  const btn = (bg, color) => ({
    padding: '12px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
    fontWeight: 800, fontSize: 14, background: bg, color, minHeight: 48,
  })
  const gridCell = { display: 'flex', flexDirection: 'column' }
  const textarea = {
    ...input('100%'), minHeight: 70, resize: 'vertical', fontFamily: 'inherit',
  }

  /* ══════════════════════════════════════════════════════════════
     FORM VIEW
     ══════════════════════════════════════════════════════════════ */
  if (view === 'form') {
    return (
      <div style={{ background: C.bg, color: C.text, minHeight: '100vh', paddingBottom: 80 }}>
        {/* ──── HEADER ──── */}
        <div style={{ textAlign: 'center', padding: '32px 20px 16px' }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: 3, color: C.accent, margin: 0 }}>
            BEST DAY FITNESS
          </h1>
          <div style={{ fontSize: 14, color: C.dim, marginTop: 4, fontWeight: 600 }}>
            Senior Movement Assessment
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
            1555 Freedom Blvd Suite 120, Provo, UT 84604
          </div>
        </div>

        {/* ──── STICKY HEADER ──── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: C.stickyBg, backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${C.border}`,
          padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              fontSize: 28, fontWeight: 900, fontFamily: 'monospace', color: C.accent,
              textShadow: `0 0 20px ${C.accentDim}`,
            }}>
              {pts}
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.dim, fontWeight: 600, letterSpacing: 1 }}>POINTS</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => { getAllSessions().then(s => { setSessions(s || []); setView('history') }) }}
              style={{ ...btn('transparent', C.accent), border: `1px solid ${C.accent}`, padding: '8px 14px', fontSize: 12 }}>
              History
            </button>
            <button onClick={handleSave}
              style={{ ...btn(C.green, '#fff'), padding: '8px 14px', fontSize: 12 }}>
              Save &amp; Results
            </button>
            <ThemeToggle />
          </div>
        </div>

        <div style={{ maxWidth: 700, margin: '0 auto', padding: '16px 12px' }}>

          {/* ──── 1. CLIENT INFO ──── */}
          <Section icon="\uD83D\uDCCB" title="Client Information">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              <div style={gridCell}>
                <span style={label}>Name</span>
                <input value={client.name} onChange={e => setC('name', e.target.value)}
                  style={input('100%')} placeholder="Full name" />
              </div>
              <div style={gridCell}>
                <span style={label}>Age</span>
                <input type="number" inputMode="numeric" value={client.age}
                  onChange={e => setC('age', e.target.value)} style={input('100%')} placeholder="65" />
              </div>
              <div style={gridCell}>
                <span style={label}>Sex</span>
                <select value={client.sex} onChange={e => setC('sex', e.target.value)} style={select}>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div style={gridCell}>
                <span style={label}>Trainer</span>
                <input value={client.trainer} onChange={e => setC('trainer', e.target.value)}
                  style={input('100%')} placeholder="Trainer" />
              </div>
              <div style={gridCell}>
                <span style={label}>Date</span>
                <input type="date" value={client.date} onChange={e => setC('date', e.target.value)}
                  style={input('100%')} />
              </div>
              <div style={gridCell}>
                <span style={label}>Email</span>
                <input type="email" value={client.email} onChange={e => setC('email', e.target.value)}
                  style={input('100%')} placeholder="email@example.com" />
              </div>
            </div>

            {/* Vitals */}
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <span style={{ ...label, marginBottom: 8 }}>Vitals</span>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div style={gridCell}>
                  <span style={{ ...label, fontSize: 10 }}>HR (bpm)</span>
                  <NumberInput value={client.hr} onChange={v => setC('hr', v)} w={70} />
                </div>
                <div style={gridCell}>
                  <span style={{ ...label, fontSize: 10 }}>BP Sys</span>
                  <NumberInput value={client.bpSys} onChange={v => setC('bpSys', v)} w={70} />
                </div>
                <div style={gridCell}>
                  <span style={{ ...label, fontSize: 10 }}>BP Dia</span>
                  <NumberInput value={client.bpDia} onChange={v => setC('bpDia', v)} w={70} />
                </div>
                <div style={gridCell}>
                  <span style={{ ...label, fontSize: 10 }}>O2 Sat %</span>
                  <NumberInput value={client.o2} onChange={v => setC('o2', v)} w={70} />
                </div>
                <div style={gridCell}>
                  <span style={{ ...label, fontSize: 10 }}>BMI</span>
                  <NumberInput value={client.bmi} onChange={v => setC('bmi', v)} w={70} />
                </div>
              </div>
            </div>

            {/* Fall History */}
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <span style={{ ...label, marginBottom: 8 }}>Fall History (Grade 1-4)</span>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[1, 2, 3, 4].map(n => (
                  <div key={n} style={gridCell}>
                    <span style={{ ...label, fontSize: 10 }}>Grade {n}</span>
                    <NumberInput value={client[`f${n}`]} onChange={v => setC(`f${n}`, v)} w={60} />
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <span style={label}>Notes</span>
              <textarea value={client.notes} onChange={e => setC('notes', e.target.value)}
                style={textarea} placeholder="Observations, medical history, medications..." />
            </div>
          </Section>

          {/* ──── 2. POSTURE ──── */}
          <Section icon="\uD83E\uDDBB" title="Posture">
            <Row label="Neck Angle (cm)" info="posture">
              <NumberInput value={results.na} onChange={v => setR('na', v)} unit="cm" />
              <Badge
                level={results.na === '' ? 'none' : parseFloat(results.na) <= 4 ? 'safe' : 'risk'}
                label={results.na !== '' ? (parseFloat(results.na) <= 4 ? 'NORMAL' : 'AT RISK') : undefined}
              />
            </Row>
          </Section>

          {/* ──── 3. FLEXIBILITY ──── */}
          <Section icon="\uD83E\uDD38" title="Flexibility">
            <Row label="Back Scratch R" info="backScratch">
              <NumberInput value={results.sR} onChange={v => setR('sR', v)} unit="in" />
            </Row>
            <Row label="Back Scratch L">
              <NumberInput value={results.sL} onChange={v => setR('sL', v)} unit="in" />
            </Row>
            <Row label="Ankle Dorsi Vertical?" info="ankleDorsi">
              <YesNo value={results.aV} onChange={v => setR('aV', v)} />
            </Row>
            {results.aV === 'N' && (
              <Row label="Dorsi Degrees">
                <NumberInput value={results.aD} onChange={v => setR('aD', v)} unit="\u00B0" />
                <Badge
                  level={results.aD === '' ? 'none' : parseFloat(results.aD) >= 8 ? 'safe' : 'risk'}
                />
              </Row>
            )}
          </Section>

          {/* ──── 4. STATIC BALANCE ──── */}
          <Section icon="\uD83E\uDDD8" title="Static Balance">
            <Row label="One Leg Stand R" info="oneLeg">
              <NumberInput value={results.oR} onChange={v => setR('oR', v)} unit="s" />
              <Timer onCapture={v => setR('oR', v)} />
            </Row>
            <Row label="One Leg Stand L">
              <NumberInput value={results.oL} onChange={v => setR('oL', v)} unit="s" />
              <Timer onCapture={v => setR('oL', v)} />
            </Row>
            <Row label="Vestibular Turns Dizzy?" info="vestibular">
              <YesNo value={results.vT} onChange={v => setR('vT', v)} />
              <Badge level={results.vT === 'Y' ? 'risk' : results.vT === 'N' ? 'safe' : 'none'} />
            </Row>
            <Row label="Vestibular Nods Dizzy?">
              <YesNo value={results.vN} onChange={v => setR('vN', v)} />
              <Badge level={results.vN === 'Y' ? 'risk' : results.vN === 'N' ? 'safe' : 'none'} />
            </Row>
          </Section>

          {/* ──── 5. DYNAMIC BALANCE ──── */}
          <Section icon="\uD83D\uDEB6" title="Dynamic Balance">
            <Row label="TUG (seconds)" info="tug">
              <NumberInput value={results.tug} onChange={v => setR('tug', v)} unit="s" />
              <Timer onCapture={v => setR('tug', v)} />
            </Row>
            {results.tug && (
              <div style={{ marginLeft: 152, marginBottom: 12 }}>
                <Badge
                  level={parseFloat(results.tug) >= 14 ? 'risk' : 'safe'}
                  label={parseFloat(results.tug) >= 14 ? 'FALL RISK 14s+' : parseFloat(results.tug) > 9 ? 'DISABILITY RISK >9s' : 'NORMAL'}
                />
              </div>
            )}
            <Row label="Tandem Walk Errors" info="tandem">
              <NumberInput value={results.tE} onChange={v => setR('tE', v)} unit="errors" />
              {results.tE !== '' && (
                <Badge level={parseFloat(results.tE) > 2 ? 'risk' : 'safe'} />
              )}
            </Row>
            <Row label="Eyes Closed 5+ steps?">
              <YesNo value={results.tEC} onChange={v => setR('tEC', v)} />
            </Row>
          </Section>

          {/* ──── 6. ENDURANCE ──── */}
          <Section icon="\u2764\uFE0F" title="Endurance">
            <Row label="2-Min Step Test" info="step">
              <NumberInput value={results.st} onChange={v => setR('st', v)} unit="steps" w={90} />
            </Row>
            <div style={{ marginTop: 8 }}>
              <Timer countFrom={120} />
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                120-second countdown for step test
              </div>
            </div>
          </Section>

          {/* ──── 7. STRENGTH ──── */}
          <Section icon="\uD83D\uDCAA" title="Strength">
            <Row label="Grip R (lbs)" info="grip">
              <NumberInput value={results.gR} onChange={v => setR('gR', v)} unit="lbs" />
            </Row>
            <Row label="Grip L (lbs)">
              <NumberInput value={results.gL} onChange={v => setR('gL', v)} unit="lbs" />
            </Row>
            <Row label="Calf Raises R" info="calf">
              <NumberInput value={results.cR} onChange={v => setR('cR', v)} unit="reps" />
              {results.cR !== '' && (
                <Badge level={parseFloat(results.cR) >= 25 ? 'safe' : 'risk'} />
              )}
            </Row>
            <Row label="Calf Raises L">
              <NumberInput value={results.cL} onChange={v => setR('cL', v)} unit="reps" />
              {results.cL !== '' && (
                <Badge level={parseFloat(results.cL) >= 25 ? 'safe' : 'risk'} />
              )}
            </Row>
          </Section>

          {/* ──── 8. FUNCTION ──── */}
          <Section icon="\uD83E\uDE91" title="Function">
            <Row label="Sit to Stand (30s)" info="sts">
              <NumberInput value={results.sts} onChange={v => setR('sts', v)} unit="reps" />
            </Row>
            <div style={{ marginTop: 8 }}>
              <Timer countFrom={30} />
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>
                30-second countdown for sit-to-stand
              </div>
            </div>
          </Section>

          {/* ──── 9. CORE ──── */}
          <Section icon="\uD83C\uDFCB\uFE0F" title="Core">
            <Row label="Plank (pass 73s?)" info="plank">
              <YesNo value={results.plk} onChange={v => setR('plk', v)} />
              <Timer />
            </Row>
            <Row label="Curl Up (seconds)">
              <NumberInput value={results.cu} onChange={v => setR('cu', v)} unit="s" />
              <Timer onCapture={v => setR('cu', v)} />
            </Row>
            <Row label="Back Extension (seconds)" info="backExt">
              <NumberInput value={results.be} onChange={v => setR('be', v)} unit="s" />
              <Timer onCapture={v => setR('be', v)} />
            </Row>
          </Section>

          {/* ──── 10. BONUS ──── */}
          <Section icon="\u2B50" title="Bonus">
            <Row label="Can Jump?" info="jump">
              <YesNo value={results.jmp} onChange={v => setR('jmp', v)} />
            </Row>
            <Row label="Get on Ground & Up?" info="ground">
              <YesNo value={results.gnd} onChange={v => setR('gnd', v)} />
            </Row>
          </Section>

          {/* ──── 11. CONSENT & SERVICES ──── */}
          <Section icon="\u270D\uFE0F" title="Consent & Services">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16 }}>
              <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}
                style={{ marginTop: 4, width: 20, height: 20, cursor: 'pointer' }} />
              <span style={{ fontSize: 13, color: C.text, lineHeight: 1.5 }}>
                I consent to this assessment and understand the results will be used to create
                a personalized training program. I acknowledge that this is a fitness assessment,
                not a medical evaluation.
              </span>
            </div>
            <div style={{ fontSize: 13, color: C.dim, fontWeight: 600, marginBottom: 10 }}>
              Recommended Services
            </div>
            {[
              { k: 'pt', l: 'Physical Therapy Referral' },
              { k: 'ot', l: 'Occupational Therapy Referral' },
              { k: 'group', l: 'Group Balance Class' },
              { k: 'personal', l: 'Personal Training' },
            ].map(s => (
              <div key={s.k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <input type="checkbox" checked={services[s.k]}
                  onChange={e => setServices(p => ({ ...p, [s.k]: e.target.checked }))}
                  style={{ width: 18, height: 18, cursor: 'pointer' }} />
                <span style={{ fontSize: 13, color: C.text }}>{s.l}</span>
              </div>
            ))}
          </Section>

          {/* ──── BIG SAVE BUTTON ──── */}
          <button onClick={handleSave} style={{
            width: '100%', padding: '18px 0', borderRadius: 14,
            border: 'none', cursor: 'pointer', fontWeight: 900, fontSize: 18,
            letterSpacing: 1, background: `linear-gradient(135deg, ${C.accent}, ${C.green})`,
            color: '#fff', marginTop: 8, minHeight: 56,
            boxShadow: `0 4px 24px ${C.accentDim}`,
          }}>
            SAVE ASSESSMENT &amp; VIEW RESULTS
          </button>
        </div>
      </div>
    )
  }

  /* ══════════════════════════════════════════════════════════════
     RESULTS VIEW
     ══════════════════════════════════════════════════════════════ */
  if (view === 'results') {
    const risks = getRisks(results, client.age, client.sex)
    const bars = getBarData(results, client.age, client.sex)
    const riskCount = risks.filter(r => r.level === 'risk').length
    const safeCount = risks.filter(r => r.level === 'safe').length

    return (
      <div style={{ background: C.bg, color: C.text, minHeight: '100vh', padding: '20px 12px 80px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {/* Score Summary */}
          <div style={{
            textAlign: 'center', padding: 32, borderRadius: 20,
            background: C.card, border: `1px solid ${C.border}`, marginBottom: 20,
          }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.dim, fontWeight: 700, marginBottom: 8 }}>
              ASSESSMENT RESULTS
            </div>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 4 }}>
              {client.name || 'Client'} {client.age ? `| Age ${client.age}` : ''} | {client.date}
            </div>
            <div style={{
              fontSize: 72, fontWeight: 900, fontFamily: 'monospace', color: C.accent,
              textShadow: `0 0 40px ${C.accentDim}`,
              lineHeight: 1, margin: '16px 0 4px',
            }}>
              {pts}
            </div>
            <div style={{ fontSize: 14, color: C.dim, fontWeight: 600 }}>
              points earned
            </div>
          </div>

          {/* Performance Bars */}
          <Section icon="\uD83D\uDCCA" title="Performance Summary">
            <BarChart items={bars} />
          </Section>

          {/* Risk Summary */}
          <Section icon="\u26A0\uFE0F" title="Risk Assessment">
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{
                flex: 1, textAlign: 'center', padding: 12, borderRadius: 12,
                background: C.redDim, border: `1px solid ${C.redBdr}`,
              }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.red }}>{riskCount}</div>
                <div style={{ fontSize: 11, color: C.red, fontWeight: 600 }}>RISK FLAGS</div>
              </div>
              <div style={{
                flex: 1, textAlign: 'center', padding: 12, borderRadius: 12,
                background: C.greenDim, border: `1px solid ${C.greenBdr}`,
              }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: C.green }}>{safeCount}</div>
                <div style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>PASSED</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {risks.map((r, i) => (
                <Badge key={i} level={r.level} label={r.label} />
              ))}
            </div>
          </Section>

          {/* Recommended Services */}
          <Section icon="\uD83D\uDCCB" title="Recommended Services">
            <div style={{ fontSize: 13, color: C.text, lineHeight: 2 }}>
              {riskCount >= 3 && <div style={{ color: C.red, fontWeight: 700 }}>Physical Therapy Referral Recommended</div>}
              {risks.some(r => r.label.includes('Vestibular') && r.level === 'risk') && (
                <div style={{ color: C.yellow, fontWeight: 700 }}>Vestibular Rehabilitation Recommended</div>
              )}
              {riskCount >= 1 && <div>Group Balance Class</div>}
              <div>Personal Training Program</div>
              {risks.some(r => r.label.includes('Core') && r.level === 'risk') && (
                <div>Core Stabilization Program</div>
              )}
            </div>
          </Section>

          {/* Trainer Tips */}
          <Section icon={'\uD83D\uDCA1'} title="Trainer Tips">
            <TrainerTips />
          </Section>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button onClick={() => setView('form')}
              style={{ ...btn('transparent', C.accent), flex: 1, border: `1px solid ${C.accent}` }}>
              Edit Assessment
            </button>
            <button onClick={() => { getAllSessions().then(s => { setSessions(s || []); setView('history') }) }}
              style={{ ...btn(C.accent, '#fff'), flex: 1 }}>
              View History
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ══════════════════════════════════════════════════════════════
     HISTORY VIEW
     ══════════════════════════════════════════════════════════════ */
  if (view === 'history') {
    const sorted = [...sessions].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    const clientNames = [...new Set(sessions.map(s => s.clientName).filter(Boolean))]

    return (
      <div style={{ background: C.bg, color: C.text, minHeight: '100vh', padding: '20px 12px 80px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: C.accent, letterSpacing: 2 }}>
              ASSESSMENT HISTORY
            </h1>
            <div style={{ display: 'flex', gap: 8 }}>
              <ThemeToggle />
              <button onClick={newAssessment} style={btn(C.green, '#fff')}>
                + New Assessment
              </button>
            </div>
          </div>

          {/* Trend buttons per client */}
          {clientNames.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: C.dim, fontWeight: 600, marginBottom: 6 }}>
                VIEW TRENDS
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {clientNames.map(name => (
                  <button key={name} onClick={() => showTrends(name)}
                    style={{
                      padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                      border: `1px solid ${C.accent}`, background: 'transparent',
                      color: C.accent, fontSize: 12, fontWeight: 600,
                    }}>
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sorted.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: 40, color: C.muted,
              borderRadius: 16, background: C.card, border: `1px solid ${C.border}`,
            }}>
              No saved assessments yet. Start a new assessment above.
            </div>
          ) : (
            sorted.map(s => (
              <div key={s.id} onClick={() => loadSession(s)} style={{
                padding: 16, borderRadius: 14, marginBottom: 10, cursor: 'pointer',
                background: C.card, border: `1px solid ${C.border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'border-color 0.2s',
              }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
                    {s.clientName || 'Unknown'}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    {s.date || 'No date'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: 24, fontWeight: 900, fontFamily: 'monospace', color: C.accent,
                  }}>
                    {s.points ?? '?'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  /* ══════════════════════════════════════════════════════════════
     TRENDS VIEW
     ══════════════════════════════════════════════════════════════ */
  if (view === 'trends') {
    const charts = [
      {
        title: 'TUG (seconds)', key: 'tug', color: C.accent,
        data: trendSessions.map(s => ({
          date: s.date || '',
          value: parseFloat(s.results?.tug) || null,
        })).filter(d => d.value !== null),
      },
      {
        title: '2-Min Steps', key: 'st', color: C.green,
        data: trendSessions.map(s => ({
          date: s.date || '',
          value: parseFloat(s.results?.st) || null,
        })).filter(d => d.value !== null),
      },
      {
        title: 'Sit to Stand (30s)', key: 'sts', color: '#eab308',
        data: trendSessions.map(s => ({
          date: s.date || '',
          value: parseFloat(s.results?.sts) || null,
        })).filter(d => d.value !== null),
      },
      {
        title: 'One Leg Stand (best)', key: 'oL', color: '#f97316',
        data: trendSessions.map(s => ({
          date: s.date || '',
          value: Math.max(parseFloat(s.results?.oR) || 0, parseFloat(s.results?.oL) || 0) || null,
        })).filter(d => d.value !== null),
      },
      {
        title: 'Total Points', key: 'points', color: C.accent,
        data: trendSessions.map(s => ({
          date: s.date || '',
          value: s.points ?? null,
        })).filter(d => d.value !== null),
      },
    ]

    return (
      <div style={{ background: C.bg, color: C.text, minHeight: '100vh', padding: '20px 12px 80px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: C.accent, letterSpacing: 2, margin: 0 }}>
                TRENDS
              </h1>
              <div style={{ fontSize: 13, color: C.dim, marginTop: 2 }}>
                {trendClient} &mdash; {trendSessions.length} session{trendSessions.length !== 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <ThemeToggle />
              <button onClick={() => setView('history')}
                style={{ ...btn('transparent', C.accent), border: `1px solid ${C.accent}`, padding: '8px 14px', fontSize: 12 }}>
                Back
              </button>
            </div>
          </div>

          {charts.map(chart => (
            <div key={chart.key} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 14, padding: 16, marginBottom: 14,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>
                {chart.title}
              </div>
              {chart.data.length < 2 ? (
                <div style={{ fontSize: 12, color: C.muted, padding: '20px 0', textAlign: 'center' }}>
                  Need at least 2 data points to show trend
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={chart.data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: C.muted }} stroke={C.border} />
                    <YAxis tick={{ fontSize: 10, fill: C.muted }} stroke={C.border} width={40} />
                    <Tooltip
                      contentStyle={{
                        background: C.card, border: `1px solid ${C.border}`,
                        borderRadius: 8, fontSize: 12, color: C.text,
                      }}
                    />
                    <Line
                      type="monotone" dataKey="value" stroke={chart.color}
                      strokeWidth={2} dot={{ r: 4, fill: chart.color }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          ))}

          <button onClick={newAssessment} style={{
            ...btn(C.green, '#fff'), width: '100%', marginTop: 8,
          }}>
            + New Assessment
          </button>
        </div>
      </div>
    )
  }

  return null
}

/* ───────────────────────── ROOT WRAPPER ───────────────────────── */

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}
