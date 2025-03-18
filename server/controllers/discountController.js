const Product = require("../models/productModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.applyDiscountController = catchAsync(async (req, res, next) => {
  let { type, id, discountType, discountValue } = req.body;

  if (
    !["percent", "amount", "none"].includes(discountType) ||
    discountValue == null ||
    isNaN(discountValue) ||
    discountValue < 0
  ) {
    return next(new AppError("Invalid discount type or value", 400));
  }

  if (!id) {
    return next(new AppError("ID is required to implement discount", 400));
  }

  if (!["category", "product"].includes(type)) {
    return next(new AppError("Invalid type, must be category or product", 400));
  }

  // Determine the filter based on the type
  let filter;
  if (type === "category") {
    filter = { category: id };
  } else if (type === "product") {
    filter = { _id: id };
  }

  // Find all the products matching with the filter
  const products = await Product.find(filter);

  // Check each product to ensure the discount is valid
  for (const product of products) {
    const effectivePrice =
      product.price -
      (discountType === "percent"
        ? (product.price * discountValue) / 100
        : discountValue);

    if (effectivePrice <= 0) {
      return next(
        new AppError(
          `Discounted price for ${product.title} cannot be equal to or less than zero`,
          400
        )
      );
    }
  }

  // Calculate the new discount value and update price after Discount
  for (const product of products) {
    let salePrice;

    if (discountValue === 0) {
      salePrice = product.price;
    } else {
      if (discountType === "percent") {
        salePrice = product.price - (product.price * discountValue) / 100;
      } else if (discountType === "amount") {
        salePrice = product.price - discountValue;
      } else if (discountType === "none") {
        salePrice = product.price;
        discountValue = 0;
      }
    }

    await Product.findOneAndUpdate(
      { _id: product._id },
      {
        salePrice,
        discountType: discountValue == 0 ? "none" : discountType,
        discountValue,
      },
      {
        new: true,
      }
    );
  }

  res.status(200).json({
    status: "success",
    message: "Discount applied successfully to all applicable products",
  });
});
