import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { motion } from "framer-motion";
import { 
ShieldCheck, Activity, Heart, ClipboardList, 
Truck, CheckCircle, ChevronDown, Stethoscope, User,
Clock, LayoutDashboard, ShoppingBag, Users, Award ,Percent, IndianRupee, ArrowUpRight, PlusCircle, MessageSquare, TrendingUp
} from "lucide-react";
import axios from "axios";

const Home = ({ isAdmin }) => {
const navigate = useNavigate();
const [activeFaq, setActiveFaq] = useState(null);
const [menuItems, setMenuItems] = useState([]);
const [stats, setStats] = useState({ 
revenue: 0, 
orders: 0, 
avgOrderValue: 0, 
completionRate: 0,
topProducts: [] 
});

useEffect(() => {
  const fetchData = async () => {
    try {
      const { data: menuData } = await axios.get("http://localhost:5000/api/menu");

      const categoriesSeen = new Set();
      const diverseFavorites = [];

      for (const item of menuData) {
        if (!categoriesSeen.has(item.healthCategory) && diverseFavorites.length < 4) {
          diverseFavorites.push(item);
          categoriesSeen.add(item.healthCategory);
        }
      }

      if (diverseFavorites.length < 4) {
        const remaining = menuData.filter(item => !diverseFavorites.includes(item));
        diverseFavorites.push(...remaining.slice(0, 4 - diverseFavorites.length));
      }

      setMenuItems(diverseFavorites);

if (isAdmin) {
 const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const config = {
 headers: { Authorization: `Bearer ${userInfo?.token}` }
};


const { data: adminStats } = await axios.get("http://localhost:5000/api/orders/stats", config);

setStats({
orders: adminStats.orders,
users: adminStats.orders > 0 ? Math.ceil(adminStats.orders * 0.8) : 0, // Estimated unique users
revenue: adminStats.revenue,
avgOrder: adminStats.avgOrderValue,
completion: adminStats.completionRate,
topProducts: adminStats.topProducts
 });
}
} catch (err) { 
console.log("Error fetching admin stats:", err); 
 }
};
fetchData();
}, [isAdmin]);


if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans text-slate-900">
        <div className="max-w-7xl mx-auto">
          

          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">Admin Dashboard</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">SwadSeva Operations Control</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate("/admin/create-menu")} 
                className="bg-[#1e4a6e] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <PlusCircle size={16}/> Add New Meal
              </button>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1e4a6e] flex items-center justify-center font-black text-xs border border-blue-200">
                AD
              </div>
            </div>
          </div>

     
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Total Revenue", value: `₹${Number(stats.revenue).toLocaleString()}`, icon: <IndianRupee size={20}/>, color: "text-emerald-500", bg: "bg-emerald-50" },
              { label: "Total Orders", value: stats.orders, icon: <ShoppingBag size={20}/>, color: "text-blue-500", bg: "bg-blue-50" },
              { label: "Avg. Order Value", value: `₹${stats.avgOrder}`, icon: <TrendingUp size={20}/>, color: "text-purple-500", bg: "bg-purple-50" },
              { label: "Completion Rate", value: `${stats.completion}%`, icon: <Percent size={20}/>, color: "text-orange-500", bg: "bg-orange-50" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group hover:shadow-md transition-all">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl w-fit mb-4`}>
                  {stat.icon}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black tracking-tighter">{stat.value}</p>
              </div>
            ))}
          </div>

      
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
<div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
  <h3 className="font-black text-slate-800 text-lg mb-8 uppercase tracking-tighter">Revenue Growth</h3>
  <div className="flex items-end justify-between h-48 gap-4 px-2">
    {[
      { day: "Mon", h: "30%" }, 
      { day: "Tue", h: "50%" },
      { day: "Wed", h: "45%" }, 
      { day: "Thu", h: "80%" },
      { day: "Fri", h: "60%" }, 
      { day: "Sat", h: "90%" },
      { day: "Sun", h: "70%" } 
    ].map((bar, i) => (
      <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
        <div 
          className="w-full bg-[#1e4a6e] rounded-t-xl hover:bg-blue-600 transition-all cursor-pointer group relative" 
          style={{ height: bar.h }}
        >
      
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {bar.h}
          </div>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase">{bar.day}</span>
      </div>
    ))}
  </div>
