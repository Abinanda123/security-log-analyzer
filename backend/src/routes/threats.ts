import { Router, Response } from 'express'
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware.js'
import { supabase } from '../supabase.js'
import { analyzeThreat } from '../utils/aiAnalyzer.js'

const router = Router()

// GET /api/threats
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { data, error } = await supabase
    .from('threats')
    .select('*')
    .eq('user_id', req.userId!)
    .order('detected_at', { ascending: false })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json({ data })
})

// GET /api/threats/:logFileId
router.get('/log/:logFileId', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { logFileId } = req.params

  const { data, error } = await supabase
    .from('threats')
    .select('*')
    .eq('log_file_id', logFileId)
    .eq('user_id', req.userId!)
    .order('detected_at', { ascending: false })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json({ data })
})

// POST /api/threats/:id/analyze
router.post('/:id/analyze', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  // Get the threat
  const { data: threat, error: fetchError } = await supabase
    .from('threats')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.userId!)
    .single()

  if (fetchError || !threat) {
    res.status(404).json({ error: 'Threat not found' })
    return
  }

  // Send to Groq
  const analysis = await analyzeThreat(
    threat.threat_type,
    threat.raw_log,
    threat.ip_address
  )

  // Save AI explanation back to Supabase
  const { error: updateError } = await supabase
    .from('threats')
    .update({ ai_explanation: analysis.explanation, severity: analysis.severity })
    .eq('id', id)

  if (updateError) {
    res.status(500).json({ error: 'Failed to save AI analysis' })
    return
  }

  res.json({
    message: 'Threat analyzed successfully',
    analysis
  })
})

export default router