const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const {
  createOne,
  getAll,
  getOneBySlug,
  updateOneBySlug,
} = require("./handleFactory");
const generateSlug = require("../utils/slugGenerator");

// exports.createCategoryController = createOne(Category);
exports.createCategoryController = catchAsync(async (req, res, next) => {
  const body = { ...req.body };
  const title = body?.title;
  const slug = generateSlug(title)
  body.slug = slug;

  const doc = await Category.create(body);

    res.status(201).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        doc,
      },
    });
});

exports.getAllCategoriesController = getAll(Category);

exports.getCategoryController = getOneBySlug(Category);

exports.updateCategoryController = updateOneBySlug(Category);

exports.deleteCategoryController = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  // 1. Find the category by slug
  const category = await Category.findOne({ slug });
  if (!category) {
    return next(new AppError("No category was found with that name!", 404));
  }

  // 2. Find all products associated with the category
  const products = await Product.find({ category: category._id });

  // 3. Delete all products and their photos on Cloudinary
  for (const product of products) {
    const cloudinaryPublicIds = product.photos.map((photoUrl) => {
      const photoUrlParts = photoUrl
        .split("/")
        .slice(-4)
        .join("/")
        .split(".")[0];

      return photoUrlParts;
    });

    if (cloudinaryPublicIds.length > 0) {
      await deleteUploadedImages(cloudinaryPublicIds);
    }

    await Product.findByIdAndDelete(product._id);
  }

  await Category.findByIdAndDelete(category._id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// All Products of a Category:
exports.getAllProductsOfCategory = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug });
  if (!category) {
    return next(new AppError("No category was found with that name!", 404));
  }

  const query = Product.find({ _id: { $in: category.products } });
  const count = await Product.countDocuments({ _id: { $in: category.products } });

  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  res.status(200).json({
    status: "success",
    totalData: count, 
    results: products.length,
    data: {
      products,
    },
  });
});
