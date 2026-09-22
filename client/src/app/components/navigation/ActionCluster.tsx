"use client";

import Link from "next/link";
import { useRef } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  GlyphHeart,
  GlyphMenu,
  GlyphShoppingBag,
  GlyphUser,
} from "../AppleGlyphs";
import { DUR, EASE, useReducedMotion } from "./nav-motion";
import SearchTrigger from "./SearchTrigger";

type ActionClusterProps = {
  cartCount: number;
  onOpenCart: () => void;
  /** Provide to render a glyph search trigger inside the cluster. */
  onOpenSearch?: () => void;
  /** Provide to render the drawer toggle (mobile / tablet states). */
  onToggleMenu?: () => void;
  isMenuOpen?: boolean;
  menuButtonRef?: RefObject<HTMLButtonElement | null>;
  glyphSize?: number;
  /** Hide the "Bag" word where horizontal space is tight. */
  showBagLabel?: boolean;
  /** Renders the account button; hidden in the narrowest state. */
  showAccount?: boolean;
  /** Carries the cluster's spacing so callers can tighten it without the
      Tailwind gap utilities fighting each other. */
  className?: string;
};

/**
 * Every header state draws the same action cluster, so it is defined once here.
 * Previously this block was copy-pasted three times, which is how the docked bar
 * and the masthead drifted apart in glyph size, label rules and aria wording.
 */
export default function ActionCluster({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onToggleMenu,
  isMenuOpen = false,
  menuButtonRef,
  glyphSize = 18,
  showBagLabel = true,
  showAccount = true,
  className = "gap-2 sm:gap-2.5",
}: ActionClusterProps) {
  const badgeRef = useRef<HTMLSpanElement>(null);
  const isFirstCount = useRef(true);
  const reduced = useReducedMotion();

  // A bag that changes silently feels broken. One short, non-looping bump is
  // enough feedback, and it is skipped on mount and under reduced motion.
  useGSAP(
    () => {
      if (isFirstCount.current) {
        isFirstCount.current = false;
        return;
      }
      if (reduced || !badgeRef.current) return;

      gsap
        .timeline()
        .to(badgeRef.current, {
          scale: 1.35,
          duration: DUR.micro,
          ease: EASE.out,
          overwrite: "auto",
        })
        .to(badgeRef.current, {
          scale: 1,
          duration: DUR.base,
          ease: "elastic.out(1, 0.55)",
        });
    },
    { dependencies: [cartCount, reduced] }
  );

  return (
    <div className={`flex items-center ${className}`}>
      {onOpenSearch && (
        <SearchTrigger variant="glyph" onOpen={onOpenSearch} glyphSize={glyphSize} />
      )}

      <Link
        href="/wishlist"
        aria-label="Wishlist"
        className="apple-glyph-btn group hidden sm:inline-grid"
      >
        <GlyphHeart size={glyphSize} />
      </Link>

      <button
        type="button"
        onClick={onOpenCart}
        aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
        aria-haspopup="dialog"
        className="apple-glyph-pill group"
      >
        <GlyphShoppingBag size={glyphSize} />
        {showBagLabel && (
          <span className="hidden font-sans text-xs font-medium text-neutral-800 transition-colors group-hover:text-neutral-950 sm:inline">
            Bag
          </span>
        )}
        <span ref={badgeRef} className="bag-count numerals font-mono" aria-hidden="true">
          {cartCount}
        </span>
      </button>

      {showAccount && (
        <Link
          href="/account"
          aria-label="Account"
          className="apple-glyph-btn group hidden sm:inline-grid"
        >
          <GlyphUser size={glyphSize} />
        </Link>
      )}

      {onToggleMenu && (
        <button
          ref={menuButtonRef}
          type="button"
          className="apple-glyph-btn group"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-haspopup="dialog"
          onClick={onToggleMenu}
        >
          <GlyphMenu size={glyphSize} isOpen={isMenuOpen} />
        </button>
      )}
    </div>
  );
}
