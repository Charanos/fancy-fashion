"use client";

import Link from "next/link";
import { IconArrowRight, IconChevronRight } from "../icons";
import type { NavCategory } from "./nav-config";

type MegaMenuContentProps = {
  category: NavCategory;
  /** `ribbon` = two-column editorial panel. `compact` = single list. */
  variant: "ribbon" | "compact";
  pathname: string;
  onNavigate: () => void;
};

/**
 * Panel body for one department. Elements marked `data-mega-stagger` are picked
 * up by the bar's GSAP timeline, so the animation stays declarative here.
 */
export default function MegaMenuContent({
  category,
  variant,
  pathname,
  onNavigate,
}: MegaMenuContentProps) {
  const Icon = category.icon;
  const isRibbon = variant === "ribbon";

  const itemList = (
    <div data-mega-stagger>
      <p className="px-2 pb-1 font-mono text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
        Curated lines
      </p>
      <ul className="space-y-0.5">
        {category.items.map((item) => {
          const isCurrent = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={isCurrent ? "page" : undefined}
                className={`mega-item group/item ${isCurrent ? "is-current" : ""}`}
              >
                <span className="mega-item-label">{item.name}</span>
                {item.badge ? (
                  <span className="mega-item-badge">{item.badge}</span>
                ) : (
                  <IconChevronRight className="size-3 shrink-0 text-neutral-300 transition-all duration-150 group-hover/item:translate-x-0.5 group-hover/item:text-neutral-700" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const departmentCta = (
    <Link
      href={category.href}
      onClick={onNavigate}
      className="mega-cta group/cta"
      data-mega-stagger
    >
      <span>Explore entire department</span>
      <IconArrowRight className="size-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
    </Link>
  );

  if (!isRibbon) {
    return (
      <div className="grid gap-2.5">
        {itemList}
        {departmentCta}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="flex flex-col gap-3">
        <div className="mega-feature" data-mega-stagger>
          <span className="mega-feature-icon">
            <Icon className="size-4" stroke={1.7} />
          </span>
          <span className="font-title text-sm leading-snug tracking-tight text-neutral-950">
            {category.featuredTitle}
          </span>
          <p className="font-sans text-xs leading-relaxed text-neutral-500">
            {category.featuredDesc}
          </p>
        </div>
        {departmentCta}
      </div>

      {itemList}
    </div>
  );
}
