"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { GlyphCompassLogo, GlyphSearch } from "../AppleGlyphs";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconChevronLeft,
  IconChevronRight,
  IconDeviceLaptop,
  IconKeyboard,
  IconLayoutGrid,
  IconNotebook,
  IconPrinter,
  IconScan,
  IconX,
} from "../icons";
import { DUR, EASE, useReducedMotion } from "./nav-motion";
import { STORE_IDENTITY } from "./nav-config";
import { useFocusTrap } from "./useFocusTrap";
import { useScrollLock } from "./useScrollLock";

interface SearchProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  material: string;
  badge?: string;
  keywords: string[];
}

interface CuratedFilter {
  id: string;
  label: string;
  query: string;
  icon: (props: { size?: number; className?: string }) => React.JSX.Element;
}

const SAMPLE_SEARCH_CATALOG: SearchProduct[] = [
  {
    id: 1,
    name: "HP Smart Tank 585 All-in-One",
    category: "Print & Scan",
    price: 31500,
    image: "/logo.png",
    material: "Wireless print, copy & scan",
    badge: "Bestseller",
    keywords: ["printer", "print", "copy", "scan", "hp", "ink"],
  },
  {
    id: 2,
    name: "Epson Perfection V39II Scanner",
    category: "Print & Scan",
    price: 18900,
    image: "/logo.png",
    material: "Slim A4 document scanning",
    badge: "Staff Pick",
    keywords: ["scanner", "scan", "document", "epson", "a4"],
  },
  {
    id: 3,
    name: "Lenovo V15 Gen 4 Laptop",
    category: "Computers & Tech",
    price: 68500,
    image: "/logo.png",
    material: "15.6-inch business laptop",
    badge: "Precision",
    keywords: ["laptop", "lenovo", "computer", "business", "tech"],
  },
  {
    id: 4,
    name: "Logitech MK270 Wireless Combo",
    category: "Computers & Tech",
    price: 4950,
    image: "/logo.png",
    material: "Wireless keyboard & mouse",
    badge: "Work ready",
    keywords: ["keyboard", "mouse", "logitech", "wireless", "accessories"],
  },
  {
    id: 5,
    name: "PaperOne A4 Copy Paper, 80gsm",
    category: "Office & Paper",
    price: 780,
    image: "/logo.png",
    material: "500 sheets · bright white",
    badge: "Everyday value",
    keywords: ["copy paper", "a4", "paper", "office", "printing"],
  },
  {
    id: 6,
    name: "Mesh Desk Organiser Set",
    category: "Workspace & School",
    price: 3250,
    image: "/logo.png",
    material: "Five-piece desktop organisation",
    badge: "Desk essential",
    keywords: ["desk", "organiser", "workspace", "office", "storage"],
  },
  {
    id: 7,
    name: "Fellowes LX25 Paper Shredder",
    category: "Workspace & School",
    price: 14200,
    image: "/logo.png",
    material: "Compact cross-cut document protection",
    badge: "Office security",
    keywords: ["shredder", "paper", "security", "workspace", "office"],
  },
  {
    id: 8,
    name: "Student Essentials Starter Kit",
    category: "Workspace & School",
    price: 1650,
    image: "/logo.png",
    material: "Exercise books, pens, pencils & geometry basics",
    badge: "School term ready",
    keywords: ["school", "student", "kit", "exercise", "pens"],
  },
];

const CURATED_BADGES: CuratedFilter[] = [
  {
    id: "printer",
    label: "Printers",
    query: "Printer",
    icon: ({ size = 11, className = "" }) => (
      <IconPrinter className={className} size={size} stroke={2} />
    ),
  },
  {
    id: "scanner",
    label: "Scanners",
    query: "Scanner",
    icon: ({ size = 11, className = "" }) => (
      <IconScan className={className} size={size} stroke={2} />
    ),
  },
  {
    id: "laptop",
    label: "Laptops",
    query: "Laptop",
    icon: ({ size = 11, className = "" }) => (
      <IconDeviceLaptop className={className} size={size} stroke={2} />
    ),
  },
  {
    id: "paper",
    label: "Copy Paper",
    query: "Copy Paper",
    icon: ({ size = 11, className = "" }) => (
      <IconNotebook className={className} size={size} stroke={2} />
    ),
  },
  {
    id: "keyboard",
    label: "Keyboards",
    query: "Keyboard",
    icon: ({ size = 11, className = "" }) => (
      <IconKeyboard className={className} size={size} stroke={2} />
    ),
  },
  {
    id: "school",
    label: "School Kit",
    query: "Student",
    icon: ({ size = 11, className = "" }) => (
      <IconLayoutGrid className={className} size={size} stroke={2} />
    ),
  },
];

