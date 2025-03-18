const AppError = require("../utils/AppError");
const Banner = require("../models/bannerModel");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOne } = require("./handleFactory");

const extractPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop(); // Get the file name with extension
  const folder = parts.slice(7).join("/"); // Extract folder path
  const publicId = `${folder}/${fileName.split(".")[0]}`; // Extract publicId without extension
  return publicId;
};

exports.createBannerController = catchAsync(async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Banner has been created successfully",
      data: {
        banner,
      },
    });
  } catch (error) {
    const resourceType = req.body.mediaType === "video" ? "video" : "image";
    await deleteUploadedImages([req.body.publicId], resourceType);
    return next(error);
  }
});

exports.getAllBannersController = getAll(Banner);

exports.getBannerController = getOne(Banner);

exports.updateBannerController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);
  if (!banner) return next(new AppError("Banner was not found!", 404));

  // If a new photo is uploaded, delete the old one from Cloudinary
  if (req.body.photo && banner.photo) {
    const oldPhotoPublicId = extractPublicIdFromUrl(banner.photo);
    const resourceType = banner.mediaType || "image";
    await deleteUploadedImages([oldPhotoPublicId], resourceType);
  }

  const updatedBanner = await Banner.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "Banner has been updated successfully",
    data: {
      banner: updatedBanner,
    },
  });
});

exports.deleteBannerController = catchAsync(async (req, res, next) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return next(new AppError("Banner was not found!", 404));

  if (banner.photo) {
    const publicId = extractPublicIdFromUrl(banner.photo);
    const resourceType = banner.mediaType || "image";
    await deleteUploadedImages([publicId], resourceType);
  }

  await Banner.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    message: "Banner has been deleted successfully",
    data: null,
  });
});
