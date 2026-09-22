import { IconLayoutGrid } from "../icons";
import { NAVIGATION_CATEGORIES } from "../navigation/nav-config";
import type { DepartmentId, NavIcon } from "../navigation/nav-config";

/**
 * Departments are the same five the header navigates. Before this, the nav used
 * `office-paper`/`computers-tech`/… while the product list used
 * `office`/`computers`/`accessories`, so a header department could never filter
 * the grid and the category ribbon's counts were hand-maintained fiction.
 */
export type DepartmentSlug = DepartmentId;

/** The line marks a product can be drawn with. */
export type ProductGlyph =
  | "printer"
  | "scanner"
  | "package"
  | "laptop"
  | "keyboard"
  | "notebook"
  | "paperclip"
  | "pencil"
  | "highlight"
  | "grid"
  | "calculator";

export type ProductSpec = {
  label: string;
  value: string;
};

export type CatalogueProduct = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  sku: string;
  department: DepartmentSlug;
  shortDescription: string;
  price: number;
  /** Was-price. Only set when there is a genuine reduction to show. */
  compareAtPrice?: number;
  /** Per-unit breakdown for anything sold in bulk, e.g. paper by the ream. */
  unitPrice?: { amount: number; unit: string };
  /** Three at-a-glance specs. The card is a datasheet, not a poster. */
  specs: [ProductSpec, ProductSpec, ProductSpec];
  rating: number;
  reviewCount: number;
  /** Units on hand; drives the stock pill and the low-stock nudge. */
  stock: number;
  badges: string[];
  /**
   * Key for the line-art mark on the specimen plate, resolved to a component
   * by ProductMedia. It is a string, not the component itself: a product
   * object crosses the server → client boundary on the detail page, and React
   * cannot serialise a function.
   */
  glyph: ProductGlyph;
  accent: "graphite" | "brass" | "sage" | "clay";
};

export const FREE_DELIVERY_THRESHOLD = 5000;

