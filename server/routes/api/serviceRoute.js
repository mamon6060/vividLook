const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const {
  getAllServicesController,
  getServiceController,
  createServiceController,
  updateServiceController,
  deleteServiceController,
} = require("../../controllers/serviceController");

const router = express.Router();

router.get("/", getAllServicesController);
router.get("/:id", getServiceController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("services", "photo"),
  createServiceController
);

router
  .route("/:id")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("services", "photo"),
    updateServiceController
  )
  .delete(deleteServiceController);

module.exports = router;
