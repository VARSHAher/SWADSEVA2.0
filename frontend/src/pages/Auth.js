import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

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

      toast.success(isSignUp ? "Welcome to the SwadSeva family!" : "Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fdfcfb] p-4 md:p-10">
      {/* Premium Container */}
      <div className="relative w-full max-w-[1000px] h-[650px] bg-white rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Side: Visual/Branding (Hidden on mobile) */}
        <div className="hidden md:flex w-1/2 bg-[#2f7a5a] relative items-center justify-center p-12 overflow-hidden">
          {/* Animated Background Circles */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white opacity-5 rounded-full" />
          <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-white opacity-10 rounded-full" />
          
          <div className="z-10 text-white">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[3.5rem] font-black leading-tight mb-4 italic tracking-tighter"
            >
              Swad<span className="text-[#e9c46a]">Seva.</span>
            </motion.h2>
            <p className="text-lg font-medium text-white/80 leading-relaxed">
              "Healing starts with what you eat. Join us for a healthier recovery journey."
            </p>
            <div className="mt-10 flex gap-2">
              <span className="w-12 h-1 bg-[#e9c46a] rounded-full"></span>
              <span className="w-4 h-1 bg-white/30 rounded-full"></span>
              <span className="w-4 h-1 bg-white/30 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 bg-white relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "signup" : "signin"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-10">
                <h2 className="text-[2rem] font-black text-[#0f2f25]">
                  {isSignUp ? "Create Account" : "Sign In"}
                </h2>
                <p className="text-gray-400 font-medium">
                  {isSignUp ? "Join the community today" : "Enter your details to continue"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {isSignUp && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs uppercase font-bold text-[#2f7a5a] ml-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="e.g. JhonDoe"
                      className="w-full bg-[#f8fcfb] border border-gray-100 rounded-2xl px-5 py-4 focus:border-[#2f7a5a] focus:ring-4 focus:ring-[#2f7a5a]/5 transition-all outline-none text-[#0f2f25]"
                      required
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase font-bold text-[#2f7a5a] ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-[#f8fcfb] border border-gray-100 rounded-2xl px-5 py-4 focus:border-[#2f7a5a] focus:ring-4 focus:ring-[#2f7a5a]/5 transition-all outline-none text-[#0f2f25]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs uppercase font-bold text-[#2f7a5a]">Password</label>
                    {!isSignUp && <button type="button" className="text-[10px] text-gray-400 hover:text-[#2f7a5a] font-bold uppercase">Forgot?</button>}
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-[#f8fcfb] border border-gray-100 rounded-2xl px-5 py-4 focus:border-[#2f7a5a] focus:ring-4 focus:ring-[#2f7a5a]/5 transition-all outline-none text-[#0f2f25]"
                    required
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="bg-[#2f7a5a] text-white font-black py-5 rounded-2xl mt-4 shadow-[0_20px_40px_rgba(47,122,90,0.2)] transition-all uppercase tracking-widest text-sm"
                >
                  {isSignUp ? "Create My Account" : "Secure Sign In"}
                </motion.button>
              </form>

              <p className="text-center mt-8 text-sm text-gray-500 font-medium">
                {isSignUp ? "Already a member?" : "Don't have an account yet?"}{" "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[#2f7a5a] font-black hover:underline underline-offset-4"
                >
                  {isSignUp ? "Log In" : "Sign Up For Free"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Auth;