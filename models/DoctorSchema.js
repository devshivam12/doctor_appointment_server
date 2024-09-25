import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: Number },
  photo: { type: String },
  ticketPrice: { type: Number },
  role: {
    type: String,
    enum: ["doctor", "admin"],
    default: "doctor",
  },
  specialization: { type: String },
  qualifications: { type: Array },
  experiences: { type: Array },
  bio: { type: String, maxLength: 50 },
  about: { type: String },
  timeSlots: { type: Array },
  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  averageRating: { type: Number, default: 0 },
  totalRating: { type: Number, default: 0 },
  isApproved: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending",
  },
  location : {
    type : String,
  },
  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
});

DoctorSchema.index({ name: 'text', specialization: 'text', location: 'text' });
DoctorSchema.index({ averageRating: 1 });
DoctorSchema.index({ ticketPrice: 1 })

export default mongoose.model("Doctor", DoctorSchema);
