import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import SessionContext from "./context/sessionContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "MERN Stack Auth",
  description: "Authentication for MERN stack",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-serif">
        <Toaster position="top-center" />

        <SessionContext>{children}</SessionContext>
      </body>
    </html>
  );
}
