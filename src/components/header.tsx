/* eslint-disable @next/next/no-img-element */
"use client";

import { Layout, Input, Button, Avatar } from "antd";
import Link from "next/link";
import { useState, useEffect } from "react";

const { Header } = Layout;

const HeaderComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Lấy thông tin người dùng từ localStorage khi component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Chuyển đổi từ chuỗi sang đối tượng
      setIsLoggedIn(true); // Đặt trạng thái đăng nhập thành true
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null); // Đặt user về null khi đăng xuất
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const userInitials = user?.email
    ? user.email.split("@")[0].split(" ").map((word: string) => word[0]).join("").toUpperCase()
    : "U";

  return (
    <Header
      style={{
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "fixed",
        height: "80px",
        width: "100vw",
        zIndex: 10,
      }}
    >
      <div style={{ width: "80px", height: "80px", position: "relative" }}>
        <Link href="/home">
          <img
            src="logo.png"
            alt="Logo"
            style={{
              width: "100%",
              height: "100%",
              transition: "transform 0.3s",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(0.9)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>
      </div>

      <Input
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ width: 400 }}
      />

      {isLoggedIn ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={user?.avatar || undefined} // Lấy avatar từ localStorage
            alt="User Avatar"
            style={{
              backgroundColor: "#f0f0f0",
              marginRight: 10,
              fontWeight: "bold",
            }}
          >
            {!user?.avatar && userInitials} {/* Hiển thị chữ cái đầu nếu không có avatar */}
          </Avatar>
          <Button
            type="primary"
            style={{ fontWeight: "bold", backgroundColor: "red" }}
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </div>
      ) : (
        <Link href="/login">
          <Button type="primary" style={{ fontWeight: "bold" }}>
            Đăng nhập
          </Button>
        </Link>
      )}
    </Header>
  );
};

export default HeaderComponent;