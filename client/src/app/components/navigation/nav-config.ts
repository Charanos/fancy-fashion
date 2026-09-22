import {
  IconLayoutGrid,
  IconNotebook,
  IconPalette,
  IconPaperclip,
  IconPencil,
} from "../icons";

/** Tabler icon components share one signature; reuse it so the data stays typed. */
export type NavIcon = typeof IconNotebook;

export type NavLink = {
  name: string;
  href: string;
  badge?: string;
};

export type NavCategory = {
  /** Stable key used for dropdown state, ids and GSAP lookups. */
  id: string;
  label: string;
  /** Condensed label for the docked console, where horizontal room is scarce.
      Always a prefix of `label` so the accessible name still contains the
      visible text (WCAG 2.5.3 Label in Name). */
  shortLabel: string;
  href: string;
  icon: NavIcon;
  featuredTitle: string;
  featuredDesc: string;
  items: NavLink[];
};

export const NAVIGATION_CATEGORIES: NavCategory[] = [
  {
    id: "office-paper",
    label: "Office & Paper",
    shortLabel: "Office",
    href: "/categories/office-paper",
    icon: IconNotebook,
    featuredTitle: "Everyday Office Paper",
    featuredDesc: "Reliable copy paper, notebooks and forms for Nairobi workdays.",
    items: [
      { name: "A4 Copy & Printer Paper", href: "/categories/office-paper/copy-paper", badge: "Top" },
      { name: "Notebooks & Planners", href: "/categories/office-paper/notebooks" },
      { name: "Files, Folders & Binders", href: "/categories/office-paper/filing" },
      { name: "Labels & Receipt Books", href: "/categories/office-paper/forms" },
    ],
  },
  {
    id: "writing-supplies",
    label: "Writing & Supplies",
    shortLabel: "Writing",
    href: "/categories/writing-supplies",
    icon: IconPencil,
    featuredTitle: "Workday Writing Kit",
    featuredDesc: "Pens, markers and essentials that keep desks ready for action.",
    items: [
      { name: "Pens, Pencils & Markers", href: "/categories/writing-supplies/pens" },
      { name: "Highlighters & Whiteboard", href: "/categories/writing-supplies/markers" },
      { name: "Staplers, Punches & Pins", href: "/categories/writing-supplies/fasteners" },
      { name: "Tapes, Glue & Scissors", href: "/categories/writing-supplies/adhesives" },
    ],
  },
  {
    id: "print-scan",
    label: "Print & Scan",
    shortLabel: "Print",
    href: "/categories/print-scan",
    icon: IconPaperclip,
    featuredTitle: "Print, Copy, Scan",
    featuredDesc: "Practical equipment and consumables for reliable document work.",
    items: [
      { name: "Inkjet & Laser Printers", href: "/categories/print-scan/printers" },
      { name: "Document Scanners", href: "/categories/print-scan/scanners" },
      { name: "Ink, Toner & Cartridges", href: "/categories/print-scan/consumables", badge: "Refill" },
      { name: "Laminators & Binding", href: "/categories/print-scan/finishing" },
    ],
  },
  {
    id: "computers-tech",
    label: "Computers & Tech",
    shortLabel: "Tech",
    href: "/categories/computers-tech",
    icon: IconPalette,
    featuredTitle: "Work-Ready Technology",
    featuredDesc: "Laptops, peripherals and power essentials for work and study.",
    items: [
      { name: "Business Laptops", href: "/categories/computers-tech/laptops" },
      { name: "Keyboards & Mice", href: "/categories/computers-tech/peripherals" },
      { name: "Storage & Networking", href: "/categories/computers-tech/storage" },
      { name: "Cables, Chargers & Power", href: "/categories/computers-tech/power" },
    ],
  },
  {
    id: "workspace-school",
    label: "Workspace & School",
    shortLabel: "Workspace",
    href: "/categories/workspace-school",
    icon: IconLayoutGrid,
    featuredTitle: "Better Everyday Setups",
    featuredDesc: "Desk organisation, calculators and practical school essentials.",
    items: [
      { name: "Desk Organisation", href: "/categories/workspace-school/organisation" },
      { name: "Calculators & Shredders", href: "/categories/workspace-school/equipment" },
      { name: "School Essentials", href: "/categories/workspace-school/school" },
      { name: "Bulk & Business Orders", href: "/categories/workspace-school/business", badge: "B2B" },
    ],
  },
];

export const STORE_IDENTITY = {
  name: "Roi Stationer & Electronics",
  shortName: "Roi Stationer",
  tagline: "Nairobi • Office supplies & electronics",
  phone: "+254 700 000 000",
  currency: "KSh (KES)",
  deliveryNotice: "Free Nairobi delivery on orders over KSh 5,000",
  deliveryWindow: "Nairobi delivery, Monday to Saturday",
} as const;

export const UTILITY_LINKS: NavLink[] = [
  { name: "Service desk", href: "/support" },
  { name: "Journal", href: "/journal" },
];
