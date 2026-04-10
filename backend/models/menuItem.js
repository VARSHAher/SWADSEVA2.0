const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String }, 
    image: { type: String },
    protein: { type: String, default: "0g" },
    carbs: { type: String, default: "0g" },
    calories: { type: String, default: "0" },
    ratings: { type: Number, default: 0 },
    foodType: { 
      type: String, 
      enum: ["veg", "non-veg"], 
      default: "veg" 
    },
    healthCategory: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);