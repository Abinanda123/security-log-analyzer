import { parseLogLine, parseLogFile } from '../utils/logParser.js'

describe('parseLogLine', () => {
  test('parses a valid Apache log line correctly', () => {
    const line = '192.168.1.1 - - [27/Jul/2026:14:23:01 +0000] "GET /index.html HTTP/1.1" 200 512'
    const result = parseLogLine(line)

    expect(result).not.toBeNull()
    expect(result?.ip).toBe('192.168.1.1')
    expect(result?.method).toBe('GET')
    expect(result?.url).toBe('/index.html')
    expect(result?.statusCode).toBe(200)
    expect(result?.timestamp).toBe('27/Jul/2026:14:23:01 +0000')
  })

  test('returns null for invalid log line', () => {
    const result = parseLogLine('this is not a valid log line')
    expect(result).toBeNull()
  })

  test('returns null for empty string', () => {
    const result = parseLogLine('')
    expect(result).toBeNull()
  })

  test('parses log line with query string in URL', () => {
    const line = "192.168.1.2 - - [27/Jul/2026:14:23:06 +0000] \"GET /index.php?id=1' or '1'='1 HTTP/1.1\" 200 512"
    const result = parseLogLine(line)

    expect(result).not.toBeNull()
    expect(result?.ip).toBe('192.168.1.2')
    expect(result?.url).toContain('/index.php')
    expect(result?.statusCode).toBe(200)
  })

  test('parses 404 status code correctly', () => {
    const line = '192.168.1.3 - - [27/Jul/2026:14:23:07 +0000] "GET /missing HTTP/1.1" 404 512'
    const result = parseLogLine(line)

    expect(result?.statusCode).toBe(404)
  })
})

describe('parseLogFile', () => {
  test('parses multiple lines and skips invalid ones', () => {
    const content = `192.168.1.1 - - [27/Jul/2026:14:23:01 +0000] "GET /index.html HTTP/1.1" 200 512
this is an invalid line
192.168.1.2 - - [27/Jul/2026:14:23:02 +0000] "POST /login HTTP/1.1" 401 512`

    const result = parseLogFile(content)
    expect(result).toHaveLength(2)
  })

  test('returns empty array for empty content', () => {
    const result = parseLogFile('')
    expect(result).toHaveLength(0)
  })
})