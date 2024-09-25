/* eslint-disable @next/next/no-img-element */
"use client";

import { Layout, Input, Button } from "antd";
import Link from "next/link";
import { useState, useEffect } from "react";

const { Header } = Layout;

const HeaderComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check local storage for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set login state based on token presence
  }, []);

  // Update search term as user types
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    setIsLoggedIn(false); // Update state to reflect logged out
  };

  return (
    <Header
      style={{
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      {/* Logo Section */}
      <div style={{ width: "80px", height: "80px", position: "relative" }}>
        <img
          src="logo.png"
          alt="Logo"
          style={{
            width: "100%",
            height: "100%",
            transition: "transform 0.3s",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(0.9)")} // Scale down on hover
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")} // Scale back on mouse out
        />
      </div>

      {/* Search Bar */}
      <Input
        placeholder="Tìm kiếm..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ width: 400 }}
      />

      {/* Login / Logout Section */}
      {isLoggedIn ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Default avatar */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: "bold",
              marginRight: "10px",
            }}
          >
            U
          </div>

          {/* Logout Button */}
          <Button
            type="primary"
            style={{ fontWeight: "bold", backgroundColor: "red" }}
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </div>
      ) : (
        /* Login Button with Link to /login */
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
