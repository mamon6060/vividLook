const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const partnerSchema = new Schema(
  {
    photo: {
      type: String,
      // required: [true, "Photo is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Partner = model("Partner", partnerSchema);

module.exports = Partner;
