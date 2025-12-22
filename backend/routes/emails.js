import express from 'express'
import { getAllEmails, getEmailByID, getEmailErrorCount } from "../controllers/emailsController.js"

const router = express.Router()

router.get('/error_count', getEmailErrorCount)
router.get('/', getAllEmails)
router.get('/:id', getEmailByID)

export default router