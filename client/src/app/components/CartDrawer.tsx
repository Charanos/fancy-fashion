"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  IconArrowRight,
  IconMinus,
  IconPlus,
  IconShieldCheck,
  IconShoppingBag,
  IconTrash,
  IconTruck,
  IconX,
} from "./icons";
import { DUR, EASE, useReducedMotion } from "./navigation/nav-motion";
import { useFocusTrap } from "./navigation/useFocusTrap";
import { useScrollLock } from "./navigation/useScrollLock";
import { useCart } from "./products/cart-store";
import ProductMedia from "./products/ProductMedia";
import { formatKsh } from "./products/product-catalog";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    count,
    subtotal,
    remainingForFreeDelivery,
    freeDeliveryProgress,
    setQuantity,
    removeItem,
  } = useCart();

  const panelRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  // Shared, reference-counted lock: writing body.style.overflow directly meant
  // closing the search palette on top of this drawer unlocked the page beneath
  // it. The focus trap keeps Tab inside the slide-over while it is open.
  useScrollLock(isOpen);
  useFocusTrap(isOpen, panelRef);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const backdrop = backdropRef.current;
      if (!isOpen || !panel || !backdrop) return;

      if (reduced) {
        gsap.set([backdrop, panel], { autoAlpha: 1, x: 0 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: EASE.out, overwrite: "auto" } })
        .fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: DUR.base }, 0)
        .fromTo(
          panel,
          { autoAlpha: 0, x: 40 },
          { autoAlpha: 1, x: 0, duration: DUR.slow },
          0
        )
        .fromTo(
          panel.querySelectorAll("[data-cart-stagger]"),
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: DUR.base, stagger: 0.04 },
          0.1
        );
    },
    { dependencies: [isOpen, reduced] }
  );

  // The delivery meter animates its own width so the progress reads as
  // movement towards the threshold rather than a value that teleports.
  useGSAP(
    () => {
      if (!meterRef.current) return;
      gsap.to(meterRef.current, {
        scaleX: freeDeliveryProgress,
        duration: reduced ? 0 : DUR.slow,
        ease: EASE.out,
        overwrite: "auto",
      });
    },
    { dependencies: [freeDeliveryProgress, isOpen, reduced] }
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-neutral-950/35 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        tabIndex={-1}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b border-stone-200/70 pb-4"
          data-cart-stagger
        >
          <div className="flex items-center gap-2.5">
            <span className="glass-control grid size-9 place-items-center rounded-xl text-neutral-800">
              <IconShoppingBag className="size-4" stroke={1.8} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-title text-xl font-normal text-neutral-950">
                Your shopping bag
              </h2>
              <p className="font-sans text-xs text-neutral-500">
                <span className="numerals font-mono">{count}</span>{" "}
                {count === 1 ? "item" : "items"} ·{" "}
                <span className="numerals font-mono">{items.length}</span>{" "}
                {items.length === 1 ? "line" : "lines"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="icon-action size-9 text-neutral-600 hover:text-neutral-950"
          >
            <IconX className="size-4" stroke={1.8} aria-hidden="true" />
          </button>
        </div>

        {/* Free delivery meter */}
        <div className="cart-meter" data-cart-stagger>
          <div className="flex items-center gap-2 font-sans text-xs font-medium text-neutral-800">
            <IconTruck className="size-4 shrink-0 text-neutral-600" stroke={1.8} aria-hidden="true" />
            {remainingForFreeDelivery > 0 ? (
              <span>
                Add{" "}
                <span className="numerals font-mono font-semibold">
                  {formatKsh(remainingForFreeDelivery)}
                </span>{" "}
                more for free Nairobi delivery
              </span>
            ) : (
              <span className="font-medium text-emerald-800">
                Free Nairobi delivery unlocked
              </span>
            )}
          </div>
          <div
            className="cart-meter-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(freeDeliveryProgress * 100)}
            aria-label="Progress towards free Nairobi delivery"
          >
            <span ref={meterRef} className="cart-meter-fill" />
          </div>
        </div>

        {/* Lines */}
        <div className="cart-lines">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <div className="grid size-16 place-items-center rounded-2xl border border-stone-200 bg-stone-100/80 text-stone-400">
                <IconShoppingBag className="size-8" stroke={1.4} aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-title text-lg text-neutral-900">
                Your bag is empty
              </h3>
              <p className="mt-1 max-w-xs font-sans text-xs text-neutral-500">
                Browse office supplies, print equipment and work-ready
                technology, all stocked in Nairobi.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-neutral-800"
              >
                Browse the catalogue
                <IconArrowRight className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            items.map(({ product, quantity, lineTotal }) => (
              <div key={product.id} className="cart-line">
                <ProductMedia product={product} size="panel" className="shrink-0" />

                <div className="min-w-0 flex-1">
                  <h4 className="truncate font-title text-sm font-normal text-neutral-900">
                    {product.name}
                  </h4>
                  <p className="truncate font-sans text-[11px] text-neutral-500">
                    {product.brand} · <span className="numerals font-mono">{product.sku}</span>
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="cart-line-stepper">
                      <button
                        type="button"
                        onClick={() => setQuantity(product, quantity - 1)}
                        aria-label={`Decrease quantity of ${product.name}`}
                        className="cart-line-step"
                      >
                        <IconMinus className="size-3" stroke={2.2} aria-hidden="true" />
                      </button>
                      <span className="numerals font-mono mx-2 text-xs font-medium text-neutral-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(product, quantity + 1)}
                        disabled={quantity >= product.stock}
                        aria-label={`Increase quantity of ${product.name}`}
                        className="cart-line-step"
                      >
                        <IconPlus className="size-3" stroke={2.2} aria-hidden="true" />
                      </button>
                    </div>

                    <span className="numerals font-mono text-xs font-semibold text-neutral-950">
                      {formatKsh(lineTotal)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  aria-label={`Remove ${product.name} from bag`}
                  className="shrink-0 self-start p-1 text-stone-400 transition hover:text-red-600"
                >
                  <IconTrash className="size-4" stroke={1.6} aria-hidden="true" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="mt-4 space-y-3 border-t border-stone-200/70 pt-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between font-sans text-neutral-600">
                <span>Subtotal</span>
                <span className="numerals font-mono font-medium text-neutral-950">
                  {formatKsh(subtotal)}
                </span>
              </div>
              <div className="flex justify-between font-sans text-neutral-600">
                <span>Delivery</span>
                <span className="font-sans font-medium text-emerald-700">
                  {remainingForFreeDelivery === 0
                    ? "Free in Nairobi"
                    : "Calculated at checkout"}
                </span>
              </div>
              <div className="flex justify-between border-t border-stone-200/60 pt-2 text-sm font-semibold text-neutral-950">
                <span>Estimated total</span>
                <span className="numerals font-mono text-base">
                  {formatKsh(subtotal)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 py-3 text-xs font-medium tracking-wider text-white uppercase shadow-md transition hover:bg-neutral-800"
            >
              <span>Proceed to checkout</span>
              <IconArrowRight className="size-4" aria-hidden="true" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
              <IconShieldCheck className="size-3.5 text-neutral-400" stroke={1.8} aria-hidden="true" />
              <span>Secure checkout · Nairobi delivery confirmation</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
