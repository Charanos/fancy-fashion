"use client";

import type { ComponentType } from "react";

import {
  IconNotebook,
  IconPalette,
  IconPaperclip,
  IconPencil,
  IconPrinter,
  IconRulerMeasure,
  IconLayoutGrid,
  type IconProps,
} from "./icons";

type Category = {
  name: string;
  description: string;
  slug: string;
  count: number;
  icon: ComponentType<IconProps>;
};

const categories: Category[] = [
  {
    name: "All",
    description: "Everything in store",
    slug: "all",
    count: 128,
    icon: IconLayoutGrid,
  },
  {
    name: "Writing",
    description: "Pens, pencils, markers",
    slug: "writing",
    count: 34,
    icon: IconPencil,
  },
  {
    name: "Notebooks",
    description: "Journals and pads",
    slug: "notebooks",
    count: 22,
    icon: IconNotebook,
  },
  {
    name: "Art",
    description: "Paint, brushes, craft",
    slug: "art",
    count: 19,
    icon: IconPalette,
  },
  {
    name: "Desk",
    description: "Clips, files, storage",
    slug: "desk",
    count: 28,
    icon: IconPaperclip,
  },
  {
    name: "Tools",
    description: "Rulers and geometry",
    slug: "tools",
    count: 15,
    icon: IconRulerMeasure,
  },
  {
    name: "Printing",
    description: "Paper and ink",
    slug: "printing",
    count: 10,
    icon: IconPrinter,
  },
];

const Categories = () => {
  return (
    <section className="relative my-20 sm:my-28" aria-labelledby="categories-heading">
      {/* ================================================================ */}
      {/* HEADER AREA — Refined typography, divider, and layout             */}
      {/* ================================================================ */}
      <div className="mb-12 flex flex-col gap-6 border-b border-stone-200/60 pb-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-500 font-mono">
            <span className="h-px w-6 bg-neutral-400"></span>
            Browse
          </p>
          <h2 id="categories-heading" className="font-title text-3xl sm:text-4xl font-normal tracking-tight text-neutral-950">
            Shop by category
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-neutral-600 md:text-right">
          Quick paths into the stationery essentials, archival materials, and desk instruments customers reach for most.
        </p>
      </div>

      {/* ================================================================ */}
      {/* TACTILE CATEGORY RIBBON — Apple-grade 3D icons, fluid scroll      */}
      {/* ================================================================ */}
      <div className="relative w-full">
        {/* Native fluid scroll container */}
        <div className="no-scrollbar flex w-full gap-3 sm:gap-6 overflow-x-auto pb-10 pt-4 snap-x snap-mandatory">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isActive = index === 0;

            return (
              <button
                key={category.slug}
                type="button"
                aria-pressed={isActive}
                className="group relative flex w-[130px] shrink-0 sm:w-44 flex-col items-center gap-5 rounded-[2.5rem] bg-transparent p-2 text-center transition-all duration-400 snap-start hover:-translate-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
              >
                {/* 3D Tactile Icon Container */}
                <span 
                  className={`relative grid size-[72px] sm:size-[88px] place-items-center rounded-full transition-all duration-400 ${
                    isActive
                      ? "bg-neutral-950 text-white shadow-xl ring-1 ring-neutral-950"
                      : "bg-gradient-to-br from-white/95 to-[#f7f5ef] text-neutral-600 shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_4px_10px_-2px_rgba(30,24,16,0.06),0_2px_4px_-1px_rgba(30,24,16,0.04)] ring-1 ring-black/5 group-hover:text-neutral-950 group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_16px_32px_-6px_rgba(30,24,16,0.12),0_6px_12px_-2px_rgba(30,24,16,0.06)] group-hover:ring-black/10"
                  }`}
                >
                  <Icon 
                    aria-hidden="true" 
                    className="size-7 sm:size-8 transition-transform duration-400 group-hover:scale-110" 
                    stroke={isActive ? 2 : 1.5} 
                  />
                </span>

                {/* Text Context */}
                <span className="flex flex-col items-center gap-1.5 px-2">
                  <span 
                    className={`font-title text-base sm:text-lg font-normal tracking-tight transition-colors duration-400 ${
                      isActive ? "text-neutral-950" : "text-neutral-800 group-hover:text-neutral-950"
                    }`}
                  >
                    {category.name}
                  </span>
                  <span className="font-mono text-[9.5px] font-semibold uppercase tracking-widest text-neutral-400 transition-colors duration-400 group-hover:text-neutral-600">
                    {category.count} items
                  </span>
                </span>
                
                {/* Subtle active indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-2 size-1.5 rounded-full bg-neutral-950" />
                )}
              </button>
            );
          })}
          
          {/* Spacer to ensure the last item can be scrolled fully into view with padding */}
          <div className="w-4 shrink-0 sm:w-8" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default Categories;
