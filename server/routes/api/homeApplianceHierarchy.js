const express = require("express");
// const protectMiddleware = require("../../middlewares/protectMiddleware");
// const restrictToMiddleware = require("../../middlewares/restrictToMiddleware");
const {
  getHomeApplianceHierarchyController,
} = require("../../controllers/homeApplianceHierarchyController");

const router = express.Router();

router.get("/", getHomeApplianceHierarchyController);

module.exports = router;
