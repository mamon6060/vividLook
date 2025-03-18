import React, { useEffect, useState } from "react";
import img from "../assets/logo/logo.png";
import { socialLink } from "../components/constants";
import { Link, useNavigate } from "react-router-dom";
import { RxEyeOpen, RxEyeNone } from "react-icons/rx";
import api from "../components/axios/Axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/auth/authSlices";
import { toast, ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toastify
import CompanyTag from "../components/companyTag/CompanyTag";

const RegistrationDealer = () => {
  const [loading, setLoading] = useState(false);
  const [eyeOpen, setEyeOpen] = useState(false);
  const [eyeConfirmOpen, setEyeConfirmOpen] = useState(false);
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  // Check if the user is already logged in (token exists)
  useEffect(() => {
    if (token && token.length > 10) {
      navigate("/"); // Redirect to home page
    }
  }, [token, navigate]);

  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long!", {
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }); // Toast notification for password length
      return;
    }
    if (!passwordsMatch) {
      toast.error("Passwords do not match!"); // Use toast.error for password mismatch
      return;
    }

    const data = {
      name: fullName,
      email: email,
      password: password,
      phone: mobileNumber,
      confirmPassword: confirmPassword,
    };

    setLoading(true);

    try {
      const response = await api.post("/auth/signup", data);


      dispatch(
        setUser({ token: response.data.token, user: response.data.data.user })
      );
      navigate("/");

      toast.success("Registration Successful!", {
        // Corrected toast notification
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      toast.info("Check Your Email To Verify Account", {
        // Corrected toast notification
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Clear the form fields
      setFullName("");
      setMobileNumber("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Signup error", error.response.data.message);
      toast.error(error.response.data.message); // Use toast.error for error notifications
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:h-screen">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-12 sm:col-span-7 h-full">
          <div className="w-36 h-36 sm:hidden mx-auto rounded-full flex justify-center items-center mt-6">
            <Link to="/">
              <img className="w-24" src={img} alt="Logo" />
            </Link>
          </div>
          <div className="relative sm:h-full flex items-center justify-center font-robo">
            <form
              className="bg-white shadow-lg rounded px-8 sm:pt-10 pb-8 mb-4 w-[560px]"
              onSubmit={handleSubmit}
            >
              <h2 className="text-2xl font-bold mb-10 text-center">
                Register As Dealer
              </h2>

              {/* Full Name Field */}
              <div className="mb-5">
                <label
                  className="block text-gray-700 text-sm font-bold mb-3"
                  htmlFor="fullName"
                >
                  ID Number
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="fullName"
                  type="text"
                  placeholder="Enter ID Number"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Full Name Field */}
              <div className="mb-5">
                <label
                  className="block text-gray-700 text-sm font-bold mb-3"
                  htmlFor="fullName"
                >
                  Full Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Mobile Number Field */}
              <div className="mb-5">
                <label
                  className="block text-gray-700 text-sm font-bold mb-3"
                  htmlFor="number"
                >
                  Mobile Number
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="number"
                  type="text"
                  placeholder="Enter your Mobile"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>

              {/* Email Field */}
              <div className="mb-5">
                <label
                  className="block text-gray-700 text-sm font-bold mb-3"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div className="mb-5 flex items-center justify-between">
                <div className="w-[48%]">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-3"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                      id="password"
                      type={eyeOpen ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="absolute right-2.5 -translate-y-1/2 top-[45%]">
                      {eyeOpen ? (
                        <RxEyeOpen
                          className="cursor-pointer"
                          onClick={() => setEyeOpen(false)}
                        />
                      ) : (
                        <RxEyeNone
                          className="cursor-pointer"
                          onClick={() => setEyeOpen(true)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="w-[48%]">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-3"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      className={`shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${confirmPassword
                          ? passwordsMatch
                            ? "border-green-500"
                            : "border-red-500"
                          : ""
                        }`}
                      id="confirmPassword"
                      type={eyeConfirmOpen ? "text" : "password"}
                      placeholder="Confirm your password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div className="absolute right-2.5 -translate-y-1/2 top-[45%]">
                      {eyeConfirmOpen ? (
                        <RxEyeOpen
                          className="cursor-pointer"
                          onClick={() => setEyeConfirmOpen(false)}
                        />
                      ) : (
                        <RxEyeNone
                          className="cursor-pointer"
                          onClick={() => setEyeConfirmOpen(true)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="bg-primary w-full hover:bg-green-600 text-white font-bold py-4 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Register"}
                </button>
              </div>

              <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
        <div className="col-span-12 hidden sm:block sm:col-span-5 bg-primary h-full">
          <CompanyTag />
        </div>
      </div>

      {/* ToastContainer for displaying notifications */}
      <ToastContainer />
    </div>
  );
};

export default RegistrationDealer;
