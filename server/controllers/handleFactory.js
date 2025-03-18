/* eslint-disable no-unused-vars */
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("./../utils/catchAsync");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError("No document found with that ID!", 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.deleteOneBySlug = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndDelete({ slug: req.params.slug });

    if (!doc) {
      return next(new AppError("No document was found with that name!", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // runValidators true dile document update korar somoy o schema validation wise data update korbe. false dile schema wise validate korbe na
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!doc) return next(new AppError("No document found with that ID!", 404));

    res.status(200).json({
      status: "success",
      message: "Document has been updated successfully",
      data: {
        doc,
      },
    });
  });

exports.updateOneBySlug = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOne({ slug: req.params.slug });

    if (!doc) {
      return next(new AppError("No document was found with that name!", 404));
    }

    const body = req.body;

    Object.keys(body).forEach((key) => {
      doc[key] = body[key];
    });

    await doc.save();

    res.status(200).json({
      status: "success",
      message: "Document has been updated successfully",
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      requestedAt: req.requestTime,
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id).select("-__v");

    if (popOptions) {
      // If popOptions is an array, populate each option
      if (Array.isArray(popOptions)) {
        popOptions.forEach((option) => {
          query = query.populate(option);
        });
      } else {
        query = query.populate(popOptions);
      }
    }

    const doc = await query;
    if (!doc) return next(new AppError("No document found with that ID!", 404));

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getOneBySlug = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findOne({ slug: req.params.slug }).select("-__v");

    if (popOptions) {
      // If popOptions is an array, populate each option
      if (Array.isArray(popOptions)) {
        popOptions.forEach((option) => {
          query = query.populate(option);
        });
      } else {
        query = query.populate(popOptions);
      }
    }

    const doc = await query;
    if (!doc) {
      return next(new AppError("No document was found with that name!", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.find({});
    // count total data
    let count = await Model.countDocuments();

    if (popOptions) {
      // If popOptions is an array, populate each option
      if (Array.isArray(popOptions)) {
        popOptions.forEach((option) => {
          query = query.populate(option);
        });
      } else {
        query = query.populate(popOptions);
      }
    }

    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query.select("-__v");
    // const doc = await features.query.select('-__v').explain();

    res.status(200).json({
      status: "success",
      results: doc.length,
      totalData: count,
      data: {
        doc,
      },
    });
  });
