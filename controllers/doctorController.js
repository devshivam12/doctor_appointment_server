import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js';

export const updateDoctor = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" })
        }

        res.status(200).json(
            {
                success: true,
                message: "Successfully Updated",
                data: updatedDoctor
            })

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update", error: error.message })
    }
}

export const deletedDoctor = async (req, res) => {
    const id = req.params.id;

    try {
        const deleteDoctor = await Doctor.findByIdAndDelete(
            id,
        );

        if (!deleteDoctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" })
        }

        res.status(200).json(
            {
                success: true,
                message: "Doctor Successfully Deleted",
            })

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete", error: error.message })
    }
}



export const getSingleDoctor = async (req, res) => {
    const id = req.params.id;

    try {
        const doctor = await Doctor.findById(id).populate("reviews").select('-password');

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" })
        }

        res.status(200).json(
            {
                success: true,
                message: "Doctor Found",
                data: doctor
            })

    } catch (error) {
        res.status(500).json({ success: false, message: "No Doctor Found", error: error.message })
    }
}



export const getAllDoctors = async (req, res) => {

    try {

        const { query } = req.query;
        let doctors;

        if (query) {
            doctors = await Doctor.find({
                isApproved: 'approved',
                $or: [{ name: { $regex: query, $options: 'i' } }, { specialization: { $regex: query, $options: 'i' } }]
            }).select('-password')
        }
        else {
            doctors = await Doctor.find({ isApproved: 'approved' }).select('-password');
        }
        res.status(200).json(
            {
                success: true,
                message: "Doctor Found",
                data: doctors
            })

    } catch (error) {
        res.status(500).json({ success: false, message: "No Doctors Found", error: error.message })
    }
}

export const getDoctorProfile = async (req, res) => {
    const doctorId = req.userId;

    console.log("Doctor id", doctorId)
    try {
        const doctor = await Doctor.findById(doctorId)

        if (!doctor) {
           return res.status(404).json({ success: false, message: "Doctor is not found" })
        }

        const { password, ...rest } = doctor._doc;
        const appointments = await Booking.find({ doctor: doctorId })

        return res.status(200).json({ success: true, message: "Doctor Profile info is getting", data: { ...rest, appointments } })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong, cannot get" })
    }
}