export const PRODUCTS: CatalogueProduct[] = [
  {
    id: 1,
    slug: "hp-smart-tank-585",
    name: "HP Smart Tank 585 All-in-One",
    brand: "HP",
    sku: "HP-ST585",
    department: "print-scan",
    shortDescription:
      "Print, copy and scan with refillable tanks and genuinely low running costs.",
    price: 31500,
    compareAtPrice: 34900,
    specs: [
      { label: "Function", value: "Print · Copy · Scan" },
      { label: "Connection", value: "Wi-Fi + USB" },
      { label: "Yield", value: "6,000 pages" },
    ],
    rating: 4.6,
    reviewCount: 128,
    stock: 7,
    badges: ["Bestseller"],
    glyph: "printer",
    accent: "graphite",
  },
  {
    id: 2,
    slug: "epson-perfection-v39ii",
    name: "Epson Perfection V39II Scanner",
    brand: "Epson",
    sku: "EP-V39II",
    department: "print-scan",
    shortDescription:
      "A slim A4 flatbed for crisp documents, IDs and archive work off one USB cable.",
    price: 18900,
    specs: [
      { label: "Format", value: "A4 flatbed" },
      { label: "Resolution", value: "4800 dpi" },
      { label: "Power", value: "USB powered" },
    ],
    rating: 4.4,
    reviewCount: 54,
    stock: 12,
    badges: ["Staff pick"],
    glyph: "scanner",
    accent: "graphite",
  },
  {
    id: 3,
    slug: "canon-047-toner",
    name: "Canon 047 Toner Cartridge",
    brand: "Canon",
    sku: "CN-047-BK",
    department: "print-scan",
    shortDescription:
      "Genuine black toner for the i-SENSYS LBP range, sealed and batch-coded.",
    price: 9800,
    specs: [
      { label: "Colour", value: "Black" },
      { label: "Yield", value: "1,600 pages" },
      { label: "Type", value: "Genuine OEM" },
    ],
    rating: 4.8,
    reviewCount: 41,
    stock: 24,
    badges: ["Genuine"],
    glyph: "package",
    accent: "brass",
  },
  {
    id: 4,
    slug: "lenovo-v15-gen4",
    name: "Lenovo V15 Gen 4 Laptop",
    brand: "Lenovo",
    sku: "LN-V15G4",
    department: "computers-tech",
    shortDescription:
      "A dependable 15.6-inch machine for business admin, classes and reporting.",
    price: 68500,
    compareAtPrice: 74000,
    specs: [
      { label: "Display", value: "15.6″ FHD" },
      { label: "Memory", value: "8 GB / 512 GB SSD" },
      { label: "Warranty", value: "12 months" },
    ],
    rating: 4.3,
    reviewCount: 76,
    stock: 4,
    badges: ["Business"],
    glyph: "laptop",
    accent: "graphite",
  },
  {
    id: 5,
    slug: "logitech-mk270",
    name: "Logitech MK270 Wireless Combo",
    brand: "Logitech",
    sku: "LG-MK270",
    department: "computers-tech",
    shortDescription:
      "Full-size keyboard and mouse on one nano receiver, with long battery life.",
    price: 4950,
    specs: [
      { label: "Layout", value: "Full size" },
      { label: "Range", value: "10 m wireless" },
      { label: "Battery", value: "Up to 24 months" },
    ],
    rating: 4.5,
    reviewCount: 203,
    stock: 31,
    badges: ["Work ready"],
    glyph: "keyboard",
    accent: "graphite",
  },
  {
    id: 6,
    slug: "paperone-a4-80gsm",
    name: "PaperOne A4 Copy Paper, 80gsm",
    brand: "PaperOne",
    sku: "PO-A4-80",
    department: "office-paper",
    shortDescription:
      "500 bright-white sheets that feed cleanly through everyday printers.",
    price: 780,
    unitPrice: { amount: 1.56, unit: "sheet" },
    specs: [
      { label: "Size", value: "A4 210 × 297 mm" },
      { label: "Weight", value: "80 gsm" },
      { label: "Pack", value: "500 sheets" },
    ],
    rating: 4.7,
    reviewCount: 312,
    stock: 180,
    badges: ["Everyday value"],
    glyph: "notebook",
    accent: "sage",
  },
  {
    id: 7,
    slug: "lever-arch-files-box",
    name: "Lever Arch Files, Box of 10",
    brand: "Roi Select",
    sku: "RS-LAF10",
    department: "office-paper",
    shortDescription:
      "Board files with reinforced spines and window labels for long-term filing.",
    price: 3400,
    unitPrice: { amount: 340, unit: "file" },
    specs: [
      { label: "Capacity", value: "70 mm spine" },
      { label: "Pack", value: "10 files" },
      { label: "Finish", value: "Laminated board" },
    ],
    rating: 4.2,
    reviewCount: 38,
    stock: 46,
    badges: [],
    glyph: "paperclip",
    accent: "clay",
  },
  {
    id: 8,
    slug: "bic-cristal-box-50",
    name: "BIC Cristal Ballpoint Pens, Box of 50",
    brand: "BIC",
    sku: "BIC-CR50",
    department: "writing-supplies",
    shortDescription:
      "The workhorse medium-point ballpoint, bought by the box for a whole office.",
    price: 1350,
    compareAtPrice: 1600,
    unitPrice: { amount: 27, unit: "pen" },
    specs: [
      { label: "Point", value: "1.0 mm medium" },
      { label: "Ink", value: "Blue" },
      { label: "Pack", value: "50 pens" },
    ],
    rating: 4.6,
    reviewCount: 156,
    stock: 92,
    badges: ["Bulk buy"],
    glyph: "pencil",
    accent: "graphite",
  },
  {
    id: 9,
    slug: "staedtler-textsurfer-4",
    name: "Staedtler Textsurfer Highlighters, 4-pack",
    brand: "Staedtler",
    sku: "ST-TS4",
    department: "writing-supplies",
    shortDescription:
      "Chisel-tip highlighters that stay wet-safe on inkjet and laser prints.",
    price: 480,
    unitPrice: { amount: 120, unit: "pen" },
    specs: [
      { label: "Tip", value: "Chisel 2–5 mm" },
      { label: "Colours", value: "4 assorted" },
      { label: "Ink", value: "Water based" },
    ],
    rating: 4.4,
    reviewCount: 64,
    stock: 3,
    badges: [],
    glyph: "highlight",
    accent: "brass",
  },
  {
    id: 10,
    slug: "mesh-desk-organiser-set",
    name: "Mesh Desk Organiser Set",
    brand: "Roi Select",
    sku: "RS-MDO5",
    department: "workspace-school",
    shortDescription:
      "Five coordinated pieces that keep paper, pens and small tools off the desk.",
    price: 3250,
    specs: [
      { label: "Pieces", value: "5 piece set" },
      { label: "Material", value: "Powder-coated mesh" },
      { label: "Finish", value: "Matte black" },
    ],
    rating: 4.1,
    reviewCount: 47,
    stock: 18,
    badges: ["Desk essential"],
    glyph: "grid",
    accent: "sage",
  },
  {
    id: 11,
    slug: "fellowes-lx25-shredder",
    name: "Fellowes LX25 Paper Shredder",
    brand: "Fellowes",
    sku: "FW-LX25",
    department: "workspace-school",
    shortDescription:
      "Cross-cut disposal for confidential paper, sized to sit beside a desk.",
    price: 14200,
    specs: [
      { label: "Cut", value: "Cross-cut P-4" },
      { label: "Capacity", value: "8 sheets" },
      { label: "Bin", value: "17 litres" },
    ],
    rating: 4.5,
    reviewCount: 29,
    stock: 6,
    badges: ["Office security"],
    glyph: "package",
    accent: "graphite",
  },
  {
    id: 12,
    slug: "casio-fx-991ex",
    name: "Casio FX-991EX Scientific Calculator",
    brand: "Casio",
    sku: "CS-991EX",
    department: "workspace-school",
    shortDescription:
      "552 functions with a high-resolution display — the exam-room standard.",
    price: 2950,
    compareAtPrice: 3400,
    specs: [
      { label: "Functions", value: "552" },
      { label: "Display", value: "Natural-V.P.A.M." },
      { label: "Power", value: "Solar + battery" },
    ],
    rating: 4.9,
    reviewCount: 418,
    stock: 27,
    badges: ["School term ready"],
    glyph: "calculator",
    accent: "clay",
  },
];

/* ── Formatting ──────────────────────────────────────────────────────────── */

const kshWhole = new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 });
const kshFine = new Intl.NumberFormat("en-KE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatKsh = (amount: number) => `KSh ${kshWhole.format(amount)}`;

/** Unit prices need decimals — "KSh 2 / sheet" would be a rounded lie. */
export const formatUnitPrice = ({
  amount,
  unit,
}: NonNullable<CatalogueProduct["unitPrice"]>) =>
  `KSh ${amount < 10 ? kshFine.format(amount) : kshWhole.format(amount)} / ${unit}`;

export const discountPercent = (product: CatalogueProduct) =>
  product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : 0;

/* ── Stock ───────────────────────────────────────────────────────────────── */

export type StockLevel = "out" | "low" | "in";

export const LOW_STOCK_AT = 5;

export const stockLevel = (stock: number): StockLevel =>
  stock <= 0 ? "out" : stock <= LOW_STOCK_AT ? "low" : "in";

export const stockLabel = (stock: number) => {
  switch (stockLevel(stock)) {
    case "out":
      return "Out of stock";
    case "low":
      return `Only ${stock} left`;
    default:
      return "In stock";
  }
};

/* ── Departments (derived, never hand-counted) ───────────────────────────── */

export type DepartmentFacet = {
  id: DepartmentSlug | "all";
  label: string;
  shortLabel: string;
  description: string;
  count: number;
  icon: NavIcon;
};

export const DEPARTMENT_FACETS: DepartmentFacet[] = [
  {
    id: "all",
    label: "All departments",
    shortLabel: "All",
    description: "Everything in the Nairobi catalogue",
    count: PRODUCTS.length,
    icon: IconLayoutGrid,
  },
  ...NAVIGATION_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    shortLabel: category.shortLabel,
    description: category.featuredDesc,
    count: PRODUCTS.filter((product) => product.department === category.id).length,
    icon: category.icon,
  })),
];

export const departmentLabel = (id: DepartmentSlug | "all") =>
  DEPARTMENT_FACETS.find((facet) => facet.id === id)?.label ?? "All departments";

/* ── Sorting ─────────────────────────────────────────────────────────────── */

export const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Best rated" },
  { id: "name", label: "Name: A–Z" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];

/** Featured order is the curated catalogue order, so it needs no comparator. */
export function sortProducts(
  products: CatalogueProduct[],
  sort: SortId
): CatalogueProduct[] {
  if (sort === "featured") return products;

  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
      );
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

/* ── Lookups ─────────────────────────────────────────────────────────────── */

export const getProductBySlug = (slug: string): CatalogueProduct | undefined =>
  PRODUCTS.find((product) => product.slug === slug);

/**
 * Same department first, then the rest of the catalogue, so a thin department
 * still fills the related rail instead of rendering one lonely card.
 */
export function getRelatedProducts(
  product: CatalogueProduct,
  limit = 4
): CatalogueProduct[] {
  const others = PRODUCTS.filter((candidate) => candidate.id !== product.id);
  const sameDepartment = others.filter(
    (candidate) => candidate.department === product.department
  );
  const rest = others.filter(
    (candidate) => candidate.department !== product.department
  );
  return [...sameDepartment, ...rest].slice(0, limit);
}
