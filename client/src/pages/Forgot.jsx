import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../components/axios/Axios";

// import HeaderPart from "../components/layouts/HeaderPart";

const Forgot = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post("/auth/forgotPassword", values);
      toast.success("Password reset email sent. Check your inbox!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Failed to send password reset email. Try again later.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex justify-center flex-col items-center h-screen">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="md:w-[30%] w-[70%] border rounded-md px-5 py-10 mb-20">
          <h2 className="text-xl font-bold text-center">Forgot password?</h2>
          <p className="text-xs text-center mt-2">
            Remember your password?{" "}
            <Link className="text-[#3368B2]" to="/login">
              Login here
            </Link>
          </p>
          <Form name="forgot_password" onFinish={onFinish} className="mt-5">
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input
                placeholder="Enter Your Email"
                prefix={<InboxOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button bg-primary mx-auto flex justify-center"
                loading={loading}
              >
                Send
              </Button>
            </Form.Item>
          </Form>
        </div>

        <h1>
          Developed by{" "}
          <Link
            className="font-bold text-black"
            target="_blanck"
            to={"https://okobiz.com"}
          >
            okobiz
          </Link>
        </h1>
      </div>
    </div>
  );
};

export default Forgot;
