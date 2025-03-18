/* eslint-disable no-unused-vars */
const AppError = require("../utils/AppError");
const Thana = require("../models/thanaModel");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOne } = require("./handleFactory");

exports.createThanaController = catchAsync(async (req, res, next) => {
  let thana;

  try {
    thana = await Thana.create(req.body);
  } catch (error) {
    return next(error);
  }

  res.status(201).json({
    status: "success",
    message: "Thana has been created successfully",
    data: {
      thana,
    },
  });
});

exports.getAllThanasController = getAll(Thana, ["districtRef"]);

exports.getThanaController = getOne(Thana, ["districtRef"]);

exports.updateThanaController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const thana = await Thana.findById(id);
  if (!thana) return next(new AppError("Thana was not found!", 404));

  let updatedThanaData = { ...req.body };

  const updatedThana = await Thana.findByIdAndUpdate(id, updatedThanaData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Thana has been updated successfully",
    data: {
      thana: updatedThana,
    },
  });
});

exports.deleteThanaController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const thana = await Thana.findById(id);
  if (!thana) return next(new AppError("Thana was not found", 404));

  await Thana.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    message: "Thana deleted successfully",
    data: null,
  });
});
