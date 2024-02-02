const mongoose = require("mongoose");

const couponDiscount = mongoose.Schema({
  code: {
    type: String,
    unique: true,
  },
  discountPercentage: {
    type: Number,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  expiry: {
    type: Date,
  },
  minPurchaseAmount: {
    type: Number,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("coupon",couponDiscount)