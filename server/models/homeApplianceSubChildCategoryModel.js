const { default: mongoose, Schema } = require("mongoose");
const { default: slugify } = require("slugify");

const homeApplianceSubchildcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, "Subchildcategory name is required"],
      // unique: true,
      trim: true,
    },
    slug: {
      type: String,
      // unique: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HomeApplianceSubcategory",
      required: [true, "Subcategory is required"],
    },
    products: [{ type: Schema.Types.ObjectId, ref: "HomeApplianceProduct" }],
  },
  { timestamps: true }
);

homeApplianceSubchildcategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

module.exports = mongoose.model(
  "HomeApplianceSubchildcategory",
  homeApplianceSubchildcategorySchema
);
