import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa"; 

const ViewCart = () => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  
  
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const deliveryCharge = cart.items.length > 0 ? 40 : 0;
  const platformFee = cart.items.length > 0 ? 5 : 0;
  const discount = cart.totalPrice > 500 ? 50 : 0; 
  const finalTotal = cart.totalPrice + deliveryCharge + platformFee - discount;

  const fetchCart = async () => {
    if (!userInfo?.token) return setLoading(false);
    try {
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setCart(data);
      setLoading(false);
    } catch (err) { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, []);

 
  const handleRemoveItem = async (itemId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
     
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`, config);
      toast.info("Item removed");
      fetchCart(); 
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    if (!address || !phone || !city || !state) {
      return toast.warn("Please provide complete delivery details (Address, City, State, Phone)");
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const orderData = {
        items: cart.items,
        totalPrice: finalTotal,
        customerName: userInfo.username,
        customerAddress: `${address}, ${city}, ${state}`,
        customerPhone: phone,
      };

      await axios.post("http://localhost:5000/api/orders", orderData, config);
      await axios.delete("http://localhost:5000/api/cart/clear", config); //

      toast.success("Order Placed Successfully!");
      navigate("/orders");
    } catch (err) {
      toast.error("Checkout failed. Try again.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-400">Loading Cart...</div>;

  return (
    <div className="bg-[#e9ecee] min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 bg-white p-8 shadow-sm rounded-lg">
           <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Cart Items ({cart.items.length})</h2>
           {cart.items.length === 0 ? (
             <div className="text-center py-10">
               <p className="text-gray-400 font-bold mb-4">Empty Cart</p>
               <button onClick={() => navigate("/menu")} className="bg-[#fc8019] text-white px-6 py-2 font-bold uppercase text-sm">Add Items</button>
             </div>
           ) : (
             <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item.itemId} className="flex justify-between items-center border-b pb-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} className="w-16 h-16 object-cover rounded-md" alt="" />
                      <div>
                        <h4 className="text-sm font-bold text-gray-700">{item.name}</h4>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-gray-700">₹{item.price * item.quantity}</span>
                      <button 
                        onClick={() => handleRemoveItem(item.itemId)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        title="Remove Item"
                      >
                        <FaTrashAlt size={16} />
                      </button>
                    </div>
                  </div>
                ))}
             </div>
           )}
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 shadow-sm border-l-4 border-[#60b246] rounded-lg">
            <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-widest">Deliver To</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Phone Number" className="w-full border p-3 text-xs outline-none focus:border-[#fc8019]" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <textarea className="w-full border p-3 text-xs outline-none focus:border-[#fc8019] h-20" placeholder="Address..." value={address} onChange={(e) => setAddress(e.target.value)} />
              <div className="flex gap-2">
                <input type="text" placeholder="City" className="w-1/2 border p-3 text-xs outline-none focus:border-[#fc8019]" value={city} onChange={(e) => setCity(e.target.value)} />
                <input type="text" placeholder="State" className="w-1/2 border p-3 text-xs outline-none focus:border-[#fc8019]" value={state} onChange={(e) => setState(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 shadow-sm rounded-lg">
            <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-widest border-b pb-2">Bill Details</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between"><span>Item Total</span><span>₹{cart.totalPrice}</span></div>
              <div className="flex justify-between"><span>Delivery Fee</span><span>₹{deliveryCharge}</span></div>
              <div className="flex justify-between"><span>Platform Fee</span><span>₹{platformFee}</span></div>
              {discount > 0 && <div className="flex justify-between text-[#60b246] font-medium"><span>Discount Applied</span><span>-₹{discount}</span></div>}
              <div className="flex justify-between text-gray-900 font-bold border-t pt-2 mt-2">
                <span>Total Amount</span>
                <span className="text-[#fc8019]">₹{finalTotal}</span>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.items.length === 0}
              className="w-full bg-[#60b246] text-white py-4 font-black uppercase text-xs shadow-md disabled:bg-gray-300"
            >
              Confirm Order (COD)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCart;