import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, ChevronRight, Activity, Heart, Clock, User, 
  Utensils, Leaf, CheckCircle2, Edit, Trash2, Info 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// Correct path to components folder
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-24">
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm flex flex-col h-full">
                <div className="w-full h-52 mb-6 overflow-hidden rounded-[1.8rem] bg-slate-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg">{item.healthCategory}</span>
                  <span className="text-[#1e4a6e] text-2xl font-black">₹{item.price}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{item.name}</h3>
                
                <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-2">{item.description}</p>
                <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-2 text-[#16a34a] text-[10px] font-black uppercase mb-1">
                    <CheckCircle2 size={16} /> Clinical Benefit
                  </div>
                  <p className="text-[#15803d] text-[13px] font-bold">{item.clinicalBenefits}</p>
                </div>
                <div className="mt-auto">
                  {isAdmin ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => navigate("/admin/create-menu", { state: { itemToUpdate: item } })} className="py-3 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2"><Edit size={16}/> Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="py-3 rounded-xl border-2 border-red-50 text-red-400 font-bold text-sm flex items-center justify-center gap-2"><Trash2 size={16}/> Delete</button>
                    </div>
                  ) : (
                    <AddToCart item={item} onCartChange={updateCartPreview} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center bg-slate-50 rounded-[3rem] border-2 border-dashed">
            <Info size={40} className="text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800">No Records Found</h2>
          </div>
        )}

      
      </div>
    </div>
  );
};

export default Menu;