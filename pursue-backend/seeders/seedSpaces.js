const mongoose = require("mongoose");
require("dotenv").config();

const Space = require("../models/common/Space");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected for Seeding"))
  .catch((err) => console.error(err));

const seedSpaces = async () => {
  try {
    // 🛑 Prevent duplicate seeding
    const existing = await Space.countDocuments();
    if (existing > 0) {
      console.log("⚠️ Spaces already exist. Seeding skipped.");
      process.exit();
    }

    const spaces = [];

    // 🏢 9 CABINS
    for (let i = 1; i <= 9; i++) {
      spaces.push({
        name: `Cabin ${i}`,
        type: "cabin",
        capacity: 4,
        price: 15000,
        description: `Private cabin ${i}`,
      });
    }

    // 💺 60 DESKS
    for (let i = 1; i <= 60; i++) {
      spaces.push({
        name: `Desk ${i}`,
        type: "desk",
        capacity: 1,
        price: 5000,
        description: `Dedicated desk ${i}`,
      });
    }

    // 🧑‍🤝‍🧑 CONFERENCE ROOM
    spaces.push({
      name: "Conference Room",
      type: "conference",
      capacity: 10,
      price: 2000,
      description: "Conference room with projector",
    });

    // 🔧 UTILITY AREA
    spaces.push({
      name: "Utility Area",
      type: "utility",
      capacity: 0,
      price: 0,
      description: "Pantry / utility space",
    });

    await Space.insertMany(spaces);

    console.log("✅ Spaces seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedSpaces();
