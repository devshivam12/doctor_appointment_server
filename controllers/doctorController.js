import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js';
import { TryCatch } from '../middleware/error.js';
import { ErrorHandler } from '../utils/utility.js';

export const createDoctor = TryCatch(async (req, res, next) => {
    const doctorData = req.body

    if (!doctorData) {
        return next(new ErrorHandler("Please provide doctor data", 404))
    }

    const result = await Doctor.create(doctorData)

    return res.status(200).json({
        success: true,
        message: "Data is saved",
        data: result
    })
})

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

const specializations = [
    "surgeon", "neurology", "pathology", "cardiologist", "dermatologist",
    "orthopedic", "pediatrician", "psychiatry", "otorhinolaryngology",
    "obstetrics-and-gynaecology", "immunology", "oncology", "general-surgery",
    "urology", "physical-therapy", "anesthesiology", "geriatrics",
    "rheumatology", "ophthalmology", "cardiothoracic-surgery", "pulmonology",
    "plastic-surgery", "radiology", "gastroenterology", "endocrinology",
    "nephrology", "preventive-healthcare", "vascular-surgery", "medical-genetics",
    "neurosurgery", "colorectal-surgery", "occupational-medicine",
    "intensive-care-medicine", "hematology", "diagnostic-radiology",
    "neonatology", "pediatric-surgery", "pediatric-hematology-oncology", "podiatry"
];

const genders = ["male", "female", "other"]
const availability = ["anytime", 'morning', 'afternoon', 'evening', 'weekends']
const hospitals = ["Apollo", "Mayo Clinic", "Cleveland Clinic", "Johns Hopkins", "Mount Sinai"];
const positions = ["Senior Surgeon", "Consultant", "Chief Medical Officer", "Resident Doctor", "Attending Physician"];
const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const degrees = ["MBBS", "MD", "PhD", "DO", "MSc", "BSc", "BDS"];
const universities = ["Harvard", "Stanford", "Oxford", "Cambridge", "Yale", "UCLA", "Johns Hopkins"];


const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)]
const getRandomSubset = (array) => array.filter(() => Math.random() > 0.5)
const getRandomTime = () => `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}:00`


const getRandomDate = (startYear, endYear) => {
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const generateDoctorExpereince = () => ({
    startingDate: getRandomDate(2010, 2019),
    endingDate: getRandomDate(2020, 2024),
    position: getRandomElement(positions),
    hospital: getRandomElement(hospitals)
})

const generateTimeSlots = () => {
    const slots = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
        day: getRandomElement(daysOfWeek),
        startingTime: getRandomTime(),
        endingTime: getRandomTime()
    }));

    slots.forEach(slot => {
        if (slot.startingTime > slot.endingTime) [slot.startingTime, slot.endingTime] = [slot.endingTime, slot.startingTime]
    });
    return slots
}

const generateQualification = () => {
    const startingDate = getRandomDate(2000, 2018);
    const endingDate = getRandomDate(2019, 2024);

    if (new Date(startingDate) > new Date(endingDate)) {
        [startingDate, endingDate] = [endingDate, startingDate]
    }

    return {
        startingDate,
        endingDate,
        degree: getRandomElement(degrees),
        university: getRandomElement(universities)
    }
}


const generateDoctorData = () => ({
    email: `doctor${Math.floor(Math.random() * 10000)}@example.com`,
    password: "password123",
    name: `Doctor ${Math.floor(Math.random() * 100)}`,
    phone: Math.floor(Math.random() * 10000000000),
    photo: "https://example.com/photo.jpg",
    ticketPrice: Math.floor(Math.random() * 200) + 50,
    role: "doctor",
    specialization: specializations[Math.floor(Math.random() * specializations.length)
    ],
    qualifications: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, generateQualification),
    experiences: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, generateDoctorExpereince),
    bio: "Experienced doctor with a focus on patient care.",
    about: "Dedicated medical professional. Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus aspernatur dicta nobis, sapiente dolore voluptate pariatur tenetur eligendi labore nesciunt. Dignissimos, officiis maiores?. Necessitatibus aspernatur dicta nobis, sapiente dolore voluptate pariatur tenetur eligendi labore nesciunt. Dignissimos, officiis maiores?",
    timeSlots: generateTimeSlots(),
    reviews: [],
    averageRating: Math.floor(Math.random() * 5) + 1,
    totalRating: 20,
    gender: getRandomElement(genders),
    availability: getRandomSubset(availability),
    consultaion_type: ["in-person", "video call"],
    isApproved: "approved",
    location: "New York",
    appointments: [],
});


export const addMultipleDoctor = TryCatch(async (req, res, next) => {
    const { quantity } = req.body

    if (!quantity) {
        return next(new ErrorHandler("Please add quantity", 408))
    }
    const doctorData = Array.from({ length: quantity }, generateDoctorData);

    const result = await Doctor.insertMany(doctorData)

    res.status(201).json({
        success: true,
        message: `${result.length} data added successfully`,
        data: result
    })
})

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

    console.log("Query parameters:", req.query);


    if (Object.keys(invalidQuery).length > 0) {
        return next(new ErrorHandler("Invalid query, please check it!", 400));
    }

    let minExp, maxExp;
    if (experience) {
        const expRange = experience.split("-");
        minExp = parseFloat(expRange[0]);
        maxExp = expRange[1] === "+" ? Infinity : parseFloat(expRange[1]);
    }

    const pipeline = [
        {
            $match: {
                isApproved: 'approved',
                ...(query && { $text: { $search: query } }),
                ...(specialization && { specialization }),
                ...(location && { location }),
                ...(minRating || maxRating ? {
                    averageRating: {
                        ...(minRating && { $gte: parseFloat(minRating) }),
                        ...(maxRating && { $lte: parseFloat(maxRating) })
                    }
                } : {}),
                ...(minPrice || maxPrice ? {
                    ticketPrice: {
                        ...(minPrice && { $gte: parseFloat(minPrice) }),
                        ...(maxPrice && { $lte: parseFloat(maxPrice) })
                    }
                } : {})
            }
        },
        {

            $addFields: {
                totalExperience: {
                    $reduce: {
                        input: "$experiences",
                        initialValue: 0,
                        in: {
                            $add: [
                                "$$value",
                                {
                                    $divide: [
                                        {
                                            $subtract: [
                                                { $ifNull: [{ $toDate: "$$this.endingDate" }, new Date()] },
                                                { $toDate: "$$this.startingDate" }
                                            ]
                                        },
                                        1000 * 60 * 60 * 24 * 365 // Convert milliseconds to years
                                    ]
                                }
                            ]
                        }
                    }
                }
            }


        },
        ...(experience ? [{
            $match: {
                totalExperience: {
                    $gte: minExp,
                    ...(maxExp !== Infinity && { $lte: maxExp })
                }
            }
        }] : []),
        {
            $project: {
                password: 0
            }
        },
        {
            $skip: (parseInt(page) - 1) * parseInt(limit)
        },
        {
            $limit: parseInt(limit)
        }
    ];

    const doctors = await Doctor.aggregate(pipeline);
    const totalDocs = await Doctor.countDocuments(pipeline[0].$match);

    if (totalDocs === 0) {
        return next(new ErrorHandler("No doctor found based on criteria", 404));
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
    });
});


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