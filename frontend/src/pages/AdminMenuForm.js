import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { Save, ArrowLeft, ClipboardList, Tag, CheckCircle } from "lucide-react";

const AdminMenuForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const itemToUpdate = location.state?.itemToUpdate;

  const [formData, setFormData] = useState({
    foodName: "",
    imageURL: "",
    rating: "",
    reviews: "",
    description: "",
    price: "",
    healthCategory: "",
    clinicalBenefits: "",
    foodType: "veg",
  });

  useEffect(() => {
    if (itemToUpdate) {
      setFormData({
        foodName: itemToUpdate.name || "",
        imageURL: itemToUpdate.image || "",
        rating: itemToUpdate.ratings ?? "",
        reviews: itemToUpdate.reviews ?? "",
        description: itemToUpdate.description || "",
        price: itemToUpdate.price ?? "",
        healthCategory: itemToUpdate.healthCategory || "",
        clinicalBenefits: itemToUpdate.clinicalBenefits || "",
        foodType: itemToUpdate.foodType || "veg",
      });
    }
  }, [itemToUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const payload = {
        name: formData.foodName,
        image: formData.imageURL,
        price: Number(formData.price),
        description: formData.description,
        healthCategory: formData.healthCategory,
        clinicalBenefits: formData.clinicalBenefits,
        foodType: formData.foodType,
      };

      if (itemToUpdate) {
        await axios.put(
          `http://localhost:5000/api/menu/${itemToUpdate._id}`,
          payload,
          config,
        );
        toast.success("Menu item updated!");
      } else {
        await axios.post("http://localhost:5000/api/menu", payload, config);
        toast.success("New item added to menu!");
      }
      navigate("/menu");
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 lg:p-12">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest mb-8 hover:text-[#1f4e79] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Kitchen
        </button>

        <div className="mb-12">
          <h1 className="text-5xl font-black text-[#1f4e79] tracking-tighter mb-2 italic">
            {itemToUpdate ? "Refine Recipe" : "New Creation"}
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Kitchen Inventory Management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Dish Name
              </label>
              <input
                type="text"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                placeholder="e.g. Quinoa Wellness Bowl"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4e79]/5 outline-none font-bold"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Dietary Type
              </label>
              <select
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4e79]/5 outline-none font-bold appearance-none cursor-pointer"
              >
                <option value="veg">Veg (Green Icon)</option>
                <option value="non-veg">Non-Veg (Red Icon)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Price (INR)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="499"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4e79]/5 outline-none font-bold"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Health Category
              </label>
              <select
                name="healthCategory"
                value={formData.healthCategory}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4e79]/5 outline-none font-bold appearance-none cursor-pointer"
                required
              >
                <option value="">Select Category</option>
                <option value="diabetic">Diabetic Friendly</option>
                <option value="cardiac">Cardiac Care</option>
                <option value="bp">Blood Pressure</option>
                <option value="post_surgery">Post-Surgery</option>
                <option value="digestive">Digestive & Gut Health</option>
                <option value="elderly">Elderly Nutrition</option>
                <option value="fitness">Fitness & Recovery</option>
                <option value="general">General Wellness</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Clinical Benefits
            </label>
            <textarea
              name="clinicalBenefits"
              value={formData.clinicalBenefits}
              onChange={handleChange}
              placeholder="Explain how this helps medically..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4e79]/5 outline-none font-bold h-24 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Dish Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the taste and ingredients..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4e79]/5 outline-none font-bold h-32 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Image URL
            </label>
            <input
              type="text"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleChange}
              placeholder="https://image-link.com/photo.jpg"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4e79]/5 outline-none font-bold"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1f4e79] text-white py-5 rounded-[20px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#163a5a] transition-all shadow-xl active:scale-[0.98]"
          >
            <Save size={18} />{" "}
            {itemToUpdate ? "Update Menu Item" : "Publish to Menu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminMenuForm;
