import React, { useState } from "react";
import { Button, Form, Input } from "antd";
// import Container from "../components/Container";
import { LockOutlined } from "@ant-design/icons";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import api from "../components/axios/Axios";
// import HeaderPart from "../components/layouts/HeaderPart";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.patch(`/auth/resetPassword/${token}`, values);
      toast.success("Password reset successfully. You can now log in.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Failed to reset password. Try again later.", {
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
    <>
      {/* <HeaderPart className={"!py-16"} title="" /> */}
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
          <h2 className="text-xl font-bold text-center">Reset Password</h2>
          <Form name="reset_password" onFinish={onFinish} className="mt-5">
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your new password!",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="New Password"
                prefix={<LockOutlined />}
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm New Password"
                prefix={<LockOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button bg-[#3368B2] mx-auto flex justify-center"
                loading={loading}
              >
                Reset Password
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
    </>
  );
};

export default ResetPassword;
