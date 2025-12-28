import express from 'express'
import authRoutes from './routes/auth.js'
import athletesRoutes from './routes/athletes.js'
import usersRoutes from './routes/users.js'
import emailsRoutes from './routes/emails.js'
import gmailRoutes from "./routes/gmail.js";
import auxiliarRoutes from "./routes/auxiliars.js";
import recordsRoutes from "./routes/records.js";
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/athletes', athletesRoutes)
app.use('/users', usersRoutes)
app.use('/emails', emailsRoutes)
app.use('/records', recordsRoutes)
app.use('/gmail', gmailRoutes)
app.use('/aux', auxiliarRoutes)

app.listen(3000, () => {
  console.log('API running on http://localhost:3000')
})
