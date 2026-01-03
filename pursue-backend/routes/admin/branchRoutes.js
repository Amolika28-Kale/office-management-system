const express = require("express");
const router = express.Router();
const {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} = require("../../controllers/admin/branchController");
const  adminAuth  = require("../../middlewares/authMiddleware");


router.post("/", adminAuth, createBranch);
router.get("/", adminAuth, getBranches);
router.get("/:id", adminAuth, getBranchById);
router.put("/:id", adminAuth, updateBranch);
router.delete("/:id", adminAuth, deleteBranch);

module.exports = router;
