const AppError = require("../utils/AppError");
const Blog = require("../models/blogModel");
const BlogCategory = require("../models/blogCategoryModel");
const catchAsync = require("../utils/catchAsync");
const { deleteUploadedImages } = require("../middlewares/photoMiddleware");
const { getAll } = require("./handleFactory");
const generateSlug = require("../utils/slugGenerator");


exports.createBlogController = catchAsync(async (req, res, next) => {
  const body = { ...req.body };
  body.author = req.user.id;
  const title = body?.title;
  const slug = generateSlug(title)


  if (req.body.photos && req.body.photos.length > 0) {
    const publicIds = req.body.publicIds;
    body.photos = req.body.photos;
    body.slug = slug;

    try {
      const blog = await Blog.create(body);

      await BlogCategory.findOneAndUpdate(
        { _id: blog.category },
        { $push: { blogs: blog._id } },
        { new: true }
      );

      return res.status(201).json({
        status: "success",
        message: "Blog has been created successfully",
        data: {
          blog,
        },
      });
    } catch (error) {
      await deleteUploadedImages(publicIds);
      return next(error);
    }
  } else {
    return next(
      new AppError("No photos uploaded, please upload at least one image.", 400)
    );
  }
});

exports.getAllBlogsController = getAll(Blog, {
  path: "category author",
  select: "title name slug ",
});

exports.getBlogController = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug })
    .populate("category author", "title name email role")
    .select("-__v");
  if (!blog) {
    return next(new AppError("No blog was found with that name!", 404));
  }

  blog.views += 1;

   await blog.save();

  res.status(200).json({
    status: "success",
    data: {
      blog,
    },
  });
});

exports.updateBlogController = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const body = { ...req.body };

  const blog = await Blog.findOne({ slug });
  if (!blog) {
    return next(new AppError("No blog was found with that name", 404));
  }

  // Check if new photos have been uploaded
  if (req.body.photos && req.body.photos.length > 0) {
    body.photos = req.body.photos;
    body.publicIds = req.body.publicIds;

    // If new photos uploaded successfully, delete old ones
    if (blog.photos && blog.photos.length > 0) {
      const oldPhotos = blog.photos.map(
        (item) => item.split("/").slice(-4).join("/").split(".")[0]
      );

      await deleteUploadedImages(oldPhotos);
    }
  }

  if (body.status) {
    if (body.status === "published") {
      body.publishedAt = new Date();
    } else if (body.status === "archived") {
      body.publishedAt = null;
    }
  }

  Object.assign(blog, body);
  await blog.save();

  res.status(200).json({
    status: "success",
    message: "Blog has been updated successfully",
    data: {
      blog,
    },
  });
});

exports.deleteBlogController = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const blog = await Blog.findOne({ slug });
  if (!blog) return next(new AppError("No blog found with that name", 404));

  // Check if the blog has photos and delete them from Cloudinary
  if (blog.photos && blog.photos.length > 0) {
    const publicIds = blog.photos.map(
      (photoUrl) => photoUrl.split("/").slice(-4).join("/").split(".")[0]
    );

    await deleteUploadedImages(publicIds);
  }

  await BlogCategory.findOneAndUpdate(
    { _id: blog.category },
    { $pull: { blogs: blog._id } },
    { new: true }
  );

  await Blog.findByIdAndDelete(blog._id);

  res.status(204).json({
    status: "success",
    message: "Blog has been deleted successfully",
    data: null,
  });
});
