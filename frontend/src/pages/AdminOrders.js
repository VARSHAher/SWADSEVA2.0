import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, MapPin, Clock, CreditCard, Hash, User, Calendar } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/orders/all", {
        headers: { Authorization: `Bearer ${userInfo?.token}` },
      });
      setOrders(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); 
    return () => clearInterval(interval);
  }, []);

  const getAutoStatus = (createdAt, dbStatus) => {
    if (dbStatus === "Cancelled") return { label: "Cancelled", color: "bg-red-50 text-red-600" };
    if (dbStatus === "Delivered") return { label: "Delivered", color: "bg-emerald-50 text-emerald-600" };

    const mins = Math.floor((new Date() - new Date(createdAt)) / 60000);

    if (mins < 5) return { label: "Placed", color: "bg-blue-50 text-blue-600" };
    if (mins < 15) return { label: "Preparing", color: "bg-amber-50 text-amber-600" };
    if (mins < 30) return { label: "Out for Delivery", color: "bg-purple-50 text-purple-600" };
    return { label: "Delivered", color: "bg-emerald-50 text-emerald-600" };
  };

  const filteredOrders = orders.filter((order) => {
    const name = (order.customerName || "").toLowerCase();
    const address = (order.customerAddress || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || address.includes(query) || order._id.toLowerCase().includes(query);
  });

  if (loading) return <div className="flex justify-center items-center h-screen font-black text-slate-400 uppercase tracking-widest">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-[1000] text-[#1e4a6e] uppercase tracking-tighter">
              Order <span className="text-[#75a74c]">Management</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Administrator Access Only</p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search by name, ID or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:border-blue-500 outline-none w-full md:w-96 shadow-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest"><div className="flex items-center gap-2"><Hash size={12}/> ID</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest"><div className="flex items-center gap-2"><MapPin size={12}/> Location</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest"><div className="flex items-center gap-2"><User size={12}/> Customer</div></th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Payment</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Total</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest"><div className="flex items-center gap-2"><Calendar size={12}/> Date & Time</div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                const statusInfo = getAutoStatus(order.createdAt, order.status);
                
                return (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-[11px] font-bold text-blue-600">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-[11px] font-bold text-slate-600 truncate max-w-[180px]">
                        {order.customerAddress || "N/A"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">
                        {order.customerName || "Guest"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                        <Clock size={12} className="text-amber-500" />
                        CASH ON DELIVERY
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-xs font-black text-[#1e4a6e]">₹{order.totalPrice}</p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <p className="text-[10px] font-bold text-slate-700">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-[9px] font-medium text-slate-400 flex items-center gap-1">
                          <Clock size={10} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="7" className="py-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    No matching orders found
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