const { default: mongoose } = require("mongoose");
const { default: slugify } = require("slugify");

const homeApplianceProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: [true, "Title is required"],
      // unique: true,
      trim: true,
    },

    sku: {
      type: String,
      // unique: true,
      trim: true,
    },

    photos: [
      {
        type: String,
        required: [true, "Minimum one photo is required"],
        trim: true,
      },
    ],

    details: {
      type: String,
      // required: [true, "Details are required"],
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["none", "percent", "amount"],
      default: "none",
    },

    discountValue: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
    },

    salePrice: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      required: [true, "Stock number is required"],
    },

    visitCount: {
      type: Number,
      default: 0,
    },

    saleNumber: {
      type: Number,
      default: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HomeApplianceCategory",
      // required: [true, "Category is required"],
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HomeApplianceSubcategory",
      // required: [true, "Subcategory is required"],
    },

    subchildcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HomeApplianceSubchildcategory",
      // required: [true, "Subchildcategory is required"],
    },

    slug: {
      type: String,
      // unique: true,
    },
  },
  {
    timestamps: true,
  }
);

homeApplianceProductSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true });
  }

  if (this.discountValue > 0 && this.discountType === "amount") {
    this.salePrice = this.price - this.discountValue;
  } else if (this.discountValue > 0 && this.discountType === "percent") {
    this.salePrice = this.price - (this.price * this.discountValue) / 100;
  } else {
    this.salePrice = this.price;
  }

  next();
});

const HomeApplianceProduct = mongoose.model(
  "HomeApplianceProduct",
  homeApplianceProductSchema
);

module.exports = HomeApplianceProduct;
