const Inquiry = require("../models/Inquiry");
const asyncHandler = require("express-async-handler");

const createInquiry = asyncHandler(async (req, res) => {
  const { name, phone, reason, message } = req.body;

  if (!name || !phone || !reason || !message) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const inquiry = await Inquiry.create({ name, phone, reason, message });
  res.status(201).json(inquiry);
});

const getInquiries = asyncHandler(async (req, res) => {
  const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
  res.json(inquiries);
});

module.exports = { createInquiry, getInquiries };