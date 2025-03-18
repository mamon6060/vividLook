const express = require("express");

const {
  getAllThanasController,
  getThanaController,
  createThanaController,
  updateThanaController,
  deleteThanaController,
} = require("../../controllers/thanaController");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const router = express.Router();

router.get("/", getAllThanasController);
router.get("/:id", getThanaController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("districts", "photo"),
  createThanaController
);

router
  .route("/:id")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("districts", "photo"),
    updateThanaController
  )
  .delete(deleteThanaController);

module.exports = router;
