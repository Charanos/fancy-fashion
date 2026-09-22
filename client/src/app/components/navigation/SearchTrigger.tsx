"use client";

import { useEffect, useState } from "react";
import { GlyphSearch } from "../AppleGlyphs";

type SearchTriggerProps = {
  /** `field` = wide faux-input. `glyph` = circular icon button. */
  variant?: "field" | "glyph";
  onOpen: () => void;
  className?: string;
  glyphSize?: number;
};

/**
 * A stateless trigger: it only reports intent upwards. Every header state can
 * mount as many of these as the layout needs without duplicating palette state
 * or global key listeners.
 */
export default function SearchTrigger({
  variant = "field",
  onOpen,
  className = "",
  glyphSize = 18,
}: SearchTriggerProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/mac|iphone|ipad|ipod/i.test(navigator.userAgent));
  }, []);

  if (variant === "glyph") {
    return (
      <button
        type="button"
        onClick={onOpen}
        className={`apple-glyph-btn group ${className}`}
        aria-label="Search the catalogue"
        aria-keyshortcuts="Control+K Meta+K"
      >
        <GlyphSearch size={glyphSize} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`search-field-trigger group ${className}`}
      aria-label="Search the catalogue"
      aria-keyshortcuts="Control+K Meta+K"
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <GlyphSearch
          size={15}
          className="shrink-0 text-neutral-600 transition group-hover:scale-105"
        />
        <span className="truncate font-sans text-xs text-neutral-400 transition-colors group-hover:text-neutral-700">
          Search printers, paper, laptops…
        </span>
      </span>
      {/* suppressHydrationWarning: the modifier label resolves client-side. */}
      <kbd
        suppressHydrationWarning
        className="inline-flex shrink-0 items-center gap-0.5 rounded-md border border-neutral-300/70 bg-white/80 px-1.5 py-0.5 font-mono text-[9.5px] font-medium text-neutral-500 shadow-2xs transition-colors group-hover:text-neutral-700"
      >
        <span>{isMac ? "⌘" : "Ctrl"}</span>
        <span>K</span>
      </kbd>
    </button>
  );
}
