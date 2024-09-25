// src/app/layout.tsx
"use client";

import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import HeaderComponent from "@/components/header";
import FooterComponent from "@/components/footer";
import { usePathname } from "next/navigation";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentPath = usePathname();
  const hideHeaderFooter =
    currentPath && ["/login", "/signup"].includes(currentPath) ? true : false;
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          {!hideHeaderFooter && <HeaderComponent />}
          {children}
          {!hideHeaderFooter && <FooterComponent />}
        </AntdRegistry>
      </body>
    </html>
  );
}
