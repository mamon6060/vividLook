/* eslint-disable no-unused-vars */
const AppError = require("../utils/AppError");
const District = require("../models/disctrictModel");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOne } = require("./handleFactory");

const extractPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop(); // Get the file name with extension
  const publicId = parts.slice(7).join("/") + "/" + fileName.split(".")[0]; // Extract publicId without extension
  return publicId;
};

exports.createDistrictController = catchAsync(async (req, res, next) => {
  let district;

  try {
    district = await District.create(req.body);
  } catch (error) {
    await deleteUploadedImages([req.body.publicId]);
    return next(error);
  }

  res.status(201).json({
    status: "success",
    message: "District has been created successfully",
    data: {
      district,
    },
  });
});

exports.getAllDistrictsController = getAll(District);

exports.getDistrictController = getOne(District);

exports.updateDistrictController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { photo } = req.body;

  const district = await District.findById(id);
  if (!district) return next(new AppError("District was not found!", 404));

  let updatedDistrictData = { ...req.body };

  // Check if a new photo is provided
  if (photo && photo !== district.photo) {
    const publicId = extractPublicIdFromUrl(district.photo);

    try {
      await deleteUploadedImages([publicId]);
    } catch (error) {
      return next(
        new AppError("Failed to delete the old image from Cloudinary", 500)
      );
    }

    updatedDistrictData.photo = photo;
  } else {
    updatedDistrictData.photo = district.photo;
  }

  const updatedDistrict = await District.findByIdAndUpdate(
    id,
    updatedDistrictData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    message: "District has been updated successfully",
    data: {
      district: updatedDistrict,
    },
  });
});

exports.deleteDistrictController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const district = await District.findById(id);
  if (!district) return next(new AppError("District was not found", 404));

  await District.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    message: "District deleted successfully",
    data: null,
  });
});
