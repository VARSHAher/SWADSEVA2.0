import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaRegCircle, FaClock, FaMapMarkerAlt, FaReceipt } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${userInfo?.token}` }
        });
        setOrders(res.data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchOrders();
  }, [userInfo?.token]);

  const getStatus = (orderStatus) => {
  const steps = [
    { label: "Order Placed", key: "Placed" },
    { label: "Preparing Your Meal", key: "Preparing" },
    { label: "Out for Delivery", key: "Out for Delivery" },
    { label: "Delivered", key: "Delivered" },
  ];

  const statusSequence = ["Pending", "Placed", "Preparing", "Out for Delivery", "Delivered"];
  const currentIndex = statusSequence.indexOf(orderStatus);

  return steps.map((s) => {
    const stepIndex = statusSequence.indexOf(s.key);
    return {
      label: s.label,
      isDone: currentIndex >= stepIndex && orderStatus !== "Pending",
      isCurrent: s.key === orderStatus,
      time: currentIndex >= stepIndex ? "Updated" : "" 
    };
  });
};
  if (loading) return <div className="p-20 text-center font-bold text-[#2f7a5a]">Loading Orders...</div>;

  return (
    <div className="bg-[#f8faf9] min-h-screen py-10 px-4 md:px-10 lg:px-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-black text-[#0f2f25]">My <span className="text-[#2f7a5a]">Orders</span></h1>

        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
            
            <div className="p-6 md:p-8 bg-[#f0fdf4] flex justify-between items-center border-b border-[#dcfce7]">
              <div>
                <p className="text-[10px] font-black text-[#2f7a5a] uppercase tracking-[0.2em]">Order ID</p>
                <p className="font-bold text-xl text-[#0f2f25]">#SWAD-{order._id.slice(-6).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase">Estimated Arrival</p>
                <p className="font-black text-xl text-[#16a34a] flex items-center gap-2 tracking-tighter">
                  <FaClock size={18} className="animate-pulse"/> 20-25 MINS
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              <div className="p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-50">
                <div className="mb-10">
                  <h3 className="text-xs font-black text-gray-400 uppercase mb-8 tracking-widest">Live Status</h3>
                  <div className="space-y-8 relative">
                    <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gray-100"></div>
                    
{getStatus(order.status).map((step, i) => (                  
      <div key={i} className="flex items-center justify-between relative group">
                        <div className="flex items-center gap-5">
                          <div className={`z-10 bg-white rounded-full transition-colors duration-500 ${step.isDone ? 'text-[#2f7a5a]' : 'text-gray-200'}`}>
                            {step.isDone ? <FaCheckCircle size={24}/> : <FaRegCircle size={24}/>}
                          </div>
                          <p className={`font-bold text-lg ${step.isDone ? 'text-[#0f2f25]' : 'text-gray-300'}`}>{step.label}</p>
                        </div>
                        {/* Time only shows if the step is done */}
                        {step.isDone && (
                          <span className="text-[11px] font-black text-[#2f7a5a] bg-[#e6f6ee] px-2 py-1 rounded-md">
                            {step.time}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase mb-6 tracking-widest">Items Ordered</h3>
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-[#f9fafb] p-4 rounded-3xl border border-white">
                        <img src={item.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm ring-4 ring-white" alt={item.name} />
                        <div className="flex-1">
                          <p className="font-bold text-[#0f2f25] leading-tight">{item.name}</p>
                          <p className="text-xs text-gray-400 font-bold mt-1 uppercase">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-black text-[#2f7a5a]">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            
              <div className="bg-[#fafcfb] p-6 md:p-10 flex flex-col justify-between">
               
                <div className="mb-10">
                  <div className="flex items-start gap-4 p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="p-3 bg-[#f0fdf4] rounded-2xl text-[#2f7a5a]">
                      <FaMapMarkerAlt size={20} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Delivery details</h4>
                      <p className="text-sm font-bold text-[#0f2f25] leading-snug">{order.customerAddress}</p>
                      <p className="text-xs text-gray-500 mt-2 font-bold uppercase tracking-tighter tracking-widest">Contact: {order.customerPhone}</p>
                    </div>
                  </div>
                </div>

                {/* 5. BILLING SECTION */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                    <FaReceipt className="text-[#2f7a5a]" />
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Price details</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-500 font-bold">
                      <span>Item Total</span><span>₹{order.totalPrice - 45}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 font-bold">
                      <span>Delivery & Platform</span><span>₹45</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-100 mt-4">
                      <span className="font-black text-lg text-[#0f2f25]"> Total Amount </span>
                      <span className="text-3xl font-black text-[#2f7a5a] tracking-tighter">₹{order.totalPrice}</span>
                    </div>
                    <div className="mt-6 bg-[#f0fdf4] text-center py-3 rounded-2xl">
                      <p className="text-[10px] font-black text-[#2f7a5a] uppercase tracking-[0.1em]">Payment via Cash on Delivery</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;