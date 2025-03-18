const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const {
  createOrderController,
  getAllOrdersController,
  getOrderController,
  updateOrderController,
  updateOrderStatusController,
  deleteOrderController,
} = require("../../controllers/orderController");

const router = express.Router();

// router.use(protectMiddleware);

router
  .route("/")
  .post(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("order", "photo"),
    createOrderController
  )
  .get(getAllOrdersController);

router.get("/:id", getOrderController);

// router.use(restrictToMiddleware("admin"));
router.route("/:id").patch(updateOrderController).delete(deleteOrderController);

router
  .route("/status/:id")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("orders", "photo"),
    updateOrderStatusController
  );

module.exports = router;
