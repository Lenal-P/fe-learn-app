"use client";
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axiosInstance from "@/untils/axiosInstance";
import { useRouter } from "next/navigation";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      message.error("Mật khẩu không khớp!");
      return;
    }

    setLoading(true);
    try {
      // Send only email and password to the backend
      const response = await axiosInstance.post("/users/signup", {
        email,
        password,
      });
      message.success("Đăng ký thành công!");
      localStorage.setItem("token", response.data.access_token);
      router.push("/login");
    } catch (error) {
      message.error("Đăng ký không thành công!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "rgb(248, 248, 255)",
        fontWeight: "bold",
      }}
    >
      <Form
        name="signup"
        onFinish={handleSubmit}
        style={{
          width: 500,
          display: "flex",
          justifyContent: "center",
          textAlign: "right",
          flexDirection: "column",
          backgroundColor: "rgb(255, 255, 255)",
          padding: "2% 4% 1% 4%",
          borderRadius: "16px",
        }}
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
        >
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            style={{ height: "3rem", fontWeight: "bold" }}
            htmlType="submit"
            loading={loading}
            block
          >
            Đăng Ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Signup;