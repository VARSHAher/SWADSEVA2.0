import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {User,Mail,Lock,ArrowRight,ShieldCheck,CheckCircle2,Heart} from "lucide-react";

const Auth = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp
      ? "http://localhost:5000/api/users/register"
      : "http://localhost:5000/api/users/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      localStorage.setItem("userInfo", JSON.stringify(data));
      if (onLogin) onLogin(data);

      toast.success(isSignUp ? "Welcome to SwadSeva!" : "Access Granted!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center pt-24 pb-12 px-6 font-['Outfit',_sans-serif] overflow-hidden">
      
      <div className="absolute inset-0 -z-10 bg-[#f8fafc]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#75a74c]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1e4a6e]/10 rounded-full blur-[120px]"></div>
        
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e4a6e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full flex flex-col md:flex-row bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-white overflow-hidden"
      >
        
        <div className="md:w-5/12 bg-gradient-to-br from-[#1e4a6e] to-[#153550] p-12 lg:p-16 text-white flex flex-col justify-between relative">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md">
                <ShieldCheck className="text-[#75a74c]" size={28} />
              </div>
              <span className="text-xl font-bold tracking-tight">SwadSeva</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tighter uppercase mb-6">
              {isSignUp ? "Begin Your \n Healthy \n Journey" : "Your Health \n Dashboard \n Awaits"}
            </h1>
            
            <div className="space-y-4 opacity-80">
              {[
                "Clinically Balanced Meals",
                "Nutritionist Support",
                "Fast Hospital Delivery"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium">
                  <CheckCircle2 size={18} className="text-[#75a74c]" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 pt-10 mt-10 border-t border-white/10">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#75a74c]">
                <Heart size={12} fill="#75a74c" /> Trusted by Doctors
             </div>
          </div>
        </div>

        <div className="flex-1 p-12 lg:p-20 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-[#1e4a6e] uppercase tracking-tighter mb-2">
              {isSignUp ? "Registration" : "Authentication"}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
              Precision Clinical Nutrition
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-1"
                >
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#75a74c] transition-colors" size={18} />
                    <input
                      name="username"
                      value={formData.username || ""}
                      onChange={handleChange}
                      placeholder="John Doe "
                      className="w-full bg-slate-50 border border-slate-100 focus:border-[#75a74c]/30 focus:bg-white rounded-[1.5rem] py-5 pl-14 pr-6 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email ID</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#75a74c] transition-colors" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  placeholder="john.doe@hospital.com  "
                  className="w-full bg-slate-50 border border-slate-100 focus:border-[#75a74c]/30 focus:bg-white rounded-[1.5rem] py-5 pl-14 pr-6 outline-none transition-all font-bold text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#75a74c] transition-colors" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-[#75a74c]/30 focus:bg-white rounded-[1.5rem] py-5 pl-14 pr-6 outline-none transition-all font-bold text-slate-700"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1e4a6e] text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#75a74c] transition-all active:scale-[0.98] shadow-xl shadow-blue-900/10 mt-6"
            >
              {isSignUp ? "Create Account" : "Access Portal"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="group text-[10px] font-black text-slate-400 uppercase tracking-widest"
            >
              {isSignUp ? "Already a member? " : "New Healthcare User? "}
              <span className="text-[#1e4a6e] border-b-2 border-[#1e4a6e]/10 group-hover:border-[#75a74c] transition-all ml-1">
                {isSignUp ? "Login" : "Register"}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;