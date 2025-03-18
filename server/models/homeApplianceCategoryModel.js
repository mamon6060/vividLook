const mongoose = require("mongoose");
const slugify = require("slugify");

const homeApplianceCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "Category name is required"],
      // unique: true,
      trim: true,
    },
    slug: {
      type: String,
      // unique: true,
    },
    subcategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "HomeApplianceSubcategory" },
    ],
  },
  { timestamps: true }
);

homeApplianceCategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model(
  "HomeApplianceCategory",
  homeApplianceCategorySchema
);
