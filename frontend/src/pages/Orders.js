import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaClock, FaPhoneAlt, FaUtensils, FaTruck, FaBox, FaHistory } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TrackStep = ({ icon, title, desc, active, isCurrent }) => (
  <div className="flex gap-6 relative z-10">
    <div className="relative flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 shadow-sm border-2 
        ${active ? 'bg-[#1e4a6e] border-[#1e4a6e] text-white' : 'bg-slate-100 border-slate-200 text-slate-300'}`}>
        {React.cloneElement(icon, { size: 16 })}
      </div>
      {isCurrent && (
        <>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white animate-ping z-20"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white z-20"></div>
        </>
      )}
    </div>
    <div className="flex-1">
      <h4 className={`text-sm font-black uppercase tracking-tight ${active ? 'text-slate-800' : 'text-slate-300'}`}>
        {title}
      </h4>
      <p className={`text-[11px] font-bold leading-relaxed ${active ? 'text-slate-400' : 'text-slate-200'}`}>{desc}</p>
    </div>
  </div>
);

const Orders = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchOrders = async () => {
    try {
      const url = isAdmin ? "http://localhost:5000/api/orders/all" : "http://localhost:5000/api/orders";
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      setOrders(prevOrders => prevOrders.map(order => {
        if (["Delivered", "Cancelled", "Cancel Requested"].includes(order.status)) return order;
        const orderTime = new Date(order.createdAt).getTime();
        const currentTime = new Date().getTime();
        const diffInMinutes = (currentTime - orderTime) / (1000 * 60);
        let newStatus = order.status;
        if (diffInMinutes >= 25) newStatus = "Delivered";
        else if (diffInMinutes >= 15) newStatus = "Out for Delivery";
        else if (diffInMinutes >= 10) newStatus = "Preparing";

        if (newStatus !== order.status) {
          updateStatusSilent(order._id, newStatus);
          return { ...order, status: newStatus };
        }
        return order;
      }));
    }, 5000); 
    return () => clearInterval(interval);
  }, [isAdmin]);

  const updateStatusSilent = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
    } catch (err) {
      console.error("Auto-status update failed", err);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
        { status: newStatus }, 
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success(`Status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleCancelRequest = (order) => {
    const orderTime = new Date(order.createdAt).getTime();
    const currentTime = new Date().getTime();
    const diffInMinutes = (currentTime - orderTime) / (1000 * 60);
    if (diffInMinutes > 15) {
      toast.error("Time limit exceeded! Order can't be cancelled after 15 minutes.");
    } else {
      updateStatus(order._id, "Cancel Requested");
    }
  };

  if (loading) return <div className="p-10 text-center font-black text-[#1e4a6e]">LOADING CLINICAL DASHBOARD...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 font-['Inter',_sans-serif]">
      <div className="max-w-4xl mx-auto space-y-12">
        {orders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200 shadow-sm">
            <FaHistory size={40} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No Medical Orders Yet</p>
          </div>
        )}

        {orders.map((order) => {
          const currentStatus = order.status;
          const isDelivered = currentStatus === "Delivered";
          const isCancelled = currentStatus === "Cancelled";
          
          const getProgressHeight = () => {
            if (currentStatus === "Preparing") return "33%";
            if (currentStatus === "Out for Delivery") return "66%";
            if (currentStatus === "Delivered") return "100%";
            return "0%";
          };

          const arrivalDate = new Date(new Date(order.createdAt).getTime() + 25 * 60000); 
          const estimatedTime = arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

          return (
            <div key={order._id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-12">
              <div className="p-8 text-center border-b border-slate-50">
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 
                   ${isCancelled ? 'bg-red-100 text-red-600' : isDelivered ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-600'}`}>
                    {isCancelled ? <FaBox size={28} /> : isDelivered ? <FaBox size={28} /> : <FaCheckCircle size={28} />}
                 </div>
                 <h1 className="text-3xl font-black text-[#1e4a6e] mb-1">
                   {isCancelled ? "Order Cancelled" : isDelivered ? "Order Delivered" : "Order Confirmed"}
                 </h1>
                 <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                   Ref: {order._id.slice(-8).toUpperCase()} • {new Date(order.createdAt).toLocaleString()}
                 </p>
              </div>

              <div className="grid md:grid-cols-5 gap-0">
                <div className="md:col-span-3 p-10 border-r border-slate-50">
                  <div className="flex items-center gap-3 mb-10">
                     <div className="w-1.5 h-6 bg-[#1e4a6e] rounded-full"></div>
                     <h2 className="text-xl font-black text-[#1e4a6e] tracking-tight">Tracking Progress</h2>
                  </div>

                  <div className="space-y-10 relative">
                    {isCancelled ? (
                      <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-center">
                        <p className="text-red-600 font-black text-sm uppercase tracking-widest">This order has been cancelled.</p>
                      </div>
                    ) : (
                      <>
                        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100 z-0"></div>
                        <div className="absolute left-[19px] top-2 w-0.5 bg-[#1e4a6e] transition-all duration-1000 z-0" style={{ height: getProgressHeight() }}></div>
                        <TrackStep icon={<FaCheckCircle />} title="Placed" desc="Your order has been placed." active={true} isCurrent={currentStatus === "Pending" || currentStatus === "Placed"} />
                        <TrackStep icon={<FaUtensils />} title="Preparing" desc="Your order is being prepared." active={["Preparing", "Out for Delivery", "Delivered"].includes(currentStatus)} isCurrent={currentStatus === "Preparing"} />
                        <TrackStep icon={<FaTruck />} title="Out for Delivery" desc="Your order is on the way." active={["Out for Delivery", "Delivered"].includes(currentStatus)} isCurrent={currentStatus === "Out for Delivery"} />
                      </>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 p-10 bg-slate-50/30 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 mb-8 uppercase tracking-widest">Order Summary</h3>
                    <div className="space-y-5 mb-10 text-[#334155]">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span className="font-bold"><span className="text-[#1e4a6e]">{item.quantity}x</span> {item.name}</span>
                          <span className="font-black">₹{item.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-black text-[#1e4a6e] uppercase tracking-widest">
                        {isCancelled ? "Order Value" : "Total Paid"}
                      </span>
                      <span className={`text-3xl font-black ${isCancelled ? 'text-slate-400 line-through' : 'text-[#1e4a6e]'}`}>
                        ₹{order.totalPrice}
                      </span>
                    </div>

                   
                  </div>

                  {!isDelivered && !isCancelled && order.status !== "Cancel Requested" && (
                    <button onClick={() => handleCancelRequest(order)} className="mt-4 w-full border-2 border-red-500 text-red-500 py-3 rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-red-50 transition-all">Request Cancellation</button>
                  )}

                  {order.status === "Cancel Requested" && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                      <p className="text-[10px] font-black text-amber-600 uppercase">Admin is reviewing cancellation...</p>
                    </div>
                  )}

                  {!isDelivered && !isCancelled && (
                    <button onClick={() => navigate("/contact")} className="mt-10 w-full bg-white border-2 border-[#1e4a6e] text-[#1e4a6e] py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-blue-50 transition-all">
                       <FaPhoneAlt size={12}/> Contact Kitchen
                    </button>
                  )}
                </div>
              </div>

              {!isDelivered && !isCancelled && (
                 <div className="bg-[#1e4a6e] p-8 flex items-center justify-between text-white">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Estimated Arrival</p>
                      <h2 className="text-4xl font-black italic tracking-tighter">{estimatedTime}</h2> 
                    </div>
                    <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md"><FaClock size={24} /></div>
                 </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;