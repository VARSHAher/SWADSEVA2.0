import React from "react";
import { Link } from "react-router-dom";
import { Activity, Phone, Mail, MapPin, ShieldCheck, HeartPulse } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#1e4a6e] text-white pt-24 overflow-hidden">
      
      {/* CURVY TOP DECORATION */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg className="relative block w-full h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10 pb-20">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-400" size={32} />
            <span className="text-2xl font-black tracking-tighter uppercase">SwadSeva</span>
          </div>
          <p className="text-blue-100/60 text-sm font-medium leading-relaxed">
            Leading the revolution in clinical nutrition. We ensure patients receive hospital-certified, dietitian-approved meals for a faster recovery.
          </p>
          <div className="flex gap-4">
             <div className="bg-white/10 p-3 rounded-xl hover:bg-blue-500 transition-colors"><ShieldCheck size={20}/></div>
             <div className="bg-white/10 p-3 rounded-xl hover:bg-blue-500 transition-colors"><HeartPulse size={20}/></div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-blue-300">Medical Portal</h3>
          <ul className="space-y-4">
            {['Home', 'Clinical Menu', 'My Orders', 'About SwadSeva'].map((link) => (
              <li key={link}>
                <Link to="/" className="text-sm font-bold text-blue-100/80 hover:text-white transition-colors flex items-center gap-2 group">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-blue-300">Specialties</h3>
          <ul className="space-y-4">
            {['Diabetic Meals', 'Cardiac Nutrition', 'Blood Pressure','Post-Surgery Diet',].map((link) => (
              <li key={link}>
                <Link to="/menu" className="text-sm font-bold text-blue-100/80 hover:text-white transition-colors uppercase tracking-tighter">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-blue-300">Care Support</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Phone size={18} className="text-blue-400 mt-1" />
              <div>
                <p className="text-[10px] font-black uppercase text-blue-300">Helpline</p>
                <p className="text-sm font-bold">+91 800-CLINIC-SS</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail size={18} className="text-blue-400 mt-1" />
              <div>
                <p className="text-[10px] font-black uppercase text-blue-300">Official Email</p>
                <p className="text-sm font-bold">care@swadseva.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-100/40">
            © 2026 SWADSEVA CLINICAL SOLUTIONS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-blue-100/40">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Hospital Standards</a>
            <a href="#" className="hover:text-white">Terms of Care</a>
          </div>
        </div>
      </div>
    </footer>
  );
}