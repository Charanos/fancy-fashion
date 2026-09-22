"use client";

import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Categories from "./Categories";
import { IconPackage } from "./icons";
import { DUR, EASE, useReducedMotion } from "./navigation/nav-motion";
import ProductCard from "./products/ProductCard";
import ProductRow from "./products/ProductRow";
import ProductToolbar, { type ViewMode } from "./products/ProductToolbar";
import {
  PRODUCTS,
  departmentLabel,
  sortProducts,
  type DepartmentSlug,
  type SortId,
} from "./products/product-catalog";

/**
 * Owns the browse state for the homepage catalogue: department, sort order and
 * layout. The catalogue itself lives in `products/product-catalog.ts`, so the
 * data is shared with the cart, the search palette and the category ribbon
 * rather than being redeclared here as it was before.
 */
const ProductList = () => {
  const [department, setDepartment] = useState<DepartmentSlug | "all">("all");
  const [sort, setSort] = useState<SortId>("featured");
  const [view, setView] = useState<ViewMode>("grid");

  const resultsRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const visibleProducts = useMemo(() => {
    const filtered =
      department === "all"
        ? PRODUCTS
        : PRODUCTS.filter((product) => product.department === department);
    return sortProducts(filtered, sort);
  }, [department, sort]);

  // Results rise in whenever the set changes. `fromTo` writes the from-state in
  // a layout effect, so there is no flash — and if the script never runs, the
  // cards are simply visible.
  useGSAP(
    () => {
      const container = resultsRef.current;
      if (!container) return;

      const items = container.querySelectorAll("[data-product-item]");
      if (items.length === 0) return;

      if (reduced) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: DUR.slow,
          ease: EASE.out,
          stagger: 0.04,
          overwrite: "auto",
        }
      );
    },
    { dependencies: [department, sort, view, reduced] }
  );

  return (
    <div className="w-full">
      <Categories activeId={department} onSelect={setDepartment} />

      <section aria-labelledby="catalogue-heading" className="scroll-mt-32" id="catalogue">
        <div className="section-header">
          <div className="max-w-2xl">
            <p className="section-eyebrow">
              <span className="section-eyebrow-rule" aria-hidden="true" />
              Catalogue
            </p>
            <h2 id="catalogue-heading" className="section-title">
              {department === "all"
                ? "Everything in stock"
                : departmentLabel(department)}
            </h2>
          </div>
          <p className="section-lede">
            Stocked in Nairobi and priced in shillings. Specifications are the
            manufacturer&rsquo;s; delivery is free on orders over KSh 5,000.
          </p>
        </div>

        <ProductToolbar
          resultCount={visibleProducts.length}
          totalCount={PRODUCTS.length}
          department={department}
          onClearDepartment={() => setDepartment("all")}
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
        />

        {visibleProducts.length === 0 ? (
          <div className="product-empty">
            <span className="product-empty-mark">
              <IconPackage className="size-7" stroke={1.3} aria-hidden="true" />
            </span>
            <p className="font-title text-lg text-neutral-900">
              Nothing in this department yet
            </p>
            <p className="mx-auto mt-1 max-w-sm font-sans text-sm leading-relaxed text-neutral-500">
              We are still building this shelf. Browse the full catalogue in the
              meantime.
            </p>
            <button
              type="button"
              onClick={() => setDepartment("all")}
              className="mega-cta mt-5 inline-flex px-5"
            >
              Show all departments
            </button>
          </div>
        ) : (
          <div
            ref={resultsRef}
            className={view === "grid" ? "product-grid" : "product-list"}
          >
            {visibleProducts.map((product) =>
              view === "grid" ? (
                <div key={product.id} data-product-item>
                  <ProductCard product={product} />
                </div>
              ) : (
                <div key={product.id} data-product-item>
                  <ProductRow product={product} />
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductList;
