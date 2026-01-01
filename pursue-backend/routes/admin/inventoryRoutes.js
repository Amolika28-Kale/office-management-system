const express = require("express");
const router = express.Router();

const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getLowStockItems,
} = require("../../controllers/admin/inventoryController");

const adminAuth = require("../../middlewares/adminMiddleware");

/**
 * INVENTORY ROUTES
 */
router.use(adminAuth);

/* Low stock (Dashboard widget) */
router.get("/low-stock", getLowStockItems);

/* CRUD */
router.post("/", createItem);
router.get("/", getAllItems);
router.get("/:id", getItemById);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
