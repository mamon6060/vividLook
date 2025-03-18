const HomeApplianceCategory = require("../models/homeApplianceCategoryModel");
const HomeApplianceProduct = require("../models/homeApplianceModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOneBySlug, updateOneBySlug } = require("./handleFactory");

exports.createHomeApplianceCategoryController = catchAsync(async (req, res) => {
  const body = { ...req.body };

  const doc = await HomeApplianceCategory.create(body);

  res.status(201).json({
    status: "success",
    requestedAt: req.requestTime,
    data: { doc },
  });
});

exports.getAllHomeApplianceCategoriesController = getAll(HomeApplianceCategory);

exports.getHomeApplianceCategoryController = getOneBySlug(HomeApplianceCategory);

exports.updateHomeApplianceCategoryController = updateOneBySlug(HomeApplianceCategory);

exports.deleteHomeApplianceCategoryController = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const category = await HomeApplianceCategory.findOne({ slug });
  if (!category) {
    return next(new AppError("No category found with that name!", 404));
  }

  const products = await HomeApplianceProduct.find({ category: category._id });

  for (const product of products) {
    const cloudinaryPublicIds = product.photos.map((photoUrl) =>
      photoUrl.split("/").slice(-4).join("/").split(".")[0]
    );

    if (cloudinaryPublicIds.length > 0) {
      await deleteUploadedImages(cloudinaryPublicIds);
    }

    await HomeApplianceProduct.findByIdAndDelete(product._id);
  }

  await HomeApplianceCategory.findByIdAndDelete(category._id);

  res.status(204).json({ status: "success", data: null });
});
