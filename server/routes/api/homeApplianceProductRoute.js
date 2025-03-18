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
  getHomeApplianceProductController,
  createHomeApplianceProductController,
  updateHomeApplianceProductController,
  deleteHomeApplianceProductController,
  searchProducts,
} = require("../../controllers/homeApplianceProductController");

const router = express.Router();

router.get("/", getAllProductsController);
router.get("/price-range", getPriceRangeController);
router.get("/:slug", getHomeApplianceProductController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(true),
  cloudinaryUploadMiddleware("product", "photos"),
  createHomeApplianceProductController
);
router.post(
  "/search",
  uploadPhotoMiddleware(true),
  cloudinaryUploadMiddleware("product", "photos"),
  searchProducts
);

router
  .route("/:slug")
  .patch(
    uploadPhotoMiddleware(true),
    cloudinaryUploadMiddleware("product", "photos"),
    updateHomeApplianceProductController
  )
  .delete(deleteHomeApplianceProductController);

module.exports = router;
