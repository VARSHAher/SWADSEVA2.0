import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { motion } from "framer-motion";
import { 
ShieldCheck, Activity, Heart, ClipboardList, 
Truck, CheckCircle, ChevronDown, Stethoscope, User,
Clock, LayoutDashboard, ShoppingBag, Users, Percent, IndianRupee, ArrowUpRight, PlusCircle, MessageSquare, TrendingUp
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
setMenuItems(menuData.slice(0, 4));

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

        
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Why Choose SwadSeva?</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2 text-blue-600">Our Pillars of Clinical Excellence</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck size={40}/>, title: "Hospital Certified", desc: "Directly sourced from hospital kitchens ensuring medical grade hygiene." },
              { icon: <Activity size={40}/>, title: "Condition Specific", desc: "Meals categorized for Diabetes, Cardiac, Renal and Post-Op care." },
              { icon: <Clock size={40}/>, title: "Timed Delivery", desc: "Meals delivered at your preferred time for optimal nutrition." }
            ].map((box, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] border-2 border-slate-50 hover:border-blue-100 hover:shadow-xl transition-all group text-center">
                <div className="text-blue-600 mb-6 flex justify-center group-hover:scale-110 transition-transform">{box.icon}</div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-4">{box.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{box.desc}</p>
              </div>
            ))}
          </div>
        </section>


        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter">Patient Favorites</h2>
              <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mt-2">Most Trusted Recovery Meals</p>
            </div>
            <button onClick={() => navigate("/menu")} className="text-slate-400 font-black uppercase text-sm border-b-2 border-slate-100 pb-1 hover:text-[#1e4a6e] hover:border-[#1e4a6e] transition-all">View All Menu</button>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {menuItems.map((item) => (
              <div key={item._id} className="group">
                <div className="relative overflow-hidden rounded-[2.5rem] aspect-square mb-6 bg-slate-100 shadow-sm">
                  <img src={item.image} alt={item.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-full font-black text-xs text-[#1e4a6e]">₹{item.price}</div>
                </div>
                <h4 className="font-black text-slate-800 uppercase text-lg mb-1 leading-tight">{item.name}</h4>
                <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">{item.healthCategory}</span>
              </div>
            ))}
          </div>
        </section>

       
        <section className="py-16 px-6 border-b border-slate-100">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#1e4a6e]">
                About SwadSeva Portal
              </h1>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                We realized that most patients struggle with nutrition once they leave the hospital. 
                SwadSeva was founded to solve this. We don't just deliver food; we deliver 
                <strong> precision nutrition</strong>.
              </p>
              <div className="flex gap-4">
                <button onClick={() => navigate("/about")} className="bg-[#1e4a6e] text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053" 
                alt="Healthy Balanced Meal" 
                className="rounded-3xl shadow-sm border border-slate-200 w-full h-80 object-cover"
              />
            </div>
          </div>
        </section>

        
        <section className="py-24 bg-[#1e4a6e] text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black uppercase tracking-tighter">The SwadSeva Core</h2>
              <p className="text-blue-200 mt-2 font-bold uppercase tracking-widest text-xs">Our foundational principles</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <ShieldCheck size={32}/>, title: "Clinical Rigor", desc: "Every partner kitchen must pass a 45-point health inspection and maintain medical-grade sterile standards." },
                { icon: <Activity size={32}/>, title: "Radical Transparency", desc: "Full macro and micro-nutrient breakdown for every single dish. No hidden sugars, no surprise sodium." },
                { icon: <User size={32}/>, title: "Patient-Centric", desc: "We don't just deliver food; we provide an interface that understands your specific medical restrictions." }
              ].map((pillar, i) => (
                <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-3xl">
                  <div className="mb-6 text-blue-400">{pillar.icon}</div>
                  <h3 className="text-xl font-bold mb-4">{pillar.title}</h3>
                  <p className="text-blue-100/70 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tighter text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How are the meals prepared and delivered?", a: "Meals are prepared in hospital kitchens and delivered fresh to your doorstep." },
              { q: "Can I order for someone else, like a family member?", a: "Yes, you can place orders on behalf of patients with their details." },
              { q: "What if I have an allergic reaction to a meal?", a: "Contact our support immediately. We have protocols in place for such situations." }
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