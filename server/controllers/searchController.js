const Product = require("../models/productModel");
const Blog = require("../models/blogModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.searchController = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  if (!query) return next(new AppError("Query parameter is required", 400));

  const searchRegex = new RegExp(query, "i");

  // Search in products
  const products = await Product.find({
    $or: [{ title: searchRegex }, { details: searchRegex }],
  }).select("-__v");

  // Dynamically send response data
  const responseData = {};
  if (products.length > 0) responseData.products = products;

  const searchResult = products.length;
  if (searchResult < 1) {
    return next(new AppError("No Results were found on the server!", 404));
  }

  res.status(200).json({
    status: "success",
    results: searchResult,
    data: responseData,
  });
});

exports.searchBlogController = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  if (!query) return next(new AppError("Query parameter is required", 400));

  const searchRegex = new RegExp(query, "i");

  // Search in Blogs
  const blogs = await Blog.find({
    $or: [
      { title: searchRegex },
      { content: searchRegex },
      { tags: searchRegex },
    ],
  }).select("-__v");

  // Dynamically send response data
  const responseData = {};
  if (blogs.length > 0) responseData.blogs = blogs;

  const searchResult = blogs.length;
  if (searchResult < 1) {
    return next(new AppError("No Results were found on the server!", 404));
  }

  res.status(200).json({
    status: "success",
    results: searchResult,
    data: responseData,
  });
});
