"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  IconChevronDown,
  IconHeart,
  IconLogin2,
  IconPhone,
} from "../icons";
import SearchTrigger from "./SearchTrigger";
import { DUR, EASE, motionDuration, useReducedMotion } from "./nav-motion";
import { STORE_IDENTITY, UTILITY_LINKS } from "./nav-config";
import type { NavCategory } from "./nav-config";
import { useFocusTrap } from "./useFocusTrap";
import { useScrollLock } from "./useScrollLock";

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  categories: NavCategory[];
  pathname: string;
  /** Focus returns here when the drawer closes. */
  triggerRef: RefObject<HTMLButtonElement | null>;
};

type DrawerSectionProps = {
  category: NavCategory;
  isOpen: boolean;
  isCurrent: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  pathname: string;
};

/**
 * One collapsible department. The sub-list stays mounted so GSAP can animate a
 * real measured height, and is marked `inert` while collapsed so it never traps
 * a Tab stop behind a zero-height box.
 */
function DrawerSection({
  category,
  isOpen,
  isCurrent,
  onToggle,
  onNavigate,
  pathname,
}: DrawerSectionProps) {
  const bodyId = useId();
  const bodyRef = useRef<HTMLDivElement>(null);
  const isFirstRun = useRef(true);
  const reduced = useReducedMotion();
  const Icon = category.icon;

  useGSAP(
    () => {
      const body = bodyRef.current;
      if (!body) return;

      if (isFirstRun.current || reduced) {
        isFirstRun.current = false;
        gsap.set(body, { height: isOpen ? "auto" : 0, autoAlpha: isOpen ? 1 : 0 });
        return;
      }

      if (isOpen) {
        gsap.to(body, {
          height: "auto",
          autoAlpha: 1,
          duration: motionDuration(reduced, DUR.base),
          ease: EASE.out,
          overwrite: "auto",
        });
        gsap.fromTo(
          body.querySelectorAll("[data-drawer-item]"),
          { autoAlpha: 0, x: -10 },
          {
            autoAlpha: 1,
            x: 0,
            duration: DUR.fast,
            stagger: 0.028,
            delay: 0.05,
            ease: EASE.out,
            overwrite: "auto",
          }
        );
        return;
      }

      gsap.to(body, {
        height: 0,
        autoAlpha: 0,
        duration: motionDuration(reduced, DUR.fast),
        ease: EASE.in,
        overwrite: "auto",
      });
    },
    { dependencies: [isOpen, reduced] }
  );

  return (
    <li className="drawer-section" data-drawer-stagger data-open={isOpen ? "true" : undefined}>
      <div className="flex items-stretch">
        <Link
          href={category.href}
          onClick={onNavigate}
          aria-current={isCurrent ? "page" : undefined}
          className="drawer-section-link"
        >
          <Icon className="size-4.5 shrink-0 text-neutral-500" stroke={1.7} />
          <span className="truncate">{category.label}</span>
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={bodyId}
          aria-label={`${isOpen ? "Collapse" : "Expand"} ${category.label} subcategories`}
          className="drawer-section-toggle"
        >
          <IconChevronDown
            className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div ref={bodyRef} id={bodyId} className="drawer-section-body" inert={!isOpen}>
        <ul className="border-t border-stone-200/60 pt-1.5 pb-2">
          {category.items.map((item) => (
            <li key={item.href} data-drawer-item>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={pathname === item.href ? "page" : undefined}
                className="drawer-sub-link"
              >
                <span className="truncate">{item.name}</span>
                {item.badge && <span className="mega-item-badge">{item.badge}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

export default function MobileDrawer({
  open,
  onClose,
  onOpenSearch,
  categories,
  pathname,
  triggerRef,
}: MobileDrawerProps) {
  // `present` keeps the drawer mounted through its exit tween.
  const [present, setPresent] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useScrollLock(open);
  useFocusTrap(open && present, panelRef, { restoreTo: triggerRef });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) setPresent(true);
  }, [open]);

  // Open the section matching the current route so the drawer lands in context.
  useEffect(() => {
    if (!open) return;
    const current = categories.find((category) =>
      pathname.startsWith(category.href)
    );
    setOpenSection(current?.id ?? null);
  }, [open, pathname, categories]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const backdrop = backdropRef.current;
      if (!present || !panel || !backdrop) return;

      if (reduced) {
        gsap.set([backdrop, panel], { autoAlpha: open ? 1 : 0, y: 0 });
        if (!open) setPresent(false);
        return;
      }

      if (open) {
        gsap
          .timeline({ defaults: { ease: EASE.out, overwrite: "auto" } })
          .fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: DUR.base }, 0)
          .fromTo(
            panel,
            { autoAlpha: 0, y: -18 },
            { autoAlpha: 1, y: 0, duration: DUR.slow },
            0.02
          )
          .fromTo(
            panel.querySelectorAll("[data-drawer-stagger]"),
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: DUR.base, stagger: 0.04 },
            0.1
          );
        return;
      }

      gsap
        .timeline({
          defaults: { ease: EASE.in, overwrite: "auto" },
          onComplete: () => setPresent(false),
        })
        .to(panel, { autoAlpha: 0, y: -14, duration: DUR.fast }, 0)
        .to(backdrop, { autoAlpha: 0, duration: DUR.fast }, 0.02);
    },
    { dependencies: [open, present, reduced] }
  );

  if (!present || !mounted) return null;

  return createPortal(
    <div className="mobile-drawer-root lg:hidden">
      <div
        ref={backdropRef}
        className="mobile-drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className="mobile-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        tabIndex={-1}
      >
        <div className="px-1 pb-4" data-drawer-stagger>
          <SearchTrigger
            variant="field"
            onOpen={() => {
              onClose();
              onOpenSearch();
            }}
            className="w-full"
          />
        </div>

        <p
          className="px-1 pb-2 font-mono text-[10px] font-semibold tracking-wider text-neutral-400 uppercase"
          data-drawer-stagger
        >
          Store departments
        </p>

        <nav aria-label="Catalogue departments" className="drawer-scroll px-1">
          <ul className="space-y-2.5 pb-2">
            {categories.map((category) => (
              <DrawerSection
                key={category.id}
                category={category}
                pathname={pathname}
                isCurrent={pathname === category.href}
                isOpen={openSection === category.id}
                onToggle={() =>
                  setOpenSection((current) =>
                    current === category.id ? null : category.id
                  )
                }
                onNavigate={onClose}
              />
            ))}
          </ul>
        </nav>

        <div
          className="mt-4 space-y-2.5 border-t border-stone-200/80 px-1 pt-4"
          data-drawer-stagger
        >
          <div className="grid grid-cols-2 gap-2">
            <Link href="/account" onClick={onClose} className="drawer-cta">
              <IconLogin2 className="size-4" />
              <span>Sign in</span>
            </Link>
            <Link href="/wishlist" onClick={onClose} className="drawer-cta">
              <IconHeart className="size-4" />
              <span>Wishlist</span>
            </Link>
          </div>

          <div className="flex items-center justify-between gap-3 px-1 font-sans text-[11px] text-neutral-500">
            <div className="flex items-center gap-3">
              {UTILITY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="transition-colors hover:text-neutral-900"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <a
              href={`tel:${STORE_IDENTITY.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-neutral-900"
            >
              <IconPhone className="size-3.5" />
              <span className="numerals font-mono">{STORE_IDENTITY.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
