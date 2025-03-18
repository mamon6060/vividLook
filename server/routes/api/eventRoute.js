const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const {
  getAllEventsController,
  getEventController,
  createEventController,
  updateEventController,
  deleteEventController,
} = require("../../controllers/eventController");

const router = express.Router();

router.get("/", getAllEventsController);
router.get("/:id", getEventController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("events", "photo"),
  createEventController
);
router
  .route("/:id")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("events", "photo"),
    updateEventController
  )
  .delete(deleteEventController);

module.exports = router;
