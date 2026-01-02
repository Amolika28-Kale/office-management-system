const express = require("express");
const router = express.Router();
const adminAuth = require("../../middlewares/adminMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
  getSettings,
  updateSettings
} = require("../../controllers/admin/adminSettingsController");

router.get("/profile", adminAuth, getProfile);
router.put("/profile", adminAuth, updateProfile);
router.put("/change-password", adminAuth, changePassword);

router.get("/settings", adminAuth, getSettings);
router.put("/settings", adminAuth, updateSettings);

module.exports = router;
