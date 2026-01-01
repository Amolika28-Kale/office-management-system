const express = require("express");
const router = express.Router();
const adminAuth = require("../../middlewares/adminMiddleware");

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
} = require("../../controllers/admin/leadController");

/**
 * ADMIN LEAD ROUTES
 */

router.post("/", adminAuth, createLead);
router.get("/", adminAuth, getLeads);
router.get("/:id", adminAuth, getLeadById);
router.put("/:id", adminAuth, updateLead);
router.delete("/:id", adminAuth, deleteLead);

module.exports = router;
