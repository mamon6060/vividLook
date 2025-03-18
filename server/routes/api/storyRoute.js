const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const {
  getAllStoriesController,
  getStoryController,
  createStoryController,
  updateStoryController,
  deleteStoryController,
} = require("../../controllers/storyController");

const router = express.Router();

router.get("/", getAllStoriesController);
router.get("/:id", getStoryController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("stories", "photo"),
  createStoryController
);

router
  .route("/:id")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("stories", "photo"),
    updateStoryController
  )
  .delete(deleteStoryController);

module.exports = router;
