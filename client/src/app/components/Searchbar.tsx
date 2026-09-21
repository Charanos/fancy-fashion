"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GlyphCompassLogo, GlyphSearch } from "./AppleGlyphs";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconChevronLeft,
  IconChevronRight,
  IconNotebook,
  IconPalette,
  IconPencil,
  IconRulerMeasure,
  IconLayoutGrid,
  IconX,
} from "./icons";

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
    name: "Architectural Grid Notebook A5",
    category: "Hardcover & Paper",
    price: 34.0,
    image: "/products/1g.png",
    material: "120gsm Japanese Mill Paper · Smyth Sewn",
    badge: "Bestseller",
    keywords: ["grid", "notebook", "paper", "journal", "sketchbook", "a5"],
  },
  {
    id: 2,
    name: "Raw Brass Rollerball & Nib Kit",
    category: "Writing Instruments",
    price: 58.0,
    image: "/products/2g.png",
    material: "Solid Untreated Brass · German Ceramic Refill",
    badge: "Staff Pick",
    keywords: ["brass", "rollerball", "pen", "nib", "ink", "writing"],
  },
  {
    id: 3,
    name: "French Boxwood Drafting Ruler 30cm",
    category: "Desk Architecture",
    price: 24.5,
    image: "/products/3gr.png",
    material: "Beveled Pearwood & Metric Grading",
    badge: "Precision",
    keywords: ["ruler", "boxwood", "drafting", "metric", "desk", "wood"],
  },
  {
    id: 4,
    name: "Sumi Archival Calligraphy Ink 60ml",
    category: "Art & Studio",
    price: 29.0,
    image: "/products/4w.png",
    material: "Hand-ground Pine Soot · Deep Matte Obsidian",
    badge: "Archival",
    keywords: ["ink", "sumi", "calligraphy", "black", "art", "pigment"],
  },
  {
    id: 5,
    name: "Linen Bound Daily Desk Journal",
    category: "Hardcover & Paper",
    price: 42.0,
    image: "/products/5r.png",
    material: "Belgian Natural Flax · Cream Acid-Free Pages",
    badge: "New Edition",
    keywords: ["linen", "journal", "diary", "desk", "paper", "bound"],
  },
  {
    id: 6,
    name: "Precision Aluminum Compass & Dividers",
    category: "Desk Architecture",
    price: 49.0,
    image: "/products/6g.png",
    material: "Anodized Matte Aluminum · Micro-adjustment Wheel",
    badge: "Heritage",
    keywords: ["compass", "divider", "geometry", "architecture", "tool", "aluminum"],
  },
  {
    id: 7,
    name: "Handmade Ceramic Water Reservoir & Brush Rest",
    category: "Art & Studio",
    price: 36.0,
    image: "/products/7g.png",
    material: "Stoneware Matte Glaze · Double Nib Cradle",
    badge: "Artisanal",
    keywords: ["ceramic", "brush", "rest", "palette", "water", "stone"],
  },
  {
    id: 8,
    name: "Atelier Curated Calligrapher's Gift Set",
    category: "Curated Sets",
    price: 110.0,
    image: "/products/8b.png",
    material: "Boxwood, Ink, Nib & Japanese Mill Pad",
    badge: "Limited Atelier",
    keywords: ["set", "gift", "kit", "calligraphy", "collection", "curated"],
  },
];

const CURATED_BADGES: CuratedFilter[] = [
  {
    id: "notebook",
    label: "Grid Notebook",
    query: "Grid Notebook",
    icon: ({ size = 11, className = "" }) => (
      <IconNotebook className={className} size={size} stroke={2} />
    ),
  },
  {
    id: "brass",
    label: "Raw Brass",
    query: "Raw Brass",
    icon: ({ size = 11, className = "" }) => (
      <IconPencil className={className} size={size} stroke={2} />
    ),
  },
  {
    id: "boxwood",
    label: "French Boxwood",
    query: "French Boxwood",
    icon: ({ size = 11, className = "" }) => (
      <IconRulerMeasure className={className} size={size} stroke={2} />
    ),
  },
  {
    id: "ink",
    label: "Sumi Ink",
    query: "Sumi Ink",
    icon: ({ size = 11, className = "" }) => (
      <IconPalette className={className} size={size} stroke={2} />
    ),
  },
  {
    id: "compass",
    label: "Compass & Dividers",
    query: "Compass",
    icon: ({ size = 12 }) => <GlyphCompassLogo size={size} />,
  },
  {
    id: "sets",
    label: "Curated Sets",
    query: "Sets",
    icon: ({ size = 11, className = "" }) => (
      <IconLayoutGrid className={className} size={size} stroke={2} />
    ),
  },
];

