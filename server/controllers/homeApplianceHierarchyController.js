const HomeApplianceCategory = require("../models/homeApplianceCategoryModel");
const catchAsync = require("../utils/catchAsync");

exports.getHomeApplianceHierarchyController = catchAsync(async (req, res) => {
  const categories = await HomeApplianceCategory.find().populate({
    path: "subcategories",
    populate: {
      path: "subchildcategories",
      populate: {
        path: "products",
      },
    },
  });

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    data: categories,
  });
});
