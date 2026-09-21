"use client";

import { useRef } from "react";
import Image from "next/image";
import ProductList from "./components/ProductList";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Homepage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    // Only play animations if the user has NOT requested reduced motion at the OS level
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline();

      // 1. Master Reveal: Extremely subtle, elegant fade-in
      tl.fromTo(
        heroRef.current,
        { 
          y: 20, // Reduced from 80
          opacity: 0, 
        },
        {
          y: 0,
          opacity: 1,
          duration: 2.2,
          ease: "power2.out",
        }
      );

      // (Continuous float animation completely removed for a calmer interface)

      // 2. Elegant Stagger for below-the-fold content
      tl.fromTo(
        contentRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.4,
          ease: "power2.out",
        },
        "-=1.4" // Overlap seamlessly
      );
    });

    // For users who explicitly prefer reduced motion, ensure immediate visibility
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(heroRef.current, { opacity: 1, y: 0 });
      gsap.set(contentRef.current, { opacity: 1, y: 0 });
    });
    
    return () => mm.revert();
  });

  return (
    <div className="w-full overflow-hidden">
      <h1 className="sr-only">Roi Stationares — Premium Stationery &amp; Desk Supplies</h1>

      {/* ================================================================ */}
      {/* HERO — Editorially placed display image                           */}
      {/* ================================================================ */}
      <section
        className="relative w-full overflow-visible"
        style={{ paddingTop: "calc(var(--nav-h) + 3rem)" }}
      >
        {/* Image wrapper: elegantly centered, increased scale, animated */}
        <div
          ref={heroRef}
          className="relative mx-auto will-change-transform"
          style={{
            /* Increased to 88vw/1150px as requested for slightly more presence */
            width: "min(90vw, 1250px)",
          }}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "16 / 7",
              mixBlendMode: "multiply", /* Blends the sketch perfectly into page bg */
            }}
          >
            <Image
              src="/featured.png"
              alt="Roi Stationares — Fine Stationery & Desk Instruments"
              fill
              priority
              sizes="(max-width: 640px) 94vw, (max-width: 1024px) 90vw, 1150px"
              className="object-contain object-top"
            />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* PAGE CONTENT — bounded product sections                           */}
      {/* ================================================================ */}
      <div 
        ref={contentRef}
        className="page-bounded py-14 sm:py-16 lg:py-20 will-change-transform"
      >
        <ProductList />
      </div>
    </div>
  );
};

export default Homepage;
