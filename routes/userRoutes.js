const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { addAvailability, getProfessorAvailability } = require("../controllers/userController");

router.post("/availability", auth, addAvailability); // 👨‍🏫 Professor adds slots
router.get("/:professorId/availability", auth, getProfessorAvailability); // 👨‍🎓 Student views slots

module.exports = router;
