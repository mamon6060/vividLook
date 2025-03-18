const HomeApplianceProduct = require("../models/homeApplianceModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOneBySlug, updateOneBySlug } = require("./handleFactory");
const homeApplianceSubChildCategoryModel = require("../models/homeApplianceSubChildCategoryModel");
const Product = require("../models/productModel");

exports.createHomeApplianceProductController = catchAsync(async (req, res) => {
  const body = { ...req.body };

  const doc = await HomeApplianceProduct.create(body);

  await homeApplianceSubChildCategoryModel.findOneAndUpdate(
    { _id: doc.subchildcategory },
    {
      $push: { products: doc._id },
    },
    { new: true }
  );

  res.status(201).json({
    status: "success",
    requestedAt: req.requestTime,
    data: { doc },
  });
});

exports.getAllProductsController = getAll(HomeApplianceProduct, [
  "category",
  "subcategory",
  "subchildcategory",
]);

exports.getHomeApplianceProductController = getOneBySlug(HomeApplianceProduct, [
  "category",
  "subcategory",
  "subchildcategory",
]);

exports.updateHomeApplianceProductController =
  updateOneBySlug(HomeApplianceProduct);

exports.deleteHomeApplianceProductController = catchAsync(
  async (req, res, next) => {
    const { slug } = req.params;

    const product = await HomeApplianceProduct.findOne({ slug });
    if (!product) {
      return next(new AppError("No product found with that name!", 404));
    }

    const cloudinaryPublicIds = product.photos.map(
      (photoUrl) => photoUrl.split("/").slice(-4).join("/").split(".")[0]
    );

    if (cloudinaryPublicIds.length > 0) {
      await deleteUploadedImages(cloudinaryPublicIds);
    }

    await HomeApplianceProduct.findByIdAndDelete(product._id);

    res.status(204).json({ status: "success", data: null });
  }
);

exports.searchProducts = catchAsync(async (req, res) => {
  const { query, categoryRef } = req.body;

  if (!query) {
    return res.status(400).json({
      status: "fail",
      message: "Search query is required",
    });
  }

  // Construct the search filter
  let filter = {
    $or: [
      { title: { $regex: query, $options: "i" } },
      { sku: { $regex: query, $options: "i" } },
    ],
  };

  if (categoryRef) {
    filter.category = categoryRef;
  }

  const homeApplianceProducts = await HomeApplianceProduct.find(
    filter
  ).populate("category");
  // const products = await Product.find(filter).populate("category");

  res.status(200).json({
    status: "success",
    // results: products.length,
    results: homeApplianceProducts.length,
    data: {
      homeApplianceProducts,
    },
  });
});

exports.getPriceRangeController = catchAsync(async (req, res) => {
  const priceRange = await HomeApplianceProduct.aggregate([
    {
      $group: {
        _id: null,
        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
      },
    },
  ]);

  if (priceRange.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No products found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      maxPrice: priceRange[0].maxPrice,
      minPrice: priceRange[0].minPrice,
    },
  });
});
