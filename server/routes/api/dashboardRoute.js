/* eslint-disable no-unused-vars */
const express = require("express");

const { getDashboardCounts } = require("../../controllers/orderController");

const router = express.Router();

router.get("/", getDashboardCounts);

module.exports = router;
