const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  getAllCategoriesController,
  getCategoryController,
  getAllProductsOfCategory,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} = require("../../controllers/categoryController");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const router = express.Router();

router.get("/", getAllCategoriesController);
router.get("/:slug", getCategoryController);
router.get("/:slug/products", getAllProductsOfCategory);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("districts", "photo"),
  createCategoryController
);

router
  .route("/:slug")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("districts", "photo"),
    updateCategoryController
  )
  .delete(deleteCategoryController);

module.exports = router;
