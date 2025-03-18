const express = require("express");
// const protectMiddleware = require("../../middlewares/protectMiddleware");
// const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const {
  getAllProductsController,
  getPriceRangeController,
  getProductController,
  createProductController,
  updateProductController,
  deleteProductController,
} = require("../../controllers/productController");

const router = express.Router();

router.get("/", getAllProductsController);
router.get("/price-range", getPriceRangeController);
router.get("/:slug", getProductController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(true),
  cloudinaryUploadMiddleware("product", "photos"),
  createProductController
);

router
  .route("/:slug")
  .patch(
    uploadPhotoMiddleware(true),
    cloudinaryUploadMiddleware("product", "photos"),
    updateProductController
  )
  .delete(deleteProductController);

module.exports = router;
