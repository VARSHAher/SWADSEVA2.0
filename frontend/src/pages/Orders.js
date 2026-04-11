import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaPhoneAlt, FaStar, FaSearch, FaHome, FaClock, FaBan, FaMoneyBillWave } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 

const Orders = () => {
  const navigate = useNavigate(); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const getDynamicStatus = (createdAt) => {
    const mins = (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60);
    if (mins < 5) return "Placed";
    if (mins < 15) return "Preparing";
    if (mins < 30) return "Out for Delivery";
    return "Delivered";
  };

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userInfo?.token]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleCancelOrder = async (order) => {
    const mins = (new Date().getTime() - new Date(order.createdAt).getTime()) / (1000 * 60);
    if (mins > 15) {
      toast.error("Order is already in the delivery phase and cannot be cancelled.");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/orders/${order._id}/status`, 
        { status: "Cancelled" }, 
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success("Order cancelled successfully.");
      fetchOrders();
    } catch (err) {
      toast.error("Error cancelling order");
    }
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div className="p-10 text-center font-black text-slate-400 text-[11px] uppercase tracking-widest bg-white min-h-screen pt-32">Loading SwadSeva...</div>;

  return (
    <div className="min-h-screen bg-white md:bg-[#f1f3f6] pb-20 font-['Outfit',_sans-serif] pt-24">
      
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Titan+One&display=swap');`}
      </style>

      <div className="max-w-3xl mx-auto px-4 mb-6">
        <h1 className="text-3xl font-[1000] text-[#1e4a6e] uppercase italic tracking-tighter">My <span className="text-[#75a74c]">Orders</span></h1>
      </div>

      <div className="max-w-3xl mx-auto">
        {orders.length === 0 && (
          <div className="text-center py-20 px-8 bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-100/50 mx-4">
            <h2 className="text-4xl md:text-5xl font-normal text-[#1e4a6e] tracking-tight leading-tight mb-4" style={{ fontFamily: "'Titan One', cursive" }}>
              Hungry for <br/> <span className="text-[#75a74c]">Something?</span>
            </h2>
            <p className="text-sm font-bold text-slate-400 mt-3 mb-10 max-w-md mx-auto leading-relaxed">
              Your orders with SwadSeva will appear here. Go ahead and find some awesome food items!
            </p> 
            <img 
              src="https://tse1.mm.bing.net/th/id/OIP.eAvNj2G3io0Whf-EANqrtwHaHa?w=512&h=512&rs=1&pid=ImgDetMain&o=7&rm=3" 
              alt="Empty Tray" 
              className="w-48 h-48 mx-auto object-contain" 
            />
            <div className="mt-10 pt-8 border-t border-slate-100">
               <h3 className="text-xl font-black text-slate-300 tracking-widest uppercase">No Orders Yet</h3>
            </div>
          </div>
        )}

        <div className="space-y-4 px-4 md:px-0">
          {filteredOrders.map((order) => {
            const currentStatus = order.status === "Cancelled" ? "Cancelled" : getDynamicStatus(order.createdAt);
            const isDelivered = currentStatus === "Delivered";
            const isCancelled = currentStatus === "Cancelled";
            const orderIdShort = order._id.slice(-6).toUpperCase();

            let timeText = "";
            if (currentStatus === "Placed") timeText = "25-30 Mins";
            else if (currentStatus === "Preparing") timeText = "20-25 Mins";
            else if (currentStatus === "Out for Delivery") timeText = "15 Mins Away";

            if (isDelivered || isCancelled) {
              return (
                <div key={order._id} className="bg-white p-5 rounded-2xl border border-slate-200 flex gap-4 transition-all hover:shadow-md mb-4">
                   <img src={order.items[0]?.image} className="w-16 h-16 rounded-xl object-cover bg-slate-100" alt="item" />
                   <div className="flex-1">
                      <p className="text-[9px] font-black text-[#75a74c] uppercase tracking-widest mb-1">ID: #{orderIdShort}</p>
                      
                      <div className="flex items-center gap-2 text-[13px] font-black">
                         <div className={`w-2 h-2 rounded-full ${isCancelled ? 'bg-red-500' : 'bg-[#75a74c]'}`}></div>
                         <span className={isCancelled ? 'text-red-600' : 'text-slate-900'}>
                            {isCancelled ? 'Cancelled' : `Delivered on ${new Date(order.createdAt).toLocaleDateString()}`}
                         </span>
                      </div>

                      <p className="text-[12px] font-bold text-slate-500 mt-1">
                        {order.items.map(i => i.name).join(", ")}
                      </p>

                      {isDelivered && (
                        <div className="mt-4 pt-4 border-t flex items-center justify-between">
                           <div className="flex items-center gap-1.5">
                             {[1,2,3,4,5].map(s => (
                               <FaStar key={s} size={14} className={reviews[order._id] >= s ? "text-[#75a74c]" : "text-slate-200"} onClick={() => setReviews({...reviews, [order._id]: s})} />
                             ))}
                           </div>
                           <span className="text-[11px] font-black text-[#75a74c] uppercase tracking-wider">Rate Order</span>
                        </div>
                      )}
                   </div>
                </div>
              );
            }

            return (
              <div key={order._id} className="bg-white rounded-[28px] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 mb-6">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 p-3 rounded-2xl text-[#1e4a6e]">
                        <FaHome size={22}/>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-[#75a74c] uppercase tracking-widest">ID: #{orderIdShort}</p>
                        <h3 className="text-[18px] font-[1000] text-slate-900 tracking-tighter">Arriving at:</h3>
                        <p className="text-[11px] font-bold text-slate-400 truncate max-w-[180px]">{order.customerAddress}</p>
                      </div>
                    </div>
                    <div className="text-right">
                        <span className={`text-[10px] font-[1000] px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse ${isCancelled ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-[#1e4a6e]'}`}>
                          {currentStatus}
                        </span>
                        {!isCancelled && (
                          <div className="flex items-center justify-end gap-1 text-[11px] font-[1000] text-slate-500 uppercase mt-2">                            
                            <FaClock size={10} /> {timeText}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-[13px] font-black text-slate-800">{item.quantity} x {item.name}</span>
                        </div>
                        <span className="text-[13px] font-black text-slate-900">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between items-center">
                       <div className="flex items-center gap-2 text-[#75a74c]">
                          <FaMoneyBillWave size={12}/>
                          <span className="text-[10px] font-black uppercase tracking-wider">Cash on Delivery</span>
                       </div>
                       <span className="text-[14px] font-[1000] text-[#1e4a6e]">Total: ₹{order.totalPrice}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button 
                      className="flex-1 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-[11px] uppercase tracking-wider text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all" 
                      onClick={() => navigate("/contact")}
                    >
                      <FaPhoneAlt size={12}/> Contact Kitchen
                    </button>

                    {!isCancelled && !isDelivered && (
                      <button 
                        onClick={() => handleCancelOrder(order)}
                        className="flex-1 py-4 bg-[#1e4a6e] text-white rounded-2xl font-black text-[11px] uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <FaBan size={12}/> Cancel Order
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="h-1.5 bg-slate-100 w-full">
                  <div 
                    className="h-full bg-[#75a74c] transition-all duration-1000" 
                    style={{ 
                      width: currentStatus === "Placed" ? '10%' : 
                             currentStatus === "Preparing" ? '40%' : 
                             currentStatus === "Out for Delivery" ? '75%' : 
                             currentStatus === "Delivered" ? '100%' : '0%' 
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
     

export default Orders;