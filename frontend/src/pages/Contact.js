import React, { useEffect, useState } from "react";
import axios from "axios";
import { Phone, Mail, MapPin, Send, MessageSquare, Clock, ChevronRight} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Contact({ isAdmin }) {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (isAdmin) {
      const fetchInquiries = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
          const res = await axios.get("http://localhost:5000/api/inquiries", config);
          setInquiries(res.data);
        } catch (err) {
          console.error("Error fetching inquiries:", err);
        } finally { 
          setLoading(false); 
        }
      };
      fetchInquiries();
    }
  }, [isAdmin, userInfo?.token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const target = event.target;
    const formData = {
      name: target[0].value,
      phone: target[1].value,
      reason: target[2].value,
      message: target[3].value,
    };

    try {
      await axios.post("http://localhost:5000/api/inquiries", formData);
      toast.success("Request submitted successfully. Our dietician will call you.");
      target.reset();
    } catch (err) {
      toast.error("Submission failed. Please try again.");
    }
  };

  const handleResolve = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/inquiries/${id}`, {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      });
      setInquiries(prev => prev.filter(iq => iq._id !== id));
      toast.success("Inquiry resolved and removed.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to resolve inquiry.");
    }
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 pt-36 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div>
              <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <MessageSquare size={22} className="text-[#1e4a6e]" /> Support Inquiries
              </h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                Patient Requests Management
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 font-black uppercase text-[10px] tracking-widest text-slate-400">
                  <th className="p-8">Patient Details</th>
                  <th className="p-8">Reason</th>
                  <th className="p-8">Message</th>
                  <th className="p-8 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                      All clear! No pending inquiries.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((iq) => (
                    <tr key={iq._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-8">
                        <p className="font-black text-[#1e4a6e] uppercase text-sm">{iq.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">{iq.phone}</p>
                      </td>
                      <td className="p-8">
                        <span className="bg-green-50 text-[#75a74c] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-green-100">
                          {iq.reason}
                        </span>
                      </td>
                      <td className="p-8 text-sm font-medium text-slate-500 max-w-xs truncate">{iq.message}</td>
                      <td className="p-8 text-right">
                        <button 
                          onClick={() => handleResolve(iq._id)}
                          className="bg-[#1e4a6e] text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#75a74c] transition-all"
                        >
                          Resolve
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden pt-10">
      <section className="relative py-24 px-6 text-center">
      
        
        <h1 className="text-5xl md:text-5xl font-[1000] text-[#75a74c] uppercase tracking-tighter leading-none mb-4">
          Questions? <span className="text-[#1e4a6e]">We Care.</span>
        </h1>
       
        <div className="w-20 h-1.5 bg-[#75a74c] mx-auto mt-6 rounded-full"></div>
      </section>

      <div className="max-w-7xl mx-auto pb-24 px-6 grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-50/50 border border-slate-100 p-10 rounded-[2.5rem] space-y-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#75a74c]">Contact Details</h3>
            
            <div className="space-y-8">
              {[
                { icon: <Phone size={20} />, label: "Call Us", val: "+91 1800-SWAD-SEVA" },
                { icon: <Mail size={20} />, label: "Email Support", val: "care@swadseva.in" },
                { icon: <MapPin size={20} />, label: "Location", val: "Sector 5, Kolkata." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5 group">
                  <div className="shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#1e4a6e] shadow-sm group-hover:bg-[#1e4a6e] group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">{item.label}</p>
                    <p className="font-black text-[#1e4a6e] text-lg tracking-tight">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-10 bg-[#1e4a6e] rounded-[2.5rem] text-white relative overflow-hidden group">
            <Clock className="text-[#75a74c] mb-6" size={32} />
            <h4 className="font-black uppercase text-xs tracking-widest mb-2">Delivery Hours</h4>
            <p className="text-blue-100 font-medium text-lg">Mon - Sat: 06:00 AM - 11:00 PM</p>
            <div className="absolute -right-4 -bottom-4 text-white/5 font-black text-7xl select-none group-hover:scale-110 transition-transform duration-700">
              TIME
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 md:p-16 shadow-xl shadow-slate-200/20">
            <div className="mb-12">
                <h2 className="text-3xl font-[1000] text-[#1e4a6e] uppercase tracking-tighter mb-2">
                  Send an <span className="text-[#75a74c]">Inquiry</span>
                </h2>
                <p className="text-slate-400 text-sm font-medium">Our clinical dietician team will review your message.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Full Name</label>
                <input type="text" placeholder="e.g. Rahul Sharma" required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-5 outline-none focus:border-[#75a74c]/30 focus:bg-white transition-all font-medium" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Phone Number</label>
                <input type="tel" placeholder="+91 00000 00000" required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-5 outline-none focus:border-[#75a74c]/30 focus:bg-white transition-all font-medium" />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Reason for Inquiry</label>
                <div className="relative">
                    <select required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-5 outline-none focus:border-[#75a74c]/30 focus:bg-white transition-all font-bold text-[#1e4a6e] appearance-none">
                    <option value="">Select a reason</option>
                    <option value="diet">Diet Consultation</option>
                    <option value="bulk">Hospital Bulk Order</option>
                    <option value="feedback">Service Feedback</option>
                    </select> 
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Your Message</label>
                <textarea rows="5" placeholder="How can our clinical team help you?" required className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-5 outline-none focus:border-[#75a74c]/30 focus:bg-white transition-all font-medium"></textarea>
              </div>
              <button type="submit" className="md:col-span-2 bg-[#75a74c] text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-[#1e4a6e] hover:shadow-2xl hover:shadow-[#1e4a6e]/20 transition-all active:scale-95">
                Submit Request <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}