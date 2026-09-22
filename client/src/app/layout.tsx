import type { Metadata } from "next";
import { Lekton, Nunito } from "next/font/google";
import "@fontsource/libertinus-serif-display";
import "@fontsource-variable/nunito";
import "@fontsource-variable/lilex";
import "@fontsource/lilex";
import "@fontsource/lekton";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./components/products/cart-store";
import { WishlistProvider } from "./components/products/wishlist-store";
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
  title: "Roi Stationer & Electronics | Nairobi office supplies and electronics",
  description:
    "Nairobi office supplies, printers, scanners, laptops and practical workspace equipment. All prices are in Kenyan shillings.",
  applicationName: "Roi Stationer & Electronics",
  authors: [{ name: "Roi Stationer & Electronics" }],
  creator: "Roi Stationer & Electronics",
  publisher: "Roi Stationer & Electronics",
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
        {/* Basket and saved items wrap the whole tree: the header badge, the
            product cards and the cart drawer all read the same state. */}
        <CartProvider>
          <WishlistProvider>
            {/* Navbar: fixed, renders above everything at z-40. It also owns the
                skip link and publishes its measured height as --nav-h. */}
            <Navbar />
            {/* Main content: full-width, no max-w constraint here — individual
                sections self-manage their layout */}
            <div className="relative flex min-h-dvh flex-col">
              <main id="main-content" tabIndex={-1} className="w-full flex-1">
                {children}
              </main>
              <div className="page-bounded">
                <Footer />
              </div>
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
