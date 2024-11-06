import express from 'express'
import { addMultipleDoctor, deletedDoctor, getAllDoctors, getDoctorProfile, getSingleDoctor, updateDoctor, createDoctor } from '../controllers/doctorController.js'

import { isAuthentication, restricte } from '../middleware/auth.js'

import reviewRouter from './review.route.js'

const router = express.Router()

router.post('/load-testing', addMultipleDoctor)

router.use('/:doctorId/review', reviewRouter)

router.get('/', getAllDoctors)

router.use(isAuthentication)

router.get('/:id', getSingleDoctor)
router.put('/:id', restricte(["doctor"]), updateDoctor)
router.post('/create-doctor', restricte(["doctor"]), createDoctor)
router.delete('/:id', restricte(["doctor"]), deletedDoctor)
router.get('/profile/me', restricte(['doctor']), getDoctorProfile)

export default router