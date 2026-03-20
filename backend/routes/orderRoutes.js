const express = require("express");
const { 
  createOrder, 
  getOrders, 
  getAllOrders, 
  updateOrderStatus, 
  getAdminStats 
} = require("../controllers/orderController"); 
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", protect, getAdminStats);

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/all", protect, getAllOrders);
router.put("/:id/status", protect, updateOrderStatus);

module.exports = router;