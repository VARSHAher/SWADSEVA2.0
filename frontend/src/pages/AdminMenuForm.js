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
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

  
    const menuData = {
      name: formData.foodName,
      image: formData.imageURL,
      price: formData.price,
      description: formData.description,
      healthCategory: formData.healthCategory,
      clinicalBenefits: formData.clinicalBenefits,
  
    };

    if (itemToUpdate) {
      
      await axios.put(`http://localhost:5000/api/menu/${itemToUpdate._id}`, menuData, config);
      toast.success("Image and details updated successfully!");
    } else {
      
      await axios.post("http://localhost:5000/api/menu", menuData, config);
      toast.success("New item added to portal!");
    }
    navigate("/menu");
  } catch (err) {
    toast.error(err.response?.data?.message || "Update failed");
  }
};

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 md:px-0">
      <div className="max-w-3xl mx-auto bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#1f4e79] p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              {itemToUpdate ? "Modify Clinical Item" : "Create Clinical Item"}
            </h2>
            <p className="text-blue-100 text-sm opacity-80 mt-1">Configure nutritional data for patient recovery</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Meal Identity</label>
              <input
                type="text"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                placeholder="e.g. Low Glycemic Oat Porridge"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4e79]/5 outline-none font-bold"
                required
              />
            </div>

        
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Prescribed Rate (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4e79]/5 outline-none font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Medical Classification</label>
            <select
              name="healthCategory"
              value={formData.healthCategory}
              onChange={handleChange}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4e79]/5 outline-none font-bold appearance-none"
              required
            >
              <option value="">Select Condition Target...</option>
              <option value="diabetic">Diabetes Care (Low Sugar)</option>
              <option value="cardiac">Cardiac Health (Low Sodium)</option>
              <option value="hormonal">PCOS & Hormonal Health</option>
              <option value="post_surgery">Surgery Recovery (High Protein)</option>
              <option value="elderly">Elderly Care</option>
              <option value="fitness">Fitness & Repair</option>
            </select>
          </div>


        
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
              <ClipboardList size={12} /> About the Item (Description)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the meal and its nutritional preparation..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4e79]/5 outline-none font-bold h-24 resize-none"
            />
          </div>

    
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2 text-[#16a34a]">
              <CheckCircle size={12} /> Clinical Benefit / Recovery Outcome
            </label>
            <textarea
              name="clinicalBenefits"
              value={formData.clinicalBenefits}
              onChange={handleChange}
              placeholder="e.g. Helps in maintaining steady blood glucose levels during post-op recovery."
              className="w-full p-4 bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl focus:ring-4 focus:ring-[#16a34a]/5 outline-none font-bold text-[#166534] h-24 resize-none"
            />
          </div>

          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Clinical Asset URL (Image)</label>
            <input
              type="text"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleChange}
              placeholder="https://image-source.com/meal-photo.jpg"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#1f4e79]/5 outline-none font-bold"
            />
          </div>


{formData.imageURL && (
  <div className="mt-4 mb-6">
    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Image Preview</p>
    <div className="w-full h-40 rounded-2xl overflow-hidden border border-slate-200">
      <img 
        src={formData.imageURL} 
        alt="Preview" 
        className="w-full h-full object-cover"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'; }}
      />
    </div>
  </div>
)}

          <button 
            type="submit"
            className="w-full bg-[#1f4e79] text-white py-5 rounded-[20px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#163a5a] transition-all shadow-lg shadow-blue-900/10 mt-8"
          >
            <Save size={20} /> {itemToUpdate ? "Update Medical Record" : "Publish to Portal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminMenuForm;