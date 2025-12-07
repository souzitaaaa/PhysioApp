import express from 'express'
import { auth, oauthCallback, getLabels, getEmails } from '../controllers/gmailController.js'

const router = express.Router()

router.get('/auth', auth)
router.get('/oauth2callback', oauthCallback)
router.get('/labels', getLabels)
router.get('/emails', getEmails)

export default router