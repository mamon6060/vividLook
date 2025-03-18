const slugify = require("slugify");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    title: {
      type: String,
      // required: [true, "Title is required"],
      unique: true,
      trim: true,
    },

    sku: {
      type: String,
      unique: true,
      trim: true,
    },

    photos: [
      {
        type: String,
        // required: [true, "Minimum one photo is required"],
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
      enum: {
        values: ["none", "percent", "amount"],
        // message: "{VALUE} is not supported, Enter a valid discount type",
      },
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

    // freeShipping: {
    //   type: Boolean,
    //   default: false,
    // },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category ID is required"],
    },

    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ title: 1, size: 1 }, { unique: true });

productSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true });
    // this.title = this.title.toLowerCase();
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

const Product = model("Product", productSchema);

module.exports = Product;
