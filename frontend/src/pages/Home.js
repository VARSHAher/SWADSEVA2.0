import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,Activity,Clock, LayoutDashboard,ShoppingBag,Users,IndianRupee,ArrowUpRight,PlusCircle,CheckCircle2,XCircle,ListOrdered,Utensils,ChevronDown,User,} from "lucide-react";
import axios from "axios";
import AddToCart from "../components/AddToCart";
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Home = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalFoodItems, setTotalFoodItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    avgOrderValue: 0,
    completionRate: 0,
    topProducts: [],
    customers: 0,
    ongoing: 0,
    cancelled: 0,
  });

  const STATUS_TIME = {
    PREPARING: 5,
    OUT: 15,
    DELIVERED: 30,
  };

  const getAutoStatus = (createdAt, dbStatus) => {
    if (dbStatus === "Cancelled")
      return { label: "Cancelled", color: "bg-red-50 text-red-600" };
    if (dbStatus === "Delivered")
      return { label: "Delivered", color: "bg-emerald-50 text-emerald-600" };

    const mins =
      (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60);

    if (mins > STATUS_TIME.DELIVERED)
      return { label: "Delivered", color: "bg-emerald-50 text-emerald-600" };
    if (mins > STATUS_TIME.OUT)
      return { label: "Out for Delivery", color: "bg-blue-50 text-blue-600" };
    if (mins > STATUS_TIME.PREPARING)
      return { label: "Preparing", color: "bg-amber-50 text-amber-600" };

    return { label: "Placed", color: "bg-slate-50 text-slate-600" };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: menuData } = await axios.get(`${BASE_URL}/api/menu`);
        setTotalFoodItems(menuData.length);

        const categoriesSeen = new Set();
        const diverseFavorites = [];
        for (const item of menuData) {
          if (
            !categoriesSeen.has(item.healthCategory) &&
            diverseFavorites.length < 4
          ) {
            diverseFavorites.push(item);
            categoriesSeen.add(item.healthCategory);
          }
        }
        setMenuItems(diverseFavorites);

        if (isAdmin) {
          const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
          if (!userInfo?.token) return;

          const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          };

          const { data: adminStats } = await axios.get(
            `${BASE_URL}/api/orders/stats`,
            config,
          );
          const { data: recentOrders } = await axios.get(
            `${BASE_URL}/api/orders/all`,
            config,
          );

          setOrders(recentOrders.slice(0, 5));
          setStats({
            orders: adminStats.orders || 0,
            customers:
              adminStats.orders > 0 ? Math.ceil(adminStats.orders * 0.7) : 0,
            revenue: adminStats.revenue || 0,
            avgOrderValue: adminStats.avgOrderValue || 0,
            completionRate: adminStats.completionRate || 0,
            topProducts: adminStats.topProducts || [],
            ongoing: adminStats.ongoing || 0,
            cancelled: adminStats.cancelled || 0,
          });
        }
      } catch (err) {
        console.log("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  const fulfilled = stats.orders - stats.cancelled - stats.ongoing;

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 pt-36 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div>
              <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <LayoutDashboard size={22} className="text-blue-600" /> SwadSeva
                Overview
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                Operational Summary
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/create-menu")}
              className="bg-[#75a74c] text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#5d8a3a] transition-all shadow-md"
            >
              <PlusCircle size={16} /> New Menu Item
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Revenue",
                value: `₹${stats.revenue}`,
                icon: <IndianRupee size={18} />,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                label: "Total Orders",
                value: stats.orders,
                icon: <ShoppingBag size={18} />,
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                label: "Total Dishes",
                value: totalFoodItems,
                icon: <Utensils size={18} />,
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
              {
                label: "Customers",
                value: stats.customers,
                icon: <Users size={18} />,
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${item.bg} ${item.color} p-3 rounded-xl`}>
                    {item.icon}
                  </div>
                  <ArrowUpRight size={14} className="text-slate-300" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {item.label}
                </p>
                <p className="text-2xl font-[1000] text-slate-800 tracking-tight mt-1">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-[0.2em] mb-8 border-b border-slate-100 pb-4">
                Live Monitoring
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span>Ongoing Orders</span>
                  <span>{stats.ongoing}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fulfilled</span>
                  <span>{fulfilled}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cancelled</span>
                  <span>{stats.cancelled}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
              <h3 className="font-black text-slate-800 text-xs uppercase tracking-[0.2em] flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
                <ListOrdered size={16} className="text-blue-600" /> Latest
                Transactions
              </h3>
              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((order) => {
                    const statusObj = getAutoStatus(
                      order.createdAt,
                      order.status,
                    );
                    return (
                      <div
                        key={order._id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100"
                      >
                        <div>#{order._id.slice(-4).toUpperCase()}</div>
                        <div>₹{order.totalPrice}</div>
                        <div className={statusObj.color}>{statusObj.label}</div>
                      </div>
                    );
                  })
                ) : (
                  <div>No Recent Activity</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white min-h-screen font-sans overflow-x-hidden">
     <section className="relative min-h-[130vh] flex flex-col items-center bg-[#f3f7f5] overflow-hidden pt-10">
      <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
    <svg viewBox="0 0 1200 800" className="w-full h-full">
      <path
        d="M0,400 C200,200 400,600 600,400 C800,200 1000,600 1200,400"
        stroke="white"
        strokeWidth="120"
        fill="none"
      />
    </svg>
  </div>

  <div className="relative w-[96%] bg-white rounded-[40px] py-36 mt-10 shadow-sm border border-slate-50 flex flex-col items-center justify-center overflow-hidden z-10">
    <motion.h1 
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative z-30 text-[8vw] md:text-[7vw] font-[1000] text-[#75a74c] leading-[0.9] uppercase tracking-[-0.03em] text-center select-none"
    >
      YOUR FOOD IS{" "}
      <span className="text-[#1e4a6e]">
        <br />
        YOUR MEDICINE
      </span>
    </motion.h1>

    <div className="absolute inset-0 pointer-events-none">
      {[
        { src: "bb_float_3.png", pos: "top-6 left-6 w-24 md:w-40", delay: 0 },
        { src: "bb_float_4.png", pos: "top-10 right-10 w-24 md:w-44", delay: 0.2 },
        { src: "bb_float_2.png", pos: "bottom-20 left-16 w-20 opacity-60", delay: 0.4 },
        { src: "bb_float_6.png", pos: "top-1/2 right-10 w-40", delay: 0.1 },
      ].map((img, idx) => (
        <motion.img
          key={idx}
          src={`https://bananablossomsalads.com/wp-content/uploads/2023/04/${img.src}`}
          className={`absolute ${img.pos}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: [0, -15, 0], 
            opacity: 1 
          }}
          transition={{ 
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: img.delay
            },
            opacity: { duration: 1 }
          }}
        />
      ))}
    </div>
  </div>

  <div className="relative w-full flex justify-center -mt-32 z-20">
    <motion.div
      initial={{ y: 150, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="w-[420px] md:w-[780px] lg:w-[950px] translate-y-[180px] drop-shadow-[0_50px_70px_rgba(0,0,0,0.16)]"
    >
      <img
        src="https://bananablossomsalads.com/wp-content/uploads/2023/06/BananaBlossomSalad.png"
        alt="Large Salad Bowl"
        className="w-full h-auto"
      />
    </motion.div>
  </div>
</section>
      <section className="py-24 px-6 max-w-7xl mx-auto bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-[1000] text-[#75a74c] uppercase tracking-tight leading-none">
            Why Choose <span className="text-[#1e4a6e]">SwadSeva?</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
            Our Pillars of Clinical Excellence
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheck size={32} strokeWidth={2} />,
              title: "Hospital Certified",
              desc: "Sourced directly from ISO-certified hospital kitchens to ensure 100% medical-grade hygiene.",
              accent: "bg-[#1e4a6e]",
              iconColor: "text-[#1e4a6e]",
              bgColor: "bg-blue-50/50",
            },
            {
              icon: <Activity size={32} strokeWidth={2} />,
              title: "Condition Specific",
              desc: "Precision-mapped nutrition for 8+ specialized clinical categories including Diabetes and Cardiac care.",
              accent: "bg-[#75a74c]",
              iconColor: "text-[#75a74c]",
              bgColor: "bg-green-50/50",
            },
            {
              icon: <Clock size={32} strokeWidth={2} />,
              title: "Timed Delivery",
              desc: "Strictly scheduled meal windows to align perfectly with your doctor's prescribed recovery timeline.",
              accent: "bg-[#1e4a6e]",
              iconColor: "text-[#1e4a6e]",
              bgColor: "bg-blue-50/50",
            },
          ].map((box, i) => (
            <div
              key={i}
              className="relative group p-10 rounded-[2.5rem] border border-slate-100 bg-white hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden"
            >
              <span className="absolute -top-4 -right-2 text-8xl font-black text-slate-50 opacity-40 group-hover:opacity-60 transition-opacity select-none">
                0{i + 1}
              </span>

              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 duration-500 ${box.bgColor} ${box.iconColor}`}
              >
                {box.icon}
              </div>

              <h3 className="text-2xl font-[1000] text-[#1e4a6e] uppercase tracking-tighter mb-4 leading-tight relative z-10">
                {box.title}
              </h3>

              <p className="text-slate-500 font-medium leading-relaxed text-sm relative z-10">
                {box.desc}
              </p>

              <div
                className={`absolute bottom-0 left-0 h-1.5 w-0 group-hover:w-full transition-all duration-700 ${box.accent}`}
              ></div>
            </div>
          ))}
        </div>
      </section>
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-[1000] text-[#75a74c] uppercase tracking-tight leading-none">
            Doctor <span className="text-[#1e4a6e]">Recommended</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
            Personalized nutrition for faster healing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => {
            const isNonVeg = item.foodType === "non-veg";
            return (
              <motion.div
                key={item._id}
                whileHover={{ y: -8 }}
                className="group relative h-[400px] w-full rounded-[2.5rem] overflow-hidden shadow-lg transition-transform duration-500"
              >
                <img
                  src={item.image}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={item.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

                <div className="absolute top-6 left-6">
                  <div
                    className={`w-5 h-5 border-2 ${isNonVeg ? "border-red-600" : "border-green-600"} flex items-center justify-center bg-white/10 backdrop-blur-md rounded-sm`}
                  >
                    <div
                      className={`w-2 h-2 ${isNonVeg ? "bg-red-600" : "bg-green-600"} rounded-full`}
                    ></div>
                  </div>
                </div>

                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="mb-4">
                    <span className="text-blue-400 font-black text-[9px] uppercase tracking-widest mb-2 block">
                      {item.healthCategory}
                    </span>
                    <h4 className="text-white font-black text-2xl uppercase tracking-tighter mb-2 leading-none">
                      {item.name}
                    </h4>
                    <p className="text-slate-300 text-[10px] font-medium line-clamp-2 mb-4 leading-relaxed opacity-80">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-end w-full">
                    <div className="flex items-baseline gap-1">
                      <span className="text-white text-xs font-black opacity-80">
                        ₹
                      </span>
                      <span className="text-white text-2xl font-black tracking-tighter">
                        {item.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl shadow-2xl">
                      <span className="text-yellow-500 text-[10px]">★</span>
                      <span className="text-[#1e4a6e] text-[10px] font-black">
                        {item.ratings || "4.0"}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-[#1e4a6e]/95 backdrop-blur-md p-8 flex flex-col justify-center items-center text-center transition-all duration-300"
                >
                  <div className="transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                      Clinical Breakdown
                    </p>

                    <div className="flex gap-6 mb-10 text-white">
                      <div className="text-center">
                        <p className="text-[8px] uppercase text-white/60 mb-1">
                          Prot
                        </p>
                        <p className="text-lg font-black text-white">
                          {item.protein || "0g"}
                        </p>
                      </div>
                      <div className="border-x border-white/20 px-6 text-center">
                        <p className="text-[8px] uppercase text-white/60 mb-1">
                          Carb
                        </p>
                        <p className="text-lg font-black text-white">
                          {item.carbs || "0g"}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] uppercase text-white/60 mb-1">
                          Kcal
                        </p>
                        <p className="text-lg font-black text-white">
                          {item.calories || "0"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    <AddToCart item={item} />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>
 <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40">
           <motion.img 
            animate={{ y: [0, -20, 0] }} 
            transition={{ duration: 4, repeat: Infinity }}
            src="https://bananablossomsalads.com/wp-content/uploads/2023/04/bb_float_3.png" 
            className="absolute top-10 left-10 w-32" 
          />
        </div>
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">

<div className="lg:w-1/2 space-y-8">
      <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-[1000] text-[#75a74c] uppercase tracking-tight leading-none">
          Who Are <span className="text-[#1e4a6e]">We?</span>
        </h2>
        
        <div className="space-y-6 text-slate-500 font-medium text-lg leading-relaxed max-w-lg">
          <p>
            We realized that most patients struggle with nutrition once they leave the hospital. 
            SwadSeva was founded to solve this—delivering 
            <span className="text-[#1e4a6e] font-black italic"> Precision Nutrition </span> 
            mapped directly to your clinical needs.
          </p>
          <p>
            Our portal ensures that your transition from hospital to home is supported by 
            chef-prepared, doctor-approved meals that look as good as they taste.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <button 
          onClick={() => navigate("/about")} 
          className="bg-[#1e4a6e] text-white px-10 py-4 rounded-xl font-bold uppercase text-[11px] tracking-widest shadow-xl hover:bg-blue-600 transition-all active:scale-95"
        >
          Know More
        </button>
      </div>
    </div>

    <div className="lg:w-1/2 relative flex justify-center lg:justify-end">
  <motion.div 
    initial={{ opacity: 0, y: 30, rotate: -5 }}
    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 1 }}
    /* 'max-w-xl' image ka container bada karega aur 'scale-110' image ko thoda zoom karega */
    className="relative w-full max-w-lg scale-110 md:scale-125" 
  >
    <img 
      src="https://static.vecteezy.com/system/resources/previews/052/320/674/non_2x/bowl-of-salad-with-cucumbers-tomatoes-and-vegetables-ai-generativ-free-png.png" 
      alt="Clean Healthy Bowl" 
      className="w-full h-auto drop-shadow-[0_45px_40px_rgba(0,0,0,0.15)]" 
    />
    
    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-black/5 rounded-[100%] blur-3xl -z-10" />
  </motion.div>
</div>
</div>
        
      </section>
     <section className="py-24 px-6 max-w-4xl mx-auto">
  <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-[1000] text-[#75a74c] uppercase tracking-tight leading-none">
      Questions? <span className="text-[#1e4a6e]">We Care.</span>
    </h2>
    <div className="w-20 h-1.5 bg-[#75a74c] mx-auto mt-4 rounded-full"></div>
  </div>

  <div className="space-y-4">
    {[
      {
        q: "How is the food prepared?",
        a: "All meals are prepared in hospital-certified kitchens that follow strict hygiene protocols. Our chefs are trained to meet medical dietary standards.",
      },
      {
        q: "What if I have issues with my order?",
        a: "Our customer support team is available 24/7 to assist you with any issues regarding your order, delivery, or meal preferences.",
      },
      {
        q: "What if I need to cancel my order?",
        a: "You can cancel your order up to 15 minutes before the scheduled delivery time. After that, we may not be able to accommodate cancellations due to the perishable nature of our meals.",
      },
    ].map((faq, i) => (
      <div
        key={i}
        className={`border-2 transition-all duration-300 rounded-[2rem] p-8 cursor-pointer group ${
          activeFaq === i 
          ? "border-[#75a74c] bg-green-50/30" 
          : "border-slate-100 hover:border-blue-100 hover:bg-slate-50/50"
        }`}
        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
      >
        <div className="flex justify-between items-center">
          <h4 className={`font-black text-lg uppercase tracking-tight transition-colors ${
            activeFaq === i ? "text-[#1e4a6e]" : "text-slate-700"
          }`}>
            {faq.q}
          </h4>
          <div className={`p-2 rounded-full transition-all ${
            activeFaq === i ? "bg-[#75a74c] text-white rotate-180" : "bg-slate-100 text-slate-400"
          }`}>
            <ChevronDown size={20} />
          </div>
        </div>
        
        {activeFaq === i && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-6 pt-6 border-t border-green-100"
          >
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </div>
    ))}
  </div>
</section>
    </div>
  );
};

export default Home;
