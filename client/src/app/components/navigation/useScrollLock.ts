"use client";

import { useEffect } from "react";

// The header can stack overlays (mega menu → search palette → cart drawer), and
// each one previously wrote `document.body.style.overflow` directly. Closing the
// inner overlay then unlocked the page while the outer one was still open. A
// module-level reference count makes the lock composable: the page only scrolls
// again once the last consumer releases it.
let lockCount = 0;
let release: (() => void) | null = null;

function engageLock() {
  const { body } = document;
  const previousOverflow = body.style.overflow;

  // Only `overflow` is touched. Setting `touch-action: none` here would also be
  // inherited by the overlays themselves — which are portalled into <body> —
  // and would kill touch scrolling inside them. Overlay scroll containers use
  // `overscroll-behavior: contain` instead to stop scroll chaining.
  body.style.overflow = "hidden";

  release = () => {
    body.style.overflow = previousOverflow;
  };
}

/**
 * Locks page scrolling while `active` is true. Safe to call from several
 * overlays at once — `html { scrollbar-gutter: stable }` keeps the layout from
 * shifting when the scrollbar disappears.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    lockCount += 1;
    if (lockCount === 1) engageLock();

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        release?.();
        release = null;
      }
    };
  }, [active]);
}
