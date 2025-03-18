import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxEyeNone, RxEyeOpen } from "react-icons/rx";
import api from "../axios/Axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/auth/authSlices";

const UpdatePassword = ({ token }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch()

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSubmit = async () => {
    // Validate password length and match
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      const response = await api.patch(
        `/auth/updateMyPassword`,
        {
          currentPassword, // Include currentPassword in the request
          password: newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token here
          },
        }
      );
      dispatch(setUser({ token: response.data.token, user: response.data.data.user }))


      toast.success("Password updated successfully!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsDrawerOpen(false); // Close the drawer after success
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "An error occurred while updating the password.",
        {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };

  return (
    <div className="mt-5 bg-white px-3 sm:px-10">
      <ToastContainer />

      <div className="py-10 w-full flex flex-wrap items-center justify-between">
        <div className="w-full sm:w-[25%]">
          <h3 className="text-[18px] font-semibold sm:mb-0 mb-3">
            {isDrawerOpen ? "Update Password" : "Update Password"}
          </h3>
        </div>
        {!isDrawerOpen ? (
          <div className="">
            <button
              onClick={handleOpenDrawer}
              className="text-[16px] py-1 px-6 bg-primary hover:bg-green-600 rounded-md text-white"
            >
              Update
            </button>
          </div>
        ) : (
          <div className="">
            <button
              onClick={handleCloseDrawer}
              className="text-[16px] py-1 px-2 sm:px-6 bg-red-800 hover:bg-red-600 rounded-md text-white"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Drawer with smooth transition */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isDrawerOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="pb-10">
          <div className="mt-2 relative">
            <label className="block text-gray-700 mb-2">Current Password</label>
            <div
              className="absolute right-3 top-11 cursor-pointer"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <RxEyeOpen /> : <RxEyeNone />}
            </div>
            <input
              type={showCurrentPassword ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 outline-none"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="mt-4 relative">
            <label className="block text-gray-700 mb-2">New Password</label>
            <div
              className="absolute right-3 top-11 cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <RxEyeOpen /> : <RxEyeNone />}
            </div>
            <input
              type={showNewPassword ? "text" : "password"}
              className={`w-full px-3 py-2 rounded-md mb-4 border outline-none ${newPassword && confirmPassword
                  ? newPassword === confirmPassword
                    ? "border-primary"
                    : "border-red-600"
                  : "border-gray-300"
                }`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mt-4 relative">
            <label className="block text-gray-700 mb-2">Confirm New Password</label>
            <div
              className="absolute right-3 top-11 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <RxEyeOpen /> : <RxEyeNone />}
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className={`w-full px-3 py-2 rounded-md mb-4 border outline-none ${newPassword && confirmPassword
                  ? newPassword === confirmPassword
                    ? "border-primary"
                    : "border-red-600"
                  : "border-gray-300"
                }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-white py-4 mt-6 mb-5 rounded-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