const DEPARTMENTS = [
  {
    name: "Office & Paper",
    tag: "Paper",
    icon: IconNotebook,
    description: "Copy paper, files, forms and notebooks",
    count: "31 Items",
  },
  {
    name: "Print & Scan",
    tag: "Printer",
    icon: IconPrinter,
    description: "Printers, scanners, ink and toner",
    count: "18 Items",
  },
  {
    name: "Computers & Tech",
    tag: "Laptop",
    icon: IconDeviceLaptop,
    description: "Laptops, peripherals and power essentials",
    count: "14 Items",
  },
  {
    name: "Workspace & School",
    tag: "Desk",
    icon: IconKeyboard,
    description: "Organisation, school and desk essentials",
    count: "33 Items",
  },
];

const formatKsh = (amount: number) =>
  `KSh ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(amount)}`;

type SearchPaletteProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * The search palette is a single, controlled instance owned by `Navbar`. It used
 * to be bundled with its trigger, which meant every header state mounted its own
 * copy — and every copy registered its own ⌘K listener, so one keypress opened
 * several stacked modals. Splitting trigger from palette fixes that at the root.
 */
export default function SearchPalette({ open, onClose }: SearchPaletteProps) {
  const router = useRouter();
  const searchId = useId();
  const listboxId = `${searchId}-results`;
  const optionId = (index: number) => `${searchId}-option-${index}`;

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Curated ribbon overflow affordances
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useScrollLock(open);
  useFocusTrap(open, cardRef, { autoFocus: false });

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  const scrollRibbon = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -170 : 170,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  useEffect(() => {
    setMounted(true);
    setIsMac(/mac|iphone|ipad|ipod/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(checkScroll, 80);
    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScroll);
    };
  }, [open]);

  // Memoised so the keyboard handler below is not rebuilt on every render.
  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return SAMPLE_SEARCH_CATALOG.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.material.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [query]);

  const activeIndex =
    filteredResults.length === 0
      ? -1
      : Math.min(selectedIndex, filteredResults.length - 1);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (filteredResults.length === 0) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + filteredResults.length) % filteredResults.length
        );
      } else if (event.key === "Home") {
        event.preventDefault();
        setSelectedIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setSelectedIndex(filteredResults.length - 1);
      } else if (event.key === "Enter") {
        const target = filteredResults[activeIndex];
        if (!target) return;
        event.preventDefault();
        router.push(`/products/${target.id}`);
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filteredResults, activeIndex, onClose, router]);

  // Reset on open, clear on close.
  useEffect(() => {
    if (open) {
      setSelectedIndex(0);
      const timer = setTimeout(
        () => inputRef.current?.focus({ preventScroll: true }),
        reduced ? 0 : 60
      );
      return () => clearTimeout(timer);
    }
    setQuery("");
    setSelectedIndex(0);
  }, [open, reduced]);

  // Keep the keyboard-selected row inside the scroll viewport.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    resultsRef.current
      ?.querySelector<HTMLElement>(`#${CSS.escape(optionId(activeIndex))}`)
      ?.scrollIntoView({ block: "nearest" });
    // optionId is derived from a stable useId, so it is intentionally omitted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex]);

  useGSAP(
    () => {
      if (!open || !cardRef.current || !backdropRef.current) return;

      if (reduced) {
        gsap.set([backdropRef.current, cardRef.current], { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      gsap
        .timeline({ defaults: { ease: EASE.out, overwrite: "auto" } })
        .fromTo(
          backdropRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: DUR.base },
          0
        )
        .fromTo(
          cardRef.current,
          { autoAlpha: 0, y: -14, scale: 0.975 },
          { autoAlpha: 1, y: 0, scale: 1, duration: DUR.slow },
          0.03
        )
        .fromTo(
          cardRef.current.querySelectorAll("[data-palette-stagger]"),
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: DUR.base, stagger: 0.035 },
          0.12
        );
    },
    { dependencies: [open, reduced] }
  );

  if (!open || !mounted) return null;

  const hasQuery = query.trim() !== "";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-3 pt-12 sm:p-4 sm:pt-20 lg:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label={`Search the ${STORE_IDENTITY.name} catalogue`}
    >
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-stone-950/45 backdrop-blur-xl"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={cardRef}
        className="search-palette-card relative w-full max-w-2xl overflow-hidden rounded-[26px]"
      >
        {/* Query row */}
        <div className="relative flex items-center border-b border-stone-200/80 bg-white/40 px-4 py-4 sm:px-5">
          <div className="mr-3 shrink-0">
            <GlyphSearch size={22} className="text-stone-700" />
          </div>
          <input
            ref={inputRef}
            id={searchId}
            type="text"
            role="combobox"
            aria-expanded={filteredResults.length > 0}
            aria-controls={listboxId}
            aria-activedescendant={
              activeIndex >= 0 ? optionId(activeIndex) : undefined
            }
            aria-autocomplete="list"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search printers, laptops, paper, ink and supplies…"
            autoComplete="off"
            spellCheck="false"
            enterKeyHint="search"
            className="search-palette-input w-full border-none bg-transparent p-0 font-serif text-base tracking-tight text-stone-900 shadow-none outline-none placeholder:text-sm placeholder:text-stone-400 sm:text-lg sm:placeholder:text-base"
          />
          {hasQuery && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="mr-2.5 rounded-full p-1 text-stone-400 transition hover:bg-stone-200/70 hover:text-stone-700"
              aria-label="Clear query"
            >
              <IconX className="size-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-stone-300/80 bg-gradient-to-b from-white via-stone-50 to-stone-100/90 px-2.5 py-1 font-mono text-[10.5px] font-medium text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(20,18,14,0.06)] transition-all duration-200 hover:border-stone-400 hover:from-white hover:to-stone-200/80 hover:text-stone-950 hover:shadow-xs active:scale-95"
            aria-label="Close search"
            title="Press Escape to close"
          >
            <span className="flex size-3.5 items-center justify-center rounded-full bg-stone-200/70 font-sans text-[9px] text-stone-500 transition-colors group-hover:bg-stone-300 group-hover:text-stone-800">
              ⎋
            </span>
            <span className="font-mono text-[10px] tracking-wider uppercase">esc</span>
          </button>
        </div>

        {/* Curated shortcuts */}
        <div className="relative flex items-center border-b border-stone-200/60 bg-stone-100/40 px-3 py-2 select-none sm:px-4">
          <div className="mr-2 flex shrink-0 items-center gap-1 font-mono text-[10px] font-semibold tracking-wider text-stone-500 uppercase">
            <IconLayoutGrid className="size-3 shrink-0 text-amber-600" />
            <span className="hidden sm:inline">Popular:</span>
          </div>

          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollRibbon("left")}
              className="absolute left-16 z-10 flex size-5.5 items-center justify-center rounded-full border border-stone-300/80 bg-white/95 text-stone-600 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:border-stone-400 hover:text-stone-950 active:scale-95 sm:left-20"
              aria-label="Scroll shortcuts left"
            >
              <IconChevronLeft size={12} stroke={2.4} />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="edge-fade no-scrollbar flex flex-1 items-center gap-1.5 overflow-x-auto scroll-smooth py-0.5"
            data-fade-left={canScrollLeft ? "true" : "false"}
            data-fade-right={canScrollRight ? "true" : "false"}
          >
            {CURATED_BADGES.map((badge) => {
              const IconComp = badge.icon;
              const isActive =
                query.toLowerCase().trim() === badge.query.toLowerCase().trim();

              return (
                <button
                  key={badge.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setQuery(isActive ? "" : badge.query);
                    setSelectedIndex(0);
                    inputRef.current?.focus();
                  }}
                  className={`group inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[11px] font-medium transition-all duration-200 select-none sm:px-3 sm:text-xs ${
                    isActive
                      ? "border border-stone-900 bg-stone-900 text-stone-50 shadow-xs ring-1 ring-stone-900/10"
                      : "border border-stone-200/80 bg-white/75 text-stone-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(20,18,14,0.04)] hover:-translate-y-0.5 hover:border-stone-400/80 hover:bg-white hover:text-stone-950 hover:shadow-xs active:translate-y-0"
                  }`}
                >
                  <span
                    className={`flex size-4 items-center justify-center rounded-full transition-colors ${
                      isActive
                        ? "bg-stone-800 text-amber-300"
                        : "bg-stone-100 text-stone-500 group-hover:bg-stone-200/80 group-hover:text-stone-900"
                    }`}
                  >
                    <IconComp size={10.5} />
                  </span>
                  <span className="whitespace-nowrap">{badge.label}</span>
                </button>
              );
            })}
          </div>

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollRibbon("right")}
              className="absolute right-2 z-10 flex size-5.5 items-center justify-center rounded-full border border-stone-300/80 bg-white/95 text-stone-600 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:border-stone-400 hover:text-stone-950 active:scale-95 sm:right-3"
              aria-label="Scroll shortcuts right"
            >
              <IconChevronRight size={12} stroke={2.4} />
            </button>
          )}
        </div>

        {/* Body */}
        <div
          ref={resultsRef}
          className="search-palette-scroll max-h-[26rem] overflow-y-auto p-4 sm:p-5"
        >
          {!hasQuery ? (
            <div className="space-y-5">
              <div data-palette-stagger>
                <div className="flex items-center justify-between px-1 pb-2">
                  <span className="font-mono text-[10.5px] font-semibold tracking-wider text-stone-400 uppercase">
                    Explore store departments
                  </span>
                  <span className="font-sans text-[11px] text-stone-400">
                    Select to filter
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {DEPARTMENTS.map((dept) => {
                    const IconComponent = dept.icon;
                    return (
                      <button
                        key={dept.name}
                        type="button"
                        onClick={() => {
                          setQuery(dept.tag);
                          setSelectedIndex(0);
                          inputRef.current?.focus();
                        }}
                        className="group flex items-center justify-between rounded-2xl border border-stone-200/70 bg-white/70 p-3 text-left transition-all hover:border-stone-300 hover:bg-white hover:shadow-xs"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700 transition group-hover:bg-stone-900 group-hover:text-stone-50">
                            <IconComponent className="size-4.5" stroke={1.6} />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-title text-sm font-medium text-stone-900">
                              {dept.name}
                            </span>
                            <span className="block truncate font-sans text-[11px] text-stone-500">
                              {dept.description}
                            </span>
                          </span>
                        </span>
                        <span className="ml-2 shrink-0 font-mono text-[10px] text-stone-400 group-hover:text-stone-700">
                          {dept.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div data-palette-stagger>
                <div className="flex items-center justify-between px-1 pb-2">
                  <span className="font-mono text-[10.5px] font-semibold tracking-wider text-stone-400 uppercase">
                    Nairobi essentials &amp; bestsellers
                  </span>
                  <span className="font-serif text-[11px] text-amber-700 italic">
                    Ready for work
                  </span>
                </div>
                <div className="space-y-1.5">
                  {SAMPLE_SEARCH_CATALOG.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.id}`}
                      onClick={onClose}
                      className="group flex items-center justify-between rounded-2xl border border-transparent bg-white/50 p-2.5 transition-all hover:border-stone-200 hover:bg-white hover:shadow-xs"
                    >
                      <span className="flex min-w-0 items-center gap-3.5">
                        <span className="relative block size-12 shrink-0 overflow-hidden rounded-xl border border-stone-200/80 bg-stone-50">
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span className="truncate font-title text-sm font-medium text-stone-900">
                              {item.name}
                            </span>
                            {item.badge && (
                              <span className="inline-flex shrink-0 rounded-full bg-stone-100 px-2 font-mono text-[9.5px] font-medium text-stone-600">
                                {item.badge}
                              </span>
                            )}
                          </span>
                          <span className="block truncate font-sans text-xs text-stone-500">
                            {item.material}
                          </span>
                        </span>
                      </span>
                      <span className="ml-3 flex shrink-0 items-center gap-3">
                        <span className="numerals font-mono text-xs font-semibold text-stone-900">
                          {formatKsh(item.price)}
                        </span>
                        <IconArrowUpRight className="size-4 text-stone-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-stone-900" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl border border-stone-200/80 bg-white/80 shadow-2xs">
                <GlyphCompassLogo size={26} />
              </div>
              <p className="font-title text-base text-stone-900">
                No matching products found
              </p>
              <p className="mx-auto mt-1 max-w-sm font-sans text-xs leading-relaxed text-stone-500">
                We could not find a product matching &ldquo;{query}&rdquo;. Try{" "}
                <em>printer</em>, <em>laptop</em>, <em>paper</em>, or <em>scanner</em>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="mt-4 inline-flex items-center rounded-full border border-stone-300 bg-white px-3.5 py-1 text-xs font-medium text-stone-700 shadow-2xs hover:bg-stone-50 hover:text-stone-950"
              >
                Clear search &amp; browse catalogue
              </button>
            </div>
          ) : (
            <div id={listboxId} role="listbox" aria-label="Search results" className="space-y-1.5">
              <div className="flex items-center justify-between px-1 pb-1">
                <p className="font-mono text-[10.5px] font-semibold tracking-wider text-stone-400 uppercase">
                  Matching products ({filteredResults.length})
                </p>
                <p className="hidden font-sans text-[11px] text-stone-400 sm:block">
                  ↑ ↓ to navigate, ↵ to view
                </p>
              </div>

              {filteredResults.map((item, index) => {
                const isSelected = index === activeIndex;
                return (
                  <Link
                    key={item.id}
                    id={optionId(index)}
                    role="option"
                    aria-selected={isSelected}
                    href={`/products/${item.id}`}
                    onClick={onClose}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`group flex items-center justify-between rounded-2xl p-2.5 transition-all duration-150 ${
                      isSelected
                        ? "translate-x-0.5 border border-stone-300/80 bg-white shadow-xs"
                        : "border border-transparent bg-white/40 hover:border-stone-200 hover:bg-white/80"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-3.5">
                      <span className="relative block size-12 shrink-0 overflow-hidden rounded-xl border border-stone-200/80 bg-stone-50">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-2">
                          <span className="truncate font-title text-sm font-medium text-stone-900">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="hidden shrink-0 rounded-full bg-stone-100 px-2 font-mono text-[9px] font-medium text-stone-600 sm:inline-flex">
                              {item.badge}
                            </span>
                          )}
                        </span>
                        <span className="block truncate font-sans text-xs text-stone-500">
                          {item.category} • {item.material}
                        </span>
                      </span>
                    </span>
                    <span className="ml-3 flex shrink-0 items-center gap-3">
                      <span className="numerals font-mono text-xs font-semibold text-stone-900 sm:text-sm">
                        {formatKsh(item.price)}
                      </span>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-stone-900 px-2 py-0.5 font-mono text-[10px] font-medium text-stone-50 shadow-2xs">
                          <span>Open</span>
                          <span aria-hidden="true">↵</span>
                        </span>
                      ) : (
                        <IconArrowRight className="size-4 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-stone-900" />
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-stone-200/70 bg-stone-100/70 px-4 py-3 font-sans text-xs text-stone-500 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <kbd className="rounded border border-stone-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600 shadow-2xs">
                ↑
              </kbd>
              <kbd className="rounded border border-stone-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600 shadow-2xs">
                ↓
              </kbd>
              <span className="text-[11px] text-stone-500">Navigate</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <kbd className="rounded border border-stone-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600 shadow-2xs">
                ↵
              </kbd>
              <span className="text-[11px] text-stone-500">Select</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <kbd className="rounded border border-stone-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600 shadow-2xs">
                {isMac ? "⌘K" : "Ctrl K"}
              </kbd>
              <span className="text-[11px] text-stone-500">Toggle</span>
            </span>
          </div>
          <div className="hidden items-center gap-1.5 font-serif text-[11px] text-stone-400 italic sm:flex">
            <span>{STORE_IDENTITY.name}</span>
            <span className="opacity-50">•</span>
            <span>Nairobi catalogue</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
