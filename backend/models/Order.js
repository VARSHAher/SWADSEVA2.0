const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  totalPrice: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerAddress: { type: String, required: true },
  customerPhone: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Placed", "Preparing", "Out for Delivery", "Delivered", "Cancel Requested", "Cancelled"],
    default: "Pending" 
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;