const User = require("../../models/user/User");

/* GET ALL USERS */
exports.getUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).sort({ createdAt: -1 });
  res.json(users);
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* CREATE USER */
exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};

/* UPDATE USER */
exports.updateUser = async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

/* DELETE USER */
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};



/* DASHBOARD STATS */
exports.userStats = async (req, res) => {
  const total = await User.countDocuments({ role: "user" });
  const members = await User.countDocuments({ userType: "Member" });
  const guests = await User.countDocuments({ userType: "Guest" });
  const premium = await User.countDocuments({ plan: "Premium" });

  res.json({ total, members, guests, premium });
};
