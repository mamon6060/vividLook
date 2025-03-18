const HomeApplianceSubchildcategory = require("../models/homeApplianceSubChildCategoryModel");
const HomeApplianceProduct = require("../models/homeApplianceModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOneBySlug, updateOneBySlug } = require("./handleFactory");
const homeApplianceSubCategoryModel = require("../models/homeApplianceSubCategoryModel");

exports.createHomeApplianceSubchildcategoryController = catchAsync(
  async (req, res) => {
    const body = { ...req.body };

    const doc = await HomeApplianceSubchildcategory.create(body);

    await homeApplianceSubCategoryModel.findOneAndUpdate(
      { _id: doc.subcategory },
      {
        $push: { subchildcategories: doc._id },
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

exports.getAllSubchildcategoriesController = getAll(
  HomeApplianceSubchildcategory,
  ["subcategory"]
);

exports.getHomeApplianceSubchildcategoryController = getOneBySlug(
  HomeApplianceSubchildcategory
);

exports.updateHomeApplianceSubchildcategoryController = updateOneBySlug(
  HomeApplianceSubchildcategory
);

exports.deleteHomeApplianceSubchildcategoryController = catchAsync(
  async (req, res, next) => {
    const { slug } = req.params;

    const subchildcategory = await HomeApplianceSubchildcategory.findOne({
      slug,
    });
    if (!subchildcategory) {
      return next(
        new AppError("No subchildcategory found with that name!", 404)
      );
    }

    const products = await HomeApplianceProduct.find({
      subchildcategory: subchildcategory._id,
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

    await HomeApplianceSubchildcategory.findByIdAndDelete(subchildcategory._id);

    res.status(204).json({ status: "success", data: null });
  }
);
