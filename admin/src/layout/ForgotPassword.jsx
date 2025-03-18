import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { API_BASE_URL } from "../shared/config";
import { Link } from "react-router";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/forgotPassword`,
        { email: values.email }
      );
      message.success(response.data.message || "Password reset email sent!");
    } catch (error) {
      message.error(error.response?.data?.message || "Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold text-center mb-4">
          Forgot Password
        </h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Button className="custom-button" htmlType="submit" block loading={loading}>
            Send Reset Link
          </Button>
        </Form>
      </div>
      <Link to="/" className="underline text-slate-700 hover:text-blue-500">
        Go Back
      </Link>
    </div>
  );
};

export default ForgotPassword;
