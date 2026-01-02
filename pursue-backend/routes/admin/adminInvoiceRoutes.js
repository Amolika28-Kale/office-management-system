const router = require("express").Router();
const auth = require("../../middlewares/authMiddleware");
const admin = require("../../middlewares/adminMiddleware");

const {
  getAllInvoices,
  getInvoiceById,
  downloadInvoice,
  generateNewInvoice,
} = require("../../controllers/admin/adminInvoiceController");

router.get("/", auth, admin, getAllInvoices);
router.get("/generate", auth, admin, generateNewInvoice);
router.get("/:id", auth, admin, getInvoiceById);
router.get("/:id/download", auth, admin, downloadInvoice);

module.exports = router;
