"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Registering useGSAP once keeps every navigation animation inside a gsap
// context, so each one is reverted automatically when its owner unmounts.
gsap.registerPlugin(useGSAP);

/**
 * A single motion vocabulary for the whole header. Sharing these tokens is what
 * makes the masthead, the mega menu and the drawer feel like one mechanism
 * instead of three components that happen to animate.
 */
export const EASE = {
  /** Default: decelerates hard, arrives calm. Used for anything entering. */
  out: "power3.out",
  /** Exits — quicker off the screen than on to keep the UI feeling responsive. */
  in: "power2.in",
  /** Positional travel (sliding indicator, mega-menu repositioning). */
  glide: "expo.out",
} as const;

export const DUR = {
  micro: 0.16,
  fast: 0.22,
  base: 0.32,
  slow: 0.44,
} as const;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Tracks the OS-level motion preference. Components read this to swap animated
 * timelines for instant `gsap.set` calls rather than merely shortening them,
 * which is what the spec actually asks for.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

/** Duration helper: collapses to an instant set when motion is reduced. */
export const motionDuration = (reduced: boolean, duration: number) =>
  reduced ? 0 : duration;
