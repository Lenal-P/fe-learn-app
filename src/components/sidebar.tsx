"use client";
import { Menu } from "antd";
import { UserOutlined, HomeOutlined, HeartOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();
  const [selectedKey, setSelectedKey] = useState<string>("1");

  const handleMenuClick = (key: string) => {
    setSelectedKey(key);
    // Navigate to the corresponding page when a menu item is clicked
    switch (key) {
      case "1":
        router.push("/home"); // For You
        break;
      case "2":
        router.push("/following"); // Following
        break;
      case "3":
        router.push("/profile"); // Profile
        break;
      default:
        break;
    }
  };

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Dành cho bạn",
    },
    {
      key: "2",
      icon: <HeartOutlined />,
      label: "Đang Follow",
    },
    {
      key: "3",
      icon: <UserOutlined />,
      label: "Hồ Sơ",
    },
  ];

  return (
    <div
      style={{
        width: 256,
        position: "fixed",
        height: "100%",
        zIndex: 9,
        fontWeight: "bold",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ height: "100%", borderRight: 0, paddingTop: "40%" }}
        onClick={({ key }) => handleMenuClick(key)}
        items={menuItems} // Use the new items prop
      />
    </div>
  );
};

export default Sidebar;