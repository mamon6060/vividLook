const express = require("express");
// const protectMiddleware = require("../../middlewares/protectMiddleware");
// const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  getAllPartnersController,
  getPartnerController,
  createPartnerController,
  updatePartnerController,
  deletePartnerController,
} = require("../../controllers/partnerController");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const router = express.Router();

router.get("/", getAllPartnersController);
router.get("/:id", getPartnerController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("partners", "photo"),
  createPartnerController
);

router
  .route("/:id")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("partners", "photo"),
    updatePartnerController
  )
  .delete(deletePartnerController);

module.exports = router;
