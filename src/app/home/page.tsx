// pages/home.tsx

"use client";
import { Button, Layout, Menu, Typography } from "antd";
import { useRouter } from "next/navigation";
import { Content, Header } from "antd/es/layout/layout";

const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Xóa token hoặc thực hiện các hành động đăng xuất khác
    localStorage.removeItem("token");
    router.push("/login"); // Chuyển hướng về trang login
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          padding: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgb(248, 248, 255)",
        }}
      >
        <Title level={2}>Welcome to the Home Page!</Title>
        <Text>You are successfully logged in.</Text>
        <Button
          type="primary"
          size="large"
          style={{ marginTop: "20px" }}
          onClick={() => router.push("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </Content>
    </Layout>
  );
};

export default HomePage;
