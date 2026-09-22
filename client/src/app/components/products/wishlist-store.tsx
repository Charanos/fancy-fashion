"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { PRODUCTS } from "./product-catalog";

const STORAGE_KEY = "roi.wishlist.v1";

type WishlistContextValue = {
  ids: ReadonlySet<number>;
  count: number;
  has: (productId: number) => boolean;
  toggle: (productId: number) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readStoredIds(): number[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Drop anything that is not a live product id.
    return parsed.filter(
      (id): id is number =>
        typeof id === "number" && PRODUCTS.some((p) => p.id === id)
    );
  } catch {
    return [];
  }
}

/**
 * A saved-items list, kept deliberately small: the heart on a product card has
 * to actually remember something, or it is a button that lies.
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<ReadonlySet<number>>(() => new Set<number>());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = readStoredIds();
    if (stored.length > 0) setIds(new Set(stored));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
    } catch {
      // Best effort only.
    }
  }, [ids, isHydrated]);

  const toggle = useCallback((productId: number) => {
    setIds((current) => {
      const next = new Set(current);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      count: ids.size,
      has: (productId: number) => ids.has(productId),
      toggle,
    }),
    [ids, toggle]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside <WishlistProvider>");
  }
  return context;
}
