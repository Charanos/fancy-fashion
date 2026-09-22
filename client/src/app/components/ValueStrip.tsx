"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  IconBuildingStore,
  IconDeviceMobile,
  IconRosetteDiscountCheck,
  IconTruck,
} from "./icons";
import { DUR, EASE, useReducedMotion } from "./navigation/nav-motion";

const ASSURANCES = [
  {
    icon: IconTruck,
    title: "Free Nairobi delivery",
    note: "On orders over KSh 5,000, Monday to Saturday.",
  },
  {
    icon: IconRosetteDiscountCheck,
    title: "Genuine stock only",
    note: "Sealed, batch-coded consumables and warranted hardware.",
  },
  {
    icon: IconBuildingStore,
    title: "Bulk & business accounts",
    note: "Tiered pricing, LPOs and consolidated monthly invoicing.",
  },
  {
    icon: IconDeviceMobile,
    title: "M-Pesa or on delivery",
    note: "Pay on collection, on delivery, or by bank transfer.",
  },
] as const;

/**
 * The commercial terms that decide a stationery purchase — delivery, warranty,
 * bulk pricing, payment — stated once, immediately under the hero. It repeats
 * the header's delivery promise on purpose: that is the single most common
 * pre-purchase question.
 */
export default function ValueStrip() {
  const rootRef = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const items = rootRef.current?.querySelectorAll("li");
      if (!items || items.length === 0) return;

      if (reduced) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: DUR.slow,
          ease: EASE.out,
          stagger: 0.06,
          overwrite: "auto",
        }
      );
    },
    { dependencies: [reduced] }
  );

  return (
    <ul ref={rootRef} className="value-strip" aria-label="Store terms">
      {ASSURANCES.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.title} className="value-item">
            <span className="value-item-mark" aria-hidden="true">
              <Icon className="size-4" stroke={1.6} />
            </span>
            <span className="min-w-0">
              <span className="value-item-title block">{item.title}</span>
              <span className="value-item-note mt-0.5 block">{item.note}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
