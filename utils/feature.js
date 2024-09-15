import jwt from "jsonwebtoken"
import { DOCTOR_TOKEN } from "../constant/config.js"

const cookieOption = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
    sameSite : true
}

const sendToken = (res, user, code, message) => {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {expiresIn : "15d"})

    return res.status(code).cookie(DOCTOR_TOKEN, token, cookieOption).json({
        success: true,
        user,
        message
    })
}

export {
    sendToken
}