const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  applyDiscountController,
} = require("../../controllers/discountController");

const router = express.Router();

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));
router.put("/", applyDiscountController);

module.exports = router;
