const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema({
  companyName: { type: String, default: "Pursue Co-Working Space" },
  address: String,
  gstNumber: String,
  supportEmail: String,
  supportPhone: String,
  invoicePrefix: { type: String, default: "INV" },
  gstPercentage: { type: Number, default: 18 },
  invoiceTerms: String
}, { timestamps: true });

module.exports = mongoose.model("AdminSettings", adminSettingsSchema);
