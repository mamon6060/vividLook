const slugify = require("slugify");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Category title is required"],
      unique: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true });
    // this.title = this.title.toLowerCase();
  }

  next();
});

const category = model("Category", categorySchema);

module.exports = category;
