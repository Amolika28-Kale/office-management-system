const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/authMiddleware");

const {
  getUserDashboardStats,
  getActiveBookings,
  getUserDashboardAnalytics,
} = require("../../controllers/user/dashboardController");

router.get("/stats", auth, getUserDashboardStats);
router.get("/active-bookings", auth, getActiveBookings);
router.get("/analytics", auth, getUserDashboardAnalytics);

module.exports = router;
