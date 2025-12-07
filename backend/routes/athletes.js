import express from 'express'
import { getAllAthletes, getAthleteByID } from "../controllers/athletesController.js"

const router = express.Router()

router.get('/', getAllAthletes)
router.get('/:id', getAthleteByID)

export default router