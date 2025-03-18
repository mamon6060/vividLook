/* eslint-disable no-unused-vars */
const AppError = require("../utils/AppError");
const Area = require("../models/areaModel");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOne } = require("./handleFactory");

const extractPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop(); // Get the file name with extension
  const publicId = parts.slice(7).join("/") + "/" + fileName.split(".")[0]; // Extract publicId without extension
  return publicId;
};

exports.createAreaController = catchAsync(async (req, res, next) => {
  let area;

  try {
    area = await Area.create(req.body);
  } catch (error) {
    await deleteUploadedImages([req.body.publicId]);
    return next(error);
  }

  res.status(201).json({
    status: "success",
    message: "Area has been created successfully",
    data: {
      area,
    },
  });
});

exports.getAllAreasController = getAll(Area, ["districtRef", "thanaRef"]);

exports.getAreaController = getOne(Area, ["districtRef", "thanaRef"]);

exports.updateAreaController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { photo } = req.body;

  const area = await Area.findById(id);
  if (!area) return next(new AppError("Area was not found!", 404));

  let updatedAreaData = { ...req.body };

  // Check if a new photo is provided
  if (photo && photo !== area.photo) {
    const publicId = extractPublicIdFromUrl(area.photo);

    try {
      await deleteUploadedImages([publicId]);
    } catch (error) {
      return next(
        new AppError("Failed to delete the old image from Cloudinary", 500)
      );
    }

    updatedAreaData.photo = photo;
  } else {
    updatedAreaData.photo = area.photo;
  }

  const updatedArea = await Area.findByIdAndUpdate(id, updatedAreaData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Area has been updated successfully",
    data: {
      area: updatedArea,
    },
  });
});

exports.deleteAreaController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const area = await Area.findById(id);
  if (!area) return next(new AppError("Area was not found", 404));

  const publicId = extractPublicIdFromUrl(area.photo);

  await Area.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    message: "Area deleted successfully",
    data: null,
  });
});
