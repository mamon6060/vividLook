/* eslint-disable no-unused-vars */
const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const {
  getAllAreasController,
  getAreaController,
  createAreaController,
  updateAreaController,
  deleteAreaController,
} = require("../../controllers/areaController");

const router = express.Router();

router.get("/", getAllAreasController);
router.get("/:id", getAreaController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("areas", "photo"),
  createAreaController
);

router
  .route("/:id")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("areas", "photo"),
    updateAreaController
  )
  .delete(deleteAreaController);

module.exports = router;
