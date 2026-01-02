const Admin = require("../../models/admin/Admin");
const Settings = require("../../models/admin/AdminSettings");
const bcrypt = require("bcryptjs");

/* ADMIN PROFILE */
exports.getProfile = async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select("-password");
  res.json(admin);
};

exports.updateProfile = async (req, res) => {
  const admin = await Admin.findByIdAndUpdate(
    req.admin.id,
    req.body,
    { new: true }
  ).select("-password");

  res.json(admin);
};

/* CHANGE PASSWORD */
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin.id);
  const isMatch = await bcrypt.compare(currentPassword, admin.password);

  if (!isMatch)
    return res.status(400).json({ message: "Wrong password" });

  admin.password = await bcrypt.hash(newPassword, 10);
  await admin.save();

  res.json({ message: "Password updated" });
};

/* SETTINGS */
exports.getSettings = async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
  res.json(settings);
};

exports.updateSettings = async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create(req.body);
  else Object.assign(settings, req.body);

  await settings.save();
  res.json(settings);
};
