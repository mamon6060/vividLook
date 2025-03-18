const validator = require("validator");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      // required: [true, "Email is required"],
      // validate: [validator.isEmail, "Please provide a valid email address"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return /^[0-9]{10,15}$/.test(v); // Allows numbers with 10-15 digits
        },
        message: "Please provide a valid phone number",
      },
    },

    districtRef: { type: Schema.Types.ObjectId, ref: "District", index: true },
    thanaRef: { type: Schema.Types.ObjectId, ref: "Thana" },
    areaRef: { type: Schema.Types.ObjectId, ref: "Area" },

    streetAddress: {
      type: String,
      // required: [true, "Street address is required"],
    },

    services: [
      {
        serviceRef: { type: Schema.Types.ObjectId, ref: "Service" },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          default: 1,
        },
      },
    ],

    totalCost: {
      type: Number,
      default: 0,
    },

    bookingStatus: {
      type: String,
      enum: ["received", "complete", "cancelled"],
      default: "received",
    },

    bookingId: {
      type: String,
      unique: true,
    },

    bookingDate: {
      type: Date,
      // default: Date.now,
    },

    bookingStartTime: {
      type: String,
      // required: [true, "Booking start time is required"],
    },

    bookingEndTime: {
      type: String,
      // required: [true, "Booking end time is required"],
      // validate: {
      //   validator: function (value) {
      //     return value > this.bookingStartTime;
      //   },
      //   message: "Booking end time must be after start time",
      // },
    },

    mechanicRef: {
      type: Schema.Types.ObjectId,
      ref: "Mechanic",
      // index: true,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Generate a unique booking ID before saving
bookingSchema.pre("save", function (next) {
  if (!this.bookingId) {
    this.bookingId = uuidv4();
  }
  next();
});

// Add indexes for efficient queries
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ phone: 1 });
bookingSchema.index({ bookingStatus: 1 });

const Booking = model("Booking", bookingSchema);

module.exports = Booking;
