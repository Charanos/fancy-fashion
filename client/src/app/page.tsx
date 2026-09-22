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
          y: 12,
          opacity: 0, 
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.82,
          ease: "power3.out",
        }
      );

      // (Continuous float animation completely removed for a calmer interface)

      // 2. Elegant Stagger for below-the-fold content
      tl.fromTo(
        contentRef.current,
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.68,
          ease: "power3.out",
        },
        "-=0.36"
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
      <h1 className="sr-only">Roi Stationer and Electronics — Nairobi office supplies and electronics</h1>

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
              src="/hero4.png"
              alt="Roi Stationer and Electronics — office supplies and electronics for Nairobi workspaces"
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
