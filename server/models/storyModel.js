const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const storySchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Text is required"],
      trim: true,
    },

    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    photo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Story = model("Story", storySchema);

module.exports = Story;
