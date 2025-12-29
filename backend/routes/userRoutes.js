const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);


router.get("/me", protect, getMe);
router.patch("/update/:id", protect, updateUser);
router.delete("/delete/:id", protect, deleteUser);

module.exports = router;