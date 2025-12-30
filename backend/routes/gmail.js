import express from 'express'
import { requireAuth } from '../controllers/authController.js'
import { auth, oauthCallback, getLabels, getEmails } from '../controllers/gmailController.js'

const router = express.Router()

router.get('/auth', requireAuth, auth)
router.get('/oauth2callback', oauthCallback)
router.get('/labels', requireAuth, getLabels)
router.get('/emails', requireAuth, getEmails)

export default router