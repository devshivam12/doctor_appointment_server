import express from 'express'
import { createReview, getReview } from '../controllers/reviewController.js'
import { authenticate, restricte } from '../auth/verfiyAuthentication.js'

const router = express.Router({ mergeParams: true })

router.route("/").get(getReview).post(authenticate, restricte(["patient"]), createReview)


export default router