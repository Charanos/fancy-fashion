"use client";

import { ProductType } from "@/types";
import { IconDeviceLaptop, IconKeyboard, IconNotebook, IconPaperclip, IconPencil, IconPrinter, IconScan } from "./icons";

const productIcons = {
  1: IconPrinter,
  2: IconScan,
  3: IconDeviceLaptop,
  4: IconKeyboard,
  5: IconNotebook,
  6: IconPaperclip,
  7: IconPaperclip,
  8: IconPencil,
} as const;

const ProductCard = ({ product, formatPrice }: { product: ProductType; formatPrice: (price: number) => string }) => {
  const ProductGlyph = productIcons[product.id as keyof typeof productIcons] ?? IconNotebook;

  return (
    <article className="group glass-surface flex flex-col justify-between overflow-hidden rounded-3xl p-3 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
      <div className="product-illustration relative grid aspect-square w-full place-items-center overflow-hidden rounded-2xl bg-white/40" aria-hidden="true">
        <span className="product-illustration-grid" />
        <ProductGlyph className="relative size-20 text-neutral-700 transition duration-300 ease-out group-hover:scale-105 group-hover:text-neutral-900" stroke={1.15} />
      </div>
      <div className="mt-3 flex flex-1 flex-col justify-between gap-2 px-1">
        <div><h3 className="font-title text-base font-normal tracking-tight text-neutral-900 group-hover:text-neutral-950">{product.name}</h3><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">{product.shortDescription}</p></div>
        <div className="mt-2 flex items-center justify-between border-t border-white/50 pt-2"><span className="numerals font-mono text-sm font-medium text-neutral-950">{formatPrice(product.price)}</span><span className="glass-control rounded-full px-2.5 py-1 text-[11px] font-medium text-neutral-700 transition group-hover:bg-white/60">Details</span></div>
      </div>
    </article>
  );
};

export default ProductCard;
