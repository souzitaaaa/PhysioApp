import express from 'express'
import { getAllEmails, getEmailByID, getEmailErrorCount, updateEmail, deleteEmail } from "../controllers/emailsController.js"

const router = express.Router()

// GET
router.get('/error_count', getEmailErrorCount)
router.get('/', getAllEmails)
router.get('/:id', getEmailByID)

// POST

// UPDATE
router.put('/:id', updateEmail)

// DELETE
router.delete('/:id', deleteEmail)

export default router