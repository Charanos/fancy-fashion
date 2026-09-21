"use client";

import Image from "next/image";
import { ProductType } from "@/types";

const ProductCard = ({ product }: { product: ProductType }) => {
  const firstImage = Object.values(product.images)[0] || "/placeholder.png";

  return (
    <article className="group glass-surface flex flex-col justify-between overflow-hidden rounded-3xl p-3 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white/40">
        <Image
          src={firstImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-3 flex flex-1 flex-col justify-between gap-2 px-1">
        <div>
          <h3 className="font-title text-base font-normal tracking-tight text-neutral-900 group-hover:text-neutral-950">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-500">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-white/50 pt-2">
          <span className="numerals font-mono text-sm font-medium text-neutral-950">
            ${product.price.toFixed(2)}
          </span>
          <span className="glass-control rounded-full px-2.5 py-1 text-[11px] font-medium text-neutral-700 transition group-hover:bg-white/60">
            Details
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
