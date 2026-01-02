const router = require("express").Router();
const auth = require("../../middlewares/authMiddleware");
const admin = require("../../middlewares/adminMiddleware");

const {
  getAllInvoices,
} = require("../../controllers/admin/adminInvoiceController");

router.get("/", auth, admin, getAllInvoices);

module.exports = router;
