const Admin = require("../models/admin/Admin");
const User = require("../models/user/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   USER REGISTER
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists =
      (await Admin.findOne({ email })) ||
      (await User.findOne({ email }));

    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "user",
      userType: "Guest",        // default
      status: "Active",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   LOGIN (ADMIN + USER)
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    let account = await Admin.findOne({ email }).select("+password");
    let role = "admin";

    if (!account) {
      account = await User.findOne({ email }).select("+password");
      role = "user";
    }

    if (!account) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (role === "admin" && account.isActive === false) {
      return res.status(403).json({ message: "Admin account disabled" });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: account._id,
        role,
        name: account.name,
        email: account.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    account.lastLogin = new Date();
    await account.save();

    res.json({
      success: true,
      token,
      role,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
