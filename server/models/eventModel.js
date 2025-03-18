const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    photo: {
      type: String,
      required: [true, "Photo is required"],
      trim: true,
    },

    heading: {
      type: String,
      required: [true, "Heading is required"],
      trim: true,
      unique: true,
    },

    details: {
      type: String,
      required: [true, "Details is required"],
      trim: true,
    },

    startingDate: {
      type: Date,
    },

    endingDate: {
      type: Date,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Event = model("Event", eventSchema);

module.exports = Event;
