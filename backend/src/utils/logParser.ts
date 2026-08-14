import {LogLine} from '../types/index.js'

// Apache/Nginx Combined Log Format:
// 192.168.1.1 - - [27/Jul/2026:14:23:01 +0000] "GET /index.html HTTP/1.1" 200 512

const LOG_REGEX = /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"(\S+)\s+([^"]+)\s+HTTP\/[\d.]+"\s+(\d+)/

export const parseLogLine = (line: string): LogLine | null => {
    const match = line.match(LOG_REGEX)

    if(!match)return null

    return {
        ip: match[1],
        timestamp: match[2],
        method: match[3],
        url: match[4],
        statusCode: parseInt(match[5], 10),
        rawLog: line.trim()
    }
 }

    export const parseLogFile = (content: string): LogLine[] => {
        const lines = content.split('\n')

        const parsed =lines
        .map(line => parseLogLine(line.trim()))
        .filter((line): line is LogLine => line !== null)

        return parsed
    }


