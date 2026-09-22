"use client";

import type { CatalogueProduct } from "./product-catalog";

type ProductMediaProps = {
  product: CatalogueProduct;
  /**
   * `plate` — full specimen panel for the grid card.
   * `panel` — wider, shorter panel for the list row.
   * `chip`  — small square for the cart drawer and search results.
   */
  size?: "plate" | "panel" | "chip";
  className?: string;
};

const GLYPH_SIZE = {
  plate: "size-20 sm:size-24",
  panel: "size-12",
  chip: "size-6",
} as const;

/**
 * Products are drawn, not photographed.
 *
 * The shipped product images are leftovers from this repo's previous life as a
 * clothing store — every one of them is a garment — so showing a t-shirt for a
 * ream of A4 would be worse than showing nothing. Until real photography
 * exists, each product is represented by a technical specimen plate: paper
 * ground, a blueprint grid, registration ticks at the corners and the
 * product's line mark. It matches the hero sketch and the compass emblem, so
 * it reads as a deliberate house style rather than a missing asset.
 *
 * One component for the card, the row, the cart and the search palette, so the
 * treatment cannot drift between them.
 */
export default function ProductMedia({
  product,
  size = "plate",
  className = "",
}: ProductMediaProps) {
  const Glyph = product.glyph;

  return (
    <div
      className={`product-plate product-plate-${size} ${className}`}
      data-accent={product.accent}
      /* Decorative: the product name is always adjacent in real text. */
      aria-hidden="true"
    >
      <span className="product-plate-grid" />
      <span className="product-plate-ticks" />
      <Glyph
        className={`product-plate-glyph ${GLYPH_SIZE[size]}`}
        stroke={size === "plate" ? 1.05 : 1.4}
      />
      <span className="product-plate-sheen" />
    </div>
  );
}
