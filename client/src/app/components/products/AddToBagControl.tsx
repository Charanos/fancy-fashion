"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { IconCheck, IconMinus, IconPlus, IconShoppingBag } from "../icons";
import { DUR, useReducedMotion } from "../navigation/nav-motion";
import { useCart } from "./cart-store";
import { stockLevel, type CatalogueProduct } from "./product-catalog";

type AddToBagControlProps = {
  product: CatalogueProduct;
  /** `full` fills its container; `inline` stays intrinsic for the list row. */
  width?: "full" | "inline";
  className?: string;
};

/**
 * The card's primary action, and the only place add-to-bag behaviour is
 * written. Once a product is in the basket the button becomes the quantity
 * stepper for that line, so the card reflects basket state instead of letting
 * you press "Add" five times and wonder what happened.
 */
export default function AddToBagControl({
  product,
  width = "full",
  className = "",
}: AddToBagControlProps) {
  const { quantityOf, addItem, setQuantity } = useCart();
  const quantity = quantityOf(product.id);
  const reduced = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);

  const level = stockLevel(product.stock);
  const isSoldOut = level === "out";
  const atStockCeiling = quantity >= product.stock;

  // A short confirmation beat when the line first appears, so pressing Add has
  // a visible consequence even if the drawer stays closed.
  useGSAP(
    () => {
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      }
      if (reduced || quantity === 0 || !rootRef.current) return;

      gsap.fromTo(
        rootRef.current,
        { scale: 0.96 },
        {
          scale: 1,
          duration: DUR.base,
          ease: "elastic.out(1, 0.6)",
          overwrite: "auto",
        }
      );
    },
    { dependencies: [quantity > 0, reduced] }
  );

  if (isSoldOut) {
    return (
      <div
        className={`product-bag-control ${width === "full" ? "w-full" : ""} ${className}`}
      >
        <button type="button" className="product-bag-button is-disabled" disabled>
          <span>Out of stock</span>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={`product-bag-control ${width === "full" ? "w-full" : ""} ${className}`}
    >
      {quantity === 0 ? (
        <button
          type="button"
          className="product-bag-button"
          onClick={() => addItem(product, 1)}
        >
          <IconShoppingBag className="size-4 shrink-0" stroke={1.7} aria-hidden="true" />
          <span>Add to bag</span>
        </button>
      ) : (
        <div className="product-stepper" role="group" aria-label={`Quantity of ${product.name}`}>
          <button
            type="button"
            className="product-stepper-button"
            onClick={() => setQuantity(product, quantity - 1)}
            aria-label={
              quantity === 1
                ? `Remove ${product.name} from bag`
                : `Decrease quantity of ${product.name}`
            }
          >
            <IconMinus className="size-3.5" stroke={2.2} aria-hidden="true" />
          </button>

          <span className="product-stepper-value">
            <IconCheck className="size-3.5 shrink-0 text-emerald-700" stroke={2.4} aria-hidden="true" />
            <span className="numerals font-mono" aria-live="polite">
              {quantity}
            </span>
            <span className="product-stepper-unit">in bag</span>
          </span>

          <button
            type="button"
            className="product-stepper-button"
            onClick={() => setQuantity(product, quantity + 1)}
            disabled={atStockCeiling}
            aria-label={
              atStockCeiling
                ? `No more ${product.name} available`
                : `Increase quantity of ${product.name}`
            }
          >
            <IconPlus className="size-3.5" stroke={2.2} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
