const express = require("express");
const router = express.Router();
const Notification = require("../models/common/Notification");
const auth = require("../middlewares/authMiddleware");

/* GET NOTIFICATIONS */
router.get("/", auth, async (req, res) => {
  const filter = req.user.role === "admin"
    ? { admin: null }
    : { user: req.user.id };

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({ success: true, data: notifications });
});

/* MARK AS READ */
router.patch("/:id/read", auth, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

module.exports = router;
