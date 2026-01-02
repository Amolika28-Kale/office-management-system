const router = require("express").Router();
const auth = require("../../middlewares/authMiddleware");
const admin = require("../../middlewares/adminMiddleware");

const {
  getAllPayments,
} = require("../../controllers/admin/adminPaymentController");

router.get("/", auth, admin, getAllPayments);

module.exports = router;
