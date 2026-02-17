import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShieldSpec — SCIF & TEMPEST Window Film Compliance",
  description:
    "AI-powered compliance brokerage for classified facility window film installations. ICD 705 & TEMPEST certified.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-navy text-white antialiased">{children}</body>
    </html>
  );
}
