import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,Activity, MenuIcon,X,ShoppingCart,User,Phone,MapPin,UserCircle,Edit3,ShoppingBag,} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import ViewCart from "../pages/ViewCart";

const Header = ({ user, onLogout, isAdmin, onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    phone: "",
    address: "",
    age: "",
    gender: "",
    city: "", 
  });


  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        phone: user.phone || "",
        address: user.address || "",
        age: user.age || "",
        gender: user.gender || "",
        city: user.city || localStorage.getItem("userCity") || "",
      });
    }
  }, [user, isProfileOpen]);

  const fetchCartCount = useCallback(async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.token && !isAdmin) {
      try {
        const { data } = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const total = data.items.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(total);
      } catch (err) {
        console.error("Header cart fetch error", err);
      }
    }
  }, [isAdmin]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    fetchCartCount();
    window.addEventListener("cartUpdated", fetchCartCount);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("cartUpdated", fetchCartCount);
    };
  }, [user, isAdmin, fetchCartCount]);

  const handleSaveProfile = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || !userInfo.token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.patch(
        `http://localhost:5000/api/users/update/${userInfo._id}`,
        profileData,
        config,
      );

      if (data) {
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ ...userInfo, ...data }),
        );

        if (onLogin) onLogin({ ...userInfo, ...data });

        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Update Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Database update failed");
    }
  };
  const handleSignOut = () => {
    setIsProfileOpen(false);
    onLogout();
    toast.info("Signed out successfully.");
    navigate("/auth");
  };

 const isActive = (path) =>
    location.pathname === path
      ? "text-[#75a74c]" 
      : isScrolled 
        ? "text-slate-900 hover:text-[#75a74c]" 
        : "text-[#1e4a6e] hover:text-[#75a74c]";

  const navLinkStyles =
    "text-[12px] font-[1000] uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2 whitespace-nowrap";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/90 backdrop-blur-md shadow-sm py-3 border-b border-slate-100" 
            : "bg-transparent py-5"
        }`}
      >
        <nav className="w-full mx-auto px-8 flex items-center">
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="bg-[#1e4a6e] p-2 rounded-xl shadow-lg group-hover:bg-[#75a74c] transition-colors duration-500">
                <Activity className="text-white" size={20} />
              </div>
              <span className={`text-2xl font-[1000] tracking-tighter uppercase transition-colors duration-300 ${
                isScrolled ? "text-slate-900" : "text-[#1e4a6e]"
              }`}>
                Swad<span className="text-[#75a74c]">Seva</span>
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex flex-[2] justify-center items-center gap-10">
            {!isAdmin && (
              <>
                <Link to="/" className={`${navLinkStyles} ${isActive("/")}`}>Home</Link>
                <Link to="/menu" className={`${navLinkStyles} ${isActive("/menu")}`}>Menu</Link>
                <Link to="/about" className={`${navLinkStyles} ${isActive("/about")}`}>About Us</Link>
                <Link to="/contact" className={`${navLinkStyles} ${isActive("/contact")}`}>Contact</Link>
              </>
            )}
            {isAdmin && (
               <>
                <Link to="/" className={`${navLinkStyles} ${isActive("/")}`}>Dashboard</Link>
                <Link to="/menu" className={`${navLinkStyles} ${isActive("/menu")}`}>Menu</Link>
                <Link to="/admin/orders" className={`${navLinkStyles} ${isActive("/admin/orders")}`}>Orders</Link>
                <Link to="/contact"className={`${navLinkStyles} ${isActive("/contact")}`}>Support</Link>
               </>
            )}
          </div>

          <div className="flex-1 flex justify-end items-center gap-6">
            {!isAdmin && (
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-2 transition-all duration-300 hover:scale-110 ${
                  isScrolled ? "text-slate-900" : "text-[#1e4a6e]"
                }`}
              >
                <ShoppingCart size={22} strokeWidth={2.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#75a74c] text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-3 group">
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#75a74c]">
                    {getGreeting()}
                  </span>
                  <span className={`text-[13px] font-[1000] uppercase tracking-tight ${
                    isScrolled ? "text-slate-900" : "text-[#1e4a6e]"
                  }`}>
                    {user.username}
                  </span>
                </div>
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200 group-hover:border-[#75a74c] transition-all">
                  <User size={18} className="text-[#1e4a6e]" />
                </div>
              </button>
            ) : (
              <Link
                to="/auth"
                className="bg-[#1e4a6e] text-white px-7 py-3 rounded-xl font-[1000] uppercase text-[10px] tracking-[0.15em] hover:bg-[#75a74c] transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-[110] transition-opacity duration-300 ${isCartOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 transform ${isCartOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}
        >
          <div className="p-6 flex justify-between items-center border-b border-slate-100">
            <h2 className="text-xl font-black text-[#1e4a6e] uppercase">
              Your Tray
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ViewCart
              isSidebar={true}
              closeSidebar={() => setIsCartOpen(false)}
            />
          </div>
        </div>
      </div>

<div className={`fixed inset-0 z-[110] transition-opacity ${isProfileOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsProfileOpen(false)} />
  <div className={`absolute right-0 top-0 h-full w-full max-w-[360px] bg-white shadow-2xl transition-transform transform ${isProfileOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
    
    <div className="p-6 flex justify-between items-center border-b">
      <h2 className="text-lg font-black text-[#1e4a6e] uppercase">Profile Settings</h2>
      <button onClick={() => setIsProfileOpen(false)}><X size={20} /></button>
    </div>

    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col items-center bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
        <div className={`w-20 h-20 ${isAdmin ? 'bg-blue-600' : 'bg-[#1e4a6e]'} rounded-full flex items-center justify-center border-4 border-white mb-4 relative`}>
          <User size={40} className="text-white" />
        </div>
        <h3 className="font-black text-slate-900 uppercase">{user?.username}</h3>
        <p className="text-[10px] text-slate-500 font-bold uppercase">{isAdmin ? "System Administrator" : user?.email}</p>
      </div>

      <div className="space-y-6">
        {isAdmin ? (
          <div className="space-y-5">
            <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest border-b pb-2">Admin Command Center</h4>
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kitchen Status</span>
                <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <p className="text-[11px] font-bold text-green-600">Currently Accepting Orders</p>
            </div>

           

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-[9px] font-black text-blue-400 uppercase">Nutritionist</p>
                <p className="text-[11px] font-bold text-blue-700">Dr. S. Roy</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-[9px] font-black text-indigo-400 uppercase">Current Shift</p>
                <p className="text-[11px] font-bold text-indigo-700">08:00 - 16:00</p>
              </div>
            </div>

            
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-widest border-b pb-2">Personal Information</h4>
            
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase">Phone Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  disabled={!isEditing}
                  className="w-full p-3 pl-10 bg-slate-50 rounded-xl border text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>

              <label className="text-[10px] font-black text-slate-400 uppercase">Full Address</label>
              <textarea
                disabled={!isEditing}
                className="w-full p-3 bg-slate-50 rounded-xl border text-xs font-bold h-20 resize-none outline-none focus:ring-1 focus:ring-blue-500"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              />

              <label className="text-[10px] font-black text-slate-400 uppercase">City</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  disabled={!isEditing}
                  placeholder="Enter City"
                  className="w-full p-3 pl-10 bg-slate-50 rounded-xl border text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Age</label>
                  <input
                    type="number"
                    disabled={!isEditing}
                    className="w-full p-3 bg-slate-50 rounded-xl border text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                    value={profileData.age}
                    onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase">Gender</label>
                  <select
                    disabled={!isEditing}
                    className="w-full p-3 bg-slate-50 rounded-xl border text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                    value={profileData.gender}
                    onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t space-y-3">
          {isAdmin ? (
            <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 font-black uppercase text-[11px] transition-all">
              <LogOut size={18} /> Sign Out Admin
            </button>
          ) : (
            <>
              {isEditing ? (
                <button onClick={handleSaveProfile} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-[11px] shadow-lg shadow-blue-200">Save Changes</button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="w-full py-4 border-2 border-[#1e4a6e] text-[#1e4a6e] rounded-xl font-black uppercase text-[11px] hover:bg-slate-50">Edit Profile</button>
              )}
              <Link to="/orders" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center justify-center gap-3 p-4 border-2 border-slate-100 rounded-xl hover:bg-slate-50 font-black uppercase text-[11px] transition-all">
                <ShoppingBag size={18} /> My Orders
              </Link>
              <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 rounded-xl font-black uppercase text-[11px] hover:bg-red-100 transition-all">
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
    </>
  );
};  
export default Header;