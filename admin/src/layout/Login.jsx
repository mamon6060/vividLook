import { useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { activeUser } from "../utils/Slices/userSlices";
import axiosInstance from "../components/Axios";
import logo from "../assets/logo/logo.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard/summary");
    }
  }, [navigate]);

  const onFinish = async (values) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      if (response.data.status === "success") {
        const {
          token,
          data: { user },
        } = response.data;

        // Check if the user is an admin
        if (user.role !== "admin") {
          message.error("You do not have admin access.");
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        dispatch(activeUser({ token, user }));

        navigate("/dashboard/summary");
        message.success("Login successful!");
      } else {
        message.error("Login failed! Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="flex justify-center flex-col items-center lg:h-screen bg-gradient-to-r from-indigo-200 to-yellow-100">
      <div className="container w-full flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-[160px] md:w-[320px]">
          <img src={logo} alt="Logo" />
        </div>
        <div className="md:w-[500px] h-full border p-10 rounded-md bg-tertiary">
          <h1 className="text-2xl my-2 mb-5">Login</h1>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button
                // className="custom-button"
                htmlType="submit"
                className="login-form-button w-full custom-button"
              >
                Log in
              </Button>
            </Form.Item>
          </Form>

          <span>
            <Link
              to="/forgot-password"
              className="text-slate-700 hover:text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </span>
        </div>
      </div>

      <h1>
        Developed by{" "}
        <Link
          className="font-bold text-black mt-10"
          target="_blank"
          to={"https://okobiz.com"}
        >
          okobiz
        </Link>
      </h1>
    </div>
  );
};

export default Login;
