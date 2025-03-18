const express = require("express");
const protectMiddleware = require("../../middlewares/protectMiddleware");
const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  createContactController,
  getAllContactsController,
  updateContactController,
  deleteContactController,
  getContactController,
} = require("../../controllers/contactController");

const router = express.Router();

router.post("/", createContactController);
router.get("/:id", getContactController);

// router.use(protectMiddleware);
// router.use(restrictToMiddleware("admin"));

router.get("/", getAllContactsController);

router
  .route("/:id")
  .patch(updateContactController)
  .delete(deleteContactController);

module.exports = router;
