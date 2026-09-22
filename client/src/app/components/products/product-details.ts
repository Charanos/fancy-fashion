/**
 * Long-form copy for the product detail pages, keyed by slug and kept out of
 * `product-catalog.ts` so the catalogue stays readable.
 *
 * NOTE FOR LAUNCH: these products are real, but this copy and the specs in the
 * catalogue are written placeholders, not manufacturer data. Replace both with
 * the supplier's own figures before this goes in front of customers — a wrong
 * page yield or warranty term on a live product page is a returns problem, not
 * a typo.
 */
export type ProductDetail = {
  /** Two short paragraphs. What it is, then why you would choose it. */
  overview: [string, string];
  highlights: string[];
  inTheBox: string[];
  /** Omitted for consumables and stationery, where it does not apply. */
  warranty?: string;
};

export const PRODUCT_DETAILS: Record<string, ProductDetail> = {
  "hp-smart-tank-585": {
    overview: [
      "Refillable ink tanks rather than cartridges, which is the whole argument for this printer in an office that prints every day. A full set of bottles covers thousands of pages, and topping up takes a minute at the desk.",
      "Wireless setup covers a small team without a print server, and the scanner handles the ordinary work of copying IDs, signing off delivery notes and filing receipts.",
    ],
    highlights: [
      "Refillable tanks — no cartridge cycle to budget for",
      "Print, copy and scan from a single unit",
      "Wi-Fi for a shared desk, USB for a single machine",
    ],
    inTheBox: ["Printer", "Starter ink bottles", "Power cable and setup guide"],
    warranty: "12-month manufacturer warranty",
  },

  "epson-perfection-v39ii": {
    overview: [
      "A flatbed built for documents rather than photographs: it lies flat on the desk, takes power from the USB cable alone, and produces straight, clean scans of A4 without a warm-up.",
      "The lid lifts clear for books and bound files, which is what matters when you are digitising an archive rather than a single page.",
    ],
    highlights: [
      "USB powered — one cable, no separate adapter",
      "4800 dpi, enough for text, IDs and line drawings",
      "Lid lifts clear for bound documents",
    ],
    inTheBox: ["Scanner", "USB cable", "Quick start guide"],
    warranty: "12-month manufacturer warranty",
  },

  "canon-047-toner": {
    overview: [
      "Genuine Canon toner for the i-SENSYS LBP range, sealed and batch-coded so it can be checked against the manufacturer's records.",
      "Third-party toner is cheaper at the counter and expensive when it leaks into a drum unit. On a printer still under warranty, genuine is the only sensible choice.",
    ],
    highlights: [
      "Genuine Canon — sealed and batch-coded",
      "Rated for 1,600 pages at 5% coverage",
      "Keeps the printer's warranty intact",
    ],
    inTheBox: ["One black toner cartridge", "Recycling and disposal instructions"],
  },

  "lenovo-v15-gen4": {
    overview: [
      "A plain, serviceable 15.6-inch machine for admin work: spreadsheets, email, reporting and the occasional call. No gaming pretensions and nothing fragile about it.",
      "8 GB of memory and a 512 GB SSD are enough for everyday business software, and the full-size screen makes it comfortable to use as a desk machine all day.",
    ],
    highlights: [
      "15.6-inch full-HD screen",
      "8 GB memory, 512 GB solid-state storage",
      "Full-size keyboard with a number pad",
    ],
    inTheBox: ["Laptop", "65W charger", "Warranty documentation"],
    warranty: "12-month Lenovo warranty",
  },

  "logitech-mk270": {
    overview: [
      "One nano receiver drives both the keyboard and the mouse, so a desk gains a full-size layout without two dongles or a Bluetooth pairing ritual.",
      "Battery life is measured in months rather than days, which is the entire point of a combo like this in an office that would rather not think about it.",
    ],
    highlights: [
      "A single receiver for both keyboard and mouse",
      "Full-size layout with a number pad",
      "Up to 24 months of keyboard battery",
    ],
    inTheBox: ["Keyboard", "Mouse", "Nano receiver and batteries"],
    warranty: "12-month manufacturer warranty",
  },

  "paperone-a4-80gsm": {
    overview: [
      "Bright white 80gsm paper that feeds cleanly through inkjet and laser printers without curling or jamming — the ordinary, reliable ream an office gets through by the box.",
      "80gsm is heavy enough to print double-sided without the text showing through, which is the usual reason to step up from 70gsm.",
    ],
    highlights: [
      "80gsm — heavy enough for double-sided work",
      "Bright white for clean contrast",
      "500 sheets per ream",
    ],
    inTheBox: ["One 500-sheet ream"],
  },

  "lever-arch-files-box": {
    overview: [
      "Laminated board files with reinforced spines and a window label on each, sold by the box of ten so a filing cabinet can be set up in one go.",
      "The 70mm spine takes roughly 500 sheets. The lever mechanism is the standard one, so pages can be added in the middle without unloading the file.",
    ],
    highlights: [
      "70mm spine — about 500 sheets per file",
      "Reinforced edges and metal thumb ring",
      "Window label on the spine",
    ],
    inTheBox: ["Ten lever arch files", "Spine label inserts"],
  },

  "bic-cristal-box-50": {
    overview: [
      "The medium-point ballpoint that most offices settle on: it writes immediately, it does not leak in a drawer, and nobody minds losing one.",
      "Bought by the box of fifty it works out at a price where you can leave pens at every desk, counter and meeting room without accounting for them.",
    ],
    highlights: [
      "1.0mm medium point",
      "Fifty pens per box",
      "Transparent barrel shows the ink level",
    ],
    inTheBox: ["Fifty blue ballpoint pens"],
  },

  "staedtler-textsurfer-4": {
    overview: [
      "Chisel-tip highlighters that stay wet-safe on inkjet and laser prints, so a marked-up document does not smear the text underneath it.",
      "The chisel tip gives a 2mm line on its edge and a 5mm sweep on its face, which covers both underlining and block highlighting from one pen.",
    ],
    highlights: [
      "Wet-safe on inkjet and laser prints",
      "Chisel tip: 2mm edge, 5mm face",
      "Four colours per pack",
    ],
    inTheBox: ["Four highlighters — yellow, green, pink, orange"],
  },

  "mesh-desk-organiser-set": {
    overview: [
      "Five coordinated pieces — letter tray, pen cup, memo holder, document stand and a small drawer — in the same powder-coated mesh, so a desk stops accumulating loose paper.",
      "Mesh rather than solid panels, which means you can see what is in each tray without lifting anything out of it.",
    ],
    highlights: [
      "Five matched pieces in one finish",
      "Powder-coated steel mesh",
      "Non-slip feet on every piece",
    ],
    inTheBox: [
      "Letter tray, pen cup, memo holder",
      "Document stand and small drawer unit",
    ],
  },

  "fellowes-lx25-shredder": {
    overview: [
      "A cross-cut shredder sized to sit beside a desk rather than in a service room, cutting eight sheets at a time into P-4 particles.",
      "P-4 is the level most offices need for anything carrying a name, an account number or a signature. The 17-litre bin empties without tools.",
    ],
    highlights: [
      "Cross-cut to security level P-4",
      "Eight sheets per pass",
      "17-litre pull-out bin",
    ],
    inTheBox: ["Shredder head and bin", "Lubricant sheet", "Instruction manual"],
    warranty: "12-month manufacturer warranty",
  },

  "casio-fx-991ex": {
    overview: [
      "The scientific calculator most Kenyan syllabuses and engineering courses are written around, with a high-resolution display that shows fractions, surds and matrices the way they are written on paper.",
      "Solar cells handle ordinary classroom light and the backup battery covers the rest, so it does not fail in the middle of an exam.",
    ],
    highlights: [
      "552 functions, including matrices and vectors",
      "Natural display — expressions as written",
      "Solar with battery backup",
    ],
    inTheBox: ["Calculator", "Hard slide-on cover", "Quick reference card"],
    warranty: "12-month manufacturer warranty",
  },
};

export const getProductDetail = (slug: string): ProductDetail | undefined =>
  PRODUCT_DETAILS[slug];
