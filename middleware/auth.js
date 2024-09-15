import jwt, { decode } from 'jsonwebtoken'
import Doctor from '../models/DoctorSchema.js';
import User from '../models/UserSchema.js';
import {DOCTOR_TOKEN} from '../constant/config.js'
import { ErrorHandler } from '../utils/utility.js';
import { TryCatch } from './error.js';

export const isAuthentication = TryCatch((req, res, next) => {
   
    const token = req.cookies[DOCTOR_TOKEN]

    if (!token) {
        return next(new ErrorHandler("Please login to access this route", 401))
    }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.userId = decoded.id
        req.role = decoded.role

        console.log("Authenticated userId:", req.userId);
        console.log("Authenticated role:", req.role);

        next();
  
})

export const restricte = roles => TryCatch(async (req, res, next) => {
    const userId = req.userId;
    console.log(userId)

        const user = await User.findById(userId) || await Doctor.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found", 404))
        }

        if (!roles.includes(user.role)) {
            return next(new ErrorHandler("You're not authorized", 401))
        }

        next();
   
})