//  Log parsing
export interface LogLine {
    ip: string, 
    timestamp: string,
    method: string,
    url: string,
    statusCode: number,
    rawLog: string
}

// Threats

export interface Threat {
    logFileId: string,
    userId: string,
    threatType: 'brute_force' | 'sql_injection' | 'flood_404'
    ipAddress: string,
    timestamp: string,
    rawLog: string,
    severity: 'low' | 'medium' | 'high'
}

// Dashboard stats

export interface ThreatStats {
    threatType: string,
    count: number
}

export interface IpStat {
    ipAddress: string,
    count: number
}

export interface DashboardStats {
    totalLogFiles: number,
    totalThreats: number,
    threatsByType: ThreatStats[],
    topAttackIps: IpStat[]
}

// API Responses 

export interface ApiResponse<T> {
    message: string,
    data?: T,
    error?: string
}