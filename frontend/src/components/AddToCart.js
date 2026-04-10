import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddToCart = ({ item, onCartChange }) => {
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
      } catch (err) { console.error(err); }
    };
    checkCart();
  }, [item._id, userInfo?.token]);

  const updateCart = async (newQty) => {
    if (!userInfo?.token) return toast.warn("Please login first");

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      let response;
      
      if (newQty > quantity) {
        response = await axios.post("http://localhost:5000/api/cart", { 
          itemId: item._id, name: item.name, price: item.price, image: item.image 
        }, config);
      } else {
        response = await axios.patch("http://localhost:5000/api/cart", { 
          itemId: item._id, quantity: -1 
        }, config);
      }

      setQuantity(newQty);
      
    
      window.dispatchEvent(new Event("cartUpdated"));

      if (onCartChange) {
        const totalCount = response.data.items.reduce((acc, i) => acc + i.quantity, 0);
        onCartChange(totalCount);
      }
    } catch (err) { toast.error("Error updating tray"); }
  };

 if (quantity === 0) {
  return (
    <button 
      onClick={() => updateCart(1)} 
      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95"
    >
      Add to Tray
    </button>
  );
}

  return (
    <div className="w-full flex items-center bg-white border-2 border-[#1e4a6e] rounded-xl overflow-hidden">
      <button onClick={() => updateCart(quantity - 1)} className="flex-1 py-3 text-[#1e4a6e] font-bold text-lg hover:bg-slate-50">−</button>
      <span className="flex-1 text-center font-black text-[#1e4a6e]">{quantity}</span>
      <button onClick={() => updateCart(quantity + 1)} className="flex-1 py-3 text-[#1e4a6e] font-bold text-lg hover:bg-slate-50">+</button>
    </div>
  );
};

export default AddToCart;