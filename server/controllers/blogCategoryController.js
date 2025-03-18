const BlogCategory = require("../models/blogCategoryModel");
const Blog = require("../models/blogModel");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("../utils/catchAsync");
const {
  createOne,
  getAll,
  getOneBySlug,
  updateOneBySlug,
} = require("./handleFactory");
const generateSlug = require("../utils/slugGenerator");

// exports.createBlogCategoryController = createOne(BlogCategory);
exports.createBlogCategoryController = catchAsync(async (req, res, next) => {
  const body = { ...req.body };
  const title = body?.title;
  const slug = generateSlug(title)
  body.slug = slug;

  const doc = await BlogCategory.create(body);

    res.status(201).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        doc,
      },
    });
});

exports.getAllBlogCategoriesController = getAll(BlogCategory);

exports.getBlogCategoryController = getOneBySlug(BlogCategory);

exports.updateBlogCategoryController = updateOneBySlug(BlogCategory);

exports.deleteBlogCategoryController = catchAsync(async (req, res, next) => {
  const blogCategory = await BlogCategory.findOne({ slug: req.params.slug });

  if (!blogCategory) {
    return next(new AppError("No blog category was found with that name", 404));
  }

  await Blog.deleteMany({ category: blogCategory._id });
  await BlogCategory.deleteOne({ _id: blogCategory._id });

  res.status(204).json({
    status: "success",
    message: "Blog category has been deleted successfully",
    data: null,
  });
});

// Get all Blogs of a Category
exports.getAllBlogsOfCategory = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const blogCategory = await BlogCategory.findOne({ slug });
  if (!blogCategory) {
    return next(
      new AppError("No blog-category was found with that name!", 404)
    );
  }

  const query = Blog.find({ _id: { $in: blogCategory.blogs } }).populate(
    "category author",
    "title name email role"
  );

  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const blogs = await features.query;

  res.status(200).json({
    status: "success",
    results: blogs.length,
    data: {
      blogs,
    },
  });
});
