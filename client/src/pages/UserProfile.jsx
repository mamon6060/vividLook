import  { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import Containar from "../components/containar/Containar";

import {useSelector } from "react-redux";

import api from "../components/axios/Axios";
import UpdatePassword from "../components/profile/UpdatePassword";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toastify
import ProfileImage from "../components/profile/ProfileImage";
import OrderHistory from "../components/profile/OrderHistory";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [editableData, setEditableData] = useState({
    name: "",
    upazilla: "",
    district: "",
    postCode: "",
    streetAddress: "",
    shopAddress: "",
    gender: "",
    dateOfBirth: "",
  });

  const token = useSelector((state) => state.auth.token);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      const fetchUserData = async () => {
        try {
          const response = await api.get("/users/getMe", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Check if the response structure is valid
          if (response.data && response.data.data && response.data.data.doc) {
            setUserData(response.data.data.doc);
            setEditableData({
              name: response.data.data.doc.name,
              upazilla: response.data.data.doc.upazilla,
              district: response.data.data.doc.district,
              postCode: response.data.data.doc.postCode,
              streetAddress: response.data.data.doc.streetAddress,
              shopAddress: response.data.data.doc.shopAddress,
              gender: response.data.data.doc.gender,
              dateOfBirth: response.data.data.doc.dateOfBirth,
            });
          } else {
            console.error("Unexpected response structure:", response);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [token]);



  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        ...editableData,
        gender: editableData.gender?.toLowerCase(),
      };

      await api.patch("/users/updateMe", updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData({ ...userData, ...updatedData });
      setIsEditMode(false);
      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      console.error("Error saving user data:", error);
      toast.error("Error updating profile. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-[#E2E7EF] mt-5 lg:mt-14">
      <div className="py-10">
        <Containar>
          <div className="mx-auto">
            <div className="grid grid-cols-12 sm:gap-10">
              <div className="col-span-12 lg:col-span-4">
                <ProfileImage />
              </div>

              <div className="col-span-12 lg:col-span-8">
                <div className="bg-white py-2 px-3 sm:px-10">
                  <div className="flex gap-x-1 py-5 border-b">
                    <div className="w-[25%]">
                      <h3 className="font-semibold text-[14px] sm:text-[16px]">
                        Full Name
                      </h3>
                    </div>
                    <div className="w-[75%]">
                      <h3 className="text-[14px] sm:text-[16px]">
                        {userData?.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex gap-x-1  py-5 border-b">
                    <div className="w-[25%]">
                      <h3 className="font-semibold text-[14px] sm:text-[16px]">
                        Email
                      </h3>
                    </div>
                    <div className="w-[75%]">
                      <h3 className="text-[14px] sm:text-[16px]">
                        {userData?.email}
                      </h3>
                    </div>
                  </div>
                  <div className="flex gap-x-1  py-5 border-b">
                    <div className="w-[25%]">
                      <h3 className="font-semibold text-[14px] sm:text-[16px]">
                        Phone Number
                      </h3>
                    </div>
                    <div className="w-[75%]">
                      <h3 className="text-[16px]">{userData?.phone}</h3>
                    </div>
                  </div>
                  {[
                    "dateOfBirth",
                    "gender",
                    "streetAddress",
                    "postCode",
                    "upazilla",
                    "district",
                    "shopAddress",
                  ].map((field, idx) => (
                    <div className="flex gap-x-1  py-5 border-b" key={idx}>
                      <div className="w-[25%]">
                        <h3 className="font-semibold text-[14px] sm:text-[16px] capitalize">
                          {field.replace(/([A-Z])/g, " $1")}
                        </h3>
                      </div>
                      <div className="w-[75%]">
                        {isEditMode ? (
                          field === "dateOfBirth" ? (
                            <input
                              type="date"
                              name={field}
                              value={
                                editableData[field]
                                  ? new Date(editableData[field])
                                      .toISOString()
                                      .substr(0, 10)
                                  : ""
                              }
                              onChange={handleChange}
                              className="w-full border rounded px-2 py-1"
                            />
                          ) : field === "gender" ? (
                            <select
                              name={field}
                              value={editableData[field] || ""}
                              onChange={handleChange}
                              className="w-full border rounded px-2 py-1"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              name={field}
                              value={editableData[field]}
                              onChange={handleChange}
                              className="w-full border rounded px-2 py-1"
                            />
                          )
                        ) : (
                          <h3 className="text-[16px]">
                            {field === "dateOfBirth"
                              ? formatDate(editableData[field])
                              : field === "gender"
                              ? editableData[field]?.charAt(0).toUpperCase() +
                                  editableData[field]?.slice(1).toLowerCase() ||
                                "N/A"
                              : editableData[field] || "N/A"}
                          </h3>
                        )}
                      </div>
                    </div>
                  ))}

                  {isEditMode ? (
                    <button
                      onClick={handleSaveChanges}
                      className="px-5 py-1 mb-2 mt-10 bg-primary text-white rounded-md"
                    >
                      Save Changes
                    </button>
                  ) : (
                    <button
                      onClick={handleEditProfile}
                      className="px-5 py-1 mb-2 mt-10 bg-primary text-white rounded-md"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                <UpdatePassword token={token} />
                <OrderHistory />
              </div>
            </div>
          </div>
        </Containar>
      </div>
    </div>
  );
};

export default UserProfile;
