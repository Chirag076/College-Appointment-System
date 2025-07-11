const Appointment = require("../models/Appointment");
const Availability = require("../models/Availability");

exports.bookAppointment = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ error: "Only students can book appointments" });
    }

    const { professorId, availabilityId } = req.body;

    const availability = await Availability.findById(availabilityId);
    if (!availability) {
      return res.status(400).json({ error: "Invalid availability ID" });
    }

    const existing = await Appointment.findOne({
      student: req.user.id,
      availability: availabilityId
    });

    if (existing) {
      return res.status(400).json({ error: "Already booked this slot" });
    }

    const bookedTime = availability.time; // Save time for appointment

    // Create new appointment
    const appointment = await Appointment.create({
      student: req.user.id,
      professor: professorId,
      availability: availabilityId,
      date: availability.date,
      time: bookedTime
    });
    await Availability.findByIdAndDelete(availabilityId);
    
    const fullAppointment = await Appointment.findById(appointment._id)
      .populate("professor", "name email");

    res.status(201).json(fullAppointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ student: req.user.id })
      .populate("professor", "name email")
      .populate("availability", "date time");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ error: "Not found" });

    if (req.user.role !== "professor" || String(appointment.professor) !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    await appointment.deleteOne();
    res.json({ message: "Appointment canceled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
