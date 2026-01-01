// pursue-backend/routes/admin/authRoutes.js
const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../../controllers/admin/authController");

/**
 * @route   POST /api/admin/auth/login
 * @desc    Admin login
 * @access  Public
 */
router.post("/login", loginAdmin);

module.exports = router;
