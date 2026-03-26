import { openDB } from 'idb'

const DB_NAME = 'bestday-assessment'
const DB_VERSION = 1

function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('clients')) {
        const clients = db.createObjectStore('clients', { keyPath: 'id' })
        clients.createIndex('name', 'name')
      }
      if (!db.objectStoreNames.contains('sessions')) {
        const sessions = db.createObjectStore('sessions', { keyPath: 'id' })
        sessions.createIndex('clientId', 'clientId')
        sessions.createIndex('date', 'date')
      }
    },
  })
}

// Clients
export async function saveClient(client) {
  const db = await getDB()
  await db.put('clients', { ...client, updatedAt: Date.now() })
  return client
}

export async function getAllClients() {
  const db = await getDB()
  return db.getAll('clients')
}

export async function getClient(id) {
  const db = await getDB()
  return db.get('clients', id)
}

export async function deleteClient(id) {
  const db = await getDB()
  // Delete all sessions for this client too
  const sessions = await getSessionsByClient(id)
  const tx = db.transaction(['clients', 'sessions'], 'readwrite')
  await tx.objectStore('clients').delete(id)
  for (const s of sessions) {
    await tx.objectStore('sessions').delete(s.id)
  }
  await tx.done
}

// Sessions
export async function saveSession(session) {
  const db = await getDB()
  await db.put('sessions', { ...session, updatedAt: Date.now() })
  return session
}

export async function getSessionsByClient(clientId) {
  const db = await getDB()
  return db.getAllFromIndex('sessions', 'clientId', clientId)
}

export async function getAllSessions() {
  const db = await getDB()
  return db.getAll('sessions')
}

export async function deleteSession(id) {
  const db = await getDB()
  await db.delete('sessions', id)
}
