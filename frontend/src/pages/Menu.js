import React, { useState, useEffect, useMemo } from "react";
import { Search, Droplets, Activity, Heart,Gauge ,Stethoscope , User, Utensils, Leaf, Edit, Trash2, Filter, ArrowUpDown } from "lucide-react";
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
  const [foodFilter, setFoodFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/menu");
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load portal data");
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
    let items = menuItems.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesCategory = selectedCategory === "All" || item.healthCategory === selectedCategory;
      const matchesSearch = query === "" || item.name?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query);
      const matchesFoodType = foodFilter === "all" || item.foodType === foodFilter;
      return matchesCategory && matchesSearch && matchesFoodType;
    });

    if (sortOrder === "low-high") {
      items.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "popular") {
      items.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
    }
    return items;
  }, [menuItems, selectedCategory, searchQuery, foodFilter, sortOrder]);

  const categories = [
  { name: "All Items", value: "All", icon: null },
  
  { name: "Diabetes Care", value: "diabetic", icon: <Droplets size={16} className="text-blue-400" /> },
  { name: "Cardiac/ Heart", value: "cardiac", icon: <Heart size={16} className="text-red-500" /> },
  { name: "Blood Pressure", value: "bp", icon: <Gauge size={16} className="text-orange-500" /> },
  { name: "Post-Surgery", value: "post_surgery", icon: <Stethoscope size={16} className="text-slate-500" /> },
  { name: "Digestive & Gut Health", value: "digestive", icon: <Utensils size={16} className="text-amber-600" /> },
  { name: "Elderly Nutrition", value: "elderly", icon: <User size={16} className="text-indigo-500" /> },
  { name: "Fitness & Recovery", value: "fitness", icon: <Activity size={16} className="text-emerald-500" /> },
  { name: "General Wellness", value: "general", icon: <Leaf size={16} className="text-green-500" /> },
];

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Initializing Portal...</div>;

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] md:p-6 font-sans">
      <div className="w-full min-h-screen bg-white shadow-sm p-6 md:p-12 relative">
        <div className="pt-20 mb-8 text-center flex flex-col items-center">
  <h1 className="text-4xl md:text-6xl font-[1000] text-[#1e4a6e] mb-4 tracking-tighter uppercase leading-none">
    Find Your <span className="text-[#75a74c]">Medicine</span>
  </h1>
  <p className="text-slate-400 text-lg font-medium max-w-lg leading-relaxed">
    Discover dietitian-approved meals specifically calibrated for your clinical recovery.
  </p>
</div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 max-w-5xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input 
              type="text" 
              className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-slate-100 outline-none focus:border-[#75a74c] transition-all"
              placeholder="Search condition or meal name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-7xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-[#1e4a6e]" />
              <select 
                value={foodFilter}
                onChange={(e) => setFoodFilter(e.target.value)}
                className="bg-transparent font-bold text-sm text-slate-600 outline-none cursor-pointer"
              >
                <option value="all">All Food Types</option>
                <option value="veg">Pure Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>
            </div>

            <div className="flex items-center gap-2 border-l pl-6 border-slate-200">
              <ArrowUpDown size={18} className="text-[#1e4a6e]" />
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-transparent font-bold text-sm text-slate-600 outline-none cursor-pointer"
              >
                <option value="default">Sort: Default</option>
                <option value="low-high">Price: Low to High</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {filteredItems.length} Recipes Matched
          </span>
        </div>


      <div className="flex flex-nowrap overflow-x-auto no-scrollbar gap-3 mb-12 pb-2">
  {categories.map((cat) => (
    <button
      key={cat.value}
      onClick={() => setSelectedCategory(cat.value)}
      className={`flex-shrink-0 whitespace-nowrap px-6 py-3 rounded-full border-2 font-bold text-sm flex items-center gap-2 transition-all 
        ${selectedCategory === cat.value 
          ? "bg-[#75a74c] text-white border-[#75a74c] shadow-lg shadow-blue-900/10" 
          : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
        }`}
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
                  <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e4a6e] via-black/40 to-transparent opacity-90"></div>

                  <div className="absolute top-4 left-4">
                    <div className={`w-5 h-5 border-2 ${isNonVeg ? 'border-red-600' : 'border-[#75a74c]'} flex items-center justify-center bg-white/10 backdrop-blur-md rounded-sm`}>
                      <div className={`w-2 h-2 ${isNonVeg ? 'bg-red-600' : 'bg-[#75a74c]'} rounded-full`}></div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md">
                    <span className="text-white text-[8px] font-black uppercase tracking-widest">{item.healthCategory}</span>
                  </div>

                  <div className="absolute inset-0 p-6 flex flex-col justify-end transition-opacity duration-300">
                    <div className="mb-4">
                      <h3 className="text-2xl font-black text-white mb-2 leading-tight uppercase tracking-tight">{item.name}</h3>
                      <p className="text-slate-300 text-xs font-medium line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="flex justify-between items-end w-full">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[#75a74c] text-sm font-black">₹</span>
                        <span className="text-white text-3xl font-black tracking-tighter">{item.price}</span>
                      </div>
                      
                      <div className="relative">
                        {isAdmin ? (
                          <div className="flex gap-2 relative z-50">
                            <button onClick={() => navigate("/admin/create-menu", { state: { itemToUpdate: item } })} className="bg-white/20 backdrop-blur-md p-2 rounded-lg text-white hover:bg-white/30 transition-all"><Edit size={16}/></button>
                            <button onClick={() => handleDelete(item._id)} className="bg-red-500/20 backdrop-blur-md p-2 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"><Trash2 size={16}/></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-xl shadow-2xl">
                            <span className="text-yellow-500 text-sm">★</span>
                            <span className="text-[#1e4a6e] text-sm font-black">{item.ratings || "4.0"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                
{!isAdmin && (
  <div className="absolute inset-0 bg-[#1e4a6e]/95 backdrop-blur-md p-8 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-all duration-300">
    
    <div className="transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
      <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
        Clinical Breakdown
      </p>
      
      <div className="flex gap-6 mb-10 text-white">
        <div className="text-center">
          <p className="text-[8px] uppercase text-white/60 mb-1 font-bold">Prot</p>
          <p className="text-lg font-black text-white">{item.protein || "0g"}</p>
        </div>

        <div className="border-x border-white/20 px-6 text-center">
          <p className="text-[8px] uppercase text-white/60 mb-1 font-bold">Carb</p>
          <p className="text-lg font-black text-white">{item.carbs || "0g"}</p>
        </div>

        <div className="text-center">
          <p className="text-[8px] uppercase text-white/60 mb-1 font-bold">Kcal</p>
          <p className="text-lg font-black text-white">{item.calories || "0"}</p>
        </div>
      </div>
    </div>

    <div className="w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75 px-2">
       <AddToCart item={item} /> 
    </div>
  </div>
)}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-slate-400"><h2 className="text-2xl font-bold uppercase tracking-widest">No Medical Records Found</h2></div>
        )}
      </div>
    </div>
  );
};

export default Menu;