const express = require("express");
const router = express.Router();
const adminAuth = require("../../middlewares/adminMiddleware");
const ctrl = require("../../controllers/user/adminUserController");

router.use(adminAuth);

router.get("/", ctrl.getUsers);
router.get("/stats", ctrl.userStats);
router.get("/:id", ctrl.getUserById);
router.post("/", ctrl.createUser);
router.put("/:id", ctrl.updateUser);
router.delete("/:id", ctrl.deleteUser);

module.exports = router;
