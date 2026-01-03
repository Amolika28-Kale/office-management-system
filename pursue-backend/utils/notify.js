const Notification = require("../models/common/Notification");

/* USER NOTIFICATION */
exports.notifyUser = async ({ userId, title, message, meta }) => {
  return Notification.create({
    user: userId,
    title,
    message,
    type: "booking",
    meta,
    isRead: false,
  });
};

/* ADMIN NOTIFICATION */
exports.notifyAdmin = async ({ title, message, meta }) => {
  return Notification.create({
    admin: null, // or adminId if multi-admin
    title,
    message,
    type: "booking",
    meta,
    isRead: false,
  });
};
