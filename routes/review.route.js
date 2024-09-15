import express from 'express'
import { createReview, getReview } from '../controllers/reviewController.js'
import { isAuthentication, restricte } from '../middleware/auth.js'

const router = express.Router({ mergeParams: true })

router.use(isAuthentication)

router.route("/").get(getReview).post(restricte(["patient"]), createReview)


export default router