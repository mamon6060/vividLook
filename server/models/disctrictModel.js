const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const districtSchema = new Schema(
  {
    name: {
      type: String,
      //   required: [true, "Name is required"],
    },
  },
  {
    timestamps: true,
  }
);

const District = model("District", districtSchema);

module.exports = District;
