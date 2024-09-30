import express from 'express'
import { register, login, logout } from '../controllers/authController.js'
import { loginValidator, registerValidator, validateHandler } from '../lib/validator.js'
import {isAuthentication} from '../middleware/auth.js' 
const router = express.Router()

router.post('/register', registerValidator(), validateHandler, register)
router.post('/login', loginValidator(), validateHandler, login)
router.post('/logout', logout)
router.get('/checkauth', isAuthentication, (req,res) => {
    const user = req.user
    console.log("user", user)
    res.status(200).json({
        success : true,
        message : "User Authenticated !!",
        user
    })
})
export default router