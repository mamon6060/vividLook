const multer = require("multer");
const AppError = require("../utils/AppError");
const { cloudinary } = require("../utils/cloudinaryConfig");
const catchAsync = require("../utils/catchAsync");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Not a valid file type, Please upload images or video only",
        400
      ),
      false
    );
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadPhotoMiddleware = (multiple = false, maxFiles = 4) => {
  return multiple ? upload.array("photos", maxFiles) : upload.single("photo");
};

// Define resizing options based on folder name
const getResizeOptions = (folder, resourceType) => {
  const resizeOptions = {
    product: {
      image: [{ width: 600, height: 600, crop: "limit", quality: "auto" }],
      video: [{ width: 1280, height: 720, crop: "scale" }],
    },
    banner: {
      image: [{ width: 1440, height: 813, crop: "limit", quality: "auto" }],
      video: [{ width: 1440, height: 813, crop: "scale" }],
    },
    blog: {
      image: [{ width: 1440, height: 813, crop: "limit", quality: "auto" }],
      video: [{ width: 1440, height: 813, crop: "scale" }],
    },
    stories: {
      image: [{ width: 1440, height: 813, crop: "limit", quality: "auto" }],
      video: [{ width: 1440, height: 813, crop: "scale" }],
    },
    services: {
      image: [{ width: 1440, height: 813, crop: "limit", quality: "auto" }],
      video: [{ width: 1440, height: 813, crop: "scale" }],
    },
    events: {
      image: [{ width: 1440, height: 813, crop: "limit", quality: "auto" }],
      video: [{ width: 1440, height: 813, crop: "scale" }],
    },
    partners: {
      image: [{ width: 500, height: 500, crop: "limit", quality: "auto" }],
      video: [{ width: 500, height: 500, crop: "scale" }],
    },
    profile: {
      image: [{ width: 450, height: 450, crop: "limit", quality: "auto" }],
      video: [{ width: 1280, height: 720, crop: "scale" }],
    },
    order: {
      image: [{ width: 550, height: 550, crop: "limit", quality: "auto" }],
      video: [{ width: 1280, height: 720, crop: "scale" }],
    },
    default: {
      image: [{ width: 600, height: 800, crop: "limit", quality: "auto" }],
      video: [{ width: 1280, height: 720, crop: "scale" }],
    },
  };

  return (
    resizeOptions[folder]?.[resourceType] || resizeOptions.default[resourceType]
  );
};

const cloudinaryUploadMiddleware = (folder, fieldName) => {
  return catchAsync(async (req, res, next) => {
    const files = req.file ? [req.file] : req.files || [];
    if (files.length === 0) return next();

    const uniqueSuffix = () =>
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const uploadToCloudinary = async (file) => {
      const folderPath = `agro-solution/uploads/${folder}`.replace(/\/+$/, "");

      const resourceType = file.mimetype.startsWith("image")
        ? "image"
        : "video";

      // Get dynamic resize options based on the folder name
      const transformation = getResizeOptions(folder, resourceType);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: folderPath,
              public_id: `${folder}-${uniqueSuffix()}`,
              resource_type: resourceType,
              transformation, // Apply dynamic resizing
            },
            (error, result) => {
              if (error) {
                reject(
                  new AppError("Failed to upload media to Cloudinary", 500)
                );
              } else {
                resolve(result);
              }
            }
          )
          .end(file.buffer);
      });

      return result; // Result --> public_id, secure_url
    };

    try {
      const uploadResults = await Promise.all(files.map(uploadToCloudinary));

      if (fieldName === "photo") {
        req.body.photo = uploadResults[0].secure_url;
        req.body.publicId = uploadResults[0].public_id;
        req.body.mediaType = uploadResults[0].resource_type;
      } else if (fieldName === "photos") {
        req.body.photos = uploadResults.map((result) => result.secure_url);
        req.body.publicIds = uploadResults.map((result) => result.public_id);
        req.body.mediaTypes = uploadResults.map(
          (result) => result.resource_type
        );
      }

      next();
    } catch (error) {
      return next(error);
    }
  });
};

const deleteUploadedImages = async (publicIds, resourceType = "image") => {
  if (!publicIds || publicIds.length === 0) return;

  try {
    await Promise.all(
      publicIds.map(async (publicId) => {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: resourceType,
        });
      })
    );
  } catch (error) {
    console.error("Failed to delete media from Cloudinary", error);
  }
};

module.exports = {
  uploadPhotoMiddleware,
  cloudinaryUploadMiddleware,
  deleteUploadedImages,
};
