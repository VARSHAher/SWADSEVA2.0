import React from "react";
import { 
  Target, Eye, ShieldCheck, Activity, Heart, Clock, Microscope, Truck, ChevronRight} from "lucide-react";

const About = () => {
  return (
    <div className="bg-white min-h-screen">
            <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-[1000] text-[#1e4a6e] uppercase tracking-tighter leading-[0.9] mb-6">
              Healing With <br />
              <span className="text-[#75a74c]">Swadseva</span>
            </h1>
            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl mb-8">
              SwadSeva is India's first hospital-integrated food solution, bridging the gap between medical prescriptions and daily meals.
            </p>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                  <ShieldCheck className="text-[#75a74c]" size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">NABH Standards</span>
               </div>
               <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                  <Activity className="text-[#1e4a6e]" size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Dietitian Verified</span>
               </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1e4a6e]/5 -skew-x-12 translate-x-20" />
      </section>

      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Clinical Meals", value: "50k+" },
            { label: "Partner Hospitals", value: "12+" },
            { label: "Certified Chefs", value: "25+" },
            { label: "Recovery Rate", value: "94%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-[#1e4a6e]">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-[#1e4a6e] p-12 rounded-[3rem] text-white relative overflow-hidden group">
            <Target className="absolute top-10 right-10 opacity-10 scale-[3]" size={100} />
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">Our Mission</h3>
            <p className="text-blue-100 text-lg font-medium leading-relaxed relative z-10">
              To deliver condition-specific, doctor-verified nutrition to every patient's doorstep, ensuring that recovery doesn't stop at the hospital gates.
            </p>
          </div>
          <div className="bg-[#75a74c] p-12 rounded-[3rem] text-white relative overflow-hidden group">
            <Eye className="absolute top-10 right-10 opacity-10 scale-[3]" size={100} />
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">Our Vision</h3>
            <p className="text-white-500 text-lg font-medium leading-relaxed bg-white/10 p-2 rounded-lg inline-block mt-2">
              Transforming "Food as Medicine" from a concept into a daily reality for millions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-[#1e4a6e] uppercase tracking-tighter">The Clinical Workflow</h2>
            <p className="text-slate-500 font-medium">How we ensure every meal is safe for your condition.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Microscope />, title: "Macro-Analysis", desc: "Every recipe is broken down by clinical nutritionists for sodium, potassium, and glycemic index." },
              { icon: <ShieldCheck />, title: "Sterile Kitchens", desc: "Our kitchens follow ISO 22000 standards with zero-cross contamination protocols." },
              { icon: <Truck />, title: "Safe Delivery", desc: "Hygienic, tamper-proof packaging ensures the meal reaches you in its purest medical form." }
            ].map((step, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="text-[#75a74c] mb-6">{step.icon}</div>
                <h4 className="text-xl font-bold text-slate-800 mb-3 uppercase tracking-tight">{step.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-[#1e4a6e] uppercase tracking-tighter mb-16 text-center">
          Our <span className="text-[#75a74c]">Medical</span> Experts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {[
            { name: "Dr. Sarah Chen", role: "Chief Clinical Officer", img: "https://tse2.mm.bing.net/th/id/OIP.Agmc4p4OkgXC_h4Oy6OKKwHaIT?rs=1&pid=ImgDetMain" },
            { name: "Mark Thompson, RD", role: "Lead Dietitian", img: "https://tse4.mm.bing.net/th/id/OIP.UOgC3QBrg_-5z1mkZPq7CQHaEL?rs=1&pid=ImgDetMain" },
            { name: "Dr. Elena Rodriguez", role: "Endocrinologist", img: "https://www.oralis.es/wp-content/uploads/2023/08/maria-elena-rodriguez-1.jpg" }
          ].map((member, i) => (
            <div key={i} className="text-center group">
              <div className="relative inline-block mb-6">
                <img src={member.img} alt={member.name} className="w-48 h-48 rounded-[3rem] object-cover grayscale group-hover:grayscale-0 transition-all duration-500 shadow-xl" />
                <div className="absolute -bottom-2 -right-2 bg-[#75a74c] p-3 rounded-2xl text-white">
                  <Activity size={20} />
                </div>
              </div>
              <h4 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{member.name}</h4>
              <p className="text-[#75a74c] text-[10px] font-black uppercase tracking-[0.2em] mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;