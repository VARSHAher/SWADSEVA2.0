import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faMessage, faReply, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from 'react-toastify'; 

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
    
    const formData = {
      name: event.target[0].value,
      phone: event.target[1].value,
      reason: event.target[2].value,
      message: event.target[3].value,
    };

    try {
      await axios.post("http://localhost:5000/api/inquiries", formData);
      
      toast.success("Message sent to SwadSeva Team!", { position: "top-center" });
      
      setTimeout(() => {
        event.target.reset();
      }, 500);
    } catch (err) {
      toast.error("Failed to send message. Check your Backend!");
      console.error(err);
    }
  };

  if (isAdmin) {
    return (
      <div className="bg-[#f6fffb] min-h-screen py-16 px-6 md:px-20">
        <h1 className="text-4xl font-black text-[#0f2f25] mb-10 text-center">User Queries</h1>
        {loading ? (
          <p className="text-center font-bold text-[#2f7a5a]">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {inquiries.map((iq) => (
              <div key={iq._id} className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-[#e6f6ee] text-[#2f7a5a] text-[10px] px-3 py-1 rounded-full font-black uppercase">{iq.reason}</span>
                  <p className="text-[10px] text-gray-400 font-bold">{new Date(iq.createdAt).toLocaleDateString()}</p>
                </div>
                <h3 className="font-black text-xl text-[#0f2f25]">{iq.name}</h3>
                <p className="text-[#2f7a5a] text-sm font-bold mb-3">{iq.phone}</p>
                <div className="bg-gray-50 p-4 rounded-2xl mb-4 italic text-gray-600 text-sm">"{iq.message}"</div>
                <a href={`mailto:admin@swadseva.com?subject=Reply to ${iq.reason}`} className="block text-center bg-[#0f2f25] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all">
                  <FontAwesomeIcon icon={faReply} className="mr-2" /> Reply via Email
                </a>
              </div>
            ))}
          </div>
        )}
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="bg-[#f6fffb] min-h-screen py-20 px-6">
      <section
        id="support"
        className="max-w-[1100px] mx-auto px-8 py-[80px] text-center bg-[#f3fff8] rounded-[32px] border border-[rgba(180,220,200,0.9)] shadow-[0_14px_45px_rgba(0,0,0,0.06)]"
      >
        <h2 className="text-[2.4rem] font-extrabold mb-4 text-[#0f2f25]">
          Care & <span className="text-[#2f7a5a]">Support</span>
        </h2>
        <p className="text-[#4b6b60] max-w-[760px] mx-auto mb-12 leading-[1.7]">
          Need help beyond placing an order? Our care team assists patients and
          caregivers with diet guidance, special meal requests, and order-related
          concerns — with patience and clarity.
        </p>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px] mx-auto"
          onSubmit={handleSubmit}
        >
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
            <button type="submit" className="bg-[#2f7a5a] hover:bg-[#256b4d] text-white px-10 py-3 rounded-[16px] font-bold shadow-md transition">
              Submit Request
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </div>
  );
}