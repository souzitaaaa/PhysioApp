import express from 'express'
import { getAllAthletes, getAthleteByID, getAthleteAccountables, createAthleteAccountables } from "../controllers/athletesController.js"

const router = express.Router()

// GET
router.get('/', getAllAthletes)
router.get('/:id', getAthleteByID)
router.get('/:id/accountables', getAthleteAccountables)

// POST
//router.post('/', createAthlete)
router.post('/:id/accountables', createAthleteAccountables)

export default router