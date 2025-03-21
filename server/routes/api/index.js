/* eslint-disable no-unused-vars */
const express = require("express");
const authRoute = require("./authRoute");
const areaRoute = require("./areaRoute");
const districtRoute = require("./districtRoute");
const bookingRoute = require("./bookingRoute");
const thanaRoute = require("./thanaRoute");
const userRoute = require("./userRoute");
const categoryRoute = require("./categoryRoute");
const productRoute = require("./productRoute");
const discountRoute = require("./discountRoute");
const orderRoute = require("./orderRoute");
const paymentRoute = require("./paymentRoute");
const blogCategoryRoute = require("./blogCategoryRoute");
const blogRoute = require("./blogRoute");
const storyRoute = require("./storyRoute");
const serviceRoute = require("./serviceRoute");
const serviceCategoryRoute = require("./serviceCategoryRoute");
const eventRoute = require("./eventRoute");
const partnerRoute = require("./partnerRoute");
const bannerRoute = require("./bannerRoute");
const contactRoute = require("./contactRoute");
const searchRoute = require("./searchRoute");
const mechanicRoute = require("./mechanicRoute");
const translateRoute = require("./translateRoute");
const dashboardRoute = require("./dashboardRoute");
const homeApplianceProductRoute = require("./homeApplianceProductRoute");
const homeApplianceCategory = require("./homeApplianceCategory");
const homeApplianceSubCategory = require("./homeApplianceSubCategory");
const homeApplianceSubChildCategory = require("./homeApplianceSubChildCategory");
const homeApplianceHierarchy = require("./homeApplianceHierarchy");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/category", categoryRoute);
router.use("/products", productRoute);
router.use("/discount", discountRoute);
router.use("/orders", orderRoute);
// router.use("/payment", paymentRoute);
router.use("/blogCategories", blogCategoryRoute);
router.use("/blogs", blogRoute);
router.use("/stories", storyRoute);
router.use("/services", serviceRoute);
router.use("/services-category", serviceCategoryRoute);
router.use("/events", eventRoute);
router.use("/partners", partnerRoute);
router.use("/banners", bannerRoute);
router.use("/contacts", contactRoute);
router.use("/search", searchRoute);
router.use("/areas", areaRoute);
router.use("/districts", districtRoute);
router.use("/bookings", bookingRoute);
router.use("/thanas", thanaRoute);
router.use("/mechanics", mechanicRoute);
router.use("/translate", translateRoute);
router.use("/dashboard-count", dashboardRoute);
router.use("/home-appliance-product", homeApplianceProductRoute);
router.use("/home-appliance-category", homeApplianceCategory);
router.use("/home-appliance-subcategory", homeApplianceSubCategory);
router.use("/home-appliance-subchildcategory", homeApplianceSubChildCategory);
router.use("/home-appliance-hierarchy", homeApplianceHierarchy);

module.exports = router;
