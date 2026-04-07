import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "CyberGov AI · Behavioral Drift Detection",
  description:
    "AI-powered behavioral drift detection mapped to NIST SP 800-53 controls",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#020817] text-slate-100 antialiased">
        <Sidebar />
        {/* Main content offset by sidebar width */}
        <div className="ml-60 min-h-screen bg-grid">
          {children}
        </div>
      </body>
    </html>
  );
}

