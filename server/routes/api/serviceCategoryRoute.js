const express = require("express");

const {
  getAllServiceCategorysController,
  getAllServicesByCategoryController,
  getServiceCategoryController,
  createServiceCategoryController,
  updateServiceCategoryController,
  deleteServiceCategoryController,
} = require("../../controllers/serviceCategoryController");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const router = express.Router();

router.get("/", getAllServiceCategorysController);
router.get("/services", getAllServicesByCategoryController);
router.get("/:id", getServiceCategoryController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("serviceCategorys", "photo"),
  createServiceCategoryController
);

router
  .route("/:id")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("serviceCategorys", "photo"),
    updateServiceCategoryController
  )
  .delete(deleteServiceCategoryController);

module.exports = router;
