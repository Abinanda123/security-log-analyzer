const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getToken = () => localStorage.getItem('token')

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
})

// ─── Auth ────────────────────────────────────────────────────────────────────

export const registerUser = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return res.json()
}

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return res.json()
}

export const logoutUser = async () => {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: headers()
  })
  return res.json()
}

// ─── Logs ────────────────────────────────────────────────────────────────────

export const uploadLogFile = async (file: File) => {
  const formData = new FormData()
  formData.append('logfile', file)

  const res = await fetch(`${BASE_URL}/logs/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData
  })
  return res.json()
}

export const getLogs = async () => {
  const res = await fetch(`${BASE_URL}/logs`, { headers: headers() })
  return res.json()
}

export const deleteLog = async (id: string) => {
  const res = await fetch(`${BASE_URL}/logs/${id}`, {
    method: 'DELETE',
    headers: headers()
  })
  return res.json()
}

// ─── Threats ─────────────────────────────────────────────────────────────────

export const getThreats = async () => {
  const res = await fetch(`${BASE_URL}/threats`, { headers: headers() })
  return res.json()
}

export const getThreatsByLog = async (logFileId: string) => {
  const res = await fetch(`${BASE_URL}/threats/log/${logFileId}`, {
    headers: headers()
  })
  return res.json()
}

export const analyzeThreat = async (id: string) => {
  const res = await fetch(`${BASE_URL}/threats/${id}/analyze`, {
    method: 'POST',
    headers: headers()
  })
  return res.json()
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const getDashboardStats = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: headers()
  })
  return res.json()
}