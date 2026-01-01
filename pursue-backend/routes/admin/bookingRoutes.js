const express = require("express");
const router = express.Router();
const adminAuth = require("../../middlewares/adminMiddleware");

const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} = require("../../controllers/admin/bookingController");

/**
 * ADMIN BOOKING ROUTES
 */

router.post("/", adminAuth, createBooking);
router.get("/", adminAuth, getAllBookings);
router.get("/:id", adminAuth, getBookingById);
router.patch("/:id/status", adminAuth, updateBookingStatus);
router.patch("/:id/cancel", adminAuth, cancelBooking);

module.exports = router;
