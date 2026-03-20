import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Phone, Mail, MapPin, Send, 
  MessageSquare, Clock 
} from "lucide-react";
import { toast } from "react-toastify";

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
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-[#1e4a6e] p-3 rounded-2xl text-white">
              <MessageSquare size={24} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Support Inquiries</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 font-black uppercase text-[10px] tracking-widest text-slate-400">
                  <th className="p-6">Patient Details</th>
                  <th className="p-6">Reason</th>
                  <th className="p-6">Message</th>
                  <th className="p-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-slate-400 font-bold uppercase text-xs">
                      All clear! No pending inquiries.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((iq) => (
                    <tr key={iq._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <p className="font-bold text-slate-800">{iq.name}</p>
                        <p className="text-xs text-slate-400">{iq.phone}</p>
                      </td>
                      <td className="p-6">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                          {iq.reason}
                        </span>
                      </td>
                      <td className="p-6 text-sm text-slate-500 max-w-xs truncate">{iq.message}</td>
                      <td className="p-6 text-right">
                        <button 
                          onClick={() => handleResolve(iq._id)}
                          className="text-blue-600 font-black text-[10px] uppercase hover:text-green-600 transition-colors"
                        >
                          Mark Resolved
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
    <div className="min-h-screen bg-white font-sans">
      <div className="bg-[#1e4a6e] py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">Contact & Support</h1>
        <p className="text-blue-200 max-w-xl mx-auto text-sm font-medium uppercase tracking-widest opacity-80">
          Professional help for your clinical dietary needs.
        </p>
      </div>

      <div className="max-w-6xl mx-auto py-20 px-6 grid md:grid-cols-12 gap-16">
        <div className="md:col-span-4 space-y-12">
          {/* Contact Details Column */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6">Contact Details</h3>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Call Us</p>
                  <p className="font-bold text-slate-800">+91 1800-SWAD-SEVA</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Email Support</p>
                  <p className="font-bold text-slate-800">care@swadseva.in</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Location</p>
                  <p className="font-bold text-slate-800 leading-tight">Sector 5, Kolkata.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
            <Clock className="text-blue-600 mb-4" size={24} />
            <h4 className="font-black uppercase text-xs text-slate-800 mb-2">Delivery Hours</h4>
            <p className="text-xs text-slate-500 font-medium">Mon - Sat: 06:00 AM - 11:00 PM</p>
          </div>
        </div>

        {/* Inquiry Form Column */}
        <div className="md:col-span-8">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 md:p-12 shadow-sm">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-8">
              Send an <span className="text-blue-600">Inquiry</span>
            </h2>
            
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Full Name</label>
                <input type="text" placeholder="e.g. Rahul Sharma" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Phone Number</label>
                <input type="tel" placeholder="+91 00000 00000" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Reason for Inquiry</label>
                <select required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
                  <option value="">Select a reason</option>
                  <option value="diet">Diet Consultation</option>
                  <option value="bulk">Hospital Bulk Order</option>
                  <option value="feedback">Service Feedback</option>
                </select> 
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Your Message</label>
                <textarea rows="4" placeholder="How can our clinical team help you?" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500/20"></textarea>
              </div>
              <button type="submit" className="md:col-span-2 bg-[#1e4a6e] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all">
                Submit Request <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}