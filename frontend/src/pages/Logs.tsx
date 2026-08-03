import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLogs, uploadLogFile, deleteLog } from '../services/api.ts'

interface LogFile {
  id: string
  filename: string
  status: string
  total_lines: number
  parsed_lines: number
  uploaded_at: string
  threats: { count: number }[]
}

export default function Logs() {
  const [logs, setLogs] = useState<LogFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null) // Track which file is being deleted
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchLogs = async () => {
    try {
      const data = await getLogs()
      if (data.data) setLogs(data.data)
    } catch (err) {
      setError('Failed to fetch logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const data = await uploadLogFile(file)

      if (data.error) {
        setError(data.error)
      } else {
        await fetchLogs()
      }
    } catch (err) {
      setError('Failed to upload file')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  // ─── Enhanced Delete Handler ──────────────────────────────────────────────

  const handleDelete = async (id: string, filename: string) => {
    // 1. Show confirmation dialog
    if (!confirm(`Delete "${filename}" and all its threats?`)) return

    // 2. Set loading state for this specific row
    setDeletingId(id)
    setDeleteError(null)

    try {
      // 3. Call the delete API
      const response = await deleteLog(id)
      
      // 4. Check for errors in response
      if (response.error) {
        setDeleteError(`Failed to delete: ${response.error}`)
        return
      }

      // 5. Refresh the logs list
      await fetchLogs()
      
      // 6. Show success feedback (optional - could use a toast notification)
      console.log(`Successfully deleted ${filename}`)

    } catch (err) {
      // 7. Handle network or other errors
      setDeleteError('Failed to delete log file. Please try again.')
      console.error('Delete error:', err)
    } finally {
      // 8. Clear loading state
      setDeletingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    if (status === 'complete') return 'text-green-400'
    if (status === 'processing') return 'text-yellow-400'
    if (status === 'failed') return 'text-red-400'
    return 'text-gray-400'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-blue-400 text-xl">Loading logs...</div>
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
          <button onClick={() => navigate('/logs')} className="text-blue-400 font-medium">Logs</button>
          <button onClick={() => navigate('/threats')} className="text-gray-400 hover:text-white transition-colors">Threats</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Log Files</h1>

          {/* Upload Button */}
          <label className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {uploading ? 'Analyzing...' : '+ Upload Log File'}
            <input
              type="file"
              accept=".log,.txt,.csv"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {deleteError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 mb-4 text-sm">
            {deleteError}
          </div>
        )}

        {logs.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <div className="text-5xl mb-4">📁</div>
            <p className="text-gray-400 text-lg mb-2">No log files uploaded yet</p>
            <p className="text-gray-600 text-sm">Upload a .log, .txt, or .csv file to start analyzing threats</p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            {/* Table - Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Filename</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Status</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Lines</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Threats</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Uploaded</th>
                    <th className="text-left px-6 py-4 text-gray-400 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr
                      key={log.id}
                      className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${index === logs.length - 1 ? 'border-0' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-white font-medium">{log.filename}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">{log.total_lines}</td>
                      <td className="px-6 py-4">
                        <span className="bg-red-500/10 text-red-400 text-sm px-2 py-1 rounded">
                          {log.threats?.[0]?.count ?? 0} threats
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {formatDate(log.uploaded_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/threats?logFileId=${log.id}`)}
                            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                          >
                            View Threats
                          </button>
                          <button
                            onClick={() => handleDelete(log.id, log.filename)}
                            disabled={deletingId === log.id}
                            className={`text-red-400 hover:text-red-300 text-sm transition-colors ml-2 ${
                              deletingId === log.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {deletingId === log.id ? (
                              <span className="flex items-center gap-1">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Deleting...
                              </span>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card View - Mobile/Tablet */}
            <div className="md:hidden divide-y divide-gray-800">
              {logs.map((log) => (
                <div key={log.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-white">{log.filename}</div>
                      <div className="text-sm text-gray-400">{formatDate(log.uploaded_at)}</div>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(log.status)}`}>
                      {log.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">Lines: <span className="text-gray-300">{log.total_lines}</span></span>
                    <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded">
                      {log.threats?.[0]?.count ?? 0} threats
                    </span>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => navigate(`/threats?logFileId=${log.id}`)}
                      className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      View Threats
                    </button>
                    <button
                      onClick={() => handleDelete(log.id, log.filename)}
                      disabled={deletingId === log.id}
                      className={`text-red-400 hover:text-red-300 text-sm transition-colors ${
                        deletingId === log.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {deletingId === log.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}