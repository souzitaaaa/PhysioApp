import express from 'express'
import athletesRoutes from './routes/athletes.js'
import usersRoutes from './routes/users.js'
import emailsRoutes from './routes/emails.js'
import gmailRoutes from "./routes/gmail.js";
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/athletes', athletesRoutes)
app.use('/users', usersRoutes)
app.use('/emails', emailsRoutes)
app.use('/gmail', gmailRoutes)

app.listen(3000, () => {
  console.log('API running on http://localhost:3000')
})
