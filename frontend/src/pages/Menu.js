import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddToCartButton from "../components/AddToCart"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Menu = ({ isAdmin, searchQuery: propSearchQuery }) => {
  const navigate = useNavigate();
  
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    { name: "All", value: "All", img: "https://cdn-icons-png.flaticon.com/512/2382/2382461.png" },
    { name: "Diabetic", value: "diabetic", img: "https://cdn-icons-png.flaticon.com/512/5935/5935553.png" },
    { name: "Cardiac", value: "cardiac", img: "https://cdn-icons-png.flaticon.com/512/10165/10165953.png" },
    { name: "Hormonal", value: "hormonal", img: "https://cdn-icons-png.flaticon.com/512/10207/10207748.png" },
    { name: "Surgery", value: "post_surgery", img: "https://cdn-icons-png.flaticon.com/512/2864/2864350.png" },
    { name: "Elderly", value: "elderly", img: "https://cdn-icons-png.flaticon.com/512/16848/16848739.png" },
    { name: "Fitness", value: "fitness", img: "https://cdn-icons-png.flaticon.com/512/15335/15335164.png" },
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/menu");
        setMenuItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu:", error);
        toast.error("Failed to load menu items");
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = useMemo(() => {
    let items = menuItems;

    if (propSearchQuery && propSearchQuery.length > 0) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(propSearchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      items = items.filter(
        (item) => item.healthCategory?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    return items;
  }, [menuItems, propSearchQuery, selectedCategory]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        };
        await axios.delete(`http://localhost:5000/api/menu/${id}`, config);
        setMenuItems((prev) => prev.filter((item) => item._id !== id));
        toast.success("Item deleted successfully");
      } catch (error) {
        toast.error("Failed to delete item");
      }
    }
  };

  return (
    <section className="min-h-screen bg-[#f6fffb] py-10 px-4 md:px-12">
      
      <div className="max-w-7xl mx-auto mb-10 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-[#e6f6ee] text-[#2f7a5a] font-semibold text-sm mb-3">
          Clinical Nutrition Menu
        </span>
        <h2 className="text-[2.5rem] font-extrabold text-[#0f2f25]">
          Choose Your <span className="text-[#2f7a5a]">Health Diet</span>
        </h2>
        <p className="text-[#5b7b70] max-w-2xl mx-auto mt-2">
          Select a category below to filter meals designed for specific medical conditions and recovery goals.
        </p>
      </div>

      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-200 font-bold text-sm ${
                selectedCategory === cat.value
                  ? "bg-[#2f7a5a] border-[#2f7a5a] text-white shadow-lg scale-105"
                  : "bg-white border-gray-200 text-gray-500 hover:border-[#2f7a5a] hover:text-[#2f7a5a]"
              }`}
            >
              <img 
                src={cat.img} 
                alt={cat.name} 
                className={`w-5 h-5 object-contain ${selectedCategory === cat.value ? "invert brightness-0" : "opacity-60"}`} 
              />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {loading ? (
             <div className="col-span-full text-center py-20 text-gray-500">Loading healthy meals...</div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <motion.div
                layout
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -5 }}
                className="flex flex-col h-full bg-white rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-[200px] overflow-hidden">
                  <img
                    src={item.image || "https://via.placeholder.com/400"}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={item.name}
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                    <span className="text-[10px] font-bold text-[#2f7a5a] uppercase tracking-wide">
                      {item.healthCategory}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#0f2f25] text-white text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    ⭐ {item.ratings || "4.5"}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-[#0f2f25] line-clamp-1 group-hover:text-[#2f7a5a] transition-colors">
                      {item.name}
                    </h3>
                  </div>
                  
                  <p className="text-[#6b857c] text-sm line-clamp-2 mb-4 h-[40px] leading-relaxed">
                    {item.description || "Formulated specifically for patient wellness and recovery."}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-black text-[#2f7a5a]">₹{item.price}</span>
                      <span className="text-xs text-gray-400 font-medium">
                        {item.reviews ? `${item.reviews} reviews` : "New Item"}
                      </span>
                    </div>

                    {isAdmin ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => navigate("/admin/create-menu", { state: { itemToUpdate: item } })}
                          className="bg-blue-50 text-blue-600 text-xs font-bold py-2.5 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-50 text-red-600 text-xs font-bold py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                        >
                          DELETE
                        </button>
                      </div>
                    ) : (
                      <div className="w-full">
                        <AddToCartButton 
                          item={item} 
                          className="w-full !bg-[#2f7a5a] hover:!bg-[#256b4d] !text-white !font-bold !py-3 !rounded-xl !shadow-md transition-all" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-70">
              <img src="https://cdn-icons-png.flaticon.com/512/11453/11453063.png" alt="Empty" className="w-24 h-24 mb-4 grayscale" />
              <p className="text-gray-500 text-lg font-medium">No items found in this category.</p>
              <button onClick={() => setSelectedCategory('All')} className="mt-2 text-[#2f7a5a] font-bold hover:underline">Clear Filters</button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Menu;