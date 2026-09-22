"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BulkOrderBand from "./components/BulkOrderBand";
import ProductList from "./components/ProductList";
import ValueStrip from "./components/ValueStrip";
import { DUR, EASE, useReducedMotion } from "./components/navigation/nav-motion";

const Homepage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const hero = heroRef.current;
      const strip = stripRef.current;
      if (!hero || !strip) return;

      if (reduced) {
        gsap.set([hero, strip], { autoAlpha: 1, y: 0 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: EASE.out, overwrite: "auto" } })
        .fromTo(
          hero,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.82 }
        )
        .fromTo(
          strip,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: DUR.slow },
          "-=0.4"
        );
    },
    { dependencies: [reduced] }
  );

  return (
    <div className="w-full">
      <h1 className="sr-only">
        Roi Stationer and Electronics — Nairobi office supplies and electronics
      </h1>

      {/* ================================================================ */}
      {/* HERO — editorially placed display image                           */}
      {/* ================================================================ */}
      <section
        className="relative w-full overflow-visible"
        style={{ paddingTop: "calc(var(--nav-h) + 2.5rem)" }}
      >
        <div
          ref={heroRef}
          className="relative mx-auto will-change-transform"
          style={{ width: "min(90vw, 1250px)" }}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "16 / 7",
              /* Blends the sketch into the warm page ground. */
              mixBlendMode: "multiply",
            }}
          >
            <Image
              src="/hero4.png"
              alt="Roi Stationer and Electronics — office supplies and electronics for Nairobi workspaces"
              fill
              priority
              sizes="(max-width: 640px) 94vw, (max-width: 1024px) 90vw, 1250px"
              className="object-contain object-top"
            />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* TERMS — the four questions every buyer asks first                 */}
      {/* ================================================================ */}
      <div ref={stripRef} className="page-bounded will-change-transform">
        <ValueStrip />
      </div>

      {/* ================================================================ */}
      {/* CATALOGUE — departments, controls and results                     */}
      {/* ================================================================ */}
      <div className="page-bounded pb-14 sm:pb-16 lg:pb-20">
        <ProductList />
      </div>

      {/* ================================================================ */}
      {/* BUSINESS SUPPLY                                                   */}
      {/* ================================================================ */}
      <div className="page-bounded pb-16 sm:pb-20 lg:pb-24">
        <BulkOrderBand />
      </div>
    </div>
  );
};

export default Homepage;
