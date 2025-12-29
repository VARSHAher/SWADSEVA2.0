const asyncHandler = require("express-async-handler");
const MenuItem = require("../models/menuItem");

const getMenu = asyncHandler(async (req, res) => {
  const menuItems = await MenuItem.find({}).sort({ createdAt: -1 }); 
  res.json(menuItems);
});

const addMenuItem = asyncHandler(async (req, res) => {
  const { name, healthCategory, price, description, image, restaurantName, restaurantLogo } = req.body;

  if (!name || !price || !healthCategory) {
    res.status(400);
    throw new Error("Please fill in required fields: Name, Price, and Health Category.");
  }

  const menuItem = await MenuItem.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, data: menuItem });
});

const updateMenuItem = asyncHandler(async (req, res) => {
  const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedItem) {
    res.status(404);
    throw new Error("Item not found");
  }
  res.json(updatedItem);
});

const deleteMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findById(req.params.id);
  if (!menuItem) {
    res.status(404);
    throw new Error("Item not found");
  }
  await menuItem.deleteOne();
  res.json({ message: "Item deleted" });
});

const deleteAllItems = asyncHandler(async (req, res) => {
  await MenuItem.deleteMany({});
  res.json({ message: "Database cleared! You can now start fresh." });
});

module.exports = { getMenu, addMenuItem, deleteMenuItem, updateMenuItem, deleteAllItems };