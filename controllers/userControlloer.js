import Booking from '../models/BookingSchema.js';
import User from '../models/UserSchema.js'
import Doctor from '../models/DoctorSchema.js'

export const updateUser = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        res.status(200).json(
            {
                success: true,
                message: "Successfully Updated",
                data: updatedUser
            })

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update", error: error.message })
    }
}

export const deletedUser = async (req, res) => {
    const id = req.params.id;

    try {
        const deleteUser = await User.findByIdAndDelete(
            id,
        );

        if (!deleteUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        res.status(200).json(
            {
                success: true,
                message: "User Successfully Deleted",
            })

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete", error: error.message })
    }
}

export const getSingleUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        res.status(200).json(
            {
                success: true,
                message: "User Found",
                data: user
            })

    } catch (error) {
        res.status(500).json({ success: false, message: "No User Found", error: error.message })
    }
}



export const getAllUsers = async (req, res) => {

    try {
        const users = await User.find({}).select('-password');

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        res.status(200).json(
            {
                success: true,
                message: "Users Found",
                data: users
            })

    } catch (error) {
        res.status(404).json({ success: false, message: "No Users Found", error: error.message })
    }
}

export const getUserProfile = async (req, res) => {
    const userId = req.userId;
    console.log("user id as",userId)
    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ success: false, message: "User is not found" })
        }

        const { password, ...rest } = user._doc

        return res.status(200).json({ success: true, message: "User Profile is found", data: { ...rest } })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong", error: error.message })
    }
}

export const getMyAppointments = async (req, res) => {

    try {
        // step 1 : retrive appointments from bookings for specific user

        const bookings = await Booking.find({ user: req.userId })

        // step 2 : extracts doctorIds from appointment booking

        const doctorIds = bookings.map(el => el.doctor.id);

        // step 3 : retrive doctors using doctor ids

        const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select("-password")

        res.status(200).json({ success: true, message: "Appointments are getting", data: doctors })

    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong, cannot get appointments" })
    }

}