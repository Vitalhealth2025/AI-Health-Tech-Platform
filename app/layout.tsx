import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const jakarta = localFont({
  src: [
    {
      path: "../public/PlusJakartaSans-VariableFont_wght.ttf",
      style: "normal",
      weight: "200 800",
    },
    {
      path: "../public/PlusJakartaSans-Italic-VariableFont_wght.ttf",
      style: "italic",
      weight: "200 800",
    },
  ],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HealthSmart AI",
  description: "Your personal AI-powered health companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
