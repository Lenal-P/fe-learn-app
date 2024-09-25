// pages/login.tsx

"use client";
import { useState } from "react";
import { Form, Input, Button, message, Modal } from "antd";
import { useRouter } from "next/navigation";
import axiosInstance from "@/untils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", values);
      message.success("Đăng nhập thành công!");
      setLoading(false);
      localStorage.setItem("token", response.data.access_token);
      router.push("/home");
    } catch (error) {
      message.error("Email hoặc mật khẩu không đúng.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      await axiosInstance.post("/users/forgot-password", {
        email: forgotEmail,
      });
      message.success("OTP đã được gửi đến email của bạn!");
      setForgotPasswordModal(false);
      setOtpModal(true); // Mở modal nhập OTP
    } catch (error) {
      message.error("Không thể gửi OTP. Vui lòng thử lại.");
    }
  };

  const handleVerifyOtp = () => {
    // Chỉ cần chuyển sang modal đặt lại mật khẩu
    message.success("OTP đã nhập!");
    setOtpModal(false);
    setResetPasswordModal(true); // Mở modal nhập mật khẩu mới
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      await axiosInstance.post(`/users/reset-password/${otp}`, {
        email: forgotEmail,
        newPassword: newPassword,
      });
      message.success("Đặt lại mật khẩu thành công!");
      setResetPasswordModal(false);
      setForgotEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      message.error("Không thể đặt lại mật khẩu. Vui lòng thử lại.");
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
        name="login"
        onFinish={onFinish}
        style={{
          width: 500,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgb(255, 255, 255)",
          padding: "2% 4% 0 4%",
          borderRadius: "16px",
        }}
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input type="email" placeholder="Email" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            style={{ height: "3rem", fontWeight: "bold" }}
            htmlType="submit"
            loading={loading}
            block
          >
            Đăng nhập
          </Button>
        </Form.Item>

        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Link href="/signup">
              <Button type="link" block style={{ flex: 1, textAlign: "left" }}>
                Đăng ký
              </Button>
            </Link>
            <Button
              type="link"
              onClick={() => setForgotPasswordModal(true)}
              style={{ width: "auto", padding: 0, textAlign: "right" }}
            >
              Quên mật khẩu?
            </Button>
          </div>
        </Form.Item>

        <Form.Item
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            style={{ height: "40px", width: "50px", marginRight: 10 }}
            onClick={() => {
              window.location.href = "http://localhost:8080/api/v1/auth/google";
            }}
          >
            <FontAwesomeIcon icon={faGoogle} />
          </Button>

          <Button
            style={{ height: "40px", width: "50px" }}
            onClick={() => {
              window.location.href = "http://localhost:8080/api/v1/auth/github";
            }}
          >
            <FontAwesomeIcon icon={faGithub} />
          </Button>
        </Form.Item>
      </Form>

      {/* Modal quên mật khẩu */}
      <Modal
        title="Quên mật khẩu"
        visible={forgotPasswordModal}
        onOk={handleForgotPassword}
        onCancel={() => setForgotPasswordModal(false)}
        okText="Xác nhận"
        style={{ top: "25%", textAlign: "center", fontWeight: "bold" }}
        width={500}
        cancelText="Hủy"
      >
        <Form.Item
          label="Email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="Nhập email của bạn"
          />
        </Form.Item>
      </Modal>

      {/* Modal nhập OTP */}
      <Modal
        title="Nhập OTP"
        visible={otpModal}
        onOk={handleVerifyOtp}
        onCancel={() => setOtpModal(false)}
        okText="Xác nhận"
        style={{ top: "25%", textAlign: "center", fontWeight: "bold" }}
        width={500}
        cancelText="Hủy"
      >
        <Form.Item
          label="OTP"
          rules={[{ required: true, message: "Vui lòng nhập OTP!" }]}
        >
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Nhập OTP đã gửi đến email"
          />
        </Form.Item>
      </Modal>

      {/* Modal nhập mật khẩu mới */}
      <Modal
        title="Đặt lại mật khẩu"
        visible={resetPasswordModal}
        onOk={handleResetPassword}
        onCancel={() => setResetPasswordModal(false)}
        okText="Xác nhận"
        style={{ top: "25%", textAlign: "center", fontWeight: "bold" }}
        width={500}
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              {
                required: true,
                min: 6,
                message: "Mật khẩu mới phải ít nhất 6 ký tự!",
              },
            ]}
          >
            <Input.Password
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            rules={[
              {
                required: true,
                min: 6,
                message: "Vui lòng xác nhận mật khẩu!",
              },
            ]}
          >
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LoginPage;
