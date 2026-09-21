"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  GlyphCompassLogo,
  GlyphHeart,
  GlyphMenu,
  GlyphShoppingBag,
  GlyphUser,
} from "./AppleGlyphs";
import CartDrawer from "./CartDrawer";
import {
  IconArrowRight,
  IconChevronDown,
  IconChevronRight,
  IconLogin2,
  IconNotebook,
  IconPalette,
  IconPaperclip,
  IconPencil,
  IconLayoutGrid,
  IconTruck,
} from "./icons";
import Searchbar from "./Searchbar";

type NavCategory = {
  label: string;
  href: string;
  icon: typeof IconNotebook;
  featuredTitle: string;
  featuredDesc: string;
  items: { name: string; href: string; badge?: string }[];
};

const NAVIGATION_CATEGORIES: NavCategory[] = [
  {
    label: "Notebooks & Paper",
    href: "/categories/notebooks",
    icon: IconNotebook,
    featuredTitle: "Architectural Grid A5",
    featuredDesc: "160gsm fountain-pen friendly Japanese milled paper.",
    items: [
      { name: "Hardcover Journals", href: "/categories/notebooks/hardcover" },
      { name: "Daily & Weekly Planners", href: "/categories/notebooks/planners", badge: "2025" },
      { name: "Grid & Dot Matrix Pads", href: "/categories/notebooks/grid" },
      { name: "Pocket Memo Notebooks", href: "/categories/notebooks/pocket" },
      { name: "Archival Refill Inserts", href: "/categories/notebooks/refills" },
    ],
  },
  {
    label: "Writing Instruments",
    href: "/categories/writing",
    icon: IconPencil,
    featuredTitle: "Raw Brass Rollerball",
    featuredDesc: "Solid machined brass that patinas gracefully with daily use.",
    items: [
      { name: "Fountain Pens & Nibs", href: "/categories/writing/fountain" },
      { name: "Rollerballs & Gel Pens", href: "/categories/writing/rollerball" },
      { name: "Drafting Mechanical Pencils", href: "/categories/writing/pencils" },
      { name: "Bottled Sumi & Shading Inks", href: "/categories/writing/inks" },
      { name: "Handmade Leather Pen Sleeves", href: "/categories/writing/cases" },
    ],
  },
  {
    label: "Desk Architecture",
    href: "/categories/desk",
    icon: IconPaperclip,
    featuredTitle: "Boxwood Ruler 30cm",
    featuredDesc: "Laser-etched metric & imperial gradations with brass edging.",
    items: [
      { name: "Solid Brass Clips & Clamps", href: "/categories/desk/clips" },
      { name: "Drafting Rulers & Triangles", href: "/categories/desk/rulers" },
      { name: "Heavyweight Desk Organizers", href: "/categories/desk/trays" },
      { name: "Precision Craft Scissors", href: "/categories/desk/scissors" },
      { name: "Cast Iron Paperweights", href: "/categories/desk/weights" },
    ],
  },
  {
    label: "Art & Studio",
    href: "/categories/art",
    icon: IconPalette,
    featuredTitle: "Studio Watercolor Kit",
    featuredDesc: "Natural mineral pigments in pocket porcelain half-pans.",
    items: [
      { name: "Mineral Watercolor Sets", href: "/categories/art/watercolors" },
      { name: "Traditional Calligraphy Inks", href: "/categories/art/calligraphy" },
      { name: "Cotton Watercolor Blocks", href: "/categories/art/paper" },
      { name: "Fine-Tip Technical Fineliners", href: "/categories/art/fineliners" },
    ],
  },
  {
    label: "Curated Sets",
    href: "/categories/sets",
    icon: IconLayoutGrid,
    featuredTitle: "The Architect's Bundle",
    featuredDesc: "A complete desk suite: notebook, brass pen, and metric scale.",
    items: [
      { name: "The Complete Desk Suite", href: "/categories/sets/desk-suite" },
      { name: "Calligrapher Starter Box", href: "/categories/sets/calligraphy" },
      { name: "Curated Studio Gift Boxes", href: "/categories/sets/gift-boxes" },
      { name: "Wax Seal & Letterwriting Set", href: "/categories/sets/wax-seal" },
    ],
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [cartCount] = useState(2);
  const pathname = usePathname();

  // Smart sticky behavior:
  // - Top of page (scrollY <= 24): Transparent multi-tier grand masthead, blended with hero
  // - Scrolling down (> 80px): Slides up and hides
  // - Scrolling up: Slides down as a compact, docked frosted glass console
  useEffect(() => {
    let prevY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      // Resting state at top
      if (currentY <= 24) {
        setIsScrolled(false);
        setIsVisible(true);
      } else {
        setIsScrolled(true);

        // Scrolling DOWN -> hide header
        if (currentY > prevY && currentY > 80) {
          setIsVisible(false);
          setActiveDropdown(null);
        }
        // Scrolling UP -> reveal compact docked bar
        else if (currentY < prevY) {
          setIsVisible(true);
        }
      }

      prevY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ease-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* ========================================================================= */}
        {/* MODE A: FULL MULTI-TIER STACK (Rendered before scroll / blended with hero)  */}
        {/* ========================================================================= */}
        {!isScrolled && (
          <div className="w-full bg-transparent transition-all duration-300">
            {/* TIER 1: Atelier Dispatch & Services Utility Bar */}
            <div className="border-b border-stone-200/40 bg-transparent py-2">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 text-xs">
                {/* Left: Dispatch Notice */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-700 font-sans">
                    <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Complimentary archival packaging on orders over $120
                  </span>
                  <span className="hidden text-neutral-300 sm:inline">•</span>
                  <span className="hidden items-center gap-1 text-[11px] text-neutral-500 font-sans sm:inline-flex">
                    <IconTruck className="size-3 text-neutral-400" />
                    Worldwide atelier dispatch from Nairobi
                  </span>
                </div>

                {/* Right: Utility Links */}
                <div className="flex items-center gap-4 text-[11px] font-sans text-neutral-500">
                  <span className="hidden hover:text-neutral-900 transition sm:inline cursor-pointer">
                    Showroom: Nairobi
                  </span>
                  <span className="hidden text-neutral-300 sm:inline">|</span>
                  <Link href="/journal" className="hover:text-neutral-900 transition">
                    Journal
                  </Link>
                  <span className="text-neutral-300">|</span>
                  <span className="font-mono numerals text-neutral-700 font-medium">
                    USD ($)
                  </span>
                </div>
              </div>
            </div>

            {/* TIER 2: Grand Atelier Masthead */}
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              {/* Left Column: Search Trigger */}
              <div className="flex flex-1 items-center justify-start">
                <div className="hidden sm:block">
                  <Searchbar variant="inline" />
                </div>
                <div className="sm:hidden">
                  <Searchbar variant="button" />
                </div>
              </div>

              {/* Center Column: The Crown Jewel (Grand Centered Brand Identity) */}
              <div className="flex flex-col items-center text-center">
                <Link
                  href="/"
                  className="group flex flex-col items-center gap-1"
                  aria-label="Roi Stationares Home"
                >
                  <GlyphCompassLogo size={40} className="mb-0.5" />
                  <span className="font-title text-2xl sm:text-3xl font-normal tracking-tight text-neutral-950 transition group-hover:text-neutral-800">
                    Roi Stationares
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-widest text-neutral-400 font-sans">
                    Nairobi • Fine Paper & Archival Goods
                  </span>
                </Link>
              </div>

              {/* Right Column: 3D Apple-Grade Glyph Action Cluster */}
              <div className="flex flex-1 items-center justify-end gap-2.5">
                {/* Wishlist Button */}
                <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  className="apple-glyph-btn group"
                >
                  <GlyphHeart size={18} />
                </Link>

                {/* Shopping Bag Trigger (Pristine Horizontal Pill) */}
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  aria-label={`Shopping Bag (${cartCount} items)`}
                  className="apple-glyph-pill group"
                >
                  <GlyphShoppingBag size={18} />
                  <span className="font-sans text-xs font-medium text-neutral-800 group-hover:text-neutral-950">
                    Bag
                  </span>
                  <span
                    className="numerals font-mono grid size-4.5 place-items-center rounded-full text-[10px] font-semibold text-white shadow-2xs"
                    style={{
                      background: "linear-gradient(180deg, #2b2723 0%, #151310 100%)",
                      boxShadow: "inset 0 0.8px 0.8px rgba(255, 255, 255, 0.5), 0 1px 3px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    {cartCount}
                  </span>
                </button>

                {/* Account / Profile Button */}
                <Link
                  href="/account"
                  aria-label="Account profile"
                  className="apple-glyph-btn group hidden sm:inline-grid"
                >
                  <GlyphUser size={18} />
                </Link>

                {/* Mobile Menu Toggle — wrapper controls lg visibility independently of apple-glyph-btn display */}
                <span className="lg:hidden">
                  <button
                    type="button"
                    className="apple-glyph-btn group"
                    aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation-drawer"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                  >
                    <GlyphMenu size={18} isOpen={isMenuOpen} />
                  </button>
                </span>
              </div>
            </div>

            {/* TIER 3: Curated Departmental Navigation Deck (Category Ribbon) */}
            <div className="border-t border-stone-200/50 bg-transparent py-3">
              <nav
                className="mx-auto hidden max-w-7xl items-center justify-center gap-8 xl:gap-12 px-4 sm:px-6 lg:flex lg:px-8"
                aria-label="Catalogue Departments"
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {NAVIGATION_CATEGORIES.map((category) => {
                  const isActive = pathname.startsWith(category.href);
                  const isHovered = activeDropdown === category.label;

                  return (
                    <div
                      key={category.label}
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(category.label)}
                    >
                      <Link
                        href={category.href}
                        className={`group relative inline-flex items-center gap-1.5 py-1 text-[13px] font-medium tracking-wide uppercase whitespace-nowrap transition-colors duration-200 ${
                          isActive
                            ? "text-neutral-950 font-semibold"
                            : "text-neutral-600 hover:text-neutral-950"
                        }`}
                        aria-expanded={isHovered}
                      >
                        <span className="whitespace-nowrap">{category.label}</span>
                        <IconChevronDown
                          className={`size-3 text-neutral-400 transition-transform duration-200 ${
                            isHovered ? "rotate-180 text-neutral-900" : "group-hover:text-neutral-700"
                          }`}
                        />
                        {/* Hover Underline Micro-Indicator */}
                        <span
                          className={`absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-neutral-900 transition-all duration-200 ${
                            isActive || isHovered ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                          }`}
                        />
                      </Link>

                      {/* Mega-Menu Flyout */}
                      {isHovered && (
                        <div className="dropdown-glass-panel absolute left-1/2 top-full mt-2.5 w-96 -translate-x-1/2 rounded-3xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-1.5 duration-200 z-50">
                          <div className="grid gap-3">
                            <div className="rounded-2xl border border-stone-200/80 bg-white/90 p-3.5 shadow-2xs">
                              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900">
                                <category.icon className="size-4 text-neutral-700" />
                                <span className="font-title text-sm tracking-tight">{category.featuredTitle}</span>
                              </div>
                              <p className="mt-1 text-xs text-neutral-500 font-sans leading-relaxed">
                                {category.featuredDesc}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 font-mono">
                                Curated Lines
                              </p>
                              {category.items.map((item) => (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  className="group/item flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-neutral-700 transition-all duration-150 hover:bg-white hover:text-neutral-950 hover:shadow-2xs font-sans"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <span className="group-hover/item:translate-x-0.5 transition-transform duration-150">{item.name}</span>
                                  {item.badge ? (
                                    <span className="rounded-md bg-stone-200/80 px-1.5 py-0.5 font-mono text-[9px] font-medium text-neutral-700">
                                      {item.badge}
                                    </span>
                                  ) : (
                                    <IconChevronRight className="size-3 text-neutral-300 group-hover/item:text-neutral-700 group-hover/item:translate-x-0.5 transition-all duration-150" />
                                  )}
                                </Link>
                              ))}
                            </div>

                            <Link
                              href={category.href}
                              onClick={() => setActiveDropdown(null)}
                              className="mt-0.5 flex items-center justify-center gap-1.5 rounded-full border border-stone-300/80 bg-white/95 py-2 text-xs font-medium text-neutral-800 shadow-2xs transition-all duration-150 hover:border-neutral-900 hover:bg-white hover:text-neutral-950 hover:shadow-xs font-sans"
                            >
                              <span>Explore Entire Department</span>
                              <IconArrowRight className="size-3.5" />
                            </Link>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE B: COMPACT DOCKED CONSOLE (Rendered when scrolling UP)               */}
        {/* ========================================================================= */}
        {isScrolled && (
          <div className="px-3 pt-3 sm:px-6">
            <div className="nav-docked mx-auto flex max-w-7xl items-center justify-between px-6 py-3 sm:px-8">
              {/* Left: Compact Brand Mark — Logo glyph only, no text in docked state */}
              <Link
                href="/"
                className="flex shrink-0 items-center group"
                aria-label="Roi Stationares Home"
              >
                <GlyphCompassLogo size={34} />
              </Link>

              {/* Center: Quick Department Links (No Line Wrapping) */}
              <nav
                className="hidden lg:flex items-center gap-8 xl:gap-10"
                aria-label="Catalogue Departments"
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {NAVIGATION_CATEGORIES.map((category) => {
                  const isActive = pathname.startsWith(category.href);
                  const isHovered = activeDropdown === category.label;

                  return (
                    <div
                      key={category.label}
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(category.label)}
                    >
                      <Link
                        href={category.href}
                        className={`inline-flex items-center gap-1 py-1 text-xs font-medium tracking-wide uppercase whitespace-nowrap transition-colors ${
                          isActive ? "text-neutral-950 font-semibold" : "text-neutral-600 hover:text-neutral-950"
                        }`}
                      >
                        <span className="whitespace-nowrap">{category.label}</span>
                        <IconChevronDown
                          className={`size-2.5 text-neutral-400 transition-transform ${
                            isHovered ? "rotate-180 text-neutral-900" : ""
                          }`}
                        />
                      </Link>

                      {/* Dropdown Flyout */}
                      {isHovered && (
                        <div className="dropdown-glass-panel absolute left-1/2 top-full mt-2.5 w-80 -translate-x-1/2 rounded-2xl p-3.5 shadow-2xl animate-in fade-in slide-in-from-top-1.5 duration-200 z-50">
                          <div className="space-y-1">
                            {category.items.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="group/item flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-neutral-700 transition-all duration-150 hover:bg-white hover:text-neutral-950 hover:shadow-2xs font-sans"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <span className="group-hover/item:translate-x-0.5 transition-transform duration-150">{item.name}</span>
                                <IconChevronRight className="size-3 text-neutral-300 group-hover/item:text-neutral-700 group-hover/item:translate-x-0.5 transition-all duration-150" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </nav>

              {/* Right: Actions (Inline Search Hidden - Replaced by Compact 3D Search Button) */}
              <div className="flex items-center gap-2.5">
                <Searchbar variant="button" />

                <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  className="apple-glyph-btn group"
                >
                  <GlyphHeart size={17} />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  aria-label={`Shopping Bag (${cartCount} items)`}
                  className="apple-glyph-pill group"
                >
                  <GlyphShoppingBag size={17} />
                  <span className="hidden sm:inline font-sans text-xs font-medium text-neutral-800">
                    Bag
                  </span>
                  <span
                    className="numerals font-mono grid size-4.5 place-items-center rounded-full text-[10px] font-semibold text-white shadow-2xs"
                    style={{
                      background: "linear-gradient(180deg, #2b2723 0%, #151310 100%)",
                      boxShadow: "inset 0 0.8px 0.8px rgba(255, 255, 255, 0.5), 0 1px 3px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    {cartCount}
                  </span>
                </button>

                <Link
                  href="/account"
                  aria-label="Account profile"
                  className="apple-glyph-btn group hidden sm:inline-grid"
                >
                  <GlyphUser size={17} />
                </Link>

                <span className="lg:hidden">
                  <button
                    type="button"
                    className="apple-glyph-btn group"
                    aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-navigation-drawer"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                  >
                    <GlyphMenu size={17} isOpen={isMenuOpen} />
                  </button>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Slide-Over Navigation Drawer */}
        {isMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            className="fixed inset-0 top-[76px] z-40 flex flex-col bg-[#fdfbf7]/98 p-5 shadow-2xl backdrop-blur-2xl lg:hidden overflow-y-auto"
          >
            <div className="mb-4">
              <Searchbar variant="inline" />
            </div>

            <div className="flex-1 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 font-sans">
                Stationery Departments
              </p>
              {NAVIGATION_CATEGORIES.map((cat) => (
                <div
                  key={cat.label}
                  className="rounded-2xl border border-stone-200/70 bg-white/70 p-3 shadow-2xs"
                >
                  <Link
                    href={cat.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between font-title text-base text-neutral-900"
                  >
                    <span className="flex items-center gap-2">
                      <cat.icon className="size-4.5 text-neutral-600" />
                      {cat.label}
                    </span>
                    <IconArrowRight className="size-4 text-stone-400" />
                  </Link>
                  <div className="mt-2.5 space-y-1.5 border-t border-stone-200/60 pt-2 text-xs font-sans">
                    {cat.items.slice(0, 3).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-neutral-600 hover:text-neutral-950 py-0.5"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-stone-200/80 pt-4 space-y-2">
              <Link
                href="/account"
                onClick={() => setIsMenuOpen(false)}
                className="flex h-11 items-center justify-center gap-2 rounded-full border border-stone-300 bg-white text-xs font-medium text-neutral-900 shadow-2xs"
              >
                <IconLogin2 className="size-4" />
                <span>Account Sign In</span>
              </Link>
              <div className="flex justify-between px-2 pt-2 text-[11px] text-neutral-400 font-sans">
                <span>Nairobi Atelier & Showroom</span>
                <span>Customer Care: +254 700 000 000</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
};

export default Navbar;
