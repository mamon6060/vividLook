/* eslint-disable no-unused-vars */
const AppError = require("../utils/AppError");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const { getAll, getOne } = require("./handleFactory");
const Service = require("../models/serviceModel");
const Mechanic = require("../models/mechanicModel");

exports.createBookingController = catchAsync(async (req, res, next) => {
  const { services } = req.body;

  if (!services || !Array.isArray(services) || services.length === 0) {
    return next(new AppError("At least one service must be selected", 400));
  }

  // Extract service IDs from the request body
  const serviceIds = services.map((s) => s.serviceRef);

  // Fetch services from the database
  const serviceData = await Service.find({ _id: { $in: serviceIds } });

  // Check if all requested services exist
  if (serviceData.length !== serviceIds.length) {
    return next(new AppError("One or more selected services are invalid", 400));
  }

  // Calculate total cost
  let totalCost = 0;
  services.forEach((service) => {
    const matchedService = serviceData.find(
      (s) => s._id.toString() === service.serviceRef
    );
    if (matchedService) {
      totalCost += matchedService.price * service.quantity;
    }
  });

  // Create the booking with the calculated totalCost
  const booking = await Booking.create({ ...req.body, totalCost });

  res.status(201).json({
    status: "success",
    message: "Booking has been created successfully",
    data: { booking },
  });
});

// exports.getAllBookingsController = getAll(Booking, [
//   "districtRef",
//   "thanaRef",
//   "areaRef",
//   "services.serviceRef",
// ]);

exports.getAllBookingsController = catchAsync(async (req, res, next) => {
  // Fetch all bookings with necessary references populated
  const bookings = await Booking.find()
    .populate("districtRef thanaRef areaRef services.serviceRef mechanicRef")
    .lean(); // Use lean() for better performance

  // Loop through each booking to fetch mechanics in the same area
  for (const booking of bookings) {
    booking.mechanics = await Mechanic.find({
      areaRef: booking.areaRef?._id,
    }).select("-__v");
  }

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: { bookings },
  });
});

exports.getBookingController = getOne(Booking, [
  "districtRef",
  "thanaRef",
  "areaRef",
  "services.serviceRef",
  "mechanicRef",
]);

exports.updateBookingController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return next(new AppError("Invalid Booking ID format", 400));
  }

  const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedBooking) return next(new AppError("Booking was not found!", 404));

  res.status(200).json({
    status: "success",
    message: "Booking has been updated successfully",
    data: { booking: updatedBooking },
  });
});

exports.updateBookingStatusController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { bookingStatus } = req.body;

  // Validate if bookingStatus is present and valid
  const validStatuses = ["received", "complete", "cancelled"];
  if (bookingStatus && !validStatuses.includes(bookingStatus)) {
    return next(new AppError("Invalid booking status", 400));
  }

  if (!mongoose.isValidObjectId(id)) {
    return next(new AppError("Invalid Booking ID format", 400));
  }

  const updatedBooking = await Booking.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedBooking) return next(new AppError("Booking was not found!", 404));

  res.status(200).json({
    status: "success",
    message: "Booking has been updated successfully",
    data: { booking: updatedBooking },
  });
});

exports.deleteBookingController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return next(new AppError("Invalid Booking ID format", 400));
  }

  const booking = await Booking.findById(id);
  if (!booking) return next(new AppError("Booking was not found", 404));

  await Booking.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    message: "Booking deleted successfully",
    data: null,
  });
});
