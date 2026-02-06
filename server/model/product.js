const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    offer_price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: ["Men", "Women"],
      required: true,
    },

    sub_category: {
      type: String,
      enum: ["Topwear", "Best Sellers", "New Arrivals", "Dresses"],
      required: true,
    },

    images: {
      type: [String],
      required: true,
    },

    sizes: {
      type: [String],
      enum: ["S", "M", "L", "XL", "XXL"],
      required: true,
    },

    stock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
