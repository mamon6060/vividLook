/* eslint-disable no-unused-vars */
const AppError = require("../utils/AppError");
const ServiceCategory = require("../models/serviceCategoryModel");
const Service = require("../models/serviceModel");

const catchAsync = require("../utils/catchAsync");
// const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOne } = require("./handleFactory");

exports.createServiceCategoryController = catchAsync(async (req, res, next) => {
  let serviceCategory;

  try {
    serviceCategory = await ServiceCategory.create(req.body);
  } catch (error) {
    // await deleteUploadedImages([req.body.publicId]);
    return next(error);
  }

  res.status(201).json({
    status: "success",
    message: "ServiceCategory has been created successfully",
    data: {
      serviceCategory,
    },
  });
});

exports.getAllServiceCategorysController = getAll(ServiceCategory);

exports.getAllServicesByCategoryController = catchAsync(
  async (req, res, next) => {
    const categories = await ServiceCategory.find().lean();

    const categoriesWithServices = await Promise.all(
      categories.map(async (category) => {
        const services = await Service.find({
          serviceCategoryRef: category._id,
        }).lean();
        return { ...category, services };
      })
    );

    res.status(200).json({
      status: "success",
      results: categoriesWithServices.length,
      data: {
        result: categoriesWithServices,
        categories: categories,
      },
    });
  }
);

exports.getServiceCategoryController = getOne(ServiceCategory);

exports.updateServiceCategoryController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  // const { photo } = req.body;

  const serviceCategory = await ServiceCategory.findById(id);
  if (!serviceCategory)
    return next(new AppError("ServiceCategory was not found!", 404));

  let updatedServiceCategoryData = { ...req.body };

  // Check if a new photo is provided
  // if (photo && photo !== serviceCategory.photo) {
  //   const publicId = extractPublicIdFromUrl(serviceCategory.photo);

  //   try {
  //     await deleteUploadedImages([publicId]);
  //   } catch (error) {
  //     return next(
  //       new AppError("Failed to delete the old image from Cloudinary", 500)
  //     );
  //   }

  //   updatedServiceCategoryData.photo = photo;
  // } else {
  //   updatedServiceCategoryData.photo = serviceCategory.photo;
  // }

  const updatedServiceCategory = await ServiceCategory.findByIdAndUpdate(
    id,
    updatedServiceCategoryData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "ServiceCategory has been updated successfully",
    data: {
      serviceCategory: updatedServiceCategory,
    },
  });
});

exports.deleteServiceCategoryController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const serviceCategory = await ServiceCategory.findById(id);
  if (!serviceCategory)
    return next(new AppError("ServiceCategory was not found", 404));

  // const publicId = extractPublicIdFromUrl(serviceCategory.photo);

  // try {
  //   await deleteUploadedImages([publicId]);
  // } catch (error) {
  //   return next(
  //     new AppError("Failed to delete the image from Cloudinary", 500)
  //   );
  // }

  await ServiceCategory.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    message: "ServiceCategory deleted successfully",
    data: null,
  });
});
