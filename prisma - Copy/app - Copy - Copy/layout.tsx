import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduManage | Student Management System",
  description: "Manage student records, attendance, and academic marks.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
