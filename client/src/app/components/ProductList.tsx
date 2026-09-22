"use client";

import { useMemo, useState } from "react";
import { ProductType } from "@/types";
import Categories from "./Categories";
import ProductCard from "./ProductCard";

// Catalogue content is intentionally local-first: prices are in Kenyan shillings
// and the mix reflects a practical Nairobi office, school and home-workspace shop.
type CatalogueProduct = ProductType & { department: string };

const products: CatalogueProduct[] = [
  { id: 1, department: "print-scan", name: "HP Smart Tank 585 All-in-One", shortDescription: "Print, copy and scan with low running costs for busy Nairobi workspaces.", description: "Wireless print, copy and scan for home offices and small teams.", price: 31500, sizes: ["Standard"], colors: ["graphite"], images: { graphite: "/products/1g.png" } },
  { id: 2, department: "print-scan", name: "Epson Perfection V39II Scanner", shortDescription: "A slim A4 flatbed scanner for clear documents, IDs and project work.", description: "Compact document scanning with a simple USB-powered setup.", price: 18900, sizes: ["A4"], colors: ["black"], images: { black: "/products/2g.png" } },
  { id: 3, department: "computers", name: "Lenovo V15 Gen 4 Laptop", shortDescription: "A dependable 15.6-inch laptop for business, classes and everyday admin.", description: "Work-ready performance with a full-size screen and essential ports.", price: 68500, sizes: ["15.6 inch"], colors: ["iron grey"], images: { graphite: "/products/3gr.png" } },
  { id: 4, department: "accessories", name: "Logitech MK270 Wireless Combo", shortDescription: "A full-size keyboard and mouse pairing with reliable everyday range.", description: "Comfortable wireless input for desks at home, school or the office.", price: 4950, sizes: ["Full size"], colors: ["black"], images: { black: "/products/4w.png" } },
  { id: 5, department: "office", name: "PaperOne A4 Copy Paper, 80gsm", shortDescription: "500 bright-white sheets for smooth everyday printing and copying.", description: "Consistent A4 paper for reports, invoices, schoolwork and documents.", price: 780, sizes: ["500 sheets"], colors: ["white"], images: { white: "/products/5r.png" } },
  { id: 6, department: "workspace", name: "Mesh Desk Organiser Set", shortDescription: "Five coordinated pieces to keep papers, pens and small tools in order.", description: "A practical metal desk set for focused, clutter-free workspaces.", price: 3250, sizes: ["5 piece"], colors: ["black"], images: { black: "/products/6g.png" } },
  { id: 7, department: "workspace", name: "Fellowes LX25 Paper Shredder", shortDescription: "Compact cross-cut protection for sensitive home and office documents.", description: "A desk-friendly solution for safer disposal of confidential papers.", price: 14200, sizes: ["8 sheet"], colors: ["black"], images: { black: "/products/7g.png" } },
  { id: 8, department: "school", name: "Student Essentials Starter Kit", shortDescription: "Exercise books, pens, pencils and geometry basics in one useful kit.", description: "A straightforward foundation for a new school term or project work.", price: 1650, sizes: ["Starter set"], colors: ["assorted"], images: { assorted: "/products/8b.png" } },
];

const formatKsh = (price: number) => `KSh ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(price)}`;

const ProductList = () => {
  const [activeDepartment, setActiveDepartment] = useState("all");
  const visibleProducts = useMemo(() => activeDepartment === "all" ? products : products.filter((product) => product.department === activeDepartment), [activeDepartment]);
  return <div className="w-full">
    <Categories activeSlug={activeDepartment} onSelect={setActiveDepartment} />
    <div className="mb-6 flex items-end justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Nairobi essentials</p><h2 className="font-title text-2xl font-normal tracking-tight text-neutral-950 sm:text-3xl">{activeDepartment === "all" ? "Featured collection" : "Selected essentials"}</h2></div>
      <p className="hidden max-w-sm text-right text-sm text-neutral-600 sm:block"><span className="numerals">{visibleProducts.length}</span> items shown · Prices in KSh.</p>
    </div>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {visibleProducts.map((product) => <ProductCard key={product.id} product={product} formatPrice={formatKsh} />)}
    </div>
  </div>;
};

export default ProductList;
