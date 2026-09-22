"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";

/** `expanded` = editorial three-tier masthead. `docked` = floating console. */
export type NavMode = "expanded" | "docked";

// Client components are still server-rendered, so the layout effect has to be
// opted out of on the server to avoid React's warning.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type HeaderScrollOptions = {
  /** Scroll depth at which the masthead condenses into the docked console. */
  dockAt?: number;
  /** Scroll depth below which the header always stays on screen. */
  revealFloor?: number;
  /** Travel required in one direction before the header hides/reveals. */
  intentThreshold?: number;
};

type HeaderScrollState = {
  mode: NavMode;
  isHidden: boolean;
  /** Mirrors `mode` for use inside imperative handlers without stale closures. */
  modeRef: RefObject<NavMode>;
};

export function useHeaderScroll({
  dockAt = 36,
  revealFloor = 96,
  intentThreshold = 10,
}: HeaderScrollOptions = {}): HeaderScrollState {
  const [mode, setMode] = useState<NavMode>("expanded");
  const [isHidden, setIsHidden] = useState(false);

  const modeRef = useRef<NavMode>("expanded");

  useIsomorphicLayoutEffect(() => {
    let lastY = window.scrollY;
    // Directional travel accumulator: a few pixels of trackpad jitter should
    // never flip the header, but a deliberate flick of ~10px should.
    let intent = 0;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;

      // Mode uses its own hysteresis band so hovering the dock threshold does
      // not strobe between the two layouts.
      if (modeRef.current === "expanded" && y > dockAt) {
        modeRef.current = "docked";
        setMode("docked");
      } else if (modeRef.current === "docked" && y < dockAt / 3) {
        modeRef.current = "expanded";
        setMode("expanded");
      }

      if (y <= revealFloor) {
        intent = 0;
        setIsHidden(false);
        return;
      }

      if (delta === 0) return;
      // Reset the accumulator whenever the scroll direction reverses.
      if ((delta > 0) !== (intent > 0)) intent = 0;
      intent += delta;

      if (intent > intentThreshold) {
        intent = 0;
        setIsHidden(true);
      } else if (intent < -intentThreshold) {
        intent = 0;
        setIsHidden(false);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    // Browsers restore scroll position before React hydrates; measuring once
    // before paint stops the full masthead from flashing mid-document.
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [dockAt, revealFloor, intentThreshold]);

  return { mode, isHidden, modeRef };
}
