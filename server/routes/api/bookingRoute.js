/* eslint-disable no-unused-vars */
const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
} = require("../../middlewares/photoMiddleware");

const {
  getAllBookingsController,
  getBookingController,
  createBookingController,
  updateBookingController,
  updateBookingStatusController,
  deleteBookingController,
} = require("../../controllers/bookingController");

const router = express.Router();

router.get("/", getAllBookingsController);
router.get("/:id", getBookingController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.post(
  "/",
  uploadPhotoMiddleware(),
  cloudinaryUploadMiddleware("bookings", "photo"),
  createBookingController
);

router
  .route("/:id")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("bookings", "photo"),
    updateBookingController
  )
  .delete(deleteBookingController);

router
  .route("/status/:id")
  .patch(
    uploadPhotoMiddleware(),
    cloudinaryUploadMiddleware("bookings", "photo"),
    updateBookingStatusController
  );

module.exports = router;
