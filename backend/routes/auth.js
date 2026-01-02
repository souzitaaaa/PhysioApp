import express from 'express'
import { me, loginWeb, loginMobile, logout, refresh } from "../controllers/authController.js"
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router()

// GET | Public


// GET | Protected
router.get('/me', requireAuth, me)

// POST | Public
router.post('/login/web', loginWeb)
router.post('/login/mobile', loginMobile)
router.post('/refresh', refresh)

// POST | Protected
router.post('/logout', requireAuth, logout)

// UPDATE

// DELETE

export default router