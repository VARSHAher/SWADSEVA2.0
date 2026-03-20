import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ArrowRight, ShieldCheck, Activity } from "lucide-react";

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
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[650px]"
      >
        {/* Left Side: Branding/Visual */}
        <div className="md:w-1/2 bg-[#1e4a6e] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Activity size={300} strokeWidth={1} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="text-blue-300" size={32} />
              <span className="text-2xl font-black uppercase tracking-tighter">SwadSeva</span>
            </div>
            <h1 className="text-5xl font-black leading-tight mb-4 uppercase tracking-tighter">
              {isSignUp ? "Join the Clinical Circle" : "Welcome Back, Provider"}
            </h1>
            <p className="text-blue-100 text-lg font-medium opacity-80">
              Connecting patients with the right nutrition. Your clinical middleman for healthy living.
            </p>
          </div>

          <div className="relative z-10 border-t border-white/10 pt-8">
            <div className="flex -space-x-3 mb-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1e4a6e] bg-slate-200" />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#1e4a6e] bg-blue-400 flex items-center justify-center text-[10px] font-bold">
                +1k
              </div>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Trusted by Medical Professionals</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
              {isSignUp ? "Create Account" : "Secure Login"}
            </h2>
            <p className="text-slate-400 font-medium mt-1">
              {isSignUp ? "Start your healthcare journey today" : "Enter your credentials to continue"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-[#1e4a6e] focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@clinical.com"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#1e4a6e] focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Security Code</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#1e4a6e] focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold text-slate-700"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1e4a6e] text-white py-5 rounded-2xl font-black uppercase text-sm flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10 hover:bg-[#153550] transition-all group active:scale-95"
            >
              {isSignUp ? "Initialize Account" : "Access Dashboard"}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-bold text-slate-400 hover:text-[#1e4a6e] transition-colors"
            >
              {isSignUp ? "Already have access? " : "New to SwadSeva? "}
              <span className="text-[#1e4a6e] border-b-2 border-[#1e4a6e]/20 pb-1">
                {isSignUp ? "Sign In" : "Register Now"}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;