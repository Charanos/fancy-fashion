"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function focusableWithin(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE)
  ).filter(
    (el) =>
      !el.hasAttribute("inert") &&
      el.getAttribute("aria-hidden") !== "true" &&
      // offsetParent is null for anything display:none or inside a hidden tree.
      (el.offsetParent !== null || el === document.activeElement)
  );
}

type FocusTrapOptions = {
  /** Element focus returns to when the trap releases — usually the trigger. */
  restoreTo?: RefObject<HTMLElement | null>;
  /** Move focus to the first focusable child when the trap engages. */
  autoFocus?: boolean;
};

/**
 * Confines Tab/Shift+Tab to `containerRef` while `active`, then hands focus back
 * to whatever opened the overlay. Without this, tabbing out of the drawer lands
 * on page content that is visually covered — the classic slide-over bug.
 */
export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  { restoreTo, autoFocus = true }: FocusTrapOptions = {}
) {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    if (autoFocus) {
      // Wait a frame so entry animations do not fight the scroll-into-view that
      // focus can trigger.
      requestAnimationFrame(() => {
        const [first] = focusableWithin(container);
        (first ?? container).focus({ preventScroll: true });
      });
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusable = focusableWithin(container);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeEl = document.activeElement;

      if (event.shiftKey && (activeEl === first || !container.contains(activeEl))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && activeEl === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      // Reading `restoreTo.current` at teardown is deliberate: the trigger may
      // have re-rendered (or moved between header states) while the overlay was
      // open, and focus must go to whichever node is live *now*.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const target = restoreTo?.current ?? previouslyFocused;
      const activeEl = document.activeElement;
      // Only pull focus back if it is still inside the overlay being closed (or
      // nowhere at all). If the user has already clicked elsewhere, leave them.
      const focusWasInside =
        activeEl === null ||
        activeEl === document.body ||
        container.contains(activeEl);

      if (target && focusWasInside) {
        target.focus({ preventScroll: true });
      }
    };
  }, [active, autoFocus, containerRef, restoreTo]);
}
