import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getThreats, getThreatsByLog, analyzeThreat } from '../services/api.ts'

interface Threat {
  id: string
  threat_type: string
  ip_address: string
  raw_log: string
  severity: string
  ai_explanation: string | null
  detected_at: string
  log_file_id: string
}

export default function Threats() {
  const [threats, setThreats] = useState<Threat[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const logFileId = searchParams.get('logFileId')

  const fetchThreats = async () => {
    const data = logFileId
      ? await getThreatsByLog(logFileId)
      : await getThreats()
    if (data.data) setThreats(data.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchThreats()
  }, [logFileId])

  const handleAnalyze = async (id: string) => {
    setAnalyzingId(id)
    const data = await analyzeThreat(id)
    if (data.analysis) {
      setThreats(prev =>
        prev.map(t =>
          t.id === id
            ? { ...t, ai_explanation: data.analysis.explanation, severity: data.analysis.severity }
            : t
        )
      )
      setExpandedId(id)
    }
    setAnalyzingId(null)
  }

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'bg-red-500/10 text-red-400 border border-red-500/30'
    if (severity === 'medium') return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
    return 'bg-green-500/10 text-green-400 border border-green-500/30'
  }

  const getThreatIcon = (type: string) => {
    if (type === 'sql_injection') return '💉'
    if (type === 'brute_force') return '🔨'
    if (type === 'flood_404') return '🌊'
    return '⚠️'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-blue-400 text-xl">Loading threats...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛡️</span>
          <span className="text-xl font-bold">Security Log Analyzer</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">Dashboard</button>
          <button onClick={() => navigate('/logs')} className="text-gray-400 hover:text-white transition-colors">Logs</button>
          <button onClick={() => navigate('/threats')} className="text-blue-400 font-medium">Threats</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {logFileId ? 'Threats for Log File' : 'All Threats'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {threats.length} threat{threats.length !== 1 ? 's' : ''} detected
            </p>
          </div>
          {logFileId && (
            <button
              onClick={() => navigate('/threats')}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← View All Threats
            </button>
          )}
        </div>

        {threats.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-gray-400 text-lg mb-2">No threats detected</p>
            <p className="text-gray-600 text-sm">Upload a log file to start analyzing</p>
          </div>
        ) : (
          <div className="space-y-4">
            {threats.map(threat => (
              <div
                key={threat.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6"
              >
                {/* Threat Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getThreatIcon(threat.threat_type)}</span>
                    <div>
                      <h3 className="font-semibold text-white capitalize">
                        {threat.threat_type.replace('_', ' ')}
                      </h3>
                      <p className="text-gray-400 text-sm">IP: {threat.ip_address}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(threat.severity)}`}>
                    {threat.severity}
                  </span>
                </div>

                {/* Raw Log */}
                <div className="bg-gray-800 rounded-lg px-4 py-3 mb-4">
                  <p className="text-gray-400 text-xs mb-1">Raw Log</p>
                  <p className="text-green-400 text-sm font-mono break-all">{threat.raw_log}</p>
                </div>

                {/* AI Explanation */}
                {threat.ai_explanation && expandedId === threat.id && (
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3 mb-4">
                    <p className="text-blue-400 text-xs mb-1 font-medium">🤖 AI Analysis</p>
                    <p className="text-gray-300 text-sm">{threat.ai_explanation}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAnalyze(threat.id)}
                    disabled={analyzingId === threat.id}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    {analyzingId === threat.id ? 'Analyzing...' : '🤖 Analyze with AI'}
                  </button>
                  {threat.ai_explanation && (
                    <button
                      onClick={() => setExpandedId(expandedId === threat.id ? null : threat.id)}
                      className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      {expandedId === threat.id ? 'Hide Analysis' : 'Show Analysis'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}