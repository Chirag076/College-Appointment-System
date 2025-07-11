const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  bookAppointment,
  getMyAppointments,
  cancelAppointment
} = require("../controllers/bookingController");

router.post("/", auth, bookAppointment);             // 👨‍🎓 Book
router.get("/me", auth, getMyAppointments);          // 👨‍🎓 My bookings
router.delete("/:id", auth, cancelAppointment);      // 👨‍🏫 Cancel
module.exports = router;
