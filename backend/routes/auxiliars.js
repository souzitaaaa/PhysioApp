import express from 'express'
import { getDivisions, getRelations, getUserType, getCountry, getAthletesStatistics, getUsersStatistics,  getAthleteInjurySummary, getAthleteStatsSummary, getInjuriesByMonth } from "../controllers/auxiliarsController.js"

const router = express.Router()

// GET
router.get('/divisions', getDivisions)
router.get('/relations', getRelations)
router.get('/userType', getUserType)
router.get('/country', getCountry)
router.get('/stats/athletes/statistics', getAthletesStatistics)
router.get('/stats/users/statistics', getUsersStatistics)
router.get('/stats/athleteInjurySummary', getAthleteInjurySummary)
router.get('/stats/athleteSummary', getAthleteStatsSummary)
router.get('/stats/injuriesByMonth', getInjuriesByMonth)
// router.get('/status', getAthleteAccountables)
// router.get('/userType', getAthleteAccountables)
// router.get('/errorSpec', getAthleteAccountables)

export default router