const slugify = require("slugify");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const serviceSchema = new Schema(
  {
    photo: {
      type: String,
      // required: [true, "Photo is required"],
      trim: true,
    },

    heading: {
      type: String,
      // required: [true, "Heading is required"],
      trim: true,
    },

    price: {
      type: Number,
      // required: [true, "Price is required"],
    },

    details: {
      type: String,
      // required: [true, "details is required"],
      trim: true,
    },

    slug: {
      type: String,
    },

    serviceCategoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "serviceCategory",
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.pre("save", function (next) {
  if (this.isModified("heading")) {
    this.slug = slugify(this.heading, { lower: true });
    // this.heading = this.heading.toLowerCase();
  }

  next();
});

const Service = model("Service", serviceSchema);

module.exports = Service;
