import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusGuide AI",
  description: "AI-powered assistant for Ethiraj College for Women",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
