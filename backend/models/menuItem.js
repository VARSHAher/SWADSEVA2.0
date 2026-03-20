const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String }, 
    image: { type: String },
    clinicalBenefits: { type: String },
    tags: [{ type: String }],          
    healthCategory: {
      type: String,
      enum: ["diabetic", "cardiac", "hormonal", "post_surgery", "elderly", "fitness"],
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);