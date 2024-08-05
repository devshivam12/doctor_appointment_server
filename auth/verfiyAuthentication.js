import jwt, { decode } from 'jsonwebtoken'
import Doctor from '../models/DoctorSchema.js';
import User from '../models/UserSchema.js';

export const authenticate = (req, res, next) => {
    const authToken = req.headers.authorization;

    if (!authToken || !authToken.startsWith("Bearer")) {
        return res.status(401).json({ success: false, message: "No token, Authorization denied" })
    }
    try {
        const token = authToken.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        req.userId = decoded.id
        req.role = decoded.role

        console.log("Authenticated userId:", req.userId);
        console.log("Authenticated role:", req.role);

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token is expire" })
        }

        return res.status(401).json({ success: false, message: "Invalid token" })
    }
}

export const restricte = roles => async (req, res, next) => {
    const userId = req.userId;
    console.log(userId)
    try {
        const user = await User.findById(userId) || await Doctor.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (!roles.includes(user.role)) {
            return res.status(401).json({ success: false, message: "You're not authorized" });
        }

        next();
    } catch (error) {
        console.error("Error in restricte middleware:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};