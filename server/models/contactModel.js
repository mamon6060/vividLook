const validator = require("validator");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      // required: [true, "Full name is required"],
      trim: true,
    },

    email: {
      type: String,
      // required: [true, "Please prodive your email address"],
      // validate: [validator.isEmail, "Please provide a valid email address"],
      lowercase: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    subject: {
      type: String,
      // required: [true, "Subject is required"],
      trim: true,
    },

    message: {
      type: String,
      // required: [true, "Message is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = model("Contact", contactSchema);

module.exports = Contact;
