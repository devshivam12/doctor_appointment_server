import Doctor from '../models/DoctorSchema.js'
import User from '../models/UserSchema.js'
import bcrypt from 'bcrypt'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { ErrorHandler } from '../utils/utility.js'
import { sendToken } from '../utils/feature.js'
import { TryCatch } from '../middleware/error.js'

// const generateToken = user => {
//     return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
//         expiresIn: "15d",
//     })
// }

export const register = TryCatch(async (req, res, next) => {
    const { email, password, name, role, gender, photo } = req.body

    let user = null;

    //check the role of the user

    if (role === 'patient') {
        user = await User.findOne({ email })
    }
    else if (role === 'doctor') {
        user = await Doctor.findOne({ email })
    }

    //if user is alredy exist

    if (user) {
        return next(new ErrorHandler("User is already exist", 400))
    }

    //hash the password

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt)

    //create the user

    if (role === 'patient') {
        user = new User({
            name,
            email,
            password: hashPassword,
            photo,
            role,
            gender
        })
    }

    if (role === 'doctor') {
        user = new Doctor({
            name,
            email,
            password: hashPassword,
            photo,
            role,
            gender
        })
    }

    await user.save()

    sendToken(res, user, 201, "User created successfully")
})

export const login = async (req, res, next) => {
    const { email, password } = req.body

    try {
        let user = null;

        const patient = await User.findOne({ email })
        const doctor = await Doctor.findOne({ email })

        //assign the role 
        if (patient) {
            user = patient
        }
        if (doctor) {
            user = doctor
        }

        //check if the user is not find

        if (!user) {
            return next(new ErrorHandler("Invalid Email or Password"))
        }

        //compare the token

        const isMatch = await compare(password, user.password)

        if (!isMatch) {
            return next(new ErrorHandler("Invalid Email or Password"))
        }

        sendToken(res, user, 200, `Welcome back ${user.name}`)

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const logout = TryCatch(async(req,res,next) => {
    res.clearCookie("doctor").json({
        success : true,
        message : "Logged out"
    })
})