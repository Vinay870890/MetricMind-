import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./Sidebar";

export const metadata: Metadata = {
  title: "MetricMind X",
  description: "AI-Powered Semantic Business Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        <Sidebar />

        <div className="min-h-screen pl-64">
          {children}
        </div>
      </body>
    </html>
  );
}