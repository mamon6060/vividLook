const AppError = require("../utils/AppError");
const Story = require("../models/storyModel");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOne } = require("./handleFactory");

const isYouTubeLink = (url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
  return youtubeRegex.test(url);
};

const isImageLink = (url) => {
  const imageRegex = /\.(jpeg|jpg|gif|png|webp|avif)$/i;
  return imageRegex.test(url);
};

const extractPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop(); // Get the file name with extension
  const publicId = parts.slice(7).join("/") + "/" + fileName.split(".")[0]; // Extract publicId without extension
  return publicId;
};

exports.createStoryController = catchAsync(async (req, res, next) => {
  const { photo, publicId } = req.body;

  if (!photo) {
    return next(
      new AppError(
        "No media uploaded, Please upload an image or a YouTube video link",
        400
      )
    );
  }

  // Check if the photo is either an image or a YouTube link
  const isValidMedia = isImageLink(photo) || isYouTubeLink(photo);

  if (!isValidMedia) {
    return next(
      new AppError(
        "Invalid media format, Please provide a valid image URL or YouTube video link",
        400
      )
    );
  }

  const body = { ...req.body, photo }; // Store the photo or video link

  try {
    const story = await Story.create(body);

    return res.status(201).json({
      status: "success",
      message: "Success story has been created successfully",
      data: {
        story,
      },
    });
  } catch (error) {
    // If there's an error, delete uploaded images (if applicable)
    if (publicId && publicId.length > 0) {
      await deleteUploadedImages(publicId);
    }
    return next(error);
  }
});

exports.getAllStoriesController = getAll(Story);

exports.getStoryController = getOne(Story);

exports.updateStoryController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { photo } = req.body;

  const story = await Story.findById(id);
  if (!story) return next(new AppError("Story was not found!", 404));

  let updatedPhoto = photo || story.photo; // If no new photo is provided, keep the existing one

  // If new media (photo or YouTube link) is provided
  if (photo) {
    const isValidMedia = isImageLink(photo) || isYouTubeLink(photo);

    if (!isValidMedia) {
      return next(
        new AppError(
          "Invalid media format, please provide a valid image URL or YouTube video link",
          400
        )
      );
    }

    const publicId = extractPublicIdFromUrl(story.photo);

    try {
      await deleteUploadedImages([publicId]);
    } catch (error) {
      return next(
        new AppError("Failed to delete the old image from Cloudinary", 500)
      );
    }

    updatedPhoto = photo;
  }

  const updatedStory = await Story.findByIdAndUpdate(
    id,
    { ...req.body, photo: updatedPhoto },
    { new: true, runValidators: true }
  );

  return res.status(200).json({
    status: "success",
    message: "Story updated successfully",
    data: {
      story: updatedStory,
    },
  });
});

exports.deleteStoryController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const story = await Story.findById(id);
  if (!story) return next(new AppError("No story was found!", 404));

  const publicId = extractPublicIdFromUrl(story.photo);
  await deleteUploadedImages([publicId]);
  await Story.findByIdAndDelete(id);

  return res.status(204).json({
    status: "success",
    message: "Story deleted successfully",
    data: null,
  });
});
