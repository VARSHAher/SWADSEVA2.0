const express = require("express");
const {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.patch("/", protect, updateQuantity);
router.delete("/clear", protect, clearCart); 
router.delete("/:id", protect, removeItem);
module.exports = router;
