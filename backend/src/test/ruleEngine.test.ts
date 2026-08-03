import { runRuleEngine } from '../utils/ruleEngine.js'
import { parseLogFile } from '../utils/logParser.js'

const makeLoginAttempts = (ip: string, count: number, statusCode = 401): string => {
  return Array.from({ length: count }, (_, i) =>
    `${ip} - - [27/Jul/2026:14:23:0${i} +0000] "GET /login HTTP/1.1" ${statusCode} 512`
  ).join('\n')
}

const make404s = (ip: string, count: number): string => {
  return Array.from({ length: count }, (_, i) =>
    `${ip} - - [27/Jul/2026:14:23:0${i} +0000] "GET /page${i} HTTP/1.1" 404 512`
  ).join('\n')
}

describe('runRuleEngine', () => {
  test('detects brute force after 5 failed logins from same IP', () => {
    const logs = parseLogFile(makeLoginAttempts('10.0.0.1', 5))
    const threats = runRuleEngine(logs, 'log-id', 'user-id')

    const bruteForce = threats.find(t => t.threatType === 'brute_force')
    expect(bruteForce).toBeDefined()
    expect(bruteForce?.ipAddress).toBe('10.0.0.1')
    expect(bruteForce?.severity).toBe('medium')
  })

  test('does not flag brute force under threshold', () => {
    const logs = parseLogFile(makeLoginAttempts('10.0.0.2', 4))
    const threats = runRuleEngine(logs, 'log-id', 'user-id')

    const bruteForce = threats.find(t => t.threatType === 'brute_force')
    expect(bruteForce).toBeUndefined()
  })

  test('detects SQL injection from URL', () => {
    const line = "192.168.1.1 - - [27/Jul/2026:14:23:01 +0000] \"GET /page?id=1' or '1'='1 HTTP/1.1\" 200 512"
    const logs = parseLogFile(line)
    const threats = runRuleEngine(logs, 'log-id', 'user-id')

    const sqli = threats.find(t => t.threatType === 'sql_injection')
    expect(sqli).toBeDefined()
    expect(sqli?.severity).toBe('high')
  })

  test('detects 404 flood after 10 requests from same IP', () => {
    const logs = parseLogFile(make404s('10.0.0.3', 10))
    const threats = runRuleEngine(logs, 'log-id', 'user-id')

    const flood = threats.find(t => t.threatType === 'flood_404')
    expect(flood).toBeDefined()
    expect(flood?.ipAddress).toBe('10.0.0.3')
  })

  test('does not flag 404 flood under threshold', () => {
    const logs = parseLogFile(make404s('10.0.0.4', 9))
    const threats = runRuleEngine(logs, 'log-id', 'user-id')

    const flood = threats.find(t => t.threatType === 'flood_404')
    expect(flood).toBeUndefined()
  })

  test('returns empty array for clean logs', () => {
    const content = `192.168.1.1 - - [27/Jul/2026:14:23:01 +0000] "GET /index.html HTTP/1.1" 200 512
192.168.1.2 - - [27/Jul/2026:14:23:02 +0000] "GET /about.html HTTP/1.1" 200 512`
    const logs = parseLogFile(content)
    const threats = runRuleEngine(logs, 'log-id', 'user-id')

    expect(threats).toHaveLength(0)
  })
})