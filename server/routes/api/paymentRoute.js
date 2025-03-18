const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const {
  initiatePayment,
  paymentSuccess,
  paymentFailure,
  paymentCancel,
} = require("../../controllers/paymentController");

const router = express.Router();

router.use(protectMiddleware);

router.post("/initiate", initiatePayment);
router.post("/success/:tranID", paymentSuccess);
router.post("/fail/:tranID", paymentFailure);
router.post("/cancel/:tranID", paymentCancel);

module.exports = router;
