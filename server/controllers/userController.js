const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOne, updateOne } = require("./handleFactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((item) => {
    if (allowedFields.includes(item)) newObj[item] = obj[item];
  });

  return newObj;
};

exports.getAllUsersController = getAll(User);

exports.getUserController = getOne(User);

exports.updateUserController = updateOne(User); // Do NOT update Password with this!

exports.deleteUserController = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) return next(new AppError("No user found with that ID!", 404));

  let oldPhotoPublicId = null;
  if (user.photo) {
    oldPhotoPublicId = user.photo.split("/").slice(-4).join("/").split(".")[0];
  }

  await User.findByIdAndDelete(user._id);

  // Delete the photo from Cloudinary if it exists
  if (oldPhotoPublicId) {
    await deleteUploadedImages([oldPhotoPublicId]);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMeController = getOne(User);

exports.updateMeController = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;

  if (password || confirmPassword) {
    return next(
      new AppError(
        "This route is not for password updates, Please use /auth/updateMyPassword.",
        400
      )
    );
  }

  let oldPhotoLink = null;
  if (req.user.photo) {
    oldPhotoLink = req.user.photo.split("/").slice(-4).join("/").split(".")[0];
  }
  // 2) Filtered out unwanted field names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "name",
    "photo",
    "gender",
    "phone",
    "district",
    "upazilla",
    "area",
    "postCode",
    "streetAddress",
    "shopAddress",
    "dateOfBirth"
  );
  if (req.file) {
    filteredBody.photo = req.body.photo;
  } else {
    delete filteredBody.photo;
  }

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  }).select("-__v");

  // Delete old photo if a new one was uploaded and an old photo exists
  if (req.file && oldPhotoLink) {
    await deleteUploadedImages([oldPhotoLink]);
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMeController = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
