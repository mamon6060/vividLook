const express = require("express");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const {
  createTranslateController,
} = require("../../controllers/translateController");

const router = express.Router();

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("translates", "photo"),
  createTranslateController
);

module.exports = router;
