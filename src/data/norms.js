// TUG norms by age group (seconds) - lower is better
export const TUG = {
  '30-39': 4.4, '40-49': 4.6, '50-59': 4.9,
  '60-69': 5.6, '70-79': 6.7, '80-89': 7.8,
}

// 2-Minute Step Test norms by age group and sex - higher is better
export const STEPS = {
  '60-64': { M: 106, F: 97 },
  '65-69': { M: 101, F: 93 },
  '70-74': { M: 95, F: 89 },
  '75-79': { M: 88, F: 84 },
  '80-84': { M: 80, F: 78 },
  '85-89': { M: 71, F: 70 },
  '90-94': { M: 60, F: 60 },
}

// 30-Second Sit to Stand norms by age group and sex - higher is better
export const STS = {
  '60-64': { M: 17, F: 15 },
  '65-69': { M: 16, F: 15 },
  '70-74': { M: 15, F: 14 },
  '75-79': { M: 14, F: 13 },
  '80-84': { M: 13, F: 12 },
  '85-89': { M: 11, F: 11 },
  '90-94': { M: 9, F: 9 },
}

// Grip strength norms by age group, sex, and hand (in kg) - higher is better
export const GRIP = {
  '60-64': { M: { R: 40.69, L: 34.84 }, F: { R: 24.99, L: 20.73 } },
  '65-69': { M: { R: 41.32, L: 34.84 }, F: { R: 22.50, L: 18.60 } },
  '70-74': { M: { R: 34.16, L: 29.39 }, F: { R: 22.50, L: 18.82 } },
  '75-79': { M: { R: 33.00, L: 31.10 }, F: { R: 21.60, L: 19.30 } },
  '80-84': { M: { R: 30.10, L: 27.00 }, F: { R: 17.30, L: 17.10 } },
  '85-89': { M: { R: 25.80, L: 25.10 }, F: { R: 17.10, L: 15.70 } },
  '90-94': { M: { R: 18.80, L: 18.90 }, F: { R: 15.20, L: 14.80 } },
}

// Back Scratch risk thresholds (inches) - lower is better
export const SCRATCH = { M: 8, F: 4 }

// Shoulder External Rotator norms (lbs)
export const SHOULDER_ER = {
  '60-69': { M: 34, F: 20 },
  '70-79': { M: 32, F: 19 },
}

// Core endurance standards
export const CORE = {
  plank: 73,             // seconds
  curlUp: { M: 183, F: 85 }, // seconds (M ~3 min, W ~80-85s)
  backExt: { M: 208, F: 128 }, // seconds (M ~3 min, W ~2 min)
}

// Helper: get 5-year age group (60-64, 65-69, etc.)
export function getAgeGroup(age) {
  const a = parseInt(age)
  if (isNaN(a) || a < 60) return null
  if (a < 65) return '60-64'
  if (a < 70) return '65-69'
  if (a < 75) return '70-74'
  if (a < 80) return '75-79'
  if (a < 85) return '80-84'
  if (a < 90) return '85-89'
  return '90-94'
}

// Helper: get TUG age group (wider ranges)
export function getTugAgeGroup(age) {
  const a = parseInt(age)
  if (isNaN(a)) return null
  if (a < 40) return '30-39'
  if (a < 50) return '40-49'
  if (a < 60) return '50-59'
  if (a < 70) return '60-69'
  if (a < 80) return '70-79'
  return '80-89'
}

// Helper: get shoulder ER age group
export function getShoulderAgeGroup(age) {
  const a = parseInt(age)
  if (isNaN(a) || a < 60) return null
  if (a < 70) return '60-69'
  return '70-79'
}
