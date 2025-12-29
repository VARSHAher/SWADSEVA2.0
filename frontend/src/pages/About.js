import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Package, RefreshCw, Truck, Utensils, CheckCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const About = ({ isAdmin }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      const { data } = await axios.get("http://localhost:5000/api/orders/all", config);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchOrders();
  }, [isAdmin]);

  const handleSync = (orderId) => {
    toast.info(`Sending Order #${orderId.slice(-5)} to Restaurant Kitchen...`, {
      icon: <Utensils className="text-orange-500" />
    });
    setTimeout(() => {
      toast.success("Restaurant has accepted the order!");
    }, 2000);
  };

  const handleStatusChange = async (orderId, newStatus) => {
  try {
    const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
    
    await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, config);
    
    toast.success(`Status updated to ${newStatus}`);
    fetchOrders(); 
  } catch (err) {
    toast.error("Status update failed");
  }
};

  if (isAdmin) {
    return (
      <div className="bg-[#f6fffb] min-h-screen p-8">
        <ToastContainer position="top-right" theme="colored" />
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-black text-[#0f2f25]">Customer Orders</h1>
              <p className="text-[#2f7a5a] font-bold">Manage your kitchen & delivery sync</p>
            </div>
            <button onClick={fetchOrders} className="p-4 bg-white rounded-full shadow-lg hover:rotate-180 transition-all duration-500 text-[#2f7a5a]">
              <RefreshCw size={24} />
            </button>
          </div>
          
          {loading ? <div className="text-center font-bold text-gray-400 py-20">Loading Dashboard...</div> : (
            <div className="grid gap-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">#{order._id.slice(-6)}</span>
                      <h3 className="font-black text-xl text-[#0f2f25]">{order.customerName}</h3>
                    </div>
                    <p className="text-sm text-gray-500 font-medium mb-3">{order.customerAddress} • {order.customerPhone}</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, i) => (
                        <span key={i} className="text-xs bg-[#f3fff8] border border-[#d1fae5] px-3 py-1 rounded-full font-bold text-[#2f7a5a]">
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleSync(order._id)}
                      className="bg-orange-50 text-orange-600 px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                    >
                      <Utensils size={16}/> SYNC RESTAURANT
                    </button>

                    <div className="relative group">
                      <button className="bg-[#0f2f25] text-white px-5 py-3 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-black transition-all shadow-md">
                        <Truck size={16}/> UPDATE STATUS
                      </button>
                      
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl hidden group-hover:block z-50">
                        {['Preparing', 'Out for Delivery', 'Delivered'].map((status) => (
                          <button 
                            key={status}
                            onClick={() => handleStatusChange(order._id, status)}
                            className="w-full text-left px-4 py-3 text-xs font-bold text-gray-600 hover:bg-[#f6fffb] hover:text-[#2f7a5a] first:rounded-t-xl last:rounded-b-xl border-b last:border-0 border-gray-50"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#f6fffb] min-h-screen">
      <section className="relative py-20 px-6 overflow-hidden">
             <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8 }}
               >
                 <span className="inline-block px-4 py-1 rounded-full bg-[#e6f6ee] text-[#2f7a5a] font-bold text-sm mb-4 tracking-wider uppercase">
                   Our Story
                 </span>
                 <h1 className="text-[3rem] md:text-[4rem] font-black text-[#0f2f25] leading-tight mb-6">
                   We are<br />
                   <span className="text-[#2f7a5a]">SwadSeva.</span>
                 </h1>
                 <p className="text-lg text-[#5b7b70] leading-relaxed mb-8">
                   SwadSeva was founded on a simple belief: recovery starts in the kitchen. 
                   We bridge the gap between hospital care and home recovery by providing 
                   doctor-approved, diet-specific meals tailored to your medical needs.
                 </p>
                 <div className="flex gap-4">
                   <div className="flex flex-col">
                     <span className="text-3xl font-black text-[#2f7a5a]">10k+</span>
                     <span className="text-sm text-[#6b857c] font-medium">Meals Delivered</span>
                   </div>
                   <div className="w-[1px] bg-gray-200 mx-4"></div>
                   <div className="flex flex-col">
                     <span className="text-3xl font-black text-[#2f7a5a]">50+</span>
                     <span className="text-sm text-[#6b857c] font-medium">Dietary Plans</span>
                   </div>
                 </div>
               </motion.div>
     
            <motion.div 
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 0.8 }}
       className="relative flex justify-center"
     >
       <img 
         src="/abt.png"
         alt="SwadSeva nutrition care"
         className="
           w-[420px] 
           md:w-[460px]"
       />
     
       <div className="absolute -bottom-5 -left-5 bg-white p-5 rounded-2xl shadow-lg hidden md:block border border-gray-100">
         <p className="text-[#0f2f25] font-bold italic text-sm leading-snug">
           “Food is the most powerful <br /> medicine we have.”
         </p>
       </div>
     </motion.div>
     
             </div>
           </section>
      <section className="mission bg-[#f6fffb] py-[70px] px-[clamp(20px,6vw,90px)] border-t border-[rgba(180,220,200,0.3)]">
            <div className="max-w-[1200px] mx-auto grid md:grid-cols-[1.1fr_0.9fr] gap-[48px] items-center">
              <div className="bg-white p-[34px] rounded-[18px] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                <span className="inline-block px-3 py-1 rounded-full bg-[#e6f6ee] text-[#2f7a5a] font-semibold text-sm mb-3">Our Mission</span>
                <h2 className="text-[32px] font-extrabold mb-3 text-[#0f2f25]">Nutrition that supports recovery, <span className="text-[#2f7a5a]">every single day.</span></h2>
                <p className="text-[#556f66] leading-[1.65] text-[15px]">
                  At SwadSeva, we believe food is a vital part of healing. Our meals are prepared to align with medical guidance, dietary needs, and daily routines. We focus on hygiene, balance, and timely delivery so patients and caregivers can focus on what matters most — recovery.
                </p>
              </div>
              <div className="text-right">
                <img src="/mis.png" alt="Healthy patient meals" className="max-w-full rounded-[16px]" onError={(e) => e.target.src='https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800'} />
              </div>
            </div>
          </section>

      <section className="py-20 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-black text-[#0f2f25] mb-6">Ready to start your journey?</h2>
        <p className="text-[#556f66] mb-10">Explore our medically tailored meal plans and experience nutrition designed for recovery.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/menu" className="bg-[#2f7a5a] text-white px-10 py-4 rounded-full font-black text-sm uppercase transition shadow-lg">View Menu</a>
          <a href="/contact" className="bg-white text-[#2f7a5a] border-2 border-[#2f7a5a] px-10 py-4 rounded-full font-black text-sm uppercase">Contact Support</a>
        </div>
      </section>
    </div>
  );
};

export default About;