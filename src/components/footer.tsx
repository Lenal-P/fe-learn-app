// src/components/Footer.tsx
"use client";

import { Layout } from "antd";
const { Footer } = Layout;

const FooterComponent: React.FC = () => {
  return (
    <Footer style={{ textAlign: "center", background: "#fff" }}>
      ©2024 Created by Lenal
    </Footer>
  );
};

export default FooterComponent;
