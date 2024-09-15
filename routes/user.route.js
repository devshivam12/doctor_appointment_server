import express from 'express'
import { deletedUser, getAllUsers, getMyAppointments, getSingleUser, getUserProfile, updateUser } from '../controllers/userControlloer.js'
import { isAuthentication, restricte } from '../middleware/auth.js'

const router = express.Router()

router.use(isAuthentication)

router.get('/', restricte(["admin"]), getAllUsers)
router.put('/:id', restricte(["patient"]), updateUser)
router.delete('/:id', restricte(["patient"]), deletedUser)
router.get('/profile/me', restricte(["patient"]), getUserProfile)
router.get('/appointments/my-appointments', restricte(["patient"]), getMyAppointments)
router.get('/:id', restricte(["patient"]), getSingleUser)


export default router