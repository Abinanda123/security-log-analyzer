import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.tsx'
import { getDashboardStats, logoutUser } from '../services/api.ts'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'

interface Stats {
  totalLogFiles: number
  totalThreats: number
  threatsByType: { threatType: string; count: number }[]
  topAttackingIps: { ipAddress: string; count: number }[]
}

const COLORS = ['#ef4444', '#f97316', '#eab308']

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const { userEmail, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats()
      if (data.data) setStats(data.data)
      setLoading(false)
    }
    fetchStats()
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    logout()
    navigate('/auth')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-blue-400 text-xl">Loading dashboard...</div>
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
          <button
            onClick={() => navigate('/')}
            className="text-blue-400 font-medium"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/logs')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Logs
          </button>
          <button
            onClick={() => navigate('/threats')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Threats
          </button>
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-700">
            <span className="text-gray-400 text-sm">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Page Title */}
        <h1 className="text-2xl font-bold mb-6">Overview</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total Log Files</p>
            <p className="text-4xl font-bold text-blue-400">{stats?.totalLogFiles}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total Threats Found</p>
            <p className="text-4xl font-bold text-red-400">{stats?.totalThreats}</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 mb-8">

          {/* Threats by Type - Bar Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Threats by Type</h2>
            {stats?.threatsByType.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.threatsByType}>
                  <XAxis
                    dataKey="threatType"
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    tickFormatter={v => v.replace('_', ' ')}
                  />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
                    labelStyle={{ color: '#f9fafb' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-sm">No threats detected yet</p>
            )}
          </div>

          {/* Top Attacking IPs - Pie Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Top Attacking IPs</h2>
            {stats?.topAttackingIps.length ? (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={stats.topAttackingIps}
                      dataKey="count"
                      nameKey="ipAddress"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                    >
                      {stats.topAttackingIps.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-1">
                  {stats.topAttackingIps.map((ip, index) => (
                    <div key={ip.ipAddress} className="flex items-center gap-2 text-sm">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-gray-300">{ip.ipAddress}</span>
                      <span className="text-gray-500 ml-auto">{ip.count} threats</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">No attacking IPs detected yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/logs')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Upload Log File
            </button>
            <button
              onClick={() => navigate('/threats')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              View All Threats
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}