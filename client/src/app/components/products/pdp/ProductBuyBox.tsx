"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IconCheck,
  IconHeart,
  IconMinus,
  IconPlus,
  IconRosetteDiscountCheck,
  IconShieldCheck,
  IconShoppingBag,
  IconTruck,
} from "../../icons";
import Rating from "../Rating";
import { useCart } from "../cart-store";
import { useWishlist } from "../wishlist-store";
import {
  FREE_DELIVERY_THRESHOLD,
  departmentLabel,
  discountPercent,
  formatKsh,
  stockLabel,
  stockLevel,
  type CatalogueProduct,
} from "../product-catalog";

type ProductBuyBoxProps = {
  product: CatalogueProduct;
  warranty?: string;
};

/**
 * The commercial half of the detail page: identity, price, availability and
 * the one action that matters. It keeps a local "how many to add" counter
 * separate from the basket line, so choosing 5 and pressing Add once does what
 * it says rather than adding one and making you press four more times.
 */
export default function ProductBuyBox({ product, warranty }: ProductBuyBoxProps) {
  const { quantityOf, addItem, setQuantity, openDrawer } = useCart();
  const { has, toggle } = useWishlist();

  const inBag = quantityOf(product.id);
  const isSaved = has(product.id);

  const level = stockLevel(product.stock);
  const isSoldOut = level === "out";
  const discount = discountPercent(product);
  const qualifiesForFreeDelivery = product.price >= FREE_DELIVERY_THRESHOLD;

  // Capped at what is actually on the shelf, and at 10 for the picker — larger
  // orders belong in a bulk quote, which the assurance list links to.
  const maxSelectable = Math.max(1, Math.min(product.stock - inBag, 10));
  const [quantity, setQuantity_] = useState(1);
  const selected = Math.min(quantity, maxSelectable);

  const handleAdd = () => {
    addItem(product, selected);
    setQuantity_(1);
    openDrawer();
  };

  return (
    <div className="pdp-buy">
      <p className="pdp-eyebrow">
        <span className="pdp-eyebrow-brand">{product.brand}</span>
        <span aria-hidden="true">·</span>
        <span>{departmentLabel(product.department)}</span>
      </p>

      <h1 className="pdp-title">{product.name}</h1>

      <div className="pdp-meta">
        <Rating value={product.rating} reviewCount={product.reviewCount} />
        <span className="pdp-meta-divider" aria-hidden="true" />
        <span className="numerals font-mono text-[11px] text-neutral-500">
          SKU {product.sku}
        </span>
      </div>

      <div className="pdp-price">
        <span className="pdp-price-row">
          <span className="numerals font-mono pdp-price-now">
            {formatKsh(product.price)}
          </span>
          {product.compareAtPrice && (
            <>
              <s className="numerals font-mono pdp-price-was">
                {formatKsh(product.compareAtPrice)}
              </s>
              <span className="pdp-price-save">Save {discount}%</span>
            </>
          )}
        </span>

        {product.unitPrice && (
          <span className="numerals font-mono pdp-price-unit">
            Works out at{" "}
            {`KSh ${product.unitPrice.amount.toLocaleString("en-KE", {
              minimumFractionDigits: product.unitPrice.amount < 10 ? 2 : 0,
              maximumFractionDigits: product.unitPrice.amount < 10 ? 2 : 0,
            })} per ${product.unitPrice.unit}`}
          </span>
        )}

        <span className="pdp-price-vat">Price includes VAT.</span>
      </div>

      <p className="pdp-stock" data-level={level}>
        <span className="product-stock-dot" aria-hidden="true" />
        <span>{stockLabel(product.stock)}</span>
        {!isSoldOut && (
          <span className="pdp-stock-count numerals font-mono">
            {product.stock} available
          </span>
        )}
      </p>

      {/* Actions */}
      <div className="pdp-actions">
        {isSoldOut ? (
          <button type="button" className="product-bag-button is-disabled" disabled>
            <span>Out of stock</span>
          </button>
        ) : (
          <>
            <div className="pdp-quantity">
              <span className="pdp-quantity-label" id={`qty-${product.id}`}>
                Qty
              </span>
              <div
                className="pdp-quantity-control"
                role="group"
                aria-labelledby={`qty-${product.id}`}
              >
                <button
                  type="button"
                  className="product-stepper-button"
                  onClick={() => setQuantity_((q) => Math.max(1, q - 1))}
                  disabled={selected <= 1}
                  aria-label="Decrease quantity"
                >
                  <IconMinus className="size-3.5" stroke={2.2} aria-hidden="true" />
                </button>
                <span className="numerals font-mono pdp-quantity-value" aria-live="polite">
                  {selected}
                </span>
                <button
                  type="button"
                  className="product-stepper-button"
                  onClick={() => setQuantity_((q) => Math.min(maxSelectable, q + 1))}
                  disabled={selected >= maxSelectable}
                  aria-label="Increase quantity"
                >
                  <IconPlus className="size-3.5" stroke={2.2} aria-hidden="true" />
                </button>
              </div>
            </div>

            <button type="button" className="product-bag-button pdp-add" onClick={handleAdd}>
              <IconShoppingBag className="size-4 shrink-0" stroke={1.7} aria-hidden="true" />
              <span>Add to bag</span>
            </button>
          </>
        )}
      </div>

      {inBag > 0 && (
        <div className="pdp-in-bag" role="status">
          <IconCheck className="size-4 shrink-0 text-emerald-700" stroke={2.4} aria-hidden="true" />
          <span>
            <span className="numerals font-mono font-semibold">{inBag}</span> in
            your bag
          </span>
          <button
            type="button"
            className="pdp-in-bag-link"
            onClick={() => setQuantity(product, Math.max(0, inBag - 1))}
          >
            Remove one
          </button>
          <button type="button" className="pdp-in-bag-link is-primary" onClick={openDrawer}>
            View bag
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => toggle(product.id)}
        aria-pressed={isSaved}
        className="pdp-save"
      >
        <IconHeart
          className="size-4"
          stroke={1.8}
          fill={isSaved ? "currentColor" : "none"}
          aria-hidden="true"
        />
        <span>{isSaved ? "Saved for later" : "Save for later"}</span>
      </button>

      {/* Commercial terms */}
      <ul className="pdp-assurances">
        <li>
          <IconTruck className="size-4 shrink-0" stroke={1.7} aria-hidden="true" />
          <span>
            {qualifiesForFreeDelivery
              ? "Free Nairobi delivery on this item."
              : `Free Nairobi delivery on orders over ${formatKsh(FREE_DELIVERY_THRESHOLD)}.`}{" "}
            Ordered before 14:00, it goes out the same day.
          </span>
        </li>
        <li>
          <IconRosetteDiscountCheck className="size-4 shrink-0" stroke={1.7} aria-hidden="true" />
          <span>
            {warranty ?? "Genuine stock, sourced through authorised channels."}
          </span>
        </li>
        <li>
          <IconShieldCheck className="size-4 shrink-0" stroke={1.7} aria-hidden="true" />
          <span>
            Pay by M-Pesa, card on delivery or bank transfer.{" "}
            <Link href="/bulk-orders" className="pdp-assurance-link">
              Bulk and LPO terms
            </Link>{" "}
            available.
          </span>
        </li>
      </ul>
    </div>
  );
}
