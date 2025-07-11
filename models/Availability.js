const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  professor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: String,        // e.g., "2025-07-02"
  time: String         // e.g., "10:00 AM - 11:00 AM"
});

module.exports = mongoose.model("Availability", availabilitySchema);
