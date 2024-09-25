import express from 'express'
import { register, login, logout } from '../controllers/authController.js'
import { loginValidator, registerValidator, validateHandler } from '../lib/validator.js'

const router = express.Router()

router.post('/register', registerValidator(), validateHandler, register)
router.post('/login', loginValidator(), validateHandler, login)
router.post('/logout', logout)

export default router