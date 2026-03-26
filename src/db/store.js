// Unified storage API: local-first with optional cloud sync
import * as local from './local.js'
import { syncSessionToCloud, syncClientToCloud } from './supabase.js'

function isOnline() {
  return typeof navigator !== 'undefined' && navigator.onLine
}

// Background sync - fire and forget
function bgSync(fn) {
  if (isOnline()) {
    fn().catch(() => {}) // silent failure, data is safe in IndexedDB
  }
}

export async function saveClient(client) {
  const saved = await local.saveClient(client)
  bgSync(() => syncClientToCloud(saved))
  return saved
}

export async function getAllClients() {
  return local.getAllClients()
}

export async function getClient(id) {
  return local.getClient(id)
}

export async function deleteClient(id) {
  return local.deleteClient(id)
}

export async function saveSession(session) {
  const saved = await local.saveSession(session)
  bgSync(() => syncSessionToCloud(saved))
  return saved
}

export async function getSessionsByClient(clientId) {
  return local.getSessionsByClient(clientId)
}

export async function getAllSessions() {
  return local.getAllSessions()
}

export async function deleteSession(id) {
  return local.deleteSession(id)
}
