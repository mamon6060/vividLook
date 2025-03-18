const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const SSLCommerzPayment = require("sslcommerz-lts");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const AppError = require("../utils/AppError");
const Email = require("../utils/Email");
const catchAsync = require("../utils/catchAsync");

const is_live = process.env.IS_LIVE === "true";

exports.initiatePayment = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    district,
    upazilla,
    area,
    postCode,
    streetAddress,
    products,
    // shippingCost,
    notes,
  } = req.body;

  if (
    !name ||
    // !email ||
    !phone ||
    !district ||
    !upazilla ||
    !area ||
    !streetAddress ||
    !products
    // !shippingCost
  ) {
    return next(
      new AppError("All fields are required to initialize payment", 400)
    );
  }

  // Fetch product details for the products in the order
  const productAggregation = await Product.aggregate([
    {
      $match: {
        _id: {
          $in: products.map(
            (item) => new mongoose.Types.ObjectId(item.product)
          ),
        },
      },
    },
    {
      $project: {
        title: 1,
        price: 1,
        salePrice: 1,
        category: 1,
        // freeShipping: 1,
      },
    },
    {
      $addFields: {
        effectivePrice: "$salePrice",
      },
    },
  ]);

  // Calculate total product cost
  // let isFreeShipping = false;
  const productTotal = products.reduce((total, item) => {
    const product = productAggregation.find((v) =>
      v._id.equals(new mongoose.Types.ObjectId(item.product))
    );

    if (product) {
      // if (product.freeShipping === true) isFreeShipping = true;
      return total + product.effectivePrice * item.quantity;
    }
    return total;
  }, 0);

  // Adjust the shipping cost based on free shipping
  // const finalShippingCost = isFreeShipping ? 0 : shippingCost;
  // const totalCost = productTotal + finalShippingCost;

  // Create an order in the database with `pending` status
  const tranID = uuidv4();
  const newOrder = await Order.create({
    name,
    email,
    phone,
    district,
    upazilla,
    area,
    postCode,
    streetAddress,
    user: req.user.id,
    // shippingCost: finalShippingCost,
    totalCost: productTotal,
    paymentMethod: "SSLCommerz",
    notes,
    products: products.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    })),
    transactionDetails: {
      transactionId: tranID,
      val_id: null,
    },
  });

  // Configure payment details for SSLCommerz
  const SERVER = `${req.protocol}://${req.get("host")}${process.env.BASE_URL}`;

  const paymentData = {
    total_amount: productTotal,
    currency: "BDT",
    tran_id: tranID,
    success_url: `${SERVER}payment/success/${tranID}`,
    fail_url: `${SERVER}payment/fail/${tranID}`,
    cancel_url: `${SERVER}payment/cancel/${tranID}`,
    ipn_url: `${SERVER}payment/ipn`,
    shipping_method: "N/A",
    product_name: productAggregation.map((p) => p.title).join(", "),
    product_category: productAggregation
      .map((p) => p.category.toString())
      .join(", "),
    product_profile: "general",
    cus_name: name,
    cus_email: email ? email : "Not Provided",
    cus_add1: `${streetAddress}, ${area}-${postCode}, ${upazilla}, ${district}`,
    cus_city: district,
    cus_state: upazilla,
    cus_postcode: postCode,
    cus_country: "Bangladesh",
    cus_phone: phone,
    ship_name: name,
    ship_add1: `${streetAddress}, ${area}-${postCode}, ${upazilla}, ${district}`,
    ship_city: district,
    ship_state: upazilla,
    ship_postcode: postCode,
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(
    process.env.SSL_STORE_ID,
    process.env.SSL_STORE_PASSWORD,
    is_live
  );

  // Initiate the payment request
  const paymentResponse = await sslcz.init(paymentData);
  if (paymentResponse.status !== "SUCCESS") {
    return next(new AppError("Failed to initiate payment", 400));
  }

  // Send the payment URL to the client for redirection
  res.status(200).json({
    status: "success",
    data: {
      gatewayUrl: paymentResponse.GatewayPageURL,
    },
  });
});

exports.paymentSuccess = catchAsync(async (req, res, next) => {
  const { tranID } = req.params;
  const { val_id } = req.body;

  const sslcz = new SSLCommerzPayment(
    process.env.SSL_STORE_ID,
    process.env.SSL_STORE_PASSWORD,
    is_live
  );

  const datas = await sslcz.validate({ val_id });

  if (datas.status === "INVALID_TRANSACTION") {
    return next(new AppError("Invalid transaction, Please try again!", 400));
  }

  const order = await Order.findOneAndUpdate(
    {
      "transactionDetails.transactionId": tranID,
    },
    {
      "transactionDetails.val_id": val_id,
      paymentStatus: "paid",
      orderStatus: "approved",
    },
    { new: true }
  );

  if (!order) return next(new AppError("Order was not found", 404));

  const populatedOrder = await Order.findById(order._id).populate({
    path: "products.product",
    select: "title price salePrice size stock",
  });

  if (order.email) {
    await new Email({ name: order.name, email: order.email }, null).sendInvoice(
      populatedOrder
    );
  }

  // Reduce stock and increase saleNumber after payment success
  await Promise.all(
    populatedOrder.products.map(async (item) => {
      await Product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: { saleNumber: item.quantity, stock: -item.quantity },
        },
        { new: true }
      );
    })
  );

  res.redirect(`${process.env.CLIENT_URL}/payment/success`);

  // res.status(200).json({
  //   status: "success",
  //   message: "Payment has been completed successfully",
  //   data: datas,
  // });
});

exports.paymentFailure = catchAsync(async (req, res, next) => {
  const { tranID } = req.params;

  const order = await Order.findOneAndUpdate(
    { "transactionDetails.transactionId": tranID },
    {
      paymentStatus: "failed",
      orderStatus: "pending",
    },
    { new: true }
  );

  if (!order) return next(new AppError("Order was not found", 404));

  res.redirect(`${process.env.CLIENT_URL}/payment/fail`);

  // res.status(200).json({
  //   status: "failure",
  //   message: "Payment failed",
  //   data: order,
  // });
});

exports.paymentCancel = catchAsync(async (req, res, next) => {
  const { tranID } = req.params;

  const order = await Order.findOneAndUpdate(
    { "transactionDetails.transactionId": tranID },
    {
      paymentStatus: "cancelled",
      orderStatus: "cancelled",
    },
    { new: true }
  );

  if (!order) return next(new AppError("Order was not found", 404));

  res.redirect(`${process.env.CLIENT_URL}/payment/cancel`);

  // res.status(200).json({
  //   status: "cancelled",
  //   message: "Payment was cancelled",
  //   data: order,
  // });
});
