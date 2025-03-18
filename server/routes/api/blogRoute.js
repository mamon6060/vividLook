const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const {
  getAllBlogsController,
  createBlogController,
  updateBlogController,
  getBlogController,
  deleteBlogController,
} = require("../../controllers/blogController");

const router = express.Router();

router.get("/", getAllBlogsController);
router.get("/:slug", getBlogController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));
router.use(
  uploadPhotoMiddleware(true, 4),
  cloudinaryUploadMiddleware("blog", "photos")
);

router.post("/", createBlogController);
router.route("/:slug").patch(updateBlogController).delete(deleteBlogController);

module.exports = router;
