import express from 'express'
import { deletedUser, getAllUsers, getMyAppointments, getSingleUser, getUserProfile, updateUser } from '../controllers/userControlloer.js'
import { authenticate, restricte } from '../auth/verfiyAuthentication.js'

const router = express.Router()

router.get('/:id', authenticate, restricte(["patient"]), getSingleUser)
router.get('/', authenticate, restricte(["admin"]), getAllUsers)
router.put('/:id', authenticate, restricte(["patient"]), updateUser)
router.delete('/:id', authenticate, restricte(["patient"]), deletedUser)
router.get('/profile/me', authenticate, restricte(["patient"]), getUserProfile)
router.get('/appointments/my-appointments', authenticate, restricte(["patient"]), getMyAppointments)


export default router