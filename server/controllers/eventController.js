const AppError = require("../utils/AppError");
const Event = require("../models/eventModel");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOne } = require("./handleFactory");

const extractPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop(); // Get the file name with extension
  const publicId = parts.slice(7).join("/") + "/" + fileName.split(".")[0]; // Extract publicId without extension
  return publicId;
};

exports.createEventController = catchAsync(async (req, res, next) => {
  const body = { ...req.body };
  const { startingDate, endingDate } = body;

  if (req.body.photo && req.body.photo.length > 0) {
    const publicId = req.body.publicId;
    body.photo = req.body.photo;

    if (
      startingDate &&
      endingDate &&
      new Date(startingDate) > new Date(endingDate)
    ) {
      await deleteUploadedImages([publicId]);
      return next(
        new AppError("Starting date cannot be later than the ending date", 400)
      );
    }

    try {
      const event = await Event.create(body);

      return res.status(201).json({
        status: "success",
        message: "Event has been created successfully",
        data: {
          event,
        },
      });
    } catch (error) {
      await deleteUploadedImages([publicId]);
      return next(error);
    }
  } else {
    return next(
      new AppError("No photos uploaded, Please upload at least one photo", 400)
    );
  }
});

exports.getAllEventsController = getAll(Event);

exports.getEventController = getOne(Event);

exports.updateEventController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { photo, startingDate, endingDate } = req.body;

  const event = await Event.findById(id);
  if (!event) return next(new AppError("Event was not found!", 404));

  // If a new photo is uploaded, delete the old one from Cloudinary
  if (photo && event.photo) {
    const publicId = extractPublicIdFromUrl(event.photo);
    try {
      await deleteUploadedImages([publicId]);
    } catch (error) {
      return next(
        new AppError("Failed to delete the old image from Cloudinary", 500)
      );
    }
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    {
      ...req.body,
      photo: photo || event.photo,
      startingDate: startingDate || event.startingDate,
      endingDate: endingDate || event.endingDate,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    message: "Event updated successfully",
    data: {
      event: updatedEvent,
    },
  });
});

exports.deleteEventController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const event = await Event.findById(id);
  if (!event) return next(new AppError("Event was not found!", 404));

  const publicId = extractPublicIdFromUrl(event.photo);
  try {
    await deleteUploadedImages([publicId]);
  } catch (error) {
    return next(
      new AppError("Failed to delete the image from Cloudinary", 500)
    );
  }

  await Event.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    message: "Event deleted successfully",
    data: null,
  });
});
