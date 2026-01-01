const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getDashboardAnalytics
} = require("../../controllers/admin/dashboardController");
const adminAuth = require("../../middlewares/adminMiddleware");

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard stats
 * @access  Private (Admin)
 */
router.get("/", adminAuth, getDashboardStats);
router.get("/analytics", adminAuth, getDashboardAnalytics);

module.exports = router;
