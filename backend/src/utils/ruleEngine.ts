import { LogLine, Threat } from '../types/index.js'

const SQL_INJECTION_PATTERNS = [
  'union select',
  'or 1=1',
  'drop table',
  'insert into',
  'select *',
  "' or '",
  "' or '",
  "or '1'='1",
  '--',
  'xp_cmdshell',
  'exec(',
  'script>'
]

const BRUTE_FORCE_THRESHOLD = 5
const FLOOD_404_THRESHOLD = 10

export const runRuleEngine = (
  lines: LogLine[],
  logFileId: string,
  userId: string
): Threat[] => {
  const threats: Threat[] = []

  // ─── Rule 1: SQL Injection Detection ─────────────────────────────
  for (const line of lines) {
    const urlLower = line.url.toLowerCase()
    const isSqli = SQL_INJECTION_PATTERNS.some(pattern =>
      urlLower.includes(pattern)
    )

    if (isSqli) {
      threats.push({
        logFileId,
        userId,
        threatType: 'sql_injection',
        ipAddress: line.ip,
        timestamp: line.timestamp,
        rawLog: line.rawLog,
        severity: 'high'
      })
    }
  }

  // ─── Rule 2: Brute Force Detection ───────────────────────────────
  const failedLoginMap = new Map<string, number>()

  for (const line of lines) {
    const isFailedLogin =
      (line.url.includes('/login') ||
        line.url.includes('/admin') ||
        line.url.includes('/auth')) &&
      (line.statusCode === 401 || line.statusCode === 403)

    if (isFailedLogin) {
      const current = failedLoginMap.get(line.ip) || 0
      failedLoginMap.set(line.ip, current + 1)
    }
  }

  for (const [ip, count] of failedLoginMap.entries()) {
    if (count >= BRUTE_FORCE_THRESHOLD) {
      const lastAttempt = lines.findLast(
        l =>
          l.ip === ip &&
          (l.url.includes('/login') ||
            l.url.includes('/admin') ||
            l.url.includes('/auth'))
      )

      threats.push({
        logFileId,
        userId,
        threatType: 'brute_force',
        ipAddress: ip,
        timestamp: lastAttempt?.timestamp || '',
        rawLog: `${count} failed login attempts from ${ip}`,
        severity: count >= 10 ? 'high' : 'medium'
      })
    }
  }

  // ─── Rule 3: 404 Flood Detection ─────────────────────────────────
  const floodMap = new Map<string, number>()

  for (const line of lines) {
    if (line.statusCode === 404) {
      const current = floodMap.get(line.ip) || 0
      floodMap.set(line.ip, current + 1)
    }
  }

  for (const [ip, count] of floodMap.entries()) {
    if (count >= FLOOD_404_THRESHOLD) {
      threats.push({
        logFileId,
        userId,
        threatType: 'flood_404',
        ipAddress: ip,
        timestamp: '',
        rawLog: `${count} 404 requests from ${ip}`,
        severity: count >= 20 ? 'high' : 'medium'
      })
    }
  }

  return threats
}