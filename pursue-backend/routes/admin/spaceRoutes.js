const express = require("express");
const router = express.Router();
const admin = require("../../middlewares/adminMiddleware");
const {
  createSpace,
  getSpaces,
  getSpaceById,
  updateSpace,
  deleteSpace,
  toggleSpaceStatus,
  getActiveSpaces,
} = require("../../controllers/admin/spaceController");

router.use(admin);

/* CRUD */
router.post("/", createSpace);
router.get("/", getSpaces);
router.get("/:id", getSpaceById);
router.put("/:id", updateSpace);
router.delete("/:id", deleteSpace);
router.get("/active", getActiveSpaces);

/* Active / Inactive */
router.patch("/:id/toggle-status", toggleSpaceStatus);

module.exports = router;
