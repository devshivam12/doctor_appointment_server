import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js';
import { TryCatch } from '../middleware/error.js';
import { ErrorHandler } from '../utils/utility.js';

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



export const getAllDoctors = TryCatch(async (req, res, next) => {
    const {
        query,
        specialization,
        minRating,
        maxRating,
        minPrice,
        maxPrice,
        experience,
        location,
        page = 1,
        limit = 10,
        ...invalidQuery
    } = req.query;

    // create the base match object for filetering document
    const matchQuery = { isApproved: 'approved' };


    if (Object.keys(invalidQuery).length > 0) {
        return next(new ErrorHandler("Invalid query please check it !!", 400))
    }

    // Text search using mongoDb $text operator

    if (query) {
        matchQuery.$text = { $search: query }
    }

    // Filter by specification 
    if (specialization) {
        matchQuery.specialization = specialization
    }

    // filter by location 

    if (location) {
        matchQuery.location = location
    }

    // filter by rating
    if (minRating || maxRating) {
        matchQuery.averageRating = {
            ...(minRating && { $gte: parseFloat(minRating) }),
            ...(maxRating && { $lte: parseFloat(maxRating) })
        }
    }

    if (minPrice || maxPrice) {
        matchQuery.ticketPrice = {
            ...(minPrice && { $gte: parseInt(minPrice) }),
            ...(maxPrice && { $lte: parseFloat(maxPrice) })
        }
    }

    // Filter by experience level
    // if (experienceLevel) {
    //     matchQuery.experiences = { $size: parseInt(experienceLevel) }
    // }


    let doctors = await Doctor.find(matchQuery)
        .select('-password')
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))

    if (experience) {
        doctors = doctors.filter(doctor => {
            const totalExperience = doctor.experiences.reduce((sum, exp) => {
                const start = new Date(exp.startingDate)
                const last = exp.endingDate ? new Date(exp.endingDate) : new Date()
                const yearsOfExpoerience = (last - start) / (1000 * 60 * 60 * 24 * 365)
                return sum + yearsOfExpoerience
            }, 0)
            return totalExperience >= parseFloat(experience)
        });
    }

    const totalDocs = doctors.length

    // Aggregation
    // const doctors = await Doctor.aggregate([
    //     {
    //         $match: matchQuery,
    //     },
    //     {
    //         $project: {
    //             password: 0
    //             ,
    //         }
    //     },
    //     {
    //         $skip: (parseInt(page - 1) * parseInt(limit))
    //     },
    //     {
    //         $limit: parseInt(limit)
    //     }
    // ]);

    // const totalDocs = await Doctor.countDocuments(matchQuery)

    // if(doctors.length === 0){
    //     return next(new ErrorHandler("No doctor is found based on criteria",404))
    // }

    if (totalDocs === 0) {
        return next(new ErrorHandler("No doctor is found based on criteria", 404))
    }

    res.status(200).json({
        success: true,
        message: "Doctors found",
        data: doctors,
        pagination: {
            currentPage: parseInt(page),
            totalPage: Math.ceil(totalDocs / parseInt(limit)),
            totalDocs,
        }
    })
})

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