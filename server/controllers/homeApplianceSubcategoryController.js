const HomeApplianceSubcategory = require("../models/homeApplianceSubCategoryModel");
const HomeApplianceProduct = require("../models/homeApplianceModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOneBySlug, updateOneBySlug } = require("./handleFactory");
const homeApplianceCategoryModel = require("../models/homeApplianceCategoryModel");

exports.createHomeApplianceSubcategoryController = catchAsync(
  async (req, res) => {
    const body = { ...req.body };

    const doc = await HomeApplianceSubcategory.create(body);

    await homeApplianceCategoryModel.findOneAndUpdate(
      { _id: doc.category },
      {
        $push: { subcategories: doc._id },
      },
      { new: true }
    );

    res.status(201).json({
      status: "success",
      requestedAt: req.requestTime,
      data: { doc },
    });
  }
);

exports.getAllHomeApplianceSubcategoriesController = getAll(
  HomeApplianceSubcategory,
  ["category"]
);

exports.getHomeApplianceSubcategoryController = getOneBySlug(
  HomeApplianceSubcategory
);

exports.updateHomeApplianceSubcategoryController = updateOneBySlug(
  HomeApplianceSubcategory
);

exports.deleteHomeApplianceSubcategoryController = catchAsync(
  async (req, res, next) => {
    const { slug } = req.params;

    const subcategory = await HomeApplianceSubcategory.findOne({ slug });
    if (!subcategory) {
      return next(new AppError("No subcategory found with that name!", 404));
    }

    const products = await HomeApplianceProduct.find({
      subcategory: subcategory._id,
    });

    for (const product of products) {
      const cloudinaryPublicIds = product.photos.map(
        (photoUrl) => photoUrl.split("/").slice(-4).join("/").split(".")[0]
      );

      if (cloudinaryPublicIds.length > 0) {
        await deleteUploadedImages(cloudinaryPublicIds);
      }

      await HomeApplianceProduct.findByIdAndDelete(product._id);
    }

    await HomeApplianceSubcategory.findByIdAndDelete(subcategory._id);

    res.status(204).json({ status: "success", data: null });
  }
);
