import express from 'express'
import { requireAuth } from '../middleware/authMiddleware.js'
import { auth, oauthCallback, getLabels, getEmails } from '../controllers/gmailController.js'

const router = express.Router()

// GET | Public
router.get('/oauth2callback', oauthCallback)

// GET | Protected
router.get('/auth', requireAuth, auth)
router.get('/labels', requireAuth, getLabels)
router.get('/emails', requireAuth, getEmails)

export default router