const express = require("express");
const { 
  getMenu, 
  addMenuItem, 
  deleteMenuItem, 
  updateMenuItem, 
  deleteAllItems 
} = require("../controllers/menuController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const protectAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else res.status(401).json({ message: "Admin access required" });
};

router.get("/", getMenu);
router.post("/", protect, protectAdmin, addMenuItem);
router.put("/:id", protect, protectAdmin, updateMenuItem);
router.delete("/:id", protect, protectAdmin, deleteMenuItem);
router.delete("/clear-all", protect, protectAdmin, deleteAllItems);

module.exports = router;