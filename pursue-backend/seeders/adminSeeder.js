const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("../models/admin/Admin");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminExists = await Admin.findOne({
      email: "admin@pursue.com",
    });

    if (adminExists) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    await Admin.create({
      name: "Super Admin",
      email: "admin@pursue.com",
      password: "Admin@123",
    });

    console.log("✅ Admin created successfully");
    console.log("📧 Email: admin@pursue.com");
    console.log("🔑 Password: Admin@123");

    process.exit();
  } catch (error) {
    console.error("❌ Admin seeding failed:", error);
    process.exit(1);
  }
};

seedAdmin();
