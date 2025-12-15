import express from 'express'
import { getDivisions, getRelations } from "../controllers/auxiliarsController.js"

const router = express.Router()

// GET
router.get('/divisions', getDivisions)
router.get('/relations', getRelations)
// router.get('/status', getAthleteAccountables)
// router.get('/userType', getAthleteAccountables)
// router.get('/errorSpec', getAthleteAccountables)

export default router