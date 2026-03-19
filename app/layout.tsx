import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "revaudit",
  description: "Generated Next.js 14 app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
