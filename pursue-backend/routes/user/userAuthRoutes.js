const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/authMiddleware"); // ✅ FIXED PATH

const {
  getMyProfile,
  updateMyProfile,
  changePassword,
} = require("../../controllers/user/userAuthController");

router.get("/me", auth, getMyProfile);
router.put("/me", auth, updateMyProfile);
router.put("/change-password", auth, changePassword);

module.exports = router;
