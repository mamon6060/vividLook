const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  getAllBlogCategoriesController,
  getBlogCategoryController,
  getAllBlogsOfCategory,
  createBlogCategoryController,
  updateBlogCategoryController,
  deleteBlogCategoryController,
} = require("../../controllers/blogCategoryController");

const router = express.Router();

router.get("/", getAllBlogCategoriesController);
router.get("/:slug", getBlogCategoryController);
router.get("/:slug/blogs", getAllBlogsOfCategory);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post("/", createBlogCategoryController);

router
  .route("/:slug")
  .patch(updateBlogCategoryController)
  .delete(deleteBlogCategoryController);

module.exports = router;
