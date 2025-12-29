const Order = require("../models/Order");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { items, totalPrice, customerName, customerAddress, customerPhone } = req.body;

  const order = new Order({
    user: req.user._id,
    items,
    totalPrice,
    customerName,
    customerAddress,
    customerPhone,
    status: "Pending", 
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "username email").sort({ createdAt: -1 });
  res.json(orders);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

module.exports = { createOrder, getOrders, getAllOrders, updateOrderStatus };