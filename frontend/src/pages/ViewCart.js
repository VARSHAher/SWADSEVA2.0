import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2, MapPin, ShieldCheck, X } from "lucide-react";

const ViewCart = ({ isSidebar, closeSidebar }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({ phone: "", address: "" });

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchCart = useCallback(async () => {
    if (!userInfo?.token) return setLoading(false);
    try {
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setCart(data);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  }, [userInfo?.token]);

  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [fetchCart]);

  useEffect(() => {
    if (isSidebar) {
      fetchCart();
    }
  }, [isSidebar, fetchCart]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setDetails({
        phone: userInfo.phone || "",
        address: userInfo.address || ""
      });
    }
    fetchCart();
  }, [fetchCart]);

  const handleRemoveItem = async (itemId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`, config);
      
      setCart((prev) => {
        const updatedItems = prev.items.filter((item) => item.itemId !== itemId);
        const newTotal = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        return { ...prev, items: updatedItems, totalPrice: newTotal };
      });

      window.dispatchEvent(new Event("cartUpdated"));
      toast.info("Item removed from tray");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleConfirmOrder = async () => {
    if (!details.phone || !details.address) return toast.error("Fill details!");
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post("http://localhost:5000/api/orders", {
        items: cart.items,
        totalPrice: cart.totalPrice + (cart.items.length), 
        customerName: userInfo.username,
        customerEmail: userInfo.email,
        customerPhone: details.phone,
        customerAddress: details.address,
      }, config);
      await axios.delete("http://localhost:5000/api/cart/clear", config);
      
      window.dispatchEvent(new Event("cartUpdated")); 
      toast.success("Order Placed!");
      if(isSidebar) closeSidebar();
      navigate("/orders");
    } catch (err) { toast.error("Error"); }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-400 italic">Accessing Tray...</div>;

  return (
    <div className={`w-full ${isSidebar ? "p-4" : "max-w-6xl mx-auto p-12"}`}>
      <div className={`grid gap-6 ${isSidebar ? "grid-cols-1" : "lg:grid-cols-12"}`}>
        <div className={isSidebar ? "" : "lg:col-span-7"}>
          {cart.items.length === 0 ? (
            <div className="text-center py-10">
               <p className="text-slate-400 font-bold mb-4">Tray is Empty</p>
               <button onClick={() => isSidebar ? closeSidebar() : navigate("/menu")} className="text-[#75a74c] font-black text-xs uppercase">Browse Menu</button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.itemId} className="group bg-white border rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-red-100 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={item.image} className="w-12 h-12 object-cover rounded-lg bg-slate-100" alt="" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                      <p className="text-xs text-slate-400 font-bold">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="font-black text-blue-600 text-sm">₹{item.price * item.quantity}</span>
                    <button 
                      onClick={() => handleRemoveItem(item.itemId)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={isSidebar ? "mt-6" : "lg:col-span-5"}>
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-400"><MapPin size={14}/> Delivery Info</h3>
            <input type="text" placeholder="Phone" className="w-full p-3 rounded-xl border mb-3 text-sm outline-none focus:ring-1 focus:ring-blue-500" value={details.phone} onChange={(e)=>setDetails({...details, phone: e.target.value})} />
            <textarea placeholder="Address" className="w-full p-3 rounded-xl border mb-4 text-sm h-20 outline-none focus:ring-1 focus:ring-blue-500" value={details.address} onChange={(e)=>setDetails({...details, address: e.target.value})} />
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-400"><span>Subtotal</span><span>₹{cart.totalPrice}</span></div>
              <div className="flex justify-between text-xs font-bold text-slate-400"><span>Clinical Fee</span><span>₹{cart.items.length}</span></div>
              <div className="flex justify-between text-lg font-black text-slate-800 pt-1"><span>Total</span><span>₹{cart.totalPrice + (cart.items.length)}</span></div>
            </div>
            <button onClick={handleConfirmOrder} disabled={cart.items.length === 0} className="w-full bg-[#1e4a6e] text-white py-4 rounded-xl mt-4 font-black uppercase text-xs shadow-lg hover:bg-blue-800 transition-all disabled:opacity-50">Confirm Order</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCart;