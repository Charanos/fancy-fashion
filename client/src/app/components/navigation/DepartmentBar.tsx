"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { IconChevronDown } from "../icons";
import MegaMenuContent from "./MegaMenuContent";
import { DUR, EASE, motionDuration, useReducedMotion } from "./nav-motion";
import type { NavCategory } from "./nav-config";

type DepartmentBarProps = {
  categories: NavCategory[];
  pathname: string;
  /** `ribbon` = tier-three masthead bar. `compact` = docked console. */
  variant: "ribbon" | "compact";
  /** False while this bar belongs to the inert (off-state) header panel. */
  live: boolean;
  className?: string;
};

/** Hover-intent windows, in ms. Opening is deliberate; closing is forgiving. */
const OPEN_DELAY = 90;
const CLOSE_DELAY = 170;
const VIEWPORT_GUTTER = 16;

export default function DepartmentBar({
  categories,
  pathname,
  variant,
  live,
  className = "",
}: DepartmentBarProps) {
  const panelDomId = useId();
  const reduced = useReducedMotion();

  // `open` drives behaviour; `rendered` keeps the outgoing panel on screen for
  // the duration of its exit tween. Both move in one setState so a render never
  // observes an open menu with no content.
  const [menu, setMenu] = useState<{
    open: string | null;
    rendered: NavCategory | null;
  }>({ open: null, rendered: null });

  // Bumped by the ResizeObserver so the indicator and panel re-measure on
  // reflow (font loading, zoom, window resize) instead of drifting.
  const [geometryTick, setGeometryTick] = useState(0);

  const rootRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasOpen = useRef(false);
  const indicatorReady = useRef(false);

  const activeCategory = categories.find(
    (category) => pathname === category.href || pathname.startsWith(`${category.href}/`)
  );
  const indicatorKey = menu.open ?? activeCategory?.id ?? null;

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  const openMenu = useCallback(
    (category: NavCategory) => {
      clearTimers();
      setMenu({ open: category.id, rendered: category });
    },
    [clearTimers]
  );

  const closeMenu = useCallback(() => {
    clearTimers();
    setMenu((current) =>
      current.open === null ? current : { open: null, rendered: current.rendered }
    );
  }, [clearTimers]);

  /** Called by the exit tween once the panel is fully hidden. */
  const releaseRendered = useCallback(() => {
    setMenu((current) => (current.open ? current : { open: null, rendered: null }));
  }, []);

  const scheduleOpen = useCallback(
    (category: NavCategory) => {
      clearTimers();
      // If a panel is already showing, switching should feel instantaneous; the
      // intent delay only guards the first open.
      if (menu.open) {
        setMenu({ open: category.id, rendered: category });
        return;
      }
      openTimer.current = setTimeout(
        () => setMenu({ open: category.id, rendered: category }),
        OPEN_DELAY
      );
    },
    [clearTimers, menu.open]
  );

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(closeMenu, CLOSE_DELAY);
  }, [clearTimers, closeMenu]);

  useEffect(() => clearTimers, [clearTimers]);

  // Collapse whenever this bar stops being the interactive one, and on
  // navigation so a stale panel never survives a route change.
  useEffect(() => {
    if (!live) closeMenu();
  }, [live, closeMenu]);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // Pointer-down anywhere outside collapses the panel.
  useEffect(() => {
    if (!menu.open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeMenu();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menu.open, closeMenu]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setGeometryTick((tick) => tick + 1));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  /** Centres the panel under its trigger, then clamps it inside the viewport. */
  const resolvePanelX = (trigger: HTMLElement, panel: HTMLElement) => {
    const root = rootRef.current;
    if (!root) return 0;

    const panelWidth = panel.offsetWidth;
    const rootLeft = root.getBoundingClientRect().left;
    const desired =
      trigger.offsetLeft + trigger.offsetWidth / 2 - panelWidth / 2;

    const minX = VIEWPORT_GUTTER - rootLeft;
    const maxX = window.innerWidth - VIEWPORT_GUTTER - panelWidth - rootLeft;

    return Math.min(Math.max(desired, minX), Math.max(minX, maxX));
  };

  // ── Panel motion ───────────────────────────────────────────────────────────
  useGSAP(
    () => {
      const panel = panelRef.current;
      const content = contentRef.current;
      if (!panel || !content) return;

      const key = menu.open;

      if (!key) {
        if (!wasOpen.current) {
          gsap.set(panel, { autoAlpha: 0 });
          return;
        }
        wasOpen.current = false;
        gsap.to(panel, {
          autoAlpha: 0,
          y: -8,
          scale: 0.98,
          duration: motionDuration(reduced, DUR.fast),
          ease: EASE.in,
          overwrite: "auto",
          onComplete: releaseRendered,
        });
        return;
      }

      const trigger = triggerRefs.current[key];
      if (!trigger) return;

      const x = resolvePanelX(trigger, panel);
      const height = content.offsetHeight;
      const settleHeight = () => gsap.set(panel, { height: "auto" });

      if (!wasOpen.current) {
        wasOpen.current = true;
        gsap.set(panel, { x, height, transformOrigin: "top center" });
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: -12, scale: 0.975 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: motionDuration(reduced, DUR.base),
            ease: EASE.out,
            overwrite: "auto",
            onComplete: settleHeight,
          }
        );
        gsap.fromTo(
          content.querySelectorAll("[data-mega-stagger]"),
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: motionDuration(reduced, DUR.base),
            stagger: reduced ? 0 : 0.03,
            delay: reduced ? 0 : 0.05,
            ease: EASE.out,
            overwrite: "auto",
          }
        );
        return;
      }

      // Already open: glide to the new department rather than blink out and in.
      gsap.to(panel, {
        x,
        height,
        duration: motionDuration(reduced, DUR.base),
        ease: EASE.glide,
        overwrite: "auto",
        onComplete: settleHeight,
      });
      gsap.fromTo(
        content,
        { autoAlpha: 0, y: 6 },
        {
          autoAlpha: 1,
          y: 0,
          duration: motionDuration(reduced, DUR.fast),
          ease: EASE.out,
          overwrite: "auto",
        }
      );
    },
    { dependencies: [menu.open, reduced, geometryTick], scope: rootRef }
  );

  // ── Sliding active/hover indicator ─────────────────────────────────────────
  useGSAP(
    () => {
      const indicator = indicatorRef.current;
      if (!indicator) return;

      const trigger = indicatorKey ? triggerRefs.current[indicatorKey] : null;

      if (!trigger) {
        indicatorReady.current = false;
        gsap.to(indicator, {
          autoAlpha: 0,
          duration: motionDuration(reduced, DUR.fast),
          overwrite: "auto",
        });
        return;
      }

      const target = { x: trigger.offsetLeft, width: trigger.offsetWidth };
      const isFirstPlacement = !indicatorReady.current;
      indicatorReady.current = true;

      if (isFirstPlacement || reduced) {
        gsap.set(indicator, { ...target, autoAlpha: 1 });
        return;
      }

      gsap.to(indicator, {
        ...target,
        autoAlpha: 1,
        duration: DUR.base,
        ease: EASE.glide,
        overwrite: "auto",
      });
    },
    { dependencies: [indicatorKey, reduced, geometryTick], scope: rootRef }
  );

  const focusTriggerAt = (index: number) => {
    const category = categories[(index + categories.length) % categories.length];
    triggerRefs.current[category.id]?.focus();
    return category;
  };

  const focusFirstPanelItem = () => {
    requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLElement>('a[href], button:not([disabled])')
        ?.focus();
    });
  };

  const onTriggerKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    category: NavCategory,
    index: number
  ) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowLeft": {
        event.preventDefault();
        const next = focusTriggerAt(index + (event.key === "ArrowRight" ? 1 : -1));
        if (menu.open) openMenu(next);
        break;
      }
      case "Home":
        event.preventDefault();
        focusTriggerAt(0);
        break;
      case "End":
        event.preventDefault();
        focusTriggerAt(categories.length - 1);
        break;
      case "ArrowDown":
        event.preventDefault();
        openMenu(category);
        focusFirstPanelItem();
        break;
      case "Escape":
        if (menu.open) {
          event.preventDefault();
          closeMenu();
        }
        break;
      default:
        break;
    }
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    const key = menu.open;
    closeMenu();
    if (key) triggerRefs.current[key]?.focus();
  };

  // Tabbing (or clicking) out of the whole bar collapses the panel.
  const onBarBlur = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && rootRef.current?.contains(next)) return;
    closeMenu();
  };

  const isCompact = variant === "compact";

  return (
    <nav
      ref={rootRef}
      aria-label="Catalogue departments"
      data-variant={variant}
      className={`nav-department-bar relative ${className}`}
      onMouseLeave={scheduleClose}
      onBlur={onBarBlur}
    >
      {/* Compact gaps are deliberately tighter: at xl the console shows all five
          full labels next to the emblem and the action cluster, and this is the
          spacing that still leaves headroom at 1280px. */}
      <ul className={`flex items-center ${isCompact ? "gap-6 xl:gap-7" : "gap-8 xl:gap-12"}`}>
        {categories.map((category, index) => {
          const isCurrent = activeCategory?.id === category.id;
          const isOpen = menu.open === category.id;

          return (
            <li key={category.id}>
              <button
                ref={(node) => {
                  triggerRefs.current[category.id] = node;
                }}
                type="button"
                className="department-trigger group"
                data-current={isCurrent ? "true" : undefined}
                data-open={isOpen ? "true" : undefined}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-controls={isOpen ? panelDomId : undefined}
                onClick={() => (isOpen ? closeMenu() : openMenu(category))}
                onMouseEnter={() => scheduleOpen(category)}
                onKeyDown={(event) => onTriggerKeyDown(event, category, index)}
                /* The docked console falls back to a condensed label between lg
                   and xl, where five full names will not fit beside the emblem
                   and the action cluster. The accessible name stays the full
                   label; `shortLabel` is a prefix of it, so WCAG 2.5.3 (Label
                   in Name) still holds. */
                aria-label={isCompact ? category.label : undefined}
              >
                {isCompact ? (
                  <>
                    <span className="whitespace-nowrap xl:hidden">
                      {category.shortLabel}
                    </span>
                    <span className="hidden whitespace-nowrap xl:inline">
                      {category.label}
                    </span>
                  </>
                ) : (
                  <span className="whitespace-nowrap">{category.label}</span>
                )}
                <IconChevronDown
                  className={`shrink-0 transition-transform duration-200 ${
                    isCompact ? "size-2.5" : "size-3"
                  } ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </li>
          );
        })}
      </ul>

      <span
        ref={indicatorRef}
        className="department-indicator"
        data-variant={variant}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        id={panelDomId}
        className="mega-panel"
        data-variant={variant}
        inert={!menu.open}
        onMouseEnter={clearTimers}
        onKeyDown={onPanelKeyDown}
      >
        <div ref={contentRef} className="mega-panel-inner">
          {menu.rendered && (
            <MegaMenuContent
              category={menu.rendered}
              variant={variant}
              pathname={pathname}
              onNavigate={closeMenu}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
