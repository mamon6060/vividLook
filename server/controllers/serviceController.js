/* eslint-disable no-unused-vars */
const AppError = require("../utils/AppError");
const Service = require("../models/serviceModel");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOne } = require("./handleFactory");

const extractPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop(); // Get the file name with extension
  const publicId = parts.slice(7).join("/") + "/" + fileName.split(".")[0]; // Extract publicId without extension
  return publicId;
};

exports.createServiceController = catchAsync(async (req, res, next) => {
  let service;

  try {
    service = await Service.create(req.body);
  } catch (error) {
    await deleteUploadedImages([req.body.publicId]);
    return next(error);
  }

  res.status(201).json({
    status: "success",
    message: "Service has been created successfully",
    data: {
      service,
    },
  });
});

exports.getAllServicesController = getAll(Service, ["serviceCategoryRef"]);

exports.getServiceController = getOne(Service, ["serviceCategoryRef"]);

exports.updateServiceController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { photo } = req.body;

  const service = await Service.findById(id);
  if (!service) return next(new AppError("Service was not found!", 404));

  let updatedServiceData = { ...req.body };

  // Check if a new photo is provided
  if (photo && photo !== service.photo) {
    const publicId = extractPublicIdFromUrl(service.photo);

    try {
      await deleteUploadedImages([publicId]);
    } catch (error) {
      return next(
        new AppError("Failed to delete the old image from Cloudinary", 500)
      );
    }

    updatedServiceData.photo = photo;
  } else {
    updatedServiceData.photo = service.photo;
  }

  const updatedService = await Service.findByIdAndUpdate(
    id,
    updatedServiceData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Service has been updated successfully",
    data: {
      service: updatedService,
    },
  });
});

exports.deleteServiceController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const service = await Service.findById(id);
  if (!service) return next(new AppError("Service was not found", 404));

  const publicId = extractPublicIdFromUrl(service.photo);

  try {
    await deleteUploadedImages([publicId]);
  } catch (error) {
    return next(
      new AppError("Failed to delete the image from Cloudinary", 500)
    );
  }

  await Service.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    message: "Service deleted successfully",
    data: null,
  });
});
