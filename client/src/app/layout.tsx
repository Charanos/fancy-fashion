import type { Metadata } from "next";
import { Lekton, Nunito } from "next/font/google";
import "@fontsource/libertinus-serif-display";
import "@fontsource-variable/nunito";
import "@fontsource-variable/lilex";
import "@fontsource/lilex";
import "@fontsource/lekton";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const lekton = Lekton({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lekton",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Roi Stationares - The best stationary store",
  description:
    "Roi Stationares is the best stationary store in the Nairobi area. We offer a wide range of stationary products at affordable prices. Our products are of high quality and we offer excellent customer service.",
  applicationName: "Roi Stationares",
  authors: [{ name: "Roi Stationares" }],
  creator: "Roi Stationares",
  publisher: "Roi Stationares",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${lekton.variable}`}>
      <body
        className="min-h-dvh text-neutral-950 antialiased selection:bg-neutral-950 selection:text-white"
        suppressHydrationWarning
      >
        {/* Navbar: fixed, renders above everything at z-40 */}
        <Navbar />
        {/* Main content: full-width, no max-w constraint here — individual sections self-manage their layout */}
        <div className="relative flex min-h-dvh flex-col">
          <main className="flex-1 w-full">{children}</main>
          <div className="page-bounded">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
