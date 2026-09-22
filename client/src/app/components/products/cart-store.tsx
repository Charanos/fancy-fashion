"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  FREE_DELIVERY_THRESHOLD,
  PRODUCTS,
  type CatalogueProduct,
} from "./product-catalog";

const STORAGE_KEY = "roi.cart.v1";
const MAX_LINE_QUANTITY = 99;

/**
 * Lines store an id and a quantity, never a snapshot of the product. Prices,
 * names and stock then come from one place — the catalogue — so a price change
 * can never leave a stale copy sitting in someone's saved basket.
 */
type CartLine = { productId: number; quantity: number };

type CartState = { lines: CartLine[] };

type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; productId: number; quantity: number; stock: number }
  | { type: "setQuantity"; productId: number; quantity: number; stock: number }
  | { type: "remove"; productId: number }
  | { type: "clear" };

/** Never let a line exceed what is on the shelf, or a sane hard ceiling. */
const clampQuantity = (value: number, stock: number) =>
  Math.max(0, Math.min(Math.floor(value), Math.min(stock, MAX_LINE_QUANTITY)));

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines };

    case "add":
    case "setQuantity": {
      const existing = state.lines.find((l) => l.productId === action.productId);
      const target =
        action.type === "add"
          ? (existing?.quantity ?? 0) + action.quantity
          : action.quantity;
      const quantity = clampQuantity(target, action.stock);

      if (quantity === 0) {
        return {
          lines: state.lines.filter((l) => l.productId !== action.productId),
        };
      }
      if (!existing) {
        return {
          lines: [...state.lines, { productId: action.productId, quantity }],
        };
      }
      if (existing.quantity === quantity) return state;
      return {
        lines: state.lines.map((l) =>
          l.productId === action.productId ? { ...l, quantity } : l
        ),
      };
    }

    case "remove": {
      if (!state.lines.some((l) => l.productId === action.productId)) return state;
      return { lines: state.lines.filter((l) => l.productId !== action.productId) };
    }

    case "clear":
      return state.lines.length === 0 ? state : { lines: [] };

    default:
      return state;
  }
}

export type CartItem = {
  product: CatalogueProduct;
  quantity: number;
  lineTotal: number;
};

type CartContextValue = {
  items: CartItem[];
  /** Total units, which is what the header badge counts. */
  count: number;
  subtotal: number;
  /** Shortfall to free Nairobi delivery; 0 once it is unlocked. */
  remainingForFreeDelivery: number;
  /** 0 → 1, for the drawer's delivery meter. */
  freeDeliveryProgress: number;
  /** False until localStorage has been read, so the UI can hold its nerve. */
  isHydrated: boolean;
  quantityOf: (productId: number) => number;
  addItem: (product: CatalogueProduct, quantity?: number) => void;
  setQuantity: (product: CatalogueProduct, quantity: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredLines(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Stored data is untrusted: it may come from an older schema, or name a
    // product that has since left the catalogue.
    return parsed.flatMap((entry): CartLine[] => {
      if (typeof entry !== "object" || entry === null) return [];
      const { productId, quantity } = entry as Partial<CartLine>;
      if (typeof productId !== "number" || typeof quantity !== "number") return [];

      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return [];

      const safeQuantity = clampQuantity(quantity, product.stock);
      return safeQuantity > 0 ? [{ productId, quantity: safeQuantity }] : [];
    });
  } catch {
    // Private mode, blocked site data, corrupt JSON — an empty basket is fine.
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [isHydrated, setIsHydrated] = useState(false);

  // The server has no basket, so restoring happens after mount. Rendering an
  // empty cart first and filling it in is deliberate: it keeps the server and
  // client markup identical instead of guessing at hydration time.
  useEffect(() => {
    const lines = readStoredLines();
    if (lines.length > 0) dispatch({ type: "hydrate", lines });
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Storage is a convenience here, never a requirement.
    }
  }, [state.lines, isHydrated]);

  const addItem = useCallback((product: CatalogueProduct, quantity = 1) => {
    dispatch({ type: "add", productId: product.id, quantity, stock: product.stock });
  }, []);

  const setQuantity = useCallback((product: CatalogueProduct, quantity: number) => {
    dispatch({
      type: "setQuantity",
      productId: product.id,
      quantity,
      stock: product.stock,
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    dispatch({ type: "remove", productId });
  }, []);

  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(() => {
    const items = state.lines.flatMap((line): CartItem[] => {
      const product = PRODUCTS.find((p) => p.id === line.productId);
      if (!product) return [];
      return [
        {
          product,
          quantity: line.quantity,
          lineTotal: product.price * line.quantity,
        },
      ];
    });

    const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);

    return {
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      subtotal,
      remainingForFreeDelivery: Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0),
      freeDeliveryProgress: Math.min(subtotal / FREE_DELIVERY_THRESHOLD, 1),
      isHydrated,
      quantityOf: (productId: number) =>
        state.lines.find((l) => l.productId === productId)?.quantity ?? 0,
      addItem,
      setQuantity,
      removeItem,
      clear,
    };
  }, [state.lines, isHydrated, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}
