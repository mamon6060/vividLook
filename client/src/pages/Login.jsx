/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import img from "../assets/logo/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { RxEyeNone, RxEyeOpen } from "react-icons/rx";
import api from "../components/axios/Axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/auth/authSlices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompanyTag from "../components/companyTag/CompanyTag";

const Login = () => {
  const [eyeOpen, setEyeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      navigate("/profile");
    }
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    setLoading(true);

    try {
      const response = await api.post("/auth/login", data);

      dispatch(
        setUser({ token: response.data.token, user: response.data.data.user })
      );

      toast.success("Login Successful!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      navigate("/profile");

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error", error);
      toast.error("Login failed. Please check your credentials.", {
        position: "top-right",
        autoClose: 700,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:h-screen">
      <div className="grid grid-cols-12 h-full">
        <div className="col-span-12 sm:col-span-7 lg:h-full">
          <div className="col-span-6 lg:h-full">
            <div className="w-36 h-36 mt-3 md:mt-7 sm:mt-0 sm:hidden mx-auto mb-5 md:mb-10 rounded-full flex justify-center items-center bg-white">
              <Link to="/">
                <img className="w-24" src={img} alt="Logo" />
              </Link>
            </div>
            <div className="relative lg:h-full flex items-center justify-center font-robo">
              <form
                className="bg-white sm:shadow-lg rounded px-8 sm:pt-14 pb-8 mb-4 w-[480px]"
                onSubmit={handleSubmit}
              >
                <h2 className="text-2xl font-bold mb-10 text-center">Login</h2>

                <div className="mb-10">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-3"
                    htmlFor="email"
                  >
                    Email / Phone
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="text"
                    placeholder="Enter your email or phone"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="">
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

                <div className="underline text-right mb-10">
                  <Link to={`/forgotpassword`}>Forget Password?</Link>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    className="bg-primary w-full hover:bg-green-600 text-white font-bold py-4 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Login"}
                  </button>
                </div>

                <p className="mt-4 text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to={"/registration-user"}
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-5 hidden sm:block bg-primary lg:h-full">
          <CompanyTag />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
