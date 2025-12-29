import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { Users, Box, TrendingUp, ShoppingBag, Plus, ArrowRight, MessageSquare, ShieldCheck, LayoutDashboard } from "lucide-react";

const Home = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [inquiries, setInquiries] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState("diabetic");
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const categories = [
    { name: "Diabetic", value: "diabetic", img: "https://cdn-icons-png.flaticon.com/512/5935/5935553.png" },
    { name: "Cardiac", value: "cardiac", img: "https://cdn-icons-png.flaticon.com/512/10165/10165953.png" },
    { name: "Hormonal", value: "hormonal", img: "https://cdn-icons-png.flaticon.com/512/10207/10207748.png" },
    { name: "Surgery", value: "post_surgery", img: "https://cdn-icons-png.flaticon.com/512/2864/2864350.png" },
    { name: "Elderly", value: "elderly", img: "https://cdn-icons-png.flaticon.com/512/16848/16848739.png" },
    { name: "Fitness", value: "fitness", img: "https://cdn-icons-png.flaticon.com/512/15335/15335164.png" },
  ];

useEffect(() => {
    const fetchData = async () => {
      try {
        const menuRes = await axios.get("http://localhost:5000/api/menu");
        setMenuItems(menuRes.data);
        
        if (isAdmin) {
          const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
          const inqRes = await axios.get("http://localhost:5000/api/inquiries", config);
          setInquiries(inqRes.data.slice(0, 5));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin, userInfo?.token]);

  const markAsResolved = (id) => {
    setInquiries(inquiries.filter(q => q._id !== id));
    toast.success("Resolved!");
  };

  const displayedItems = useMemo(() => {
    return menuItems
      .filter((item) => item.healthCategory === selectedCategory)
      .sort((a, b) => (b.ratings || 0) - (a.ratings || 0))
      .slice(0, 4);
  }, [menuItems, selectedCategory]);

  const handleSubmit = (event) => {
    event.preventDefault();
    toast.success("Message sent successfully!");
    event.target.reset();
  };

  return (
    <div className="min-h-screen bg-white">
      
      <section className={`relative w-full min-h-[85vh] flex items-center overflow-hidden transition-all duration-700 ${isAdmin ? "bg-[#0a1a15]" : "bg-[#f4f9f6]"} pt-20 md:pt-0`}>
        <section className={`relative w-full min-h-[75vh] flex items-center overflow-hidden transition-all duration-500 ${isAdmin ? "bg-[#0f2f25]" : "bg-[#f4f9f6]"} pt-20 md:pt-0`}>
        <div className="container mx-auto px-6 md:px-20 z-10 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className={isAdmin ? "text-white" : "text-[#0f2f25]"}>
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block ${isAdmin ? "bg-[#2f7a5a] text-white" : "bg-white text-[#2f7a5a] shadow-sm"}`}>
              {isAdmin ? "Admin Command Center" : "Clinical Nutrition"}
            </span>
            <h1 className="text-[3.5rem] md:text-[5rem] font-black leading-[0.9] mb-8 tracking-tighter uppercase italic">
              {isAdmin ? "Manage" : "Healing"}<br /> 
              <span className="text-[#2f7a5a]">{isAdmin ? "Operations" : "with SwadSeva"}</span>
            </h1>
            <p className={`max-w-[450px] text-lg mb-10 ${isAdmin ? "text-gray-300" : "text-[#5b7b70]"}`}>
              {isAdmin ? "Syncing your kitchen with patient needs. Monitor live inquiries and manage your clinical menu." : "Doctor-approved meals designed for your speedy recovery and daily nutrition."}
            </p>
            <Link to={isAdmin ? "/about" : "/menu"} className="px-10 py-4 bg-[#2f7a5a] text-white rounded-2xl font-black text-sm uppercase shadow-xl hover:scale-105 transition-all inline-block">
              {isAdmin ? "Review Orders" : "Order Now"}
            </Link>
          </motion.div>

          <div className="flex justify-center md:justify-end">
            <img 
              src={isAdmin ? "https://cdn-icons-png.flaticon.com/512/2329/2329087.png" : "https://static.vecteezy.com/system/resources/previews/022/918/449/non_2x/poke-bowl-isolated-png.png"} 
              className="w-full max-w-[650px] object-contain drop-shadow-2xl"
              alt="Hero"
            />
          </div>
        </div>
      </section>
      </section>

      {isAdmin && (
        <section className="py-16 px-6 bg-[#f9fcfb]">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-[#0f2f25]">Operational Overview</h2>
              <Link to="/admin/create-menu" className="bg-[#2f7a5a] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-md">
                <Plus size={18}/> Add Menu
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                <Users className="text-[#2f7a5a] mb-2" />
                <p className="text-gray-500 text-xs font-bold uppercase">Total Patients</p>
                <h3 className="text-2xl font-black text-[#0f2f25]">1,284</h3>
              </div>
              <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                <ShoppingBag className="text-[#2f7a5a] mb-2" />
                <p className="text-gray-500 text-xs font-bold uppercase">Today's Orders</p>
                <h3 className="text-2xl font-black text-[#0f2f25]">42</h3>
              </div>
              <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                <TrendingUp className="text-[#2f7a5a] mb-2" />
                <p className="text-gray-500 text-xs font-bold uppercase">Revenue</p>
                <h3 className="text-2xl font-black text-[#0f2f25]">₹84,200</h3>
              </div>
              <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                <Box className="text-[#2f7a5a] mb-2" />
                <p className="text-gray-500 text-xs font-bold uppercase">Menu Items</p>
                <h3 className="text-2xl font-black text-[#0f2f25]">{menuItems.length}</h3>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                <h3 className="text-xl font-black text-[#0f2f25] mb-6 flex items-center gap-2">
                  <MessageSquare size={20} className="text-[#2f7a5a]"/> Recent Inquiries
                </h3>
                <div className="space-y-4">
                  {inquiries.map((iq) => (
                    <div key={iq._id} className="p-4 rounded-2xl bg-[#f6fffb] flex justify-between items-center group border border-transparent hover:border-[#2f7a5a]">
                      <div>
                        <p className="font-bold text-[#0f2f25] text-sm">{iq.name} <span className="text-[10px] text-gray-400">({iq.reason})</span></p>
                        <p className="text-xs text-gray-500 italic">"{iq.message}"</p>
                      </div>
                      <button onClick={() => markAsResolved(iq._id)} className="bg-white text-[#2f7a5a] border border-[#2f7a5a] px-3 py-1 rounded-xl text-[10px] font-bold hover:bg-[#2f7a5a] hover:text-white transition-all">RESOLVE</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-black text-[#0f2f25]">Inventory</h3>
                   <Link to="/menu" className="text-[#2f7a5a] text-xs font-bold hover:underline">View All</Link>
                </div>
                <div className="space-y-4">
                  {menuItems.slice(0, 4).map((item) => (
                    <div key={item._id} className="flex items-center gap-4 group">
                      <img src={item.image} className="w-12 h-12 rounded-xl object-cover" alt=""/>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-[#0f2f25] text-sm truncate">{item.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{item.healthCategory}</p>
                      </div>
                      <ArrowRight size={14} className="text-gray-300 group-hover:text-[#2f7a5a] transition-all"/>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {!isAdmin && (
        <>
          <section className="why-choose bg-white py-16 px-6">
            <div className="max-w-[1200px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-[clamp(32px,4vw,42px)] font-black text-[#0f2f25] mb-4">Why Choose SwadSeva?</h2>
                <p className="text-[#6b857c] max-w-[600px] mx-auto text-lg">Unmatched Quality, Clinical Precision, and Compassionate Service.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-10">
                {[
                  { title: "Diet-Planned Meals", desc: "Medical grade nutrition for low-salt and diabetic needs.", img: "https://cdn-icons-png.flaticon.com/512/9756/9756984.png" },
                  { title: "Safety Standards", desc: "100% hygienic preparation following clinical protocols.", img: "https://cdn.prod.website-files.com/661cabfe491ead7e40ea563c/661cceff9911086b9044d821_food-safety%20icon.png" },
                  { title: "Timely Delivery", desc: "Punctual service to align with medication schedules.", img: "https://cdn-icons-png.flaticon.com/512/2972/2972572.png" },
                  { title: "Fresh Ingredients", desc: "Locally sourced, farm-fresh produce in every meal.", img: "https://cdn.prod.website-files.com/661cabfe491ead7e40ea563c/661cceffce5a04ced087edb6_fresh%20food%20icon.png" }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-2xl bg-[#f0f9f6] group-hover:bg-[#2f7a5a] transition-all duration-300">
                      <img src={item.img} className="w-14 h-14 group-hover:invert transition-all" alt={item.title} />
                    </div>
                    <h3 className="font-bold text-lg text-[#0f2f25] mb-2">{item.title}</h3>
                    <p className="text-sm text-[#5b7b70] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

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


          <section className="top-rated bg-[#f9fffc] py-[80px] px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-center text-[2.6em] font-extrabold text-[#0f2f25] mb-4">
                Top Recommended Meals
              </h2>
              <p className="text-center text-[#5b7b70] mb-12 max-w-2xl mx-auto">
                Explore our clinically approved menu categories. Select a category below to see top recommendations.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 font-bold transition-all duration-200 ${
                      selectedCategory === cat.value
                        ? "bg-[#2f7a5a] border-[#2f7a5a] text-white shadow-lg scale-105"
                        : "bg-white border-gray-200 text-gray-500 hover:border-[#2f7a5a] hover:text-[#2f7a5a]"
                    }`}
                  >
                    <img src={cat.img} alt="" className={`w-6 h-6 ${selectedCategory === cat.value ? "invert brightness-0" : ""}`} />
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {loading ? (
                  <p className="text-center col-span-full text-gray-500">Loading recommended meals...</p>
                ) : displayedItems.length > 0 ? (
                  displayedItems.map((item) => (
                    <div 
                      key={item._id} 
                      onClick={() => navigate('/menu')}
                      className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group"
                    >
                      <div className="relative h-[200px] overflow-hidden">
                        <img
                          src={item.image || "https://via.placeholder.com/300"}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#2f7a5a] shadow-sm">
                          ⭐ {item.ratings || "4.5"}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-[#0f2f25] mb-2 line-clamp-1">{item.name}</h3>
                        <p className="text-[#6b857c] text-sm mb-4 line-clamp-2 h-[40px]">
                          {item.description || "Healthy, doctor-approved meal for daily recovery."}
                        </p>
                        
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xl font-black text-[#2f7a5a]">₹{item.price}</span>
                          <span className="text-xs bg-[#e6f6ee] text-[#2f7a5a] px-2 py-1 rounded font-semibold uppercase tracking-wide">
                            {item.healthCategory}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500 text-lg">No items found in this category yet.</p>
                    <a href="/admin/create-menu" className="text-[#2f7a5a] font-bold mt-2 inline-block hover:underline">Add items in Admin Panel</a>
                  </div>
                )}
              </div>

              <div className="text-center mt-12">
                <a href="/menu" className="inline-block bg-white border-2 border-[#2f7a5a] text-[#2f7a5a] hover:bg-[#2f7a5a] hover:text-white px-10 py-3 rounded-xl font-bold transition-all shadow-sm">
                  View Full Menu →
                </a>
              </div>
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

          <section className="py-[70px] bg-[#f6fffb]">
            <div className="max-w-[1100px] mx-auto px-6 text-center">
              <h2 className="text-[30px] font-extrabold text-[#0f2f25] mb-3">Simple Nutrition Guidance for Patients</h2>
              <p className="text-[#5f7f74] max-w-[640px] mx-auto mb-12 text-[15px]">Following small food habits can support recovery and improve daily comfort.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  ["🍽️", "Eat Light & Balanced", "Choose meals that are easy to digest and nutritionally balanced."],
                  ["🕒", "Regular Meal Timing", "Maintain consistent meal times to support digestion."],
                  ["💧", "Stay Hydrated", "Drink adequate fluids unless advised otherwise by a doctor."],
                  ["🧼", "Hygiene Matters", "Consume meals fresh and follow basic hygiene practices."]
                ].map(([icon, title, desc]) => (
                  <div key={title} className="bg-white p-6 rounded-[16px] shadow-[0_6px_18px_rgba(0,0,0,0.05)] hover:shadow-lg transition">
                    <div className="text-[30px] mb-3">{icon}</div>
                    <h3 className="font-semibold text-[16px] mb-2 text-[#0f2f25]">{title}</h3>
                    <p className="text-[#667] text-[14px] leading-[1.5]">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="support" className="max-w-[1100px] mx-auto px-8 py-[80px] text-center bg-[#f3fff8] rounded-[32px] border border-[rgba(180,220,200,0.9)] shadow-[0_14px_45px_rgba(0,0,0,0.06)] mb-20">
            <h2 className="text-[2.4rem] font-extrabold mb-4 text-[#0f2f25]">Care & <span className="text-[#2f7a5a]">Support</span></h2>
            <p className="text-[#4b6b60] max-w-[760px] mx-auto mb-12 leading-[1.7]">
              Need help beyond placing an order? Our care team assists patients and caregivers with diet guidance, special meal requests, and order-related concerns.
            </p>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px] mx-auto" onSubmit={handleSubmit}>
              <input type="text" placeholder="Patient / Caregiver Name" required className="px-4 py-3 rounded-[12px] border border-[#b4dcc8] focus:outline-none focus:ring-2 focus:ring-[#2f7a5a]" />
              <input type="tel" placeholder="Phone Number" required className="px-4 py-3 rounded-[12px] border border-[#b4dcc8] focus:outline-none focus:ring-2 focus:ring-[#2f7a5a]" />
              <select required className="px-4 py-3 rounded-[12px] border border-[#b4dcc8] md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#2f7a5a]">
                <option value="">Select reason for support</option>
                <option value="diet">Diet consultation</option>
                <option value="special">Special meal request</option>
                <option value="order">Order issue</option>
                <option value="bulk">Hospital / bulk meals</option>
              </select>
              <textarea rows="4" required placeholder="Describe your concern or request" className="px-4 py-3 rounded-[12px] border border-[#b4dcc8] md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#2f7a5a]"></textarea>
              <div className="md:col-span-2 flex justify-center mt-6">
                <button type="submit" className="bg-[#2f7a5a] hover:bg-[#256b4d] text-white px-10 py-3 rounded-[16px] font-bold shadow-md transition">Submit Request</button>
              </div>
            </form>
          </section>

          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default Home;