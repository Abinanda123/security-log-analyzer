import express, { Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { supabase } from './supabase.js'
import authRouter from './routes/auth.js'
import logsRouter from './routes/logs.js'
import threatsRouter from './routes/threats.js'
import dashboardRouter from './routes/dashboard.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/logs', logsRouter)
app.use('/api/threats', threatsRouter)
app.use('/api/dashboard', dashboardRouter)

app.get('/', async (req, res) => {
  const { data, error } = await supabase.from('log_files').select('*').limit(1)
  if (error) {
    res.status(500).json({ error: error.message })
    return
  }
  res.json({ message: 'Supabase connection successful', data })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})