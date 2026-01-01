// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.post("/register", auth.register); // USER ONLY
router.post("/login", auth.login);       // ADMIN + USER

module.exports = router;
