const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const { Schema, model } = mongoose;

const blogCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
    },

    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],

    slug: {
      type: String,
      // trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// blogCategorySchema.pre("save", function (next) {
//   this.slug = slugify(this.title, { lower: true, strict: true });
//   next();
// });

const BlogCategory = model("BlogCategory", blogCategorySchema);

module.exports = BlogCategory;
