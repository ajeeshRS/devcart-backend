const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    filename: String,
    path: String,
    destination: String,
  },
  quantity:{
    type:Number,
    default:1
  }
});

module.exports = mongoose.model("product", productSchema);
