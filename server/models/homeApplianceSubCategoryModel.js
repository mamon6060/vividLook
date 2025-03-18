const { default: mongoose, Schema } = require("mongoose");
const { default: slugify } = require("slugify");

const homeApplianceSubcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "Subcategory name is required"],
      // unique: true,
      trim: true,
    },
    slug: {
      type: String,
      // unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HomeApplianceCategory",
      required: [true, "Category is required"],
    },
    subchildcategories: [
      { type: Schema.Types.ObjectId, ref: "HomeApplianceSubchildcategory" },
    ],
  },
  { timestamps: true }
);

homeApplianceSubcategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model(
  "HomeApplianceSubcategory",
  homeApplianceSubcategorySchema
);
