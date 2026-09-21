import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lama Commerce Admin",
  description: "Admin shell for the monorepo e-commerce tutorial.",
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
