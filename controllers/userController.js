const Availability = require("../models/Availability");

exports.addAvailability = async (req, res) => {
  try {
    if (req.user.role !== "professor") return res.status(403).json({ error: "Only professors can add availability" });

    const { date, time } = req.body;
    const slot = await Availability.create({ professor: req.user.id, date, time });
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfessorAvailability = async (req, res) => {
  try {
    const slots = await Availability.find({ professor: req.params.professorId });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
