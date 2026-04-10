import React from "react";
import { Link } from "react-router-dom";
import { Activity, Phone, Mail, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const footerLinkStyles = "group flex items-center gap-1 text-[13px] font-bold text-slate-500 hover:text-[#75a74c] transition-all duration-300 uppercase tracking-widest";
  const sectionTitleStyles = "text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-[#1e4a6e]/40";

  return (
    <footer className="bg-white pt-32 pb-12 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-10">
        
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-6">
            <div className="flex items-center gap-3 group">
              <div className="bg-[#1e4a6e] p-2 rounded-xl group-hover:bg-[#75a74c] transition-colors duration-500 shadow-lg shadow-blue-900/10">
                <Activity className="text-white" size={20} />
              </div>
              <span className="text-xl font-[1000] text-slate-900 tracking-tighter uppercase">
                Swad<span className="text-[#75a74c]">Seva</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
              Hospital-certified, dietitian-approved clinical nutrition delivered for your recovery.
            </p>
          </div>

          <div>
            <h3 className={sectionTitleStyles}>Medical Portal</h3>
            <ul className="space-y-4">
              <li><Link to="/" className={footerLinkStyles}>Home</Link></li>
              <li><Link to="/menu" className={footerLinkStyles}>Clinical Menu</Link></li>
              <li><Link to="/about" className={footerLinkStyles}>About Us</Link></li>
              <li><Link to="/contact" className={footerLinkStyles}>Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={sectionTitleStyles}>Specialties</h3>
            <ul className="space-y-4">
              <li><Link to="/menu" className={footerLinkStyles}>Diabetic Care</Link></li>
              <li><Link to="/menu" className={footerLinkStyles}>Cardiac Nutrition</Link></li>
              <li><Link to="/menu" className={footerLinkStyles}>Elderly Nutrition</Link></li>
              <li><Link to="/menu" className={footerLinkStyles}>General Wellness</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={sectionTitleStyles}>Care Support</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600 group cursor-pointer">
                <div className="p-2 bg-white rounded-lg border border-slate-100 group-hover:border-[#75a74c] transition-colors">
                  <Phone size={14} className="text-[#1e4a6e]" />
                </div>
                <span className="text-sm font-bold text-slate-700">+91 800-CLINIC-SS</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 group cursor-pointer">
                <div className="p-2 bg-white rounded-lg border border-slate-100 group-hover:border-[#75a74c] transition-colors">
                  <Mail size={14} className="text-[#1e4a6e]" />
                </div>
                <span className="text-sm font-bold text-slate-700">care@swadseva.com</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 pt-2">
                <ShieldCheck size={16} className="text-[#75a74c]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hospital Standards Verified</span>
              </div>
            </div>
          </div>
        </div>

      
        <div className="relative py-12 border-y border-slate-50 overflow-hidden flex justify-center items-center">
            <h2 className="text-[12vw] font-[1000] text-slate-50/50 uppercase select-none tracking-tighter leading-none">
                Swad<span className="text-slate-100/80">Seva</span>
            </h2>
            <div className="absolute flex items-center gap-4 bg-white px-8">
                <ShieldCheck className="text-[#75a74c]" size={24} />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">
                    Medical Grade Standards
                </span>
                <ShieldCheck className="text-[#75a74c]" size={24} />
            </div>
        </div>

      <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            © 2026 SwadSeva. All Rights Reserved.
          </p>
          
          <div className="flex items-center gap-12">
            {['Privacy', 'Terms', 'Certifications'].map((link) => (
              <a key={link} href="#" className="text-[10px] font-black text-slate-400 hover:text-[#1e4a6e] uppercase tracking-widest transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}