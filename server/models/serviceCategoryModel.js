const slugify = require("slugify");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const serviceCategorySchema = new Schema(
  {
    title: {
      type: String,
      // required: [true, "Service Category title is required"],
      // unique: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

serviceCategorySchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true });
    // this.title = this.title.toLowerCase();
  }

  next();
});

const ServiceCategory = model("serviceCategory", serviceCategorySchema);

module.exports = ServiceCategory;
