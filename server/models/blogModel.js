const slugify = require("slugify");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "A blog post must have a title"],
      trim: true,
      maxLength: [100, "Blog title must not exceed 100 characters"],
      unique: true,
    },

    content: {
      type: String,
      required: [true, "A blog post must have content"],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: [true, "A blog post must belong to a category"],
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A blog post must have an author"],
    },

    tags: [
      {
        type: String,
        trim: true,
        required: [true, "A blog post must have at least one tag"],
      },
    ],

    photos: [
      {
        type: String,
        required: [true, "A blog post must have at least one photo"],
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: {
        values: ["draft", "published", "archived"],
        message: "{VALUE} is not a valid status",
      },
      default: "draft",
    },

    publishedAt: Date,

    views: {
      type: Number,
      default: 0,
    },

    slug: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// blogSchema.pre("save", function (next) {

//   this.slug = slugify(this.title, { lower: true, strict: true });

//   if (this.isModified("tags") && Array.isArray(this.tags)) {
//     this.tags = this.tags.map((tag) => tag.toLowerCase());
//   }

//   next();
// });

const Blog = model("Blog", blogSchema);

module.exports = Blog;
