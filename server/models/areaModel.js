const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const areaSchema = new Schema(
  {
    name: {
      type: String,
      //   required: [true, "Name is required"],
    },

    thanaRef: {
      type: Schema.Types.ObjectId,
      ref: "Thana",
    },

    districtRef: {
      type: Schema.Types.ObjectId,
      ref: "District",
    },
  },
  {
    timestamps: true,
  }
);

const Area = model("Area", areaSchema);

module.exports = Area;
