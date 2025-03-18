// const validator = require("validator");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const mechanicSchema = new Schema(
  {
    name: {
      type: String,
      //   required: [true, "Name is required"],
    },

    email: {
      type: String,
      // validate: [validator.isEmail, "Please provide a valid email address"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },

    totalService: {
      type: Number,
      default: 0,
    },

    totalPaymentReceived: {
      type: Number,
      default: 0,
    },

    areaRef: {
      type: Schema.Types.ObjectId,
      ref: "Area",
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

const Mechanic = model("Mechanic", mechanicSchema);

module.exports = Mechanic;
