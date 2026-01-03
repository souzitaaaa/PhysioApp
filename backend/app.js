import express from 'express'
import authRoutes from './routes/auth.js'
import athletesRoutes from './routes/athletes.js'
import usersRoutes from './routes/users.js'
import emailsRoutes from './routes/emails.js'
import gmailRoutes from "./routes/gmail.js"
import auxiliarRoutes from "./routes/auxiliars.js"
import recordsRoutes from "./routes/records.js"
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cookieParser())

// Debug middleware
app.use((req, res, next) => {
  const now = new Date()
  const timestamp = now.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  console.log(`[${timestamp}] 📥 Request:`, req.method, req.url)
  console.log(`[${timestamp}] 🍪 Cookies:`, {
    access_token: req.cookies.access_token ? 'present' : 'missing',
    refresh_token: req.cookies.refresh_token ? 'present' : 'missing'
  })
  next()
})


const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// Body parsers
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use('/auth', authRoutes)
app.use('/athletes', athletesRoutes)
app.use('/users', usersRoutes)
app.use('/emails', emailsRoutes)
app.use('/records', recordsRoutes)
app.use('/gmail', gmailRoutes)
app.use('/aux', auxiliarRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ [Error]', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    code: err.code || 'SERVER_ERROR'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`)
})