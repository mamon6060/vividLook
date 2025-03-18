// pages/VerifyEmail.js
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../components/axios/Axios";
import logo from "../assets/logo/logo.png";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await api.get(`/auth/verify`, {
            params: { token }, 
          });

          setVerificationStatus(response.data.message);
        } catch (error) {
          if (error.response) {
            setVerificationStatus(
              error.response.data.message || "Verification failed"
            ); 
          } else {
            setVerificationStatus("Network error occurred");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setVerificationStatus("No token provided.");
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const isSuccessful = verificationStatus && verificationStatus.toLowerCase().includes("successful");
  const messageColor = isSuccessful ? "text-green-600" : "text-red-600";
  const borderColor = loading ? "border-blue-600" : (isSuccessful ? "border-green-600" : "border-red-600");

  return (
    <div className="h-screen bg-[#E2E7EF] flex justify-center items-center">
      <div className="w-[500px] py-20 px-20 bg-white rounded-lg flex flex-col items-center">
        <div className="w-40 h-40">
          <img className="w-full h-full object-cover" src={logo} alt="Logo" />
        </div>
        <h1 className="mt-7 text-[28px] font-semibold">Email Verification</h1>
        <div className="mt-7">
          {loading ? (
            <h3 className={`p-5 rounded-md border-2 w-[300px] flex justify-center text-[16px] font-medium ${borderColor}`}>Loading...</h3>
          ) : (
            <h3 className={`p-5 border-2 relative rounded-md text-[16px] font-medium flex items-center gap-1 ${messageColor} ${borderColor}`}>
              {isSuccessful && <div className="w-10 h-10 absolute left-2 -top-[20px] flex justify-center items-center bg-white rounded-full"><IoIosCheckmarkCircleOutline className=" text-[30px]"/></div>} {/* Conditionally render the icon */}
              {verificationStatus}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
