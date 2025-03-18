const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const {
  getAllMechanicsController,
  getMechanicController,
  getAllMechanicsByAreaController,
  createMechanicController,
  updateMechanicController,
  deleteMechanicController,
} = require("../../controllers/mechanicController");

const router = express.Router();

router.get("/", getAllMechanicsController);
router.get("/:areaId", getAllMechanicsByAreaController);
router.get("/:id", getMechanicController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("mechanics", "photo"),
  createMechanicController
);

router
  .route("/:id")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("mechanics", "photo"),
    updateMechanicController
  )
  .delete(deleteMechanicController);

module.exports = router;
