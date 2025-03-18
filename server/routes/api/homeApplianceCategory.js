const express = require("express");
// const protectMiddleware = require("../../middlewares/protectMiddleware");
// const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  getAllHomeApplianceCategoriesController,
  getHomeApplianceCategoryController,
  createHomeApplianceCategoryController,
  updateHomeApplianceCategoryController,
  deleteHomeApplianceCategoryController,
} = require("../../controllers/homeApplianceCategoryController");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const router = express.Router();

router.get("/", getAllHomeApplianceCategoriesController);
router.get("/:slug", getHomeApplianceCategoryController);
// router.get("/:slug/products");

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("districts", "photo"),
  createHomeApplianceCategoryController
);

router
  .route("/:slug")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("districts", "photo"),
    updateHomeApplianceCategoryController
  )
  .delete(deleteHomeApplianceCategoryController);

module.exports = router;
