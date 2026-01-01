const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/authMiddleware");
const {
  getMyInvoices,
  getInvoiceById,
  downloadInvoicePDF,
} = require("../../controllers/user/invoiceController");

router.get("/my", auth, getMyInvoices);
router.get("/:id", auth, getInvoiceById);
router.get("/:id/pdf", auth, downloadInvoicePDF);

module.exports = router;
