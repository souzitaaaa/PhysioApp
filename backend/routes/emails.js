import express from 'express'
import { getAllEmails, getEmailByID } from "../controllers/emailsController.js"

const router = express.Router()

router.get('/', getAllEmails)
router.get('/:id', getEmailByID)

export default router