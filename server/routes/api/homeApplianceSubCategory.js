const express = require("express");
// const protectMiddleware = require("../../middlewares/protectMiddleware");
// const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  getAllHomeApplianceSubcategoriesController,
  getHomeApplianceSubcategoryController,
  createHomeApplianceSubcategoryController,
  updateHomeApplianceSubcategoryController,
  deleteHomeApplianceSubcategoryController,
} = require("../../controllers/homeApplianceSubcategoryController");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const router = express.Router();

router.get("/", getAllHomeApplianceSubcategoriesController);
router.get("/:slug", getHomeApplianceSubcategoryController);
// router.get("/:slug/products", getAllProductsOfHomeApplianceCategory);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("districts", "photo"),
  createHomeApplianceSubcategoryController
);

router
  .route("/:slug")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("districts", "photo"),
    updateHomeApplianceSubcategoryController
  )
  .delete(deleteHomeApplianceSubcategoryController);

module.exports = router;
