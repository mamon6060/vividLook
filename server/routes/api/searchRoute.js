const express = require("express");
const {
  searchController,
  searchBlogController,
} = require("../../controllers/searchController");

const router = express.Router();

router.get("/", searchController);
router.get("/blogs", searchBlogController);

module.exports = router;
