import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

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
    restaurantName: "",
    restaurantLogo: "",
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
        restaurantName: itemToUpdate.restaurantName || "",
        restaurantLogo: itemToUpdate.restaurantLogo || "",
      });
    }
  }, [itemToUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const parseOptionalNumber = (value) => {
    if (value === "") return undefined;
    const num = parseFloat(value);
    return isNaN(num) ? undefined : num;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.price || !formData.healthCategory) {
      toast.error("Price and Health Category are required.");
      return;
    }

    try {
      const payload = {
        name: formData.foodName,
        image: formData.imageURL,
        description: formData.description,
        price: parseFloat(formData.price),
        healthCategory: formData.healthCategory,
        ratings: parseOptionalNumber(formData.rating),
        reviews: parseOptionalNumber(formData.reviews),
        restaurantName: formData.restaurantName,
        restaurantLogo: formData.restaurantLogo,
      };

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      if (itemToUpdate) {
        await axios.put(
          `http://localhost:5000/api/menu/${itemToUpdate._id}`,
          payload,
          config
        );
        toast.success("Menu item updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/menu", payload, config);
        toast.success("Menu item created successfully!");
      }

      navigate("/menu");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save menu item.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#fff3eb] p-8">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
          {itemToUpdate ? "Update Health Menu Item" : "Create Health Menu Item"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="foodName"
            value={formData.foodName}
            onChange={handleChange}
            placeholder="Food Name"
            className="w-full p-3 border rounded-md"
            required
          />

          <input
            type="text"
            name="imageURL"
            value={formData.imageURL}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full p-3 border rounded-md"
          />

          <select
            name="healthCategory"
            value={formData.healthCategory}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            required
          >
            <option value="">Select Health Category</option>
            <option value="diabetic">Diabetic Patients</option>
            <option value="cardiac">Cardiac & BP Patients</option>
            <option value="hormonal">Thyroid & PCOS (Hormonal Health)</option>
            <option value="post_surgery">Post Surgery</option>
            <option value="elderly">Elderly Care</option>
            <option value="fitness">Fitness & Diet Conscious</option>
          </select>

          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            placeholder="Rating (0–5)"
            step="0.1"
            className="w-full p-3 border rounded-md"
          />

          <input
            type="number"
            name="reviews"
            value={formData.reviews}
            onChange={handleChange}
            placeholder="Reviews"
            className="w-full p-3 border rounded-md"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 border rounded-md"
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-3 border rounded-md"
            required
          />

          
          <button className="w-full bg-green-600 text-white py-3 rounded-md">
            {itemToUpdate ? "Update Item" : "Create Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminMenuForm;
