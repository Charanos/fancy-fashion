"use client";

import Link from "next/link";
import { IconArrowRight, IconHeart, IconTruck } from "../icons";
import AddToBagControl from "./AddToBagControl";
import ProductMedia from "./ProductMedia";
import Rating from "./Rating";
import { useWishlist } from "./wishlist-store";
import {
  FREE_DELIVERY_THRESHOLD,
  departmentLabel,
  discountPercent,
  formatKsh,
  formatUnitPrice,
  stockLabel,
  stockLevel,
  type CatalogueProduct,
} from "./product-catalog";

type ProductRowProps = {
  product: CatalogueProduct;
};

/**
 * List view. Not a squashed card — a different information density: the full
 * summary, all three specs as a labelled table and the SKU, which is what
 * someone comparing or bulk-ordering actually wants to read.
 */
export default function ProductRow({ product }: ProductRowProps) {
  const { has, toggle } = useWishlist();
  const isSaved = has(product.id);

  const href = `/products/${product.slug}`;
  const discount = discountPercent(product);
  const level = stockLevel(product.stock);

  return (
    <article className="product-row group" data-accent={product.accent}>
      <div className="product-row-media">
        <ProductMedia product={product} size="panel" />
        {discount > 0 && <span className="product-flag is-sale">−{discount}%</span>}
      </div>

      <div className="product-row-main">
        <p className="product-card-eyebrow">
          <span className="product-card-brand">{product.brand}</span>
          <span aria-hidden="true">·</span>
          <span>{departmentLabel(product.department)}</span>
          <span aria-hidden="true">·</span>
          <span className="numerals font-mono">{product.sku}</span>
        </p>

        <h3 className="product-row-name">
          <Link href={href} className="product-card-link">
            {product.name}
          </Link>
        </h3>

        <div className="product-row-meta">
          <Rating value={product.rating} reviewCount={product.reviewCount} />
          <span className="product-row-stock" data-level={level}>
            <span className="product-stock-dot" aria-hidden="true" />
            {stockLabel(product.stock)}
          </span>
        </div>

        <p className="product-row-summary">{product.shortDescription}</p>

        <dl className="product-row-specs">
          {product.specs.map((spec) => (
            <div key={spec.label} className="product-spec">
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="product-row-side">
        <div className="product-card-price">
          <span className="product-price-row">
            <span className="numerals font-mono product-price">
              {formatKsh(product.price)}
            </span>
            {product.compareAtPrice && (
              <s className="numerals font-mono product-price-was">
                {formatKsh(product.compareAtPrice)}
              </s>
            )}
          </span>

          {product.unitPrice && (
            <span className="product-price-note numerals font-mono">
              {formatUnitPrice(product.unitPrice)}
            </span>
          )}

          {product.price >= FREE_DELIVERY_THRESHOLD && (
            <span className="product-price-note product-price-delivery">
              <IconTruck className="size-3 shrink-0" stroke={1.8} aria-hidden="true" />
              Free Nairobi delivery
            </span>
          )}
        </div>

        <AddToBagControl product={product} />

        <div className="product-row-links">
          <button
            type="button"
            onClick={() => toggle(product.id)}
            aria-pressed={isSaved}
            className="product-row-link"
          >
            <IconHeart
              className="size-3.5"
              stroke={1.8}
              fill={isSaved ? "currentColor" : "none"}
              aria-hidden="true"
            />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>

          <Link href={href} className="product-row-link">
            <span>Details</span>
            <IconArrowRight
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
