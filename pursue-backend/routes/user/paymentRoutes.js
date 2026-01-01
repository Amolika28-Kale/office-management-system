const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/authMiddleware");

const {
  createStripePaymentIntent,
  confirmStripePayment,
  getUserPayments,
  paymentStats,
} = require("../../controllers/user/paymentController");

/* STRIPE */
router.post("/stripe/create-intent", auth, createStripePaymentIntent);
router.post("/stripe/confirm", auth, confirmStripePayment);

/* USER PAYMENTS */
router.get("/my", auth, getUserPayments);
router.get("/stats", auth, paymentStats);

module.exports = router;
