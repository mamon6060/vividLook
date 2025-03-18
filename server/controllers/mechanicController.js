/* eslint-disable no-unused-vars */
const AppError = require("../utils/AppError");
const Mechanic = require("../models/mechanicModel");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const { getAll, getOne } = require("./handleFactory");
const Service = require("../models/serviceModel");

exports.createMechanicController = catchAsync(async (req, res, next) => {
  // Create the mechanic with the calculated totalCost
  const mechanic = await Mechanic.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Mechanic has been created successfully",
    data: { mechanic },
  });
});

exports.getAllMechanicsController = getAll(Mechanic, {
  path: "areaRef",
  populate: {
    path: "thanaRef",
    populate: { path: "districtRef" },
  },
});

exports.getMechanicController = getOne(Mechanic, {
  path: "areaRef",
  populate: {
    path: "thanaRef",
    populate: { path: "districtRef" },
  },
});

exports.getAllMechanicsByAreaController = catchAsync(async (req, res, next) => {
  const { areaId } = req.params;

  if (!mongoose.isValidObjectId(areaId)) {
    return next(new AppError("Invalid Area ID format", 400));
  }

  const mechanics = await Mechanic.find({ areaRef: areaId })
    .populate({
      path: "areaRef",
      populate: {
        path: "thanaRef",
        populate: { path: "districtRef" },
      },
    })
    .select("-__v");

  if (!mechanics.length) {
    return next(new AppError("No mechanics found for this area", 404));
  }

  res.status(200).json({
    status: "success",
    results: mechanics.length,
    data: { mechanics },
  });
});

// exports.updateMechanicController = catchAsync(async (req, res, next) => {
//   const { id } = req.params;

//   if (!mongoose.isValidObjectId(id)) {
//     return next(new AppError("Invalid Mechanic ID format", 400));
//   }

//   const updatedMechanic = await Mechanic.findByIdAndUpdate(id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!updatedMechanic)
//     return next(new AppError("Mechanic was not found!", 404));

//   res.status(200).json({
//     status: "success",
//     message: "Mechanic has been updated successfully",
//     data: { mechanic: updatedMechanic },
//   });
// });

exports.updateMechanicController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { totalService } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return next(new AppError("Invalid Mechanic ID format", 400));
  }

  const updateQuery = {};
  if (totalService) {
    updateQuery.$inc = { totalService: totalService }; // Ensure incrementing
  }

  const updatedMechanic = await Mechanic.findByIdAndUpdate(id, updateQuery, {
    new: true,
    runValidators: true,
  });

  if (!updatedMechanic) {
    return next(new AppError("Mechanic was not found!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Mechanic has been updated successfully",
    data: { mechanic: updatedMechanic },
  });
});

exports.deleteMechanicController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return next(new AppError("Invalid Mechanic ID format", 400));
  }

  const mechanic = await Mechanic.findById(id);
  if (!mechanic) return next(new AppError("Mechanic was not found", 404));

  await Mechanic.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    message: "Mechanic deleted successfully",
    data: null,
  });
});
