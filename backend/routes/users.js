import express from 'express'
import { getAllUsers, getUserByID, deleteUser } from "../controllers/usersController.js"

const router = express.Router()

// GET
router.get('/', getAllUsers)
router.get('/:id', getUserByID)

// DELETE
router.delete('/:id', deleteUser)

export default router