const AppError = require("../utils/AppError");
const Partner = require("../models/partnerModel");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOne } = require("./handleFactory");

const extractPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const fileName = parts.pop(); // Get the file name with extension
  const publicId = parts.slice(7).join("/") + "/" + fileName.split(".")[0]; // Extract publicId without extension
  return publicId;
};

exports.createPartnerController = catchAsync(async (req, res) => {
  const partner = await Partner.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Partner has been create successfully",
    data: {
      partner,
    },
  });
});

exports.getAllPartnersController = getAll(Partner);

exports.getPartnerController = getOne(Partner);

exports.updatePartnerController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { photo } = req.body;

  const partner = await Partner.findById(id);
  if (!partner) {
    return next(new AppError("Partner not found", 404));
  }

  // If a new photo is uploaded, delete the old one from Cloudinary
  if (photo && partner.photo) {
    const publicId = extractPublicIdFromUrl(partner.photo);
    try {
      await deleteUploadedImages([publicId]);
    } catch (error) {
      return next(
        new AppError("Failed to delete the old image from Cloudinary", 500)
      );
    }
  }

  // Update partner with new photo and other data
  const updatedPartner = await Partner.findByIdAndUpdate(
    id,
    { ...req.body, photo: photo || partner.photo },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    message: "Partner updated successfully",
    data: {
      partner: updatedPartner,
    },
  });
});

exports.deletePartnerController = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const partner = await Partner.findById(id);
  if (!partner) return next(new AppError("Partner was not found!", 404));

  const publicId = extractPublicIdFromUrl(partner.photo);
  try {
    await deleteUploadedImages([publicId]);
  } catch (error) {
    return next(
      new AppError("Failed to delete the image from Cloudinary", 500)
    );
  }

  await Partner.findByIdAndDelete(id);

  res.status(204).json({
    status: "success",
    message: "Partner deleted successfully",
    data: null,
  });
});
