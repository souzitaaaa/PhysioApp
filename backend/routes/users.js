import express from 'express'
import { getAllUsers, getUserByID, createUser, deleteUser } from "../controllers/usersController.js"

const router = express.Router()

// GET
router.get('/', getAllUsers)
router.get('/:id', getUserByID)

// POST
router.post('/', createUser)

// DELETE
router.delete('/:id', deleteUser)

export default router