import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, ChevronRight, Activity, Heart, Clock, User, 
  Utensils, Leaf, CheckCircle2, Edit, Trash2, Info 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AddToCart from "../components/AddToCart";

const Menu = ({ isAdmin }) => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const updateCartPreview = (count) => {
    setCartCount(count);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const { data: menuData } = await axios.get("http://localhost:5000/api/menu");
        setMenuItems(menuData);

        if (userInfo?.token) {
          const { data: cartData } = await axios.get("http://localhost:5000/api/cart", {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          const totalItems = cartData.items.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(totalItems);
        }
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load clinical portal data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        await axios.delete(`http://localhost:5000/api/menu/${id}`, {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setMenuItems(prev => prev.filter(item => item._id !== id));
        toast.success("Record removed");
      } catch (err) { toast.error("Delete failed"); }
    }
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesCategory = selectedCategory === "All" || item.healthCategory === selectedCategory;
      const matchesSearch = query === "" || item.name?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

const categories = [

    { name: "All Items", value: "All", icon: null },

    { name: "Diabetes Care", value: "diabetic", icon: <Activity size={16} /> },

    { name: "Cardiac/ Heart", value: "cardiac", icon: <Activity size={16} /> },

    { name: "Blood Pressure", value: "bp", icon: <Heart size={16} /> },

    { name: "Post-Surgery", value: "post_surgery", icon: <Clock size={16} /> },

    { name: "Digestive & Gut Health", value: "digestive", icon: <Clock size={16} /> },

    { name: "Elderly Nutrition", value: "elderly", icon: <User size={16} /> },

    { name: "Fitness & Recovery", value: "fitness", icon: <Utensils size={16} /> },

    { name: "General Wellness", value: "general", icon: <Leaf size={16} /> },

  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Initializing Portal...</div>;

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] md:p-6 font-sans">
      <div className="w-full min-h-screen bg-white shadow-sm p-6 md:p-12 relative">
        <div className="mb-10 max-w-4xl">
          <h1 className="text-4xl font-extrabold text-[#1e293b] mb-3 tracking-tight">Find Nutrition for Recovery</h1>
          <p className="text-slate-500 text-lg italic font-medium">Discover clinical meals for your health condition.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input 
              type="text" 
              className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-slate-100 outline-none focus:border-[#1e4a6e]"
              placeholder="Search condition or meal..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="bg-[#1e4a6e] text-white px-12 py-4 rounded-2xl font-bold shadow-xl">Check Eligibility</button>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-6 py-3 rounded-full border-2 font-bold text-sm flex items-center gap-2 ${selectedCategory === cat.value ? "bg-[#1e4a6e] text-white border-[#1e4a6e]" : "bg-white text-slate-500 border-slate-100"}`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

{filteredItems.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24 px-4">
    {filteredItems.map((item) => {
      const isNonVeg = item.foodType === "non-veg";
      
      return (
        <div 
          key={item._id} 
          className="group relative h-[400px] w-full rounded-[2rem] overflow-hidden shadow-lg transition-transform duration-500 hover:scale-[1.02]"
        >
          <img 
            src={item.image} 
            alt={item.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

          <div className="absolute top-4 left-4">
            <div className={`w-5 h-5 border-2 ${isNonVeg ? 'border-red-600' : 'border-green-600'} flex items-center justify-center bg-white/10 backdrop-blur-md rounded-sm`}>
              <div className={`w-2 h-2 ${isNonVeg ? 'bg-red-600' : 'bg-green-600'} rounded-full`}></div>
            </div>
          </div>

          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="mb-4">
              <h3 className="text-2xl font-black text-white mb-2 leading-tight">
                {item.name}
              </h3>
              <p className="text-slate-300 text-xs font-medium line-clamp-3 mb-4 leading-relaxed">
                {item.description || "Freshly prepared with handpicked ingredients for your clinical recovery and wellness."}
              </p>
            </div>

          
<div className="flex justify-between items-end w-full">
  <div className="flex items-baseline gap-1">
    <span className="text-white text-sm font-black opacity-80">₹</span>
    <span className="text-white text-2xl font-black tracking-tighter">
      {item.price}
    </span>
  </div>

  <div className="relative">
    {isAdmin ? (
      <div className="flex gap-2">
        <button 
          onClick={() => navigate("/admin/create-menu", { state: { itemToUpdate: item } })} 
          className="bg-white/20 backdrop-blur-md p-2 rounded-lg text-white hover:bg-white/30 transition-all"
        >
          <Edit size={16}/>
        </button>
        <button 
          onClick={() => handleDelete(item._id)} 
          className="bg-red-500/20 backdrop-blur-md p-2 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
        >
          <Trash2 size={16}/>
        </button>
      </div>
    ) : (
      <div className="w-24 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl transform active:scale-95 transition-all">
         <AddToCart 
           item={item} 
           onCartChange={updateCartPreview} 
           buttonText="ADD" 
         />
      </div>
    )}
  </div>
</div>
          </div>

          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md">
             <span className="text-white/60 text-[8px] font-black uppercase tracking-widest">{item.healthCategory}</span>
          </div>
        </div>
      );
    })}
  </div>
) : (
  <div className="py-32 flex flex-col items-center justify-center">
    <h2 className="text-2xl font-bold text-slate-400">No Items Found</h2>
  </div>
)}
      
      </div>
    </div>
  );
};

export default Menu;