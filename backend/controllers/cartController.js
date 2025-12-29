const Cart = require("../models/Cart");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }
    res.json(cart);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { itemId, name, price, image } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find(
      (item) => item.itemId.toString() === itemId
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ itemId, name, price, image, quantity: 1 });
    }

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    const item = cart.items.find((item) => item.itemId.toString() === itemId);
    if (!item) return res.status(404).json({ msg: "Item not found in cart" });

    item.quantity += quantity;
    if (item.quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.itemId.toString() !== itemId
      );
    }

    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

const removeItem = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    cart.items = cart.items.filter((item) => item.itemId.toString() !== id);
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Remove item error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ items: [], totalPrice: 0 });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = { getCart, addToCart, updateQuantity, removeItem, clearCart };
