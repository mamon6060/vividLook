const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const {
  getAllBannersController,
  getBannerController,
  createBannerController,
  updateBannerController,
  deleteBannerController,
} = require("../../controllers/bannerController");

const router = express.Router();

router.get("/", getAllBannersController);
router.get("/:id", getBannerController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("banner", "photo"),
  createBannerController
);

router
  .route("/:id")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("banner", "photo"),
    updateBannerController
  )
  .delete(deleteBannerController);

module.exports = router;
