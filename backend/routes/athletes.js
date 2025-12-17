import express from 'express'
import { getAllAthletes, getAthleteByID, getAthleteAccountables, getAthleteHistory, createAthleteAccountables, updateAccountable, deleteAthlete } from "../controllers/athletesController.js"

const router = express.Router()

// GET
router.get('/', getAllAthletes)
router.get('/:id', getAthleteByID)
router.get('/:id/accountables', getAthleteAccountables)
router.get('/:id/history', getAthleteHistory)

// POST
//router.post('/', createAthlete)
router.post('/:id/accountables', createAthleteAccountables)

// UPDATE
router.put('/:id/accountables/:accountableID', updateAccountable)

// DELETE
router.delete('/:id', deleteAthlete)

export default router