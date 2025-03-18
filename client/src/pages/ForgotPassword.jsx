import { useState } from "react";
import Containar from "../components/containar/Containar";
import forgotPassword from "../assets/ForgotPassword/forgot-password.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="bg-[#e2e7ef]">
      <Containar>
        <div className="flex justify-center  items-center h-screen w-[500px]  mx-auto  px-5">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full">
            <div className=" flex justify-center">
              <img src={forgotPassword}></img>
            </div>
            <h2 className="text-2xl font-semibold text-center mt-10 mb-4">
              Forgot Password
            </h2>
            <p className="text-center text-base font-medium text-gray-500 mb-6">
              {/* You will receive instructions for resetting your password. */}
              Enter Your Email and we&lsquo;ll send you a linkto reset your
              password
            </p>
            <form onSubmit={handleSubmit} className="w-full mt-12 pb-10">
              <div className="mb-4 w-full ">
                <input
                  type="email"
                  className="w-full p-3 bg-slate-100 outline-none rounded-lg mb-5"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white p-3 rounded-lg flex items-center justify-center hover:bg-green-600 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.3 5a.7.7 0 01.7-.7h14a.7.7 0 01.7.7v10a.7.7 0 01-.7.7h-14a.7.7 0 01-.7-.7V5zm1 1v8h12V6H3.3zM9.2 8.29a.7.7 0 011 0l3 3a.7.7 0 11-1 1L10 10.41V15a.7.7 0 01-1.4 0v-4.59L7.3 12.3a.7.7 0 11-1-1l3-3z"
                    clipRule="evenodd"
                  />
                </svg>
                SEND
              </button>
            </form>
          </div>
        </div>
      </Containar>
    </div>
  );
};

export default ForgotPassword;
