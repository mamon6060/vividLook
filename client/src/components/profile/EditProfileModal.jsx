import React, { useState } from 'react';
import axios from 'axios';
import api from '../axios/Axios';

const EditProfileModal = ({ userData, isOpen, onClose }) => {
  // Destructure userData to get default values for non-editable fields
  const { photo, name, phone, email, ...rest } = userData;

  // Define state for the form fields
  const [formData, setFormData] = useState({
    address: rest.address || '',
    bio: rest.bio || '',
    ...rest,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the API to update user details (excluding photo, name, phone, and email)
      await api.patch('/users/updateMe', formData);
      alert('Profile updated successfully!');
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-2xl mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          {/* Non-editable fields */}
          <div className="mb-4">
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              value={name}
              disabled
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Phone</label>
            <input
              type="text"
              value={phone}
              disabled
              className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Editable fields */}
          <div className="mb-4">
            <label className="block font-semibold">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 bg-gray-500 text-white p-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