const DEPARTMENTS = [
  {
    name: "Hardcover & Paper",
    tag: "Notebook",
    icon: IconNotebook,
    description: "Japanese grid, ruled & Smyth-sewn journals",
    count: "12 Items",
  },
  {
    name: "Writing Instruments",
    tag: "Rollerball",
    icon: IconPencil,
    description: "Raw brass, nibs & ceramic refills",
    count: "8 Instruments",
  },
  {
    name: "Desk Architecture",
    tag: "Drafting",
    icon: IconRulerMeasure,
    description: "Boxwood rulers, dividers & trays",
    count: "14 Tools",
  },
  {
    name: "Art & Archival Inks",
    tag: "Ink",
    icon: IconPalette,
    description: "Pine-soot Sumi, brush rests & pigments",
    count: "9 Formulas",
  },
];

export default function Searchbar({
  variant = "inline",
}: {
  variant?: "inline" | "button";
}) {
  const router = useRouter();
  const searchId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Curated ribbon scroll & overflow visibility state
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
    }
  };

  const scrollRibbon = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -170 : 170;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  useEffect(() => {
    setMounted(true);
    setIsMac(
      typeof window !== "undefined" &&
        navigator.userAgent.toUpperCase().indexOf("MAC") >= 0
    );
  }, []);

  // Update overflow indicators when modal opens or query/resize changes
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(checkScroll, 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  // Filter products based on query
  const filteredResults = query.trim()
    ? SAMPLE_SEARCH_CATALOG.filter((item) => {
        const q = query.toLowerCase().trim();
        return (
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.material.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
    : [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search modal with Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (filteredResults.length > 0) {
          setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (filteredResults.length > 0) {
          setSelectedIndex(
            (prev) => (prev - 1 + filteredResults.length) % filteredResults.length
          );
        }
      } else if (e.key === "Enter") {
        if (filteredResults.length > 0 && filteredResults[selectedIndex]) {
          e.preventDefault();
          router.push(`/products/${filteredResults[selectedIndex].id}`);
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, router]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Focus and selection reset on open
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 30);
      return () => clearTimeout(timer);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  return (
    <>
      {/* Search Trigger (Inline or Button) */}
      {variant === "inline" ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex h-9.5 w-40 sm:w-48 lg:w-72 items-center justify-between rounded-full border border-stone-300/70 bg-white/50 px-3.5 text-left text-neutral-600 shadow-2xs backdrop-blur-md transition-all hover:border-stone-400/90 hover:bg-white/80 hover:shadow-xs focus:outline-none"
          aria-label="Search stationery catalogue"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <GlyphSearch
              size={15}
              className="shrink-0 text-neutral-600 transition group-hover:scale-105"
            />
            <span className="truncate text-xs text-neutral-400 font-sans group-hover:text-neutral-700">
              Search instruments, inks, paper...
            </span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 rounded-md border border-neutral-300/70 bg-white/80 px-1.5 py-0.5 font-mono text-[9.5px] font-medium text-neutral-500 shadow-2xs group-hover:text-neutral-700">
            <span>{isMac ? "⌘" : "Ctrl"}</span>
            <span>K</span>
          </kbd>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="apple-glyph-btn group"
          aria-label="Search catalogue"
        >
          <GlyphSearch size={18} />
        </button>
      )}

      {/* Luxury Command Palette Modal Teleported to Document Body */}
      {isOpen &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center p-3 sm:p-4 pt-12 sm:pt-20 lg:pt-24"
            role="dialog"
            aria-modal="true"
            aria-label="Search Atelier Catalogue"
          >
            {/* Fullscreen Backdrop Blur Covering 100% of the Viewport */}
            <div
              className="fixed inset-0 bg-stone-950/45 backdrop-blur-xl transition-all duration-300 animate-in fade-in"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Precision Spotlight Floating Card */}
            <div
              className="relative w-full max-w-2xl overflow-hidden rounded-[26px] border border-white/85 bg-[#faf8f5]/96 backdrop-blur-3xl transition-all animate-in fade-in zoom-in-98 duration-200 shadow-2xl"
              style={{
                boxShadow:
                  "inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 1), inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 25px 60px -15px rgba(25, 22, 18, 0.28), 0 8px 24px -4px rgba(25, 22, 18, 0.12)",
              }}
            >
              {/* Search Input Bar */}
              <div className="relative flex items-center px-4 sm:px-5 py-4 border-b border-stone-200/80 bg-white/40">
                <div className="mr-3 shrink-0">
                  <GlyphSearch size={22} className="text-stone-700" />
                </div>
                <input
                  ref={inputRef}
                  id={searchId}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Search notebooks, raw brass, desk architecture, inks..."
                  autoComplete="off"
                  spellCheck="false"
                  className="search-palette-input w-full bg-transparent text-base sm:text-lg text-stone-900 placeholder:text-stone-400 placeholder:text-sm sm:placeholder:text-base font-serif tracking-tight border-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 shadow-none p-0"
                  style={{
                    outline: "none",
                    border: "none",
                    boxShadow: "none",
                  }}
                />
                {query && (
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

                {/* Sleek Minimalistic Glyphy ESC Badge */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-stone-300/80 bg-gradient-to-b from-white via-stone-50 to-stone-100/90 px-2.5 py-1 text-[10.5px] font-mono font-medium text-stone-600 shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(20,18,14,0.06)] transition-all duration-200 hover:border-stone-400 hover:from-white hover:to-stone-200/80 hover:text-stone-950 hover:shadow-xs active:scale-95 active:shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] shrink-0"
                  aria-label="Close search modal"
                  title="Press Escape to close"
                >
                  <span className="flex size-3.5 items-center justify-center rounded-full bg-stone-200/70 text-[9px] text-stone-500 transition-colors group-hover:bg-stone-300 group-hover:text-stone-800 font-sans">
                    ⎋
                  </span>
                  <span className="tracking-wider uppercase font-mono text-[10px]">esc</span>
                </button>
              </div>

              {/* Curated Discoveries Bar (Edge Fades & Overflow Affordance) */}
              <div className="relative flex items-center border-b border-stone-200/60 bg-stone-100/40 px-3 sm:px-4 py-2 select-none">
                <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-stone-500 font-mono shrink-0 mr-2">
                  <IconLayoutGrid className="size-3 text-amber-600 shrink-0" />
                  <span className="hidden xs:inline">Curated:</span>
                </div>

                {/* Left Micro-Glide Arrow */}
                {canScrollLeft && (
                  <button
                    type="button"
                    onClick={() => scrollRibbon("left")}
                    className="absolute left-16 sm:left-20 z-10 flex size-5.5 items-center justify-center rounded-full border border-stone-300/80 bg-white/95 text-stone-600 shadow-sm backdrop-blur-md transition-all hover:border-stone-400 hover:text-stone-950 hover:scale-105 active:scale-95"
                    aria-label="Scroll left"
                  >
                    <IconChevronLeft size={12} stroke={2.4} />
                  </button>
                )}

                {/* Ribbon Container with Dynamic Gradient Edge Mask */}
                <div
                  ref={scrollRef}
                  onScroll={checkScroll}
                  className="flex flex-1 items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth"
                  style={{
                    maskImage:
                      canScrollLeft && canScrollRight
                        ? "linear-gradient(to right, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)"
                        : canScrollRight
                        ? "linear-gradient(to right, black 0%, black calc(100% - 28px), transparent 100%)"
                        : canScrollLeft
                        ? "linear-gradient(to right, transparent 0%, black 28px, black 100%)"
                        : "none",
                    WebkitMaskImage:
                      canScrollLeft && canScrollRight
                        ? "linear-gradient(to right, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)"
                        : canScrollRight
                        ? "linear-gradient(to right, black 0%, black calc(100% - 28px), transparent 100%)"
                        : canScrollLeft
                        ? "linear-gradient(to right, transparent 0%, black 28px, black 100%)"
                        : "none",
                  }}
                >
                  {CURATED_BADGES.map((badge) => {
                    const IconComp = badge.icon;
                    const isActive =
                      query.toLowerCase().trim() === badge.query.toLowerCase().trim();

                    return (
                      <button
                        key={badge.id}
                        type="button"
                        onClick={() => {
                          if (isActive) {
                            setQuery("");
                          } else {
                            setQuery(badge.query);
                          }
                          setSelectedIndex(0);
                          inputRef.current?.focus();
                        }}
                        className={`group inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-sans font-medium transition-all duration-200 shrink-0 select-none cursor-pointer ${
                          isActive
                            ? "border border-stone-900 bg-stone-900 text-stone-50 shadow-xs ring-1 ring-stone-900/10"
                            : "border border-stone-200/80 bg-white/75 text-stone-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(20,18,14,0.04)] hover:border-stone-400/80 hover:bg-white hover:text-stone-950 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0"
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

                {/* Right Micro-Glide Arrow */}
                {canScrollRight && (
                  <button
                    type="button"
                    onClick={() => scrollRibbon("right")}
                    className="absolute right-2 sm:right-3 z-10 flex size-5.5 items-center justify-center rounded-full border border-stone-300/80 bg-white/95 text-stone-600 shadow-sm backdrop-blur-md transition-all hover:border-stone-400 hover:text-stone-950 hover:scale-105 active:scale-95"
                    aria-label="Scroll right"
                  >
                    <IconChevronRight size={12} stroke={2.4} />
                  </button>
                )}
              </div>

              {/* Modal Body: Departments & Selections OR Live Results (Curated Vertical Scrollbar) */}
              <div className="max-h-[26rem] overflow-y-auto p-4 sm:p-5 search-palette-scroll">
                {/* Initial Rich State */}
                {query.trim() === "" ? (
                  <div className="space-y-5">
                    {/* Atelier Departments */}
                    <div>
                      <div className="flex items-center justify-between pb-2 px-1">
                        <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-stone-400">
                          Explore Atelier Departments
                        </span>
                        <span className="text-[11px] text-stone-400 font-sans">
                          Select to filter
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-700 transition group-hover:bg-stone-900 group-hover:text-stone-50">
                                  <IconComponent className="size-4.5" stroke={1.6} />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-title text-sm font-medium text-stone-900 truncate group-hover:text-stone-950">
                                    {dept.name}
                                  </p>
                                  <p className="text-[11px] text-stone-500 font-sans truncate">
                                    {dept.description}
                                  </p>
                                </div>
                              </div>
                              <span className="font-mono text-[10px] text-stone-400 shrink-0 ml-2 group-hover:text-stone-700">
                                {dept.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Curated Recommendations */}
                    <div>
                      <div className="flex items-center justify-between pb-2 px-1">
                        <span className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-stone-400">
                          Atelier Selections & Bestsellers
                        </span>
                        <span className="text-[11px] text-amber-700 font-serif italic">
                          Master Craft Certified
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {SAMPLE_SEARCH_CATALOG.slice(0, 3).map((item) => (
                          <Link
                            key={item.id}
                            href={`/products/${item.id}`}
                            onClick={() => setIsOpen(false)}
                            className="group flex items-center justify-between rounded-2xl border border-transparent bg-white/50 p-2.5 transition-all hover:border-stone-200 hover:bg-white hover:shadow-xs"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-stone-200/80 bg-stone-50">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="48px"
                                  className="object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-title text-sm font-medium text-stone-900 truncate group-hover:text-stone-950">
                                    {item.name}
                                  </h4>
                                  {item.badge && (
                                    <span className="inline-flex rounded-full bg-stone-100 px-2 py-0.2 font-mono text-[9.5px] font-medium text-stone-600">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-stone-500 font-sans truncate">
                                  {item.material}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 ml-3">
                              <span className="font-mono numerals text-xs font-semibold text-stone-900">
                                ${item.price.toFixed(2)}
                              </span>
                              <IconArrowUpRight className="size-4 text-stone-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-stone-900" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : filteredResults.length === 0 ? (
                  /* Empty Results State */
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl border border-stone-200/80 bg-white/80 shadow-2xs">
                      <GlyphCompassLogo size={26} />
                    </div>
                    <p className="font-title text-base text-stone-900">
                      No atelier instruments found
                    </p>
                    <p className="mx-auto mt-1 max-w-sm text-xs text-stone-500 font-sans leading-relaxed">
                      We could not find any stationery matching &ldquo;{query}&rdquo;.
                      Try searching by material like <em>brass</em>, <em>linen</em>, or <em>sumi</em>.
                    </p>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setQuery("");
                          inputRef.current?.focus();
                        }}
                        className="inline-flex items-center rounded-full border border-stone-300 bg-white px-3.5 py-1 text-xs font-medium text-stone-700 shadow-2xs hover:bg-stone-50 hover:text-stone-950"
                      >
                        Clear search & browse catalog
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Matching Products List */
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between pb-1 px-1">
                      <p className="font-mono text-[10.5px] font-semibold uppercase tracking-wider text-stone-400">
                        Matching Atelier Goods ({filteredResults.length})
                      </p>
                      <p className="text-[11px] text-stone-400 font-sans hidden sm:block">
                        Use ↑ ↓ to navigate, ↵ to view
                      </p>
                    </div>

                    {filteredResults.map((item, index) => {
                      const isSelected = index === selectedIndex;
                      return (
                        <Link
                          key={item.id}
                          href={`/products/${item.id}`}
                          onClick={() => setIsOpen(false)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`group flex items-center justify-between rounded-2xl p-2.5 transition-all duration-150 ${
                            isSelected
                              ? "border border-stone-300/80 bg-white shadow-xs translate-x-0.5"
                              : "border border-transparent bg-white/40 hover:border-stone-200 hover:bg-white/80"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-stone-200/80 bg-stone-50">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-title text-sm font-medium text-stone-900 truncate group-hover:text-stone-950">
                                  {item.name}
                                </h4>
                                {item.badge && (
                                  <span className="hidden sm:inline-flex rounded-full bg-stone-100 px-2 py-0.2 font-mono text-[9px] font-medium text-stone-600">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-stone-500 font-sans truncate">
                                {item.category} • {item.material}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 ml-3">
                            <span className="font-mono numerals text-xs sm:text-sm font-semibold text-stone-900">
                              ${item.price.toFixed(2)}
                            </span>
                            {isSelected ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-stone-900 px-2 py-0.5 font-mono text-[10px] font-medium text-stone-50 shadow-2xs">
                                <span>Open</span>
                                <span>↵</span>
                              </span>
                            ) : (
                              <IconArrowRight className="size-4 text-stone-400 transition group-hover:translate-x-0.5 group-hover:text-stone-900" />
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer Command Bar */}
              <div className="flex items-center justify-between border-t border-stone-200/70 bg-stone-100/70 px-4 sm:px-5 py-3 text-xs text-stone-500 font-sans">
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex items-center gap-1.5">
                    <kbd className="rounded border border-stone-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600 shadow-2xs">↑</kbd>
                    <kbd className="rounded border border-stone-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600 shadow-2xs">↓</kbd>
                    <span className="text-[11px] text-stone-500">Navigate</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <kbd className="rounded border border-stone-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600 shadow-2xs">↵</kbd>
                    <span className="text-[11px] text-stone-500">Select</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <kbd className="rounded border border-stone-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600 shadow-2xs">Esc</kbd>
                    <span className="text-[11px] text-stone-500">Close</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-serif italic">
                  <span>Roi Stationares</span>
                  <span className="opacity-50">•</span>
                  <span>Atelier Search</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
