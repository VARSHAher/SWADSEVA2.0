const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    ratings: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    restaurantName: { type: String }, 
    restaurantLogo: { type: String },

    healthCategory: {
      type: String,
      enum: [
        "diabetic",
        "cardiac",
        "hormonal",
        "post_surgery",
        "elderly",
        "fitness",
      ],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