</div>
        
<div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
  <h3 className="font-black text-slate-800 text-lg mb-8 uppercase tracking-tighter">Top Selling Items</h3>
  <div className="space-y-6">
    {[
      { name: "Vegetable Oats Upma", image: "https://drop.ndtv.com/albums/COOKS/7-yummy-indian-_638560510406355448/638560510453782355.jpeg", status: "85%" },
      { name: "Dal and Rice", image: "https://www.clubmahindra.com/blog/images/Dal-Rice-resized.jpg", status: "70%" },
      { name: "Chia Seed Yogurt Bowl", image: "https://greenbowl2soul.com/wp-content/uploads/2023/04/Matcha-yogurt-768x768.jpg", status: "60%" },
      { name: "Steamed Veggie Protein Bowl", image: "https://tse1.mm.bing.net/th/id/OIP.A76Sx1TQ91WBAtQrenKYVgHaJQ?w=1024&h=1280&rs=1&pid=ImgDetMain&o=7&rm=3", status: "45%" }
    ].map((item, i) => (
      <div key={i} className="flex items-center gap-4 group">
        <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden border border-slate-50">
          <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <span className="text-[11px] font-black text-slate-700 truncate w-32">{item.name}</span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active</span>
          </div>
          <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: item.status }}></div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
   


      
            <div className="lg:col-span-2">
              <div className="bg-[#1e4a6e] rounded-[2.5rem] p-8 text-white relative overflow-hidden group h-full">
                <div className="relative z-10">
                  <h2 className="text-xl font-black uppercase tracking-tighter mb-2">System Health</h2>
                  <p className="opacity-70 mb-8 text-sm font-medium">All clinical kitchen interfaces and delivery logistics are operational.</p>
                  <div className="flex gap-4">
                    <button onClick={() => navigate("/admin/orders")} className="bg-white text-[#1e4a6e] px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-50 transition-all">Review Live Orders</button>
                    <button onClick={() => navigate("/menu")} className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all">Management Console</button>
                  </div>
                </div>
                <Activity className="absolute right-[-20px] bottom-[-20px] text-white/5 group-hover:text-white/10 transition-all duration-700" size={200} />
              </div>
            </div>

    
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <h3 className="font-black text-slate-800 text-xs mb-6 flex items-center gap-2 border-b border-slate-50 pb-4 uppercase tracking-widest">
                <LayoutDashboard size={16} className="text-blue-600"/> Quick Links
              </h3>
              <div className="space-y-3">
                <button onClick={() => navigate("/contact")} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl font-black text-[10px] uppercase text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all group">
                  <div className="flex items-center gap-3">
                    <MessageSquare size={16} className="text-slate-300 group-hover:text-blue-500"/> Patient Queries
                  </div>
                  <ArrowUpRight size={14} />
                </button>
                <button onClick={() => navigate("/about")} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl font-black text-[10px] uppercase text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all group">
                  <div className="flex items-center gap-3">
                    <ClipboardList size={16} className="text-slate-300 group-hover:text-blue-500"/> Logistics Audit
                  </div>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div> 
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans overflow-x-hidden">
    
      <section className="relative bg-[#1e4a6e] py-32 px-6 flex items-center justify-center text-center overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: `url('https://www.trainforher.com/wp-content/uploads/2018/12/meatless.jpg')` }}
          ></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl relative z-10"
          >
            <span className="bg-blue-400/20 text-blue-200 px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] mb-8 inline-block">
              SwadSeva Healthcare 
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter mb-8">
               Your Food is <br /> <span className="text-blue-300 font-outline-2">Your medicine.</span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl font-medium opacity-80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Prescribed by Doctors, Prepared by Hospital Kitchens, Delivered by Us. 
              The bridge to your nutritional recovery.
            </p>
            <button onClick={() => navigate("/menu")} className="bg-blue-500 text-white px-10 py-5 rounded-full font-black uppercase text-sm shadow-2xl hover:bg-blue-600 transition-all">
              Browse Menu
            </button>
          </motion.div>
        </section>

        
      <section className="py-24 px-6 max-w-7xl mx-auto bg-white">
  <div className="text-center mb-16">
    <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
      Why Choose <span className="text-blue-600">SwadSeva?</span>
    </h2>
    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-4">
      Our Pillars of Clinical Excellence
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-12">
    {[
      { 
        icon: <ShieldCheck size={32} />, 
        title: "Hospital Certified", 
        desc: "Sourced directly from ISO-certified hospital kitchens to ensure 100% medical-grade hygiene.",
        color: "blue"
      },
      { 
        icon: <Activity size={32} />, 
        title: "Condition Specific", 
        desc: "Precision-mapped nutrition for 8+ specialized clinical categories including Diabetes and Cardiac care.",
        color: "teal"
      },
      { 
        icon: <Clock size={32} />, 
        title: "Timed Delivery", 
        desc: "Strictly scheduled meal windows to align perfectly with your doctor's prescribed recovery timeline.",
        color: "blue"
      }
    ].map((box, i) => (
      <div key={i} className="relative group p-10 rounded-[2.5rem] border border-slate-100 bg-white hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden">
        {/* Subtle decorative number */}
        <span className="absolute -top-4 -right-4 text-9xl font-black text-slate-50 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
          0{i + 1}
        </span>

        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 duration-500 ${
          box.color === "blue" ? "bg-blue-50 text-blue-600" : "bg-teal-50 text-teal-600"
        }`}>
          {box.icon}
        </div>

        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4">
          {box.title}
        </h3>
        
        <p className="text-slate-500 font-medium leading-relaxed text-sm">
          {box.desc}
        </p>

        {/* Bottom accent line */}
        <div className={`absolute bottom-0 left-0 h-1.5 w-0 group-hover:w-full transition-all duration-700 ${
          box.color === "blue" ? "bg-blue-600" : "bg-teal-600"
        }`}></div>
      </div>
    ))}
  </div>
</section>


    <section className="py-24 px-6 max-w-7xl mx-auto">
  <div className="text-center mb-16">
    <h2 className="text-4xl font-semibold text-slate-900 tracking-tight uppercase">
      Doctor <span className="font-black text-blue-600">Recommended</span>
    </h2>
    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">
      Personalized nutrition for faster healing
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    {menuItems.map((item) => (
      <motion.div 
        key={item._id}
        whileHover={{ y: -8 }}
        className="group relative h-[420px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg"
        onClick={() => navigate(`/menu/${item._id}`)}
      >
        <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.name} />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-8 flex flex-col justify-end">
          <span className="text-blue-400 font-black text-[9px] uppercase tracking-widest mb-2">
            {item.healthCategory}
          </span>
          <h4 className="text-white font-black text-2xl uppercase tracking-tighter mb-2 leading-none">
            {item.name}
          </h4>
          <span className="text-white font-bold opacity-80">₹{item.price}</span>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-[#1e4a6e]/95 backdrop-blur-md p-8 flex flex-col justify-center items-center text-center transition-all duration-300"
        >
          <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Clinical Breakdown
          </p>
          
          <div className="flex gap-6 mb-10">
            <div className="text-center">
              <p className="text-[8px] uppercase text-white/60 mb-1">Prot</p>
              <p className="text-lg font-black text-white">14g</p>
            </div>
            <div className="border-x border-white/20 px-6 text-center">
              <p className="text-[8px] uppercase text-white/60 mb-1">Carb</p>
              <p className="text-lg font-black text-white">42g</p>
            </div>
            <div className="text-center">
              <p className="text-[8px] uppercase text-white/60 mb-1">Kcal</p>
              <p className="text-lg font-black text-white">310</p>
            </div>
          </div>

          <div className="w-full">
            <button 
              onClick= {(e) => {  navigate("/cart")
                e.stopPropagation();
              }}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95"
            >
              Add to Meal Plan
            </button>
          </div>
        </motion.div>
      </motion.div>
    ))}
  </div>
</section>
       
    <section className="py-20 px-6 bg-white border-b border-slate-50">
  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
    
    <div className="lg:w-1/2 space-y-8">
      
      <h2 className="text-4xl md:text-5xl font-black text-[#1e4a6e] uppercase tracking-tighter leading-tight">
        About <br /> 
        <span className="text-blue-500">SwadSeva Portal</span>
      </h2>
      
      <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-lg">
        We realized that most patients struggle with nutrition once they leave the hospital. 
        SwadSeva was founded to solve this—delivering <span className="text-[#1e4a6e] font-black italic">Precision Nutrition</span> mapped directly to your clinical needs.
      </p>

      <div className="flex gap-4 pt-4">
        <button 
          onClick={() => navigate("/about")} 
          className="bg-[#1e4a6e] text-white px-8 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-700 transition-all active:scale-95"
        >
          Know More
        </button>
      </div>
    </div>
    <div className="lg:w-1/2 relative flex justify-center lg:justify-end">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg aspect-[4/3.5] rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white"
      >
        <img 
          src="https://www.trainforher.com/wp-content/uploads/2018/12/meatless.jpg" 
          alt="Healthy Balanced Meal" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </motion.div>
      
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10"></div>
    </div>

  </div>
</section>
        
    <section className="py-20 bg-[#1e4a6e] relative overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 relative z-10">
    
    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
        The SwadSeva <span className="text-blue-400">Core</span>
      </h2>
    
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {[
        { 
          num: "01",
          title: "Clinical Rigor", 
          desc: "Medical-grade sterile environments. 45-point health audits are our bare minimum." 
        },
        { 
          num: "02",
          title: "Transparency", 
          desc: "Full nutrient tracking for every dish. Know exactly what heals you." 
        },
        { 
          num: "03",
          title: "Patient-First", 
          desc: "An interface that adapts to your specific medical restrictions." 
        }
      ].map((pillar, i) => (
        <div 
          key={i} 
          className="p-8 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:bg-white/[0.06] hover:border-blue-400/30 transition-all duration-500 group relative overflow-hidden"
        >          <div className="text-3xl font-black text-white/5 group-hover:text-blue-400/20 transition-all duration-500 mb-6 font-mono">
            {pillar.num}
          </div>
          
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-3">
            {pillar.title}
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 scale-0 group-hover:scale-100 transition-transform shadow-[0_0_10px_rgba(96,165,250,0.6)]"></div>
          </h3>
          
          <p className="text-blue-100/60 text-sm leading-relaxed font-medium">
            {pillar.desc}
          </p>

          <div className="mt-8 h-[1px] w-0 group-hover:w-full bg-blue-400/50 transition-all duration-700"></div>
        </div>
      ))}
    </div>
  </div>
</section>
        <section className="py-24 px-6 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter mb-12 italic">Questions? <span className="text-blue-500">We Care.</span></h2>
          <div className="space-y-4">
            {[
            {q: "How is the food prepared?", a: "All meals are prepared in hospital-certified kitchens that follow strict hygiene protocols. Our chefs are trained to meet medical dietary standards."},
            {q:"What if I have issues with my order?", a: "Our customer support team is available 24/7 to assist you with any issues regarding your order, delivery, or meal preferences."},            
            {q:"What if I need to cancel my order?", a: " You can cancel your order up to 15 minutes before the scheduled delivery time. After that, we may not be able to accommodate cancellations due to the perishable nature of our meals."},
            ].map((faq, i) => (
              <div key={i} className="border rounded-xl p-6 cursor-pointer group" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800">{faq.q}</h4>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform ${activeFaq === i ? "rotate-180" : ""}`} />
                </div>
                {activeFaq === i && <p className="text-slate-500 mt-4">{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>
    </div>
  );
};

export default Home;