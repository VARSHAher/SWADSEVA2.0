import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Target, Eye, ShieldCheck, Activity, 
  Stethoscope, User, Phone, MapPin, RefreshCw, CheckCircle2 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const About = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchAdminOrders = async () => {
    try {
      setLoading(true);
      const url = "http://localhost:5000/api/orders/all"; 
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setOrders(data);
    } catch (err) {
      console.error("Error fetching admin orders:", err);
      toast.error("Failed to load customer orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncRestaurant = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
        { status: "Placed" }, 
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.success("Restaurant has accepted the order!");
      fetchAdminOrders();
    } catch (err) {
      toast.error("Sync failed");
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      toast.info(`Status updated to: ${newStatus}`);
      fetchAdminOrders();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminOrders();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  return (
    <div className="bg-white min-h-screen font-sans text-slate-800">
      
       

          {/* Mission & Stats Section */}
          <section className="py-20 px-6 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-12 h-12 bg-blue-50 text-[#1e4a6e] rounded-xl flex items-center justify-center mb-6">
                  <Target size={28} />
                </div>
                <h2 className="text-4xl font-black text-[#1e4a6e] mb-6 uppercase tracking-tighter">Our Mission</h2>
                <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                  Our mission is to integrate clinical-grade nutrition into the standard of care for every patient. 
                  We partner with medical institutions and expert dietitians to ensure that every calorie 
                  served on our platform contributes to a patient's recovery journey.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-4xl font-black text-[#1e4a6e]">98%</h3>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">Nutrient Accuracy</p>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-[#1e4a6e]">12k+</h3>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">Meals Delivered</p>
                  </div>
                </div>
              </div>
              <div className="relative flex gap-4">
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=500" alt="Clinical work" className="rounded-[2rem] shadow-2xl" />
              </div>
            </div>
          </section>

          {/* Core Pillars Section */}
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

          {/* Scientific Team Section */}
          <section className="py-24 px-6 bg-slate-50">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-4xl font-black text-[#1e4a6e] mb-4 uppercase tracking-tighter">Guided by Science</h2>
              <p className="text-slate-500 mb-16">Meet the professionals ensuring your meals are clinical-grade.</p>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { name: "Dr. Sarah Chen", role: "Chief Clinical Officer", tag: "Metabolic Health", img: "https://tse2.mm.bing.net/th/id/OIP.Agmc4p4OkgXC_h4Oy6OKKwHaIT?rs=1&pid=ImgDetMain&o=7&rm=3" },
                  { name: "Mark Thompson, RD", role: "Lead Dietitian", tag: "Renal Nutrition", img: "https://tse4.mm.bing.net/th/id/OIP.UOgC3QBrg_-5z1mkZPq7CQHaEL?w=1199&h=676&rs=1&pid=ImgDetMain&o=7&rm=3" },
                  { name: "Dr. Elena Rodriguez", role: "Head of Culinary Medicine", tag: "Cardiovascular Health", img: "https://www.oralis.es/wp-content/uploads/2023/08/maria-elena-rodriguez-1.jpg" }
                ].map((member, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
                    <img src={member.img} alt={member.name} className="w-24 h-24 rounded-full object-cover mb-6 border-4 border-slate-50" />
                    <h3 className="text-xl font-black text-[#1e4a6e] mb-1">{member.name}</h3>
                    <p className="text-sm font-bold text-blue-600 mb-4">{member.role}</p>
           
                 
                  </div>
                ))}
              </div>
            </div>
          </section>

         
         
       
  
    </div>
  );
};

export default About;