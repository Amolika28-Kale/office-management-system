const Notification = require("../models/common/Notification");

exports.notifyAdmin = async ({ title, message, meta }) => {
  await Notification.create({
    title,
    message,
    admin: null, // means all admins
    type: "booking",
    meta,
  });
};

exports.notifyUser = async ({ userId, title, message, meta }) => {
  await Notification.create({
    title,
    message,
    user: userId,
    type: "booking",
    meta,
  });
};
