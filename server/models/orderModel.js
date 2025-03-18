// const validator = require("validator");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bankSchema = new Schema(
  {
    bank: {
      type: String,
      enum: {
        values: ["Bank Asia", "City Bank"],
        message: "{VALUE} is not supported, Enter a valid bank name",
      },
      // required: [true, "Bank name is required"],
    },

    method: {
      type: String,
      enum: {
        values: [
          "TRANSFER",
          "BEFTN",
          "NPSB",
          "RTGS",
          "CASH DEPOSIT",
          "CHEQUE DEPOSIT",
        ],
        message: "{VALUE} is not supported, Enter a valid method",
      },
      // required: [true, "Transfer method is required"],
    },

    accountName: {
      type: String,
      // required: [true, "Account name is required"],
    },

    accountNumber: {
      type: String,
      // required: [true, "Account number is required"],
    },

    dateOfPayment: {
      type: Date,
      // required: [true, "Payment date is required"],
    },

    chequeSubmissionDate: {
      type: Date,
      // required: [
      //   function () {
      //     return this.method === "CHEQUE DEPOSIT";
      //   },
      //   "Cheque submission date is required",
      // ],
    },

    bankReference: {
      type: String,
      // required: [true, "Bank reference number is required"],
    },

    promo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: [true, "User ID is required"],
    },

    name: {
      type: String,
      // required: [true, "Name is required"],
    },

    email: {
      type: String,
      // validate: [validator.isEmail, "Please provide a valid email address"],
    },

    phone: {
      type: String,
      // required: [true, "Phone number is required"],
    },

    division: {
      type: String,
      // required: [true, "District name is required"],
    },

    district: {
      type: String,
      // required: [true, "District name is required"],
    },

    upazilla: {
      type: String,
      // required: [true, "Upazilla name is required"],
    },

    area: {
      type: String,
      // required: [true, "Area name is required"],
    },

    postCode: {
      type: String,
      // required: [true, "Post code is required"],
    },

    streetAddress: {
      type: String,
      // required: [true, "Street address is required"],
    },

    totalCost: {
      type: Number,
      default: 0,
    },

    shippingCost : {
      type: Number,
      // required: [true, "Shipping cost is required"],
    },

    orderStatus: {
      type: String,
      enum: {
        values: ["pending", "approved", "shipped", "delivered", "canceled"],
        message: "{VALUE} is not supported, Enter a valid order status",
      },
      default: "pending",
    },

    // paymentMethod: {
    //   type: String,
    //   enum: {
    //     values: ["COD", "Bank"], // SSLCommerz
    //     message: "{VALUE} is not supported, Enter a valid payment method",
    //   },
    //   default: "COD",
    // },

    paymentStatus: {
      type: String,
      enum: {
        values: ["pending", "paid", "failed", "canceled"],
        message: "{VALUE} is not supported, Enter a valid payment status",
      },
      default: "pending",
    },

    bankDetails: {
      type: bankSchema,
      // required: function () {
      //   return this.paymentMethod === "Bank";
      // },
    },

    photo: {
      type: String,
      // required: [
      //   function () {
      //     return this.paymentMethod === "Bank";
      //   },
      //   "Voucher photo is required",
      // ],
    },

    transactionDetails: {
      transactionId: String,
      cardType: String,
      val_id: String,

      currency: {
        type: String,
        default: "BDT",
      },
    },

    notes: {
      type: String,
      default: "",
    },

    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          refPath: "products.productType",
          // required: [true, "Product is required"],
        },

        quantity: {
          type: Number,
          // required: [true, "Quantity is required"],
        },
        productType: {
          type: String,
          enum: ["Product", "HomeApplianceProduct"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", orderSchema);

module.exports = Order;

// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       // required: true,
//     },
//     products: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           refPath: "products.productType", // Dynamically reference either "Product" or "HomeApplianceProduct"
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//           min: 1,
//         },
//         productType: {
//           type: String,
//           enum: ["Product", "HomeApplianceProduct"],
//           required: true,
//         },
//       },
//     ],
//     totalCost: {
//       type: Number,
//       required: true,
//     },
//     orderStatus: {
//       type: String,
//       enum: ["pending", "approved", "shipped", "delivered", "canceled"],
//       default: "pending",
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["pending", "paid", "failed"],
//       default: "pending",
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);
