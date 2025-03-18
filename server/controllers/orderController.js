// /* eslint-disable no-undef */
const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const HomeApplianceProduct = require("../models/homeApplianceModel");
const AppError = require("../utils/AppError");
const Email = require("../utils/Email");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll, getOne } = require("./handleFactory");
const Booking = require("../models/bookingModel");
exports.updateOrderStatusController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  // Validate if orderStatus is present and valid
  const validStatuses = [
    "pending",
    "approved",
    "shipped",
    "delivered",
    "canceled",
  ];
  if (orderStatus && !validStatuses.includes(orderStatus)) {
    return next(new AppError("Invalid order status", 400));
  }

  if (!mongoose.isValidObjectId(id)) {
    return next(new AppError("Invalid Order ID format", 400));
  }

  const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedOrder) return next(new AppError("Order was not found!", 404));

  res.status(200).json({
    status: "success",
    message: "Order has been updated successfully",
    data: { order: updatedOrder },
  });
});

exports.getDashboardCounts = catchAsync(async (req, res, next) => {
  try {
    // Get total orders count
    const totalOrders = await Order.countDocuments();

    // Calculate total sales from orders (sum of totalCost)
    const totalSalesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalCost" },
        },
      },
    ]);
    const totalSales =
      totalSalesData.length > 0 ? totalSalesData[0].totalSales : 0;

    // Calculate total stock value (sum of stock * price)
    const totalStockValueData = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalStockValue: { $sum: { $multiply: ["$stock", "$price"] } },
        },
      },
    ]);
    const totalStockValue =
      totalStockValueData.length > 0
        ? totalStockValueData[0].totalStockValue
        : 0;

    // Calculate total stock count from products
    const totalStockData = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: "$stock" },
        },
      },
    ]);
    const totalStock =
      totalStockData.length > 0 ? totalStockData[0].totalStock : 0;

    // Get total bookings count from Booking model
    const totalBookings = await Booking.countDocuments();

    // Calculate total sales from bookings (sum of totalCost in Booking model)
    const totalBookingSalesData = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookingSales: { $sum: "$totalCost" },
        },
      },
    ]);
    const totalBookingSales =
      totalBookingSalesData.length > 0
        ? totalBookingSalesData[0].totalBookingSales
        : 0;

    res.status(200).json({
      status: "success",
      data: {
        totalOrders,
        totalSales,
        totalStock,
        totalStockValue,
        totalBookings,
        totalBookingSales,
      },
    });
  } catch (error) {
    return next(new AppError(error, 500));
  }
});

exports.createOrderController = catchAsync(async (req, res) => {
  const productItems = req.body.products;

  // Separate regular products and home appliance products
  const regularProductIds = productItems
    .filter((item) => item.productType === "Product")
    .map((item) => new mongoose.Types.ObjectId(item.product));

  const homeApplianceProductIds = productItems
    .filter((item) => item.productType === "HomeApplianceProduct")
    .map((item) => new mongoose.Types.ObjectId(item.product));

  // Fetch product details
  const regularProducts = await Product.find({
    _id: { $in: regularProductIds },
  }).select("price salePrice");

  const homeApplianceProducts = await HomeApplianceProduct.find({
    _id: { $in: homeApplianceProductIds },
  }).select("price salePrice");

  // Merge both product types into a single map
  const productMap = {};
  [...regularProducts, ...homeApplianceProducts].forEach((product) => {
    productMap[product._id.toString()] = product;
  });

  // Calculate total price
  let totalCost = 0;
  productItems.forEach((item) => {
    const product = productMap[item.product];
    if (product) {
      const price = product.salePrice || product.price;
      totalCost += price * item.quantity;
    }
  });

  // Create order
  let order = await Order.create({
    ...req.body,
    totalCost,
    user: req.body.userId,
  });

  order = await Order.findById(order._id).populate({
    path: "products.product",
    select: "title sku price salePrice",
  });

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: { order },
  });
});

exports.getAllOrdersController = getAll(Order, [
  {
    path: "products.product",
    select: "-__v -createdAt -updatedAt",
  },
]);

exports.getOrderController = getOne(Order, [
  {
    path: "products.product",
    select: "-__v -createdAt -updatedAt",
  },
]);

exports.updateOrderController = catchAsync(async (req, res, next) => {
  const { orderStatus } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate({
    path: "products.product",
    select: "title sku price salePrice stock",
  });

  if (!order) return next(new AppError("No order found with that ID!", 404));

  if (orderStatus === "delivered") {
    // Update stock for both product types
    await Promise.all(
      order.products.map(async (item) => {
        const ProductModel =
          item.productType === "HomeApplianceProduct"
            ? HomeApplianceProduct
            : Product;
        await ProductModel.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity, saleNumber: item.quantity },
        });
      })
    );
  }

  res.status(200).json({
    status: "success",
    message: "Order updated successfully",
    data: { order },
  });
});

exports.deleteOrderController = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found!", 404));

  await Order.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    message: "Order deleted successfully",
    data: null,
  });
});
