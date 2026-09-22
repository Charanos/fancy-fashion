"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { IconChevronLeft, IconChevronRight } from "./icons";
import { DUR, EASE, useReducedMotion } from "./navigation/nav-motion";
import {
  DEPARTMENT_FACETS,
  type DepartmentSlug,
} from "./products/product-catalog";

type CategoriesProps = {
  activeId: DepartmentSlug | "all";
  onSelect: (id: DepartmentSlug | "all") => void;
};

/**
 * The department ribbon. Its labels, descriptions and — crucially — its item
 * counts are derived from the catalogue, so they can no longer disagree with
 * the grid the way the previously hand-written counts did. The slugs are the
 * same five the header navigates.
 */
const Categories = ({ activeId, onSelect }: CategoriesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const syncOverflow = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const nudge = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      syncOverflow();

      const tiles = track.querySelectorAll("[data-category-tile]");
      if (reduced || tiles.length === 0) {
        gsap.set(tiles, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        tiles,
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: DUR.slow,
          ease: EASE.out,
          stagger: 0.035,
          overwrite: "auto",
        }
      );
    },
    { dependencies: [reduced] }
  );

  return (
    <section className="relative my-16 sm:my-20" aria-labelledby="categories-heading">
      <div className="section-header">
        <div className="max-w-2xl">
          <p className="section-eyebrow">
            <span className="section-eyebrow-rule" aria-hidden="true" />
            Browse
          </p>
          <h2 id="categories-heading" className="section-title">
            Shop by department
          </h2>
        </div>
        <p className="section-lede">
          Quick paths into the office equipment, print essentials and reliable
          technology Nairobi teams use every day.
        </p>
      </div>

      <div className="category-ribbon">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => nudge("left")}
            className="category-nudge is-left"
            aria-label="Scroll departments left"
          >
            <IconChevronLeft className="size-4" stroke={2.2} aria-hidden="true" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={syncOverflow}
          className="category-scroll no-scrollbar edge-fade"
          data-fade-left={canScrollLeft ? "true" : "false"}
          data-fade-right={canScrollRight ? "true" : "false"}
        >
          <div ref={trackRef} className="category-track" role="group" aria-label="Filter by department">
            {DEPARTMENT_FACETS.map((facet) => {
              const Icon = facet.icon;
              const isActive = activeId === facet.id;

              return (
                <button
                  key={facet.id}
                  type="button"
                  data-category-tile
                  aria-pressed={isActive}
                  onClick={() => onSelect(facet.id)}
                  className="category-tile group"
                  data-active={isActive ? "true" : undefined}
                >
                  <span className="category-tile-mark">
                    <Icon
                      className="size-6 transition-transform duration-300 group-hover:scale-110"
                      stroke={isActive ? 1.9 : 1.5}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="category-tile-text">
                    <span className="category-tile-name">{facet.label}</span>
                    <span className="category-tile-count numerals font-mono">
                      {facet.count} {facet.count === 1 ? "item" : "items"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => nudge("right")}
            className="category-nudge is-right"
            aria-label="Scroll departments right"
          >
            <IconChevronRight className="size-4" stroke={2.2} aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
};

export default Categories;
