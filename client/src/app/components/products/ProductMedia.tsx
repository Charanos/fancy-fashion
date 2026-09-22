"use client";

import {
  IconCalculator,
  IconDeviceLaptop,
  IconHighlight,
  IconKeyboard,
  IconLayoutGrid,
  IconNotebook,
  IconPackage,
  IconPaperclip,
  IconPencil,
  IconPrinter,
  IconScan,
} from "../icons";
import type { NavIcon } from "../navigation/nav-config";
import type { CatalogueProduct, ProductGlyph } from "./product-catalog";

/**
 * The catalogue stores a glyph *key*; the component lives here. A product
 * object is passed from the server-rendered detail page into client
 * components, and React cannot serialise a function across that boundary — so
 * the mapping has to happen on this side of it.
 */
const GLYPHS: Record<ProductGlyph, NavIcon> = {
  printer: IconPrinter,
  scanner: IconScan,
  package: IconPackage,
  laptop: IconDeviceLaptop,
  keyboard: IconKeyboard,
  notebook: IconNotebook,
  paperclip: IconPaperclip,
  pencil: IconPencil,
  highlight: IconHighlight,
  grid: IconLayoutGrid,
  calculator: IconCalculator,
};

type ProductMediaProps = {
  product: CatalogueProduct;
  /**
   * `plate` — full specimen panel for the grid card and detail page.
   * `panel` — wider, shorter panel for the list row and cart line.
   * `chip`  — small square for the tightest contexts.
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
 * One component for the card, the row, the detail page, the cart and the
 * search palette, so the treatment cannot drift between them.
 */
export default function ProductMedia({
  product,
  size = "plate",
  className = "",
}: ProductMediaProps) {
  const Glyph = GLYPHS[product.glyph];

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
