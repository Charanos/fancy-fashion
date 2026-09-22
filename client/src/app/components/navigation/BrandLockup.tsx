"use client";

import Link from "next/link";
import { GlyphCompassLogo } from "../AppleGlyphs";
import { STORE_IDENTITY } from "./nav-config";

type BrandLockupProps = {
  /** `grand` = stacked editorial lockup. `mark` = compact emblem + wordmark. */
  variant?: "grand" | "mark";
  /** Breakpoint from which the compact wordmark appears beside the emblem. */
  wordmark?: "none" | "sm" | "xl";
  markSize?: number;
  className?: string;
};

const WORDMARK_VISIBILITY = {
  none: "hidden",
  sm: "hidden sm:inline",
  xl: "hidden xl:inline",
} as const;

/**
 * The brand lockup is the one element shared by every header state, so it lives
 * in a single component. Both variants resolve to the same accessible name,
 * which keeps the "home" link stable for screen readers across the scroll morph.
 */
export default function BrandLockup({
  variant = "grand",
  wordmark = "xl",
  markSize = 34,
  className = "",
}: BrandLockupProps) {
  const homeLabel = `${STORE_IDENTITY.name} — home`;

  if (variant === "mark") {
    return (
      <Link
        href="/"
        aria-label={homeLabel}
        className={`group flex shrink-0 items-center gap-2.5 rounded-full ${className}`}
      >
        <GlyphCompassLogo size={markSize} />
        <span
          className={`${WORDMARK_VISIBILITY[wordmark]} font-title text-[0.95rem] leading-none tracking-tight whitespace-nowrap text-neutral-900 transition-colors group-hover:text-neutral-950`}
        >
          {STORE_IDENTITY.shortName}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label={homeLabel}
      className={`group flex flex-col items-center gap-1 rounded-2xl text-center ${className}`}
    >
      <GlyphCompassLogo size={40} className="mb-0.5" />
      <span className="font-title text-2xl font-normal tracking-tight whitespace-nowrap text-neutral-950 transition-colors group-hover:text-neutral-800 sm:text-3xl">
        {STORE_IDENTITY.name}
      </span>
      <span className="font-sans text-[9px] font-medium tracking-widest text-neutral-400 uppercase">
        {STORE_IDENTITY.tagline}
      </span>
    </Link>
  );
}
