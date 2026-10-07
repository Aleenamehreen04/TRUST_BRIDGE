import 'dotenv/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import rateLimit from 'express-rate-limit'
import { analyzeRequest } from './analyze.js'

const IDENTITIES = ['Manager', 'Friend', 'Family member', 'Company', 'Other']
const CHANNELS = ['WhatsApp', 'SMS', 'Email', 'Phone', 'Other']
const MAX_LEN = 3000

export const app = express()
app.set('trust proxy', 1)
app.use(express.json({ limit: '20kb' }))
app.use('/api', rateLimit({ windowMs: 60_000, max: 15, message: { error: 'Too many requests. Please wait a minute and try again.' } }))

app.post('/api/analyze', async (req, res) => {
  const { message, claimedIdentity = '', channel = '' } = req.body || {}
  if (typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: 'Please paste or describe the suspicious request first.' })
  if (message.length > MAX_LEN) return res.status(400).json({ error: `Please keep the request under ${MAX_LEN} characters.` })
  if ((claimedIdentity && !IDENTITIES.includes(claimedIdentity)) || (channel && !CHANNELS.includes(channel)))
    return res.status(400).json({ error: 'Invalid context option.' })
  if (!process.env.LLM_API_KEY) return res.status(503).json({ error: "We couldn't analyze this request right now. Please try again." })

  try {
    res.json(await analyzeRequest({ message: message.trim(), claimedIdentity, channel }))
  } catch (e) {
    console.error('analyze failed:', e.message)
    res.status(502).json({ error: "We couldn't analyze this request right now. Please try again." })
  }
})

// In production this same server also serves the built React app.
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../client/dist')
app.use(express.static(dist))
app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')))

app.use((err, req, res, next) => res.status(400).json({ error: 'Invalid request.' }))

if (process.argv[1].endsWith('index.js')) {
  app.listen(process.env.PORT || 3001, () => console.log('TrustBridge server running on port', process.env.PORT || 3001))
}