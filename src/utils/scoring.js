import { TUG, STEPS, STS, GRIP, SCRATCH, CORE, getAgeGroup, getTugAgeGroup } from '../data/norms'

function pf(v) {
  const n = parseFloat(v)
  return isNaN(n) ? null : n
}

// Calculate total points (each passing test = 1 point)
export function calculatePoints(r, age, sex) {
  const ag = getAgeGroup(age)
  let p = 0

  // Posture: neck angle <= 4cm
  if (r.na !== '' && pf(r.na) !== null && pf(r.na) <= 4) p++

  // Back Scratch: better side within threshold
  const bs = Math.min(pf(r.sR) ?? 999, pf(r.sL) ?? 999)
  if (bs < 999 && bs <= SCRATCH[sex]) p++

  // Ankle Dorsi: vertical or >= 8 degrees
  if (r.aV === 'Y' || (r.aD && pf(r.aD) >= 8)) p++

  // One Leg Stand: best side >= 5s
  if (Math.max(pf(r.oR) ?? 0, pf(r.oL) ?? 0) >= 5) p++

  // Vestibular turns: no dizziness
  if (r.vT === 'N') p++

  // Vestibular nods: no dizziness
  if (r.vN === 'N') p++

  // TUG: < 14s
  if (r.tug && pf(r.tug) < 14) p++

  // Tandem walk: <= 2 errors
  if (r.tE !== '' && pf(r.tE) !== null && pf(r.tE) <= 2) p++

  // Tandem eyes closed: >= 5 steps
  if (r.tEC === 'Y') p++

  // 2-Min Step: at or above norm
  if (ag && STEPS[ag] && r.st && pf(r.st) >= STEPS[ag][sex]) p++

  // Grip R: above norm (input in lbs, norms in kg, 1 lb = 0.4536 kg)
  if (ag && GRIP[ag]) {
    if ((pf(r.gR) ?? 0) * 0.4536 >= GRIP[ag][sex].R) p++
    if ((pf(r.gL) ?? 0) * 0.4536 >= GRIP[ag][sex].L) p++
  }

  // Calf raises: >= 25 each side
  if (pf(r.cR) >= 25) p++
  if (pf(r.cL) >= 25) p++

  // Sit to Stand: at or above norm
  if (ag && STS[ag] && r.sts && pf(r.sts) >= STS[ag][sex]) p++

  // Plank: passed 73s
  if (r.plk === 'Y') p++

  // Curl up: any time recorded
  if (r.cu && pf(r.cu) > 0) p++

  // Back extension: any time recorded
  if (r.be && pf(r.be) > 0) p++

  // Bonus: Jump
  if (r.jmp === 'Y') p++

  // Double Bonus: Ground get-up
  if (r.gnd === 'Y') p++

  return p
}

// Get individual risk assessments for results view
export function getRisks(r, age, sex) {
  const ag = getAgeGroup(age)
  const tAg = getTugAgeGroup(age)

  return [
    {
      label: 'Fall Risk (TUG 14s+)',
      level: r.tug ? (pf(r.tug) >= 14 ? 'risk' : 'safe') : 'none',
    },
    {
      label: 'Disability Risk (TUG >9s)',
      level: r.tug ? (pf(r.tug) > 9 ? 'risk' : 'safe') : 'none',
    },
    {
      label: 'One Leg Stand (<5s)',
      level: (r.oR || r.oL) ? (Math.max(pf(r.oR) ?? 0, pf(r.oL) ?? 0) < 5 ? 'risk' : 'safe') : 'none',
    },
    {
      label: 'Vestibular Turns',
      level: r.vT === 'Y' ? 'risk' : r.vT === 'N' ? 'safe' : 'none',
    },
    {
      label: 'Vestibular Nods',
      level: r.vN === 'Y' ? 'risk' : r.vN === 'N' ? 'safe' : 'none',
    },
    {
      label: 'Tandem Walk (>2 errors)',
      level: r.tE !== '' ? (pf(r.tE) > 2 ? 'risk' : 'safe') : 'none',
    },
    {
      label: 'Ankle Dorsi (<8\u00b0)',
      level: r.aV === 'Y' ? 'safe' : (r.aD ? (pf(r.aD) < 8 ? 'risk' : 'safe') : 'none'),
    },
    {
      label: 'Calf Raises (<25)',
      level: (r.cR || r.cL) ? (Math.min(pf(r.cR) ?? 0, pf(r.cL) ?? 0) < 25 ? 'risk' : 'safe') : 'none',
    },
    {
      label: 'Shoulder Flexibility',
      level: (r.sR || r.sL) ? (Math.min(pf(r.sR) ?? 999, pf(r.sL) ?? 999) > SCRATCH[sex] ? 'risk' : 'safe') : 'none',
    },
    {
      label: 'Core (Plank)',
      level: r.plk === 'N' ? 'risk' : r.plk === 'Y' ? 'safe' : 'none',
    },
  ]
}

// Get bar chart data for results view
export function getBarData(r, age, sex) {
  const ag = getAgeGroup(age)
  const tAg = getTugAgeGroup(age)

  return [
    {
      label: 'TUG', value: r.tug, unit: 's',
      norm: tAg ? TUG[tAg] : '',
      risk: r.tug && pf(r.tug) >= 14 ? 'risk' : 'safe',
    },
    {
      label: '2-Min Steps', value: r.st, unit: '',
      norm: ag && STEPS[ag] ? STEPS[ag][sex] : '',
      risk: ag && STEPS[ag] && r.st ? (pf(r.st) < STEPS[ag][sex] ? 'risk' : 'safe') : 'none',
    },
    {
      label: 'Sit to Stand', value: r.sts, unit: 'reps',
      norm: ag && STS[ag] ? STS[ag][sex] : '',
      risk: ag && STS[ag] && r.sts ? (pf(r.sts) < STS[ag][sex] ? 'risk' : 'safe') : 'none',
    },
    {
      label: 'One Leg (best)', value: Math.max(pf(r.oR) ?? 0, pf(r.oL) ?? 0) || '', unit: 's',
      norm: 20,
      risk: (pf(r.oR) || pf(r.oL)) ? (Math.max(pf(r.oR) ?? 0, pf(r.oL) ?? 0) < 5 ? 'risk' : 'safe') : 'none',
    },
    {
      label: 'Calf R', value: r.cR, unit: '',
      norm: 25,
      risk: r.cR ? (pf(r.cR) < 25 ? 'risk' : 'safe') : 'none',
    },
    {
      label: 'Calf L', value: r.cL, unit: '',
      norm: 25,
      risk: r.cL ? (pf(r.cL) < 25 ? 'risk' : 'safe') : 'none',
    },
  ]
}
