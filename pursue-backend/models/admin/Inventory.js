const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Furniture", "Electronics", "Stationery", "Pantry", "Other"],
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    minStock: {
      type: Number,
      default: 0,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* 🔹 Virtual: Total Value */
inventorySchema.virtual("totalValue").get(function () {
  return this.quantity * this.unitPrice;
});

/* 🔹 Ensure virtuals show in JSON */
inventorySchema.set("toJSON", { virtuals: true });
inventorySchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Inventory", inventorySchema);
