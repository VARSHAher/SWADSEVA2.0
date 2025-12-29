const express = require("express");
const router = express.Router();
const Inquiry = require("../models/Inquiry");
const { protect } = require("../middleware/authMiddleware");

router.post("/", async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    await newInquiry.save();
    res.status(201).json({ message: "Inquiry saved!" });
  } catch (err) { res.status(500).json(err); }
});

router.get("/", protect, async (req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json(inquiries);
});

module.exports = router;