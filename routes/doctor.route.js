import express from 'express'
import { deletedDoctor, getAllDoctors, getDoctorProfile, getSingleDoctor, updateDoctor } from '../controllers/doctorController.js'

import { authenticate, restricte } from '../auth/verfiyAuthentication.js'

import reviewRouter from './review.route.js'

const router = express.Router()

router.use('/:doctorId/review', reviewRouter)

router.get('/:id', getSingleDoctor)
router.get('/', getAllDoctors)
router.put('/:id', authenticate, restricte(["doctor"]), updateDoctor)
router.delete('/:id', authenticate, restricte(["doctor"]), deletedDoctor)
router.get('/profile/me', authenticate, restricte(['doctor']), getDoctorProfile)

export default router