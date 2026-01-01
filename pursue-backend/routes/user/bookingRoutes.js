const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/authMiddleware");

const {
  createBooking,
  getMyBookings,
  updateBooking,
  deleteBooking,
} = require("../../controllers/user/bookingController");

router.use(auth);

router.post("/", createBooking);
router.get("/", getMyBookings);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

module.exports = router;
