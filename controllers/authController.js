import Doctor from '../models/DoctorSchema.js'
import User from '../models/UserSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const generateToken = user => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: "15d",
    })
}

export const register = async (req, res) => {
    const { email, password, name, role, gender, photo } = req.body

    try {
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
            return res.status(400).json({ message: "User is already exist" })
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

        return res.status(200).json({ success: true, message: "User created successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const login = async (req, res) => {
    const { email } = req.body

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
            return res.status(404).json({ message: "User not found" })
        }

        //compare the token

        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password)

        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        // get Token

        const token = generateToken(user)

        const { password, role, appointment, ...rest } = user._doc;

        res.status(200).json(
            {
                success: true,
                message: "You are sucessfully login",
                token,
                data: { ...rest },
                role
            }

        )


    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}