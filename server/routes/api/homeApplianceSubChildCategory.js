const express = require("express");
// const protectMiddleware = require("../../middlewares/protectMiddleware");
// const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  getAllSubchildcategoriesController,
  getHomeApplianceSubchildcategoryController,
  createHomeApplianceSubchildcategoryController,
  updateHomeApplianceSubchildcategoryController,
  deleteHomeApplianceSubchildcategoryController,
} = require("../../controllers/homeApplianceSubchildcategoryController");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const router = express.Router();

router.get("/", getAllSubchildcategoriesController);
router.get("/:slug", getHomeApplianceSubchildcategoryController);
// router.get("/:slug/products", getAllProductsOfHomeApplianceCategory);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("districts", "photo"),
  createHomeApplianceSubchildcategoryController
);

router
  .route("/:slug")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("districts", "photo"),
    updateHomeApplianceSubchildcategoryController
  )
  .delete(deleteHomeApplianceSubchildcategoryController);

module.exports = router;
