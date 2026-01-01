const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/authMiddleware");

const {
  getUserDashboardStats,
  getActiveBookings,
} = require("../../controllers/user/dashboardController");

router.get("/stats", auth, getUserDashboardStats);
router.get("/active-bookings", auth, getActiveBookings);

module.exports = router;
