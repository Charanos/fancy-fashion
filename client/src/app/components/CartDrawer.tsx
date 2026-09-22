"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "./navigation/useFocusTrap";
import { useScrollLock } from "./navigation/useScrollLock";
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

export type CartItem = {
  id: number | string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
}

const DEFAULT_SAMPLE_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "HP Smart Tank 585 All-in-One",
    category: "Print & Scan • Wireless",
    price: 31500,
    quantity: 1,
    image: "/products/1g.png",
  },
  {
    id: 2,
    name: "PaperOne A4 Copy Paper, 80gsm",
    category: "Office & Paper • 500 Sheets",
    price: 780,
    quantity: 1,
    image: "/products/2g.png",
  },
];

const FREE_SHIPPING_THRESHOLD = 5000;
const formatKsh = (amount: number) => `KSh ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(amount)}`;

export default function CartDrawer({
  isOpen,
  onClose,
  items: initialItems,
}: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems || DEFAULT_SAMPLE_ITEMS);
  const panelRef = useRef<HTMLElement>(null);

  // Shared, reference-counted lock: writing body.style.overflow directly meant
  // closing the search palette on top of this drawer unlocked the page beneath
  // it. The focus trap keeps Tab inside the slide-over while it is open.
  useScrollLock(isOpen);
  useFocusTrap(isOpen, panelRef);

  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
    }
  }, [initialItems]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const updateQuantity = (id: number | string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeItem = (id: number | string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(
    FREE_SHIPPING_THRESHOLD - subtotal,
    0
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag Drawer"
    >
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/35 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <aside
        ref={panelRef}
        className="relative flex h-full w-full max-w-md flex-col justify-between border-l border-white/60 bg-[#faf8f5]/95 p-6 shadow-2xl backdrop-blur-2xl transition-transform duration-300 sm:rounded-l-3xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200/70 pb-4">
          <div className="flex items-center gap-2">
            <span className="glass-control grid size-9 place-items-center rounded-xl text-neutral-800">
              <IconShoppingBag className="size-4" stroke={1.8} />
            </span>
            <div>
              <h2 className="font-title text-xl font-normal text-neutral-950">
                Your Shopping Bag
              </h2>
              <p className="text-xs text-neutral-500 font-sans">
                {items.length} {items.length === 1 ? "item" : "items"} selected
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag drawer"
            className="icon-action size-8 text-neutral-600 hover:text-neutral-950"
          >
            <IconX className="size-4" stroke={1.8} />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="my-4 rounded-2xl border border-stone-200/80 bg-stone-100/60 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-800">
            <IconTruck className="size-4 text-neutral-600 shrink-0" stroke={1.8} />
            {remainingForFreeShipping > 0 ? (
              <span>
                Add{" "}
                <span className="font-mono numerals font-semibold">
                  {formatKsh(remainingForFreeShipping)}
                </span>{" "}
                more for free Nairobi delivery
              </span>
            ) : (
              <span className="text-emerald-800 font-medium">
                Free Nairobi delivery is unlocked!
              </span>
            )}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-neutral-900 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-6">
              <div className="grid size-16 place-items-center rounded-2xl border border-stone-200 bg-stone-100/80 text-stone-400">
                <IconShoppingBag className="size-8" stroke={1.4} />
              </div>
              <h3 className="mt-4 font-title text-lg text-neutral-900">
                Your basket is currently empty
              </h3>
              <p className="mt-1 text-xs text-neutral-500 max-w-xs font-sans">
                Explore practical office supplies, print equipment and work-ready technology.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-neutral-800"
              >
                Browse Nairobi essentials
                <IconArrowRight className="size-3.5" />
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-stone-200/70 bg-white/70 p-3 shadow-xs transition hover:bg-white/90"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-stone-200/60 bg-stone-50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-title text-sm font-normal text-neutral-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 truncate font-sans">
                    {item.category}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-stone-200 bg-stone-50/80 px-2 py-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                        className="text-neutral-500 hover:text-neutral-900 p-0.5"
                      >
                        <IconMinus className="size-3" stroke={2} />
                      </button>
                      <span className="font-mono numerals mx-2 text-xs font-medium text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                        className="text-neutral-500 hover:text-neutral-900 p-0.5"
                      >
                        <IconPlus className="size-3" stroke={2} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-mono numerals text-xs font-semibold text-neutral-950">
                        {formatKsh(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="text-stone-400 hover:text-red-600 transition p-1"
                >
                  <IconTrash className="size-4" stroke={1.6} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-stone-200/70 pt-4 mt-4 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600 font-sans">
                <span>Subtotal</span>
                <span className="font-mono numerals text-neutral-950 font-medium">
                  {formatKsh(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600 font-sans">
                <span>Packaging & Handling</span>
                <span className="text-emerald-700 font-medium font-sans">
                  {remainingForFreeShipping === 0 ? "Free in Nairobi" : "Calculated at checkout"}
                </span>
              </div>
              <div className="flex justify-between border-t border-stone-200/60 pt-2 text-sm font-semibold text-neutral-950">
                <span>Estimated Total</span>
                <span className="font-mono numerals text-base">
                  {formatKsh(subtotal)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 py-3 text-xs font-medium uppercase tracking-wider text-white shadow-md transition hover:bg-neutral-800"
            >
              <span>Proceed to Checkout</span>
              <IconArrowRight className="size-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
              <IconShieldCheck className="size-3.5 text-neutral-400" stroke={1.8} />
              <span>Secure checkout • Nairobi delivery confirmation</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
