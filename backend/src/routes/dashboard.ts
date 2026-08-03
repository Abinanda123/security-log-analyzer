import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware.js'
import { supabase } from '../supabase.js'

const router = Router()

// GET /api/dashboard/stats
router.get('/stats', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!

  // Total log files
  const { count: totalLogFiles } = await supabase
    .from('log_files')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Total threats
  const { count: totalThreats } = await supabase
    .from('threats')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  // Threats by type
  const { data: threatsByType } = await supabase
    .from('threats')
    .select('threat_type')
    .eq('user_id', userId)

  // Top attacking IPs
  const { data: allThreats } = await supabase
    .from('threats')
    .select('ip_address')
    .eq('user_id', userId)

  // Count threats by type
  const typeCount: Record<string, number> = {}
  for (const t of threatsByType || []) {
    typeCount[t.threat_type] = (typeCount[t.threat_type] || 0) + 1
  }

  // Count by IP
  const ipCount: Record<string, number> = {}
  for (const t of allThreats || []) {
    ipCount[t.ip_address] = (ipCount[t.ip_address] || 0) + 1
  }

  // Sort and take top 5 IPs
  const topAttackingIps = Object.entries(ipCount)
    .map(([ipAddress, count]) => ({ ipAddress, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Threats by type array for Recharts
  const threatsByTypeArray = Object.entries(typeCount).map(
    ([threatType, count]) => ({ threatType, count })
  )

  res.json({
    data: {
      totalLogFiles: totalLogFiles || 0,
      totalThreats: totalThreats || 0,
      threatsByType: threatsByTypeArray,
      topAttackingIps
    }
  })
})

export default router