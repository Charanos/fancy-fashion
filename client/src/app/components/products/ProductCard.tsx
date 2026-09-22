"use client";

import Link from "next/link";
import { IconEye, IconHeart, IconTruck } from "../icons";
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

type ProductCardProps = {
  product: CatalogueProduct;
};

/**
 * Grid card, built as a specimen sheet rather than a poster: plate, identity,
 * three specs, then price and action. Everything on it is real catalogue data,
 * and the action row reflects basket state.
 */
export default function ProductCard({ product }: ProductCardProps) {
  const { has, toggle } = useWishlist();
  const isSaved = has(product.id);

  const href = `/products/${product.slug}`;
  const discount = discountPercent(product);
  const level = stockLevel(product.stock);
  const qualifiesForFreeDelivery = product.price >= FREE_DELIVERY_THRESHOLD;

  return (
    <article className="product-card group" data-accent={product.accent}>
      <div className="product-card-media">
        <ProductMedia product={product} size="plate" />

        <div className="product-card-flags">
          {discount > 0 && (
            <span className="product-flag is-sale">−{discount}%</span>
          )}
          {product.badges.map((badge) => (
            <span key={badge} className="product-flag">
              {badge}
            </span>
          ))}
        </div>

        <div className="product-card-quick">
          <button
            type="button"
            onClick={() => toggle(product.id)}
            aria-pressed={isSaved}
            aria-label={
              isSaved
                ? `Remove ${product.name} from saved items`
                : `Save ${product.name} for later`
            }
            className="product-quick-button"
            data-active={isSaved ? "true" : undefined}
          >
            <IconHeart
              className="size-4"
              stroke={1.8}
              fill={isSaved ? "currentColor" : "none"}
              aria-hidden="true"
            />
          </button>

          <Link
            href={href}
            aria-label={`View full details for ${product.name}`}
            className="product-quick-button"
          >
            <IconEye className="size-4" stroke={1.8} aria-hidden="true" />
          </Link>
        </div>

        <p className="product-card-stock" data-level={level}>
          <span className="product-stock-dot" aria-hidden="true" />
          {stockLabel(product.stock)}
        </p>
      </div>

      <div className="product-card-body">
        <p className="product-card-eyebrow">
          <span className="product-card-brand">{product.brand}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{departmentLabel(product.department)}</span>
        </p>

        <h3 className="product-card-name">
          {/* Stretched link: the whole card is the hit target, while the quick
              actions above sit on their own layer and stay clickable. */}
          <Link href={href} className="product-card-link">
            {product.name}
          </Link>
        </h3>

        <Rating value={product.rating} reviewCount={product.reviewCount} />

        <p className="product-card-summary">{product.shortDescription}</p>

        <dl className="product-card-specs">
          {product.specs.map((spec) => (
            <div key={spec.label} className="product-spec">
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="product-card-foot">
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

          {product.unitPrice ? (
            <span className="product-price-note numerals font-mono">
              {formatUnitPrice(product.unitPrice)}
            </span>
          ) : qualifiesForFreeDelivery ? (
            <span className="product-price-note product-price-delivery">
              <IconTruck className="size-3 shrink-0" stroke={1.8} aria-hidden="true" />
              Free Nairobi delivery
            </span>
          ) : (
            <span className="product-price-note">
              SKU <span className="numerals">{product.sku}</span>
            </span>
          )}
        </div>

        <AddToBagControl product={product} />
      </div>
    </article>
  );
}
