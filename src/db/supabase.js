// Supabase integration placeholder
// To activate: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env

import { createClient } from '@supabase/supabase-js'

let supabase = null

export function getSupabase() {
  if (supabase) return supabase
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  supabase = createClient(url, key)
  return supabase
}

export async function syncSessionToCloud(session) {
  const sb = await getSupabase()
  if (!sb) return false
  try {
    const { error } = await sb.from('sessions').upsert({
      ...session,
      synced_at: new Date().toISOString(),
    })
    return !error
  } catch {
    return false
  }
}

export async function syncClientToCloud(client) {
  const sb = await getSupabase()
  if (!sb) return false
  try {
    const { error } = await sb.from('clients').upsert({
      ...client,
      synced_at: new Date().toISOString(),
    })
    return !error
  } catch {
    return false
  }
}

export async function pullFromCloud() {
  const sb = await getSupabase()
  if (!sb) return { clients: [], sessions: [] }
  try {
    const [c, s] = await Promise.all([
      sb.from('clients').select('*'),
      sb.from('sessions').select('*'),
    ])
    return {
      clients: c.data || [],
      sessions: s.data || [],
    }
  } catch {
    return { clients: [], sessions: [] }
  }
}
