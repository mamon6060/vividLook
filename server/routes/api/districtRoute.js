const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const {
  getAllDistrictsController,
  getDistrictController,
  createDistrictController,
  updateDistrictController,
  deleteDistrictController,
} = require("../../controllers/districtController");

const router = express.Router();

router.get("/", getAllDistrictsController);
router.get("/:id", getDistrictController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("districts", "photo"),
  createDistrictController
);

router
  .route("/:id")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("districts", "photo"),
    updateDistrictController
  )
  .delete(deleteDistrictController);

module.exports = router;
