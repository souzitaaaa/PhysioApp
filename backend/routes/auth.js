import express from 'express'
import { me, login, logout } from "../controllers/authController.js"

const router = express.Router()

// GET
router.get('/me', me)

// POST
router.post('/login', login)
router.post('/logout', logout)

// UPDATE

// DELETE

export default router