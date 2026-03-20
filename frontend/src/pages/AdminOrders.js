import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, ChevronRight, CreditCard, Clock } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setOrders(data);
    } catch (error) {
      console.error("Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const getAutoStatus = (createdAt) => {
    const mins = Math.floor((new Date() - new Date(createdAt)) / 60000);
    

    if (mins < 10) return { label: "Preparing", color: "text-amber-600", bg: "bg-amber-50", key: "preparing" };

    if (mins < 15) return { label: "Out for Delivery", color: "text-blue-600", bg: "bg-blue-50", key: "out-for-delivery" };
  
    if (mins >= 25) return { label: "Delivered", color: "text-emerald-600", bg: "bg-emerald-50", key: "delivered" };
    

    return { label: "In Transit", color: "text-indigo-600", bg: "bg-indigo-50", key: "transit" };
  };

  const getPaymentStatus = (statusKey) => {
    if (statusKey === "delivered") {
      return { label: "Paid", color: "text-emerald-600", icon: <CreditCard size={10} /> };
    }
    return { label: "Cash on Delivery", color: "text-slate-500", icon: <Clock size={10} /> };
  };

  const filteredOrders = orders.filter(order => {
    const status = getAutoStatus(order.createdAt);
    if (filter === "All") return true;
    if (filter === "Pending") return status.key !== "delivered";
    if (filter === "Delivered") return status.key === "delivered";
    return true;
  });

  if (loading) return <div className="flex h-screen items-center justify-center text-slate-400 font-medium font-sans">Syncing Live Data...</div>;

  return (
    <div className="min-h-screen bg-[#f9fafb] p-10 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        
        

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex bg-slate-50 p-1 rounded-xl">
            {["All", "Pending", "Delivered"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === tab ? "bg-[#1e293b] text-white shadow-md" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-slate-200 transition-all outline-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Customer</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Total</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                const autoStatus = getAutoStatus(order.createdAt);
                const payment = getPaymentStatus(autoStatus.key);
                const isUrgent = order.status === "Cancel Requested";

                return (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-100">
                          <img src={order.items[0]?.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{order.customerName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-tighter">
                            Order #{order._id?.slice(-5)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${isUrgent ? 'bg-red-50 border-red-100 text-red-600' : `${autoStatus.bg} border-slate-50 ${autoStatus.color}`}`}>
                        <div className={`w-1 h-1 rounded-full ${isUrgent ? 'bg-red-500 animate-pulse' : 'bg-current'}`}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {isUrgent ? "Cancel Requested" : autoStatus.label}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div>
                        <p className="text-sm font-black text-slate-800">₹{order.totalPrice}</p>
                        <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tight mt-0.5 ${payment.color}`}>
                          {payment.icon}
                          <span>{payment.label}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <button className="flex items-center gap-1 text-slate-400 hover:text-[#1e293b] transition-colors group/btn">
                        <span className="text-[10px] font-black uppercase tracking-widest">Details</span>
                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <p className="text-slate-400 font-medium italic text-sm">No relevant orders found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;