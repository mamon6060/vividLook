import React, { useState } from "react";
import api from "../components/axios/Axios";

const EditProfile = ({ userData, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    gender: userData?.gender || "",
    dateOfBirth: userData?.dateOfBirth || "",
    postCode: userData?.postCode || "",
    streetAddress: userData?.streetAddress || "",
    upazilla: userData?.upazilla || "",
    district: userData?.district || "",
    shopAddress: userData?.shopAddress || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.patch("/users/updateMe", formData);
      onUpdateSuccess(response.data.data.user);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="p-2 border"
        />
        <input
          type="text"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          placeholder="Gender"
          className="p-2 border"
        />
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          placeholder="Birth Date"
          className="p-2 border"
        />
        <input
          type="text"
          name="postCode"
          value={formData.postCode}
          onChange={handleChange}
          placeholder="Postal Code"
          className="p-2 border"
        />
        <input
          type="text"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleChange}
          placeholder="Street Address"
          className="p-2 border"
        />
        <input
          type="text"
          name="upazilla"
          value={formData.upazilla}
          onChange={handleChange}
          placeholder="Upazilla"
          className="p-2 border"
        />
        <input
          type="text"
          name="district"
          value={formData.district}
          onChange={handleChange}
          placeholder="District"
          className="p-2 border"
        />
        <input
          type="text"
          name="shopAddress"
          value={formData.shopAddress}
          onChange={handleChange}
          placeholder="Shop Address"
          className="p-2 border"
        />
        <button
          type="submit"
          className="px-5 py-1 bg-primary text-white rounded-md"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
