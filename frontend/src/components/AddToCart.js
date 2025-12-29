import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddToCartButton = ({ item }) => {
  const [quantity, setQuantity] = useState(0);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const checkCart = async () => {
      if (!userInfo?.token) return;
      try {
        const { data } = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const existing = data.items.find((i) => i.itemId === item._id);
        if (existing) setQuantity(existing.quantity);
      } catch (err) { console.log(err); }
    };
    checkCart();
  }, [item._id, userInfo?.token]);

  const flyToCart = (e) => {
    const cartIcon = document.getElementById("cart-icon");
    if (!cartIcon) return;

    const img = document.createElement("img");
    img.src = item.image;
    img.style.position = "fixed";
    img.style.width = "50px";
    img.style.height = "50px";
    img.style.borderRadius = "50%";
    img.style.zIndex = "9999";
    img.style.pointerEvents = "none";
    img.style.transition = "all 0.8s ease-in-out"; 

    const rect = e.target.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    img.style.top = `${rect.top}px`;
    img.style.left = `${rect.left}px`;
    
    document.body.appendChild(img);

    setTimeout(() => {
      img.style.top = `${cartRect.top + 10}px`; 
      img.style.left = `${cartRect.left + 10}px`;
      img.style.width = "10px"; 
      img.style.height = "10px";
      img.style.opacity = "0";  
    }, 50);

    setTimeout(() => {
      img.remove();
    }, 850);
  };

  const updateCart = async (newQty, event) => {
    if (!userInfo?.token) return toast.warn("Please login first");

    if (newQty > quantity && event) {
      flyToCart(event);
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      if (newQty > quantity) {
        await axios.post("http://localhost:5000/api/cart", { 
          itemId: item._id, name: item.name, price: item.price, image: item.image 
        }, config);
      } else {
        await axios.patch("http://localhost:5000/api/cart", { itemId: item._id, quantity: -1 }, config);
      }
      setQuantity(newQty);
      

    } catch (err) { toast.error("Error updating cart"); }
  };

  if (quantity === 0) {
    return (
      <button
        onClick={(e) => updateCart(1, e)} 
        className="w-full bg-white text-[#60b246] border border-gray-300 font-black py-3 uppercase text-xs shadow-sm hover:shadow-md transition-all active:scale-95"
      >
        Add
      </button>
    );
  }

  return (
    <div className="w-full flex items-center bg-white border border-[#60b246] shadow-sm">
      <button onClick={() => updateCart(quantity - 1)} className="flex-1 py-3 text-[#60b246] font-bold text-lg hover:bg-gray-50">−</button>
      
      <span className="flex-1 text-center font-black text-[#60b246]">{quantity}</span>
      
      <button onClick={(e) => updateCart(quantity + 1, e)} className="flex-1 py-3 text-[#60b246] font-bold text-lg hover:bg-gray-50">+</button>
    </div>
  );
};

export default AddToCartButton;