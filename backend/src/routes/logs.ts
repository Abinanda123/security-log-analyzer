import { Router, Response } from 'express'
import multer from 'multer'
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware.js'
import { supabase } from '../supabase.js'
import { parseLogFile } from '../utils/logParser.js'
import { runRuleEngine } from '../utils/ruleEngine.js'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['.log', '.txt', '.csv']
    const ext = '.' + file.originalname.split('.').pop()?.toLowerCase()
    if (allowed.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error('Only .log, .txt, and .csv files are allowed'))
    }
  }
})

// POST /api/logs/upload
router.post(
  '/upload',
  authMiddleware,
  upload.single('logfile'),
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

    const content = req.file.buffer.toString('utf-8')
    const filename = req.file.originalname
    const userId = req.userId!

    // Save log file record to Supabase
    const { data: logFile, error: logFileError } = await supabase
      .from('log_files')
      .insert({
        user_id: userId,
        filename,
        status: 'processing'
      })
      .select()
      .single()

if (logFileError || !logFile) {
  console.error('Supabase error:', logFileError)
  res.status(500).json({ error: 'Failed to save log file record' })
  return
}

    // Parse the log file
    const parsedLines = parseLogFile(content)

    // Run rule engine
    const threats = runRuleEngine(parsedLines, logFile.id, userId)

    // Save threats to Supabase
    if (threats.length > 0) {
      const { error: threatError } = await supabase
        .from('threats')
        .insert(
          threats.map(t => ({
            log_file_id: t.logFileId,
            user_id: t.userId,
            threat_type: t.threatType,
            ip_address: t.ipAddress,
            timestamp: null,
            raw_log: t.rawLog,
            severity: t.severity
          }))
        )

      if (threatError) {
        console.error('Failed to save threats:', threatError.message)
      }
    }

    // Update log file status to complete
    await supabase
      .from('log_files')
      .update({
        status: 'complete',
        total_lines: parsedLines.length,
        parsed_lines: parsedLines.length
      })
      .eq('id', logFile.id)

    res.status(201).json({
      message: 'Log file uploaded and analyzed successfully',
      logFileId: logFile.id,
      totalLines: parsedLines.length,
      threatsFound: threats.length
    })
  }
)

// GET /api/logs
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { data, error } = await supabase
    .from('log_files')
    .select('*, threats(count)')
    .eq('user_id', req.userId!)
    .order('uploaded_at', { ascending: false })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json({ data })
})

// DELETE /api/logs/:id
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { id } = req.params

  // Make sure this log file belongs to this user
  const { data: logFile } = await supabase
    .from('log_files')
    .select('id')
    .eq('id', id)
    .eq('user_id', req.userId!)
    .single()

  if (!logFile) {
    res.status(404).json({ error: 'Log file not found' })
    return
  }

  const { error } = await supabase
    .from('log_files')
    .delete()
    .eq('id', id)

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json({ message: 'Log file deleted successfully' })
})

export default router