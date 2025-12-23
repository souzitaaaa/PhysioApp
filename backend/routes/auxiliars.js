import express from 'express'
import { getDivisions, getRelations, getUserType, getAthletesStatistics, getAthleteInjurySummary, getAthleteStatsSummary, getInjuriesByMonth } from "../controllers/auxiliarsController.js"

const router = express.Router()

// GET
router.get('/divisions', getDivisions)
router.get('/relations', getRelations)
router.get('/userType', getUserType)
router.get('/stats/athletes/statistics', getAthletesStatistics)
router.get('/stats/athleteInjurySummary', getAthleteInjurySummary)
router.get('/stats/athleteSummary', getAthleteStatsSummary)
router.get('/stats/injuriesByMonth', getInjuriesByMonth)
// router.get('/status', getAthleteAccountables)
// router.get('/userType', getAthleteAccountables)
// router.get('/errorSpec', getAthleteAccountables)

export default router