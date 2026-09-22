"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CartDrawer from "./CartDrawer";
import { IconTruck } from "./icons";
import { useCart } from "./products/cart-store";
import ActionCluster from "./navigation/ActionCluster";
import BrandLockup from "./navigation/BrandLockup";
import DepartmentBar from "./navigation/DepartmentBar";
import MobileDrawer from "./navigation/MobileDrawer";
import SearchPalette from "./navigation/SearchPalette";
import SearchTrigger from "./navigation/SearchTrigger";
import {
  NAVIGATION_CATEGORIES,
  STORE_IDENTITY,
  UTILITY_LINKS,
} from "./navigation/nav-config";
import { DUR, EASE, useReducedMotion } from "./navigation/nav-motion";
import { useHeaderScroll } from "./navigation/useHeaderScroll";

type QuickTo = ReturnType<typeof gsap.quickTo>;

/**
 * Site header.
 *
 * Three presentations, one source of truth:
 *
 *  • `rail`     — below `lg`, a single always-stable control bar plus a drawer.
 *  • `expanded` — at `lg`+ and at the top of the document, the three-tier
 *                 editorial masthead (utility strip, grand lockup, departments).
 *  • `docked`   — at `lg`+ once scrolled, a floating frosted console.
 *
 * Both desktop presentations stay mounted and are cross-faded by GSAP; the
 * inactive one is `inert` and `visibility: hidden`, so exactly one of them is
 * ever in the accessibility tree or the tab order. Which presentation shows is
 * decided by CSS breakpoints rather than a measured viewport, so the first
 * paint is correct on the server and there is no hydration flash.
 */
const Navbar = () => {
  const pathname = usePathname();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // The badge reflects the real basket now, not a hardcoded 2. Drawer
  // visibility lives in the store too, so a product page can open the bag.
  const {
    count: cartCount,
    isDrawerOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useCart();

  const headerRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const dockedRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerY = useRef<QuickTo | null>(null);
  const isFirstModeRun = useRef(true);

  const reduced = useReducedMotion();

  const { mode, isHidden } = useHeaderScroll();

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);

  // ── Global shortcuts ───────────────────────────────────────────────────────
  useEffect(() => {
    const isTypingTarget = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el) return false;
      return (
        el.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen((open) => !open);
        return;
      }
      // "/" is the storefront convention for jump-to-search.
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !isTypingTarget(event.target)) {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Close the drawer on navigation and when the viewport grows into the
  // desktop layouts, where the drawer has no trigger to return focus to.
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      if (query.matches) setIsDrawerOpen(false);
    };
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // ── Header reveal / hide ───────────────────────────────────────────────────
  useGSAP(() => {
    if (!headerRef.current) return;
    // quickTo reuses one tween instance, so rapid scroll reversals retarget an
    // existing animation instead of allocating a new one per flip.
    headerY.current = gsap.quickTo(headerRef.current, "y", {
      duration: DUR.slow,
      ease: EASE.out,
      overwrite: "auto",
    });
  }, []);

  useGSAP(
    () => {
      const header = headerRef.current;
      const setY = headerY.current;
      if (!header || !setY) return;

      if (!isHidden) {
        if (reduced) gsap.set(header, { y: 0 });
        else setY(0);
        return;
      }

      // Travel only as far as the visible surface actually needs: the docked
      // pill is a fraction of the masthead's height, and animating the full
      // header box would make it crawl off screen.
      const surface =
        (mode === "expanded" ? expandedRef.current : dockedRef.current)
          ?.offsetHeight || railRef.current?.offsetHeight || 96;

      if (reduced) gsap.set(header, { y: -(surface + 24) });
      else setY(-(surface + 24));
    },
    { dependencies: [isHidden, mode, reduced] }
  );

  // ── Expanded ⇄ docked cross-fade ───────────────────────────────────────────
  useGSAP(
    () => {
      const expanded = expandedRef.current;
      const docked = dockedRef.current;
      if (!expanded || !docked) return;

      const incoming = mode === "expanded" ? expanded : docked;
      const outgoing = mode === "expanded" ? docked : expanded;

      if (isFirstModeRun.current || reduced) {
        isFirstModeRun.current = false;
        gsap.set(incoming, { autoAlpha: 1, y: 0 });
        gsap.set(outgoing, { autoAlpha: 0, y: 0 });
        return;
      }

      gsap
        .timeline({ defaults: { overwrite: "auto" } })
        .to(
          outgoing,
          {
            autoAlpha: 0,
            y: mode === "expanded" ? 8 : -8,
            duration: DUR.fast,
            ease: EASE.in,
          },
          0
        )
        .fromTo(
          incoming,
          { autoAlpha: 0, y: mode === "expanded" ? -12 : 12 },
          { autoAlpha: 1, y: 0, duration: DUR.slow, ease: EASE.out },
          0.05
        );
    },
    { dependencies: [mode, reduced] }
  );

  // ── Publish the real header height as --nav-h ──────────────────────────────
  // Page content offsets itself with this token. Measuring the live masthead
  // keeps the hero aligned when fonts load or the utility strip wraps, and it
  // deliberately tracks the *expanded* height so docking never shifts layout.
  useEffect(() => {
    const root = document.documentElement;

    const publishHeight = () => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      const surface = isDesktop ? expandedRef.current : railRef.current;
      const height = surface?.offsetHeight ?? 0;
      if (height > 0) root.style.setProperty("--nav-h", `${Math.round(height)}px`);
    };

    publishHeight();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(publishHeight)
        : null;
    if (expandedRef.current) observer?.observe(expandedRef.current);
    if (railRef.current) observer?.observe(railRef.current);
    window.addEventListener("resize", publishHeight);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", publishHeight);
      root.style.removeProperty("--nav-h");
    };
  }, []);

  const expandedIsLive = mode === "expanded" && !isHidden;
  const dockedIsLive = mode === "docked" && !isHidden;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header ref={headerRef} className="site-header" data-mode={mode}>
        {/* ─── Below lg: one stable control bar, identical at every scroll depth ── */}
        <div ref={railRef} className="nav-rail lg:hidden">
          <div className="nav-rail-surface">
            <BrandLockup variant="mark" wordmark="sm" markSize={30} />

            {/* From sm the field takes the slack; below it the glyph joins the
                right-hand cluster so the rail reads as brand | actions. */}
            <SearchTrigger
              variant="field"
              onOpen={openSearch}
              className="hidden min-w-0 flex-1 sm:flex"
            />

            <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
              <SearchTrigger
                variant="glyph"
                onOpen={openSearch}
                glyphSize={17}
                className="sm:hidden"
              />

              <ActionCluster
                cartCount={cartCount}
                onOpenCart={openCart}
                onToggleMenu={() => setIsDrawerOpen((open) => !open)}
                isMenuOpen={isDrawerOpen}
                menuButtonRef={menuButtonRef}
                glyphSize={17}
                showBagLabel={false}
                showAccount={false}
                className="gap-1.5 sm:gap-2"
              />
            </div>
          </div>
        </div>

        {/* ─── lg+ / top of document: three-tier editorial masthead ───────────── */}
        <div
          ref={expandedRef}
          className="nav-panel nav-panel-expanded hidden lg:block"
          inert={!expandedIsLive}
        >
          {/* Tier 1 — dispatch & service strip */}
          <div className="nav-tier nav-tier-utility">
            <div className="nav-tier-inner flex items-center justify-between text-xs">
              <p className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 font-sans text-[11px] font-medium text-neutral-700">
                  <span className="nav-live-dot" aria-hidden="true" />
                  {STORE_IDENTITY.deliveryNotice}
                </span>
                <span className="hidden text-neutral-300 xl:inline" aria-hidden="true">
                  •
                </span>
                <span className="hidden items-center gap-1 font-sans text-[11px] text-neutral-500 xl:inline-flex">
                  <IconTruck className="size-3 text-neutral-400" aria-hidden="true" />
                  {STORE_IDENTITY.deliveryWindow}
                </span>
              </p>

              <div className="flex items-center gap-4 font-sans text-[11px] text-neutral-500">
                {UTILITY_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition-colors hover:text-neutral-900"
                  >
                    {link.name}
                  </Link>
                ))}
                <span className="text-neutral-300" aria-hidden="true">
                  |
                </span>
                <span className="numerals font-mono font-medium text-neutral-700">
                  {STORE_IDENTITY.currency}
                </span>
              </div>
            </div>
          </div>

          {/* Tier 2 — grand lockup, flanked by search and actions */}
          <div className="nav-tier-inner flex items-center justify-between gap-6 py-4">
            <div className="flex flex-1 items-center justify-start">
              <SearchTrigger
                variant="field"
                onOpen={openSearch}
                className="w-56 xl:w-72"
              />
            </div>

            <BrandLockup variant="grand" />

            <div className="flex flex-1 items-center justify-end">
              <ActionCluster
                cartCount={cartCount}
                onOpenCart={openCart}
                glyphSize={18}
              />
            </div>
          </div>

          {/* Tier 3 — department ribbon */}
          <div className="nav-tier nav-tier-departments">
            <div className="nav-tier-inner flex justify-center">
              <DepartmentBar
                categories={NAVIGATION_CATEGORIES}
                pathname={pathname}
                variant="ribbon"
                live={expandedIsLive}
              />
            </div>
          </div>
        </div>

        {/* ─── lg+ / scrolled: floating console ───────────────────────────────── */}
        <div
          ref={dockedRef}
          className="nav-panel nav-panel-docked hidden lg:block"
          inert={!dockedIsLive}
        >
          <div className="nav-docked-inner">
            <div className="nav-docked">
              {/* Emblem only when docked — the wordmark belongs to the full
                  masthead, and dropping it buys the departments real room. */}
              <BrandLockup variant="mark" wordmark="none" markSize={34} />

              <DepartmentBar
                categories={NAVIGATION_CATEGORIES}
                pathname={pathname}
                variant="compact"
                live={dockedIsLive}
                className="mx-6 flex-1 justify-center"
              />

              <ActionCluster
                cartCount={cartCount}
                onOpenCart={openCart}
                onOpenSearch={openSearch}
                glyphSize={17}
              />
            </div>
          </div>
        </div>
      </header>

      {/* One live region for the whole header; the two desktop panels would
          otherwise announce every bag change twice. */}
      <span className="sr-only" role="status" aria-live="polite">
        {cartCount} {cartCount === 1 ? "item" : "items"} in your bag
      </span>

      <MobileDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenSearch={openSearch}
        categories={NAVIGATION_CATEGORIES}
        pathname={pathname}
        triggerRef={menuButtonRef}
      />

      <SearchPalette open={isSearchOpen} onClose={closeSearch} />

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Navbar;
