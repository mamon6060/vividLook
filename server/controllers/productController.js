const category = require("../models/categoryModel");
const Product = require("../models/productModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll } = require("./handleFactory");
// const generateSlug = require("../utils/slugGenerator");

exports.createProductController = catchAsync(async (req, res, next) => {
  const body = { ...req.body };
  // const title = body?.title;
  // const slug = generateSlug(title)
  // if (!body.photos || body.photos.length === 0) {
  //   return next(
  //     new AppError(
  //       "Validation failed, Photos are required to create a product",
  //       400
  //     )
  //   );
  // }

  try {
    // body.slug = slug;
    const product = await Product.create(body);

    await category.findOneAndUpdate(
      { _id: product.category },
      {
        $push: { products: product._id },
      },
      { new: true }
    );

    res.status(201).json({
      status: "success",
      message: "Product has been created successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    await deleteUploadedImages(req.body.publicIds);
    return next(error);
  }
});

exports.getAllProductsController = getAll(Product, {
  path: "category",
  select: "title",
});

exports.getProductController = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug })
    .populate({
      path: "category",
      select: "id slug",
    })
    .select("-__v");
  if (!product) {
    return next(new AppError("No product was found with that name!", 404));
  }

  product.visitCount += 1;
  await product.save();

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.updateProductController = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const body = { ...req.body };

  // Handle new photos if provided by the Cloudinary upload middleware
  if (req.body.photos && req.body.photos.length > 0) {
    body.photos = req.body.photos;
  }

  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      return next(new AppError("No product was found with that name!", 404));
    }

    // Delete old photos from Cloudinary if new ones are uploaded
    if (req.body.photos && req.body.photos.length > 0) {
      const oldPhotoPublicIds = product.photos.map((photoUrl) => {
        const publicId = photoUrl.split("/").slice(-4).join("/").split(".")[0];
        return publicId;
      });

      await deleteUploadedImages(oldPhotoPublicIds);
    }

    // Update the product with new data
    Object.assign(product, body);
    await product.save();

    res.status(200).json({
      status: "success",
      message: "Product has been updated successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    // In case of error, handle the deletion of newly uploaded photos
    if (req.body.photos && req.body.photos.length > 0) {
      const newPhotoPublicIds = req.body.photos.map((photoUrl) => {
        const publicId = photoUrl.split("/").slice(-4).join("/").split(".")[0];
        return publicId;
      });

      await deleteUploadedImages(newPhotoPublicIds);
    }

    return next(error);
  }
});

exports.deleteProductController = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const product = await Product.findOne({ slug });
  if (!product) {
    return next(new AppError("No product was found with that name!", 404));
  }

  if (product.photos && product.photos.length > 0) {
    const oldPhotoPublicIds = product.photos.map((photoUrl) => {
      const publicId = photoUrl.split("/").slice(-4).join("/").split(".")[0];
      return publicId;
    });

    await deleteUploadedImages(oldPhotoPublicIds);
  }

  await category.findOneAndUpdate(
    { _id: product.category },
    { $pull: { products: product._id } },
    { new: true }
  );

  await product.deleteOne();

  res.status(204).json({
    status: "success",
    message: "Product has been deleted successfully",
    data: null,
  });
});

exports.getPriceRangeController = catchAsync(async (req, res) => {
  const priceRange = await Product.aggregate([
    {
      $group: {
        _id: null,
        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
      },
    },
  ]);

  if (priceRange.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No products found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      maxPrice: priceRange[0].maxPrice,
      minPrice: priceRange[0].minPrice,
    },
  });
});

