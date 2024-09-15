import express from 'express'
import { deletedDoctor, getAllDoctors, getDoctorProfile, getSingleDoctor, updateDoctor } from '../controllers/doctorController.js'

import {  isAuthentication, restricte } from '../middleware/auth.js'

import reviewRouter from './review.route.js'

const router = express.Router()

router.use('/:doctorId/review', reviewRouter)

router.get('/:id', getSingleDoctor)
router.get('/', getAllDoctors)

router.use(isAuthentication)

router.put('/:id', restricte(["doctor"]), updateDoctor)
router.delete('/:id', restricte(["doctor"]), deletedDoctor)
router.get('/profile/me', restricte(['doctor']), getDoctorProfile)

export default router