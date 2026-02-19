import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PharmaGuard | Precision Medicine",
  description: "AI-powered Pharmacogenomic Risk Prediction System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
