import express from 'express'
import { getAllRecords, getRecordByID } from "../controllers/injuriesController.js"

const router = express.Router()

router.get('/', getAllRecords)
router.get('/:id', getRecordByID)

export default router