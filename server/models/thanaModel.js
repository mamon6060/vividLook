const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const thanaSchema = new Schema(
  {
    name: {
      type: String,
      //   required: [true, "Name is required"],
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

const Thana = model("Thana", thanaSchema);

module.exports = Thana;
