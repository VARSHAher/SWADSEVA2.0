import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Activity, Menu as MenuIcon, X, PlusCircle, LayoutDashboard, ClipboardList, MessageSquare, ShoppingCart, Home } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import ViewCart from "../pages/ViewCart"; 

const Header = ({ user, onLogout, isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
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
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    fetchCartCount();
    window.addEventListener("cartUpdated", fetchCartCount);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("cartUpdated", fetchCartCount);
    };
  }, [user, isAdmin]);

  const handleSignOut = () => {
    onLogout();
    toast.info("Signed out successfully.");
    navigate("/auth");
  };

  const isActive = (path) => location.pathname === path ? "text-blue-600 after:w-full" : "text-slate-600 hover:text-blue-600 after:w-0 hover:after:w-full";
  const navLinkStyles = "relative text-xs font-black uppercase tracking-widest transition-all duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 flex items-center gap-1.5";

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-lg py-2" : "bg-white border-b border-slate-100 py-4"}`}>
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          
   
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-gradient-to-br from-[#1e4a6e] to-blue-600 p-2.5 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-md">
              <Activity className="text-white" size={22} />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Swad<span className="text-blue-600">Seva</span></span>
          </Link>

   
          <div className="hidden lg:flex items-center gap-8">
            {isAdmin ? (
            
              <>
                <Link to="/" className={`${navLinkStyles} ${isActive("/")}`}>
                  <Home size={14} />Dashboard
                </Link>
                <Link to="/admin/orders" className={`${navLinkStyles} ${isActive("/admin/orders")}`}>
                  <ClipboardList size={14} /> Orders
              </Link>
                <Link to="/menu" className={`${navLinkStyles} ${isActive("/menu")}`}>
                 <LayoutDashboard size={14} /> Menu
                </Link>
                <Link to="/admin/create-menu" className={`${navLinkStyles} ${isActive("/admin/create-menu")}`}>
                  <PlusCircle size={14} /> Create
                </Link>
                <Link to="/contact" className={`${navLinkStyles} ${isActive("/contact")}`}>
                  <MessageSquare size={14} /> Support
                </Link>
              </>
            ) : (
              
              <>
                <Link to="/" className={`${navLinkStyles} ${isActive("/")}`}>Home</Link>
                <Link to="/about" className={`${navLinkStyles} ${isActive("/about")}`}>About</Link>
                <Link to="/menu" className={`${navLinkStyles} ${isActive("/menu")}`}>Menu</Link>
                {user && <Link to="/orders" className={`${navLinkStyles} ${isActive("/orders")}`}>Orders</Link>}
                <Link to="/contact" className={`${navLinkStyles} ${isActive("/contact")}`}>Contact</Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
        
            {!isAdmin && (
              <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="text-[10px] font-bold uppercase text-blue-600 tracking-tighter">{"Hello,"}</span>
                  <span className="text-sm font-black text-slate-800">{user.username}</span>
                </div>
                <button onClick={handleSignOut} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><LogOut size={20} /></button>
              </div>
            ) : (
              <Link to="/auth" className="bg-[#1e4a6e] text-white px-5 py-2 rounded-lg font-black uppercase text-[11px] tracking-wider hover:bg-blue-700 transition-all">Sign In</Link>
            )}
            
          
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-slate-600">
              {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
            </button>
          </div>
        </nav>
      </header>
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isCartOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-300 transform ${isCartOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
          <div className="p-6 flex justify-between items-center border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Your Tray</h2>
            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
             <ViewCart isSidebar={true} closeSidebar={() => setIsCartOpen(false)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;