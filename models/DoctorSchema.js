import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  doctorId: { type: Number },
  phone: { type: Number },
  photo: { type: String },
  ticketPrice: { type: Number },
  role: {
    type: String,
    enum: ["doctor", "admin"],
    default: "doctor",
  },
  specialization: { type: String },
  qualifications : [
    {
      startingDate : Date,
      endingDate : Date,
      degree : String,
      university : String
    }
  ],
  experiences: [
    {
      startingDate: Date,
      endingDate: Date,
      position: String,
      hospital: String
    }
  ],
  totalExperience : {
    type : Number,
    default : 0
  },
  bio: {
    type: String,
    maxlength: 150,
  },
  about: {
    type: String,
    maxlength: 15000,
  },
  timeSlots: [
    {
      day: String,
      startingTime: Date,
      endingTime: Date
    }
  ],
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  averageRating: { type: Number, default: 0 },
  totalRating: { type: Number, default: 0 },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  availability: {
    type: [String],
    enum: ["anytime", 'morning', 'afternoon', 'evening', 'weekends']
  },
  consultaion_type: {
    type: [String],
    enum: ["in-person", 'video call', 'telehealth', 'message']
  },
  isApproved: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending",
  },
  location: {
    type: String,
  },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
});

DoctorSchema.index({ name: 'text', specialization: 'text', location: 'text' });
DoctorSchema.index({ averageRating: 1 });
DoctorSchema.index({ ticketPrice: 1 })

export default mongoose.model("Doctor", DoctorSchema);
