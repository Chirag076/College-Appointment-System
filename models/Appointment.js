const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  availability: { type: mongoose.Schema.Types.ObjectId, ref: "Availability", required: true },
  date: String,        // e.g., "2025-07-02"
  time: String  
});

module.exports = mongoose.model("Appointment", appointmentSchema);
