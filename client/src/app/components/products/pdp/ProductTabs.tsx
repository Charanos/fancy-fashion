"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { IconCheck } from "../../icons";
import { DUR, EASE, motionDuration, useReducedMotion } from "../../navigation/nav-motion";
import { STORE_IDENTITY } from "../../navigation/nav-config";
import { formatKsh, FREE_DELIVERY_THRESHOLD } from "../product-catalog";
import type { CatalogueProduct } from "../product-catalog";
import type { ProductDetail } from "../product-details";

type ProductTabsProps = {
  product: CatalogueProduct;
  detail: ProductDetail;
};

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "specifications", label: "Specifications" },
  { id: "box", label: "In the box" },
  { id: "delivery", label: "Delivery & returns" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/**
 * A real ARIA tablist: arrow keys move between tabs, Home/End jump to the ends,
 * and the panels stay in the DOM (hidden, not unmounted) so the specification
 * text is still indexable and findable with the browser's own find-in-page.
 */
export default function ProductTabs({ product, detail }: ProductTabsProps) {
  const baseId = useId();
  const [active, setActive] = useState<TabId>("overview");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;

  const focusTab = (index: number) => {
    const next = TABS[(index + TABS.length) % TABS.length];
    setActive(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(TABS.length - 1);
        break;
      default:
        break;
    }
  };

  useGSAP(
    () => {
      const panel = panelRef.current?.querySelector('[data-active-panel="true"]');
      if (!panel) return;

      gsap.fromTo(
        panel,
        { autoAlpha: 0, y: 8 },
        {
          autoAlpha: 1,
          y: 0,
          duration: motionDuration(reduced, DUR.base),
          ease: EASE.out,
          overwrite: "auto",
        }
      );
    },
    { dependencies: [active, reduced] }
  );

  const freeDelivery = product.price >= FREE_DELIVERY_THRESHOLD;

  return (
    <section className="pdp-tabs" aria-label="Product information">
      <div className="pdp-tablist-shell">
        <div role="tablist" aria-label="Product information" className="pdp-tablist">
          {TABS.map((tab, index) => (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[tab.id] = node;
              }}
              id={tabId(tab.id)}
              role="tab"
              type="button"
              aria-selected={active === tab.id}
              aria-controls={panelId(tab.id)}
              tabIndex={active === tab.id ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className="pdp-tab"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div ref={panelRef} className="pdp-panels">
        {/* Overview */}
        <div
          id={panelId("overview")}
          role="tabpanel"
          aria-labelledby={tabId("overview")}
          hidden={active !== "overview"}
          data-active-panel={active === "overview" ? "true" : undefined}
          tabIndex={0}
          className="pdp-panel"
        >
          <div className="pdp-prose">
            {detail.overview.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <div className="pdp-panel-aside">
            <p className="pdp-aside-title">Why this one</p>
            <ul className="pdp-checklist">
              {detail.highlights.map((highlight) => (
                <li key={highlight}>
                  <IconCheck className="size-3.5 shrink-0" stroke={2.2} aria-hidden="true" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Specifications */}
        <div
          id={panelId("specifications")}
          role="tabpanel"
          aria-labelledby={tabId("specifications")}
          hidden={active !== "specifications"}
          data-active-panel={active === "specifications" ? "true" : undefined}
          tabIndex={0}
          className="pdp-panel"
        >
          <dl className="pdp-spec-table">
            {product.specs.map((spec) => (
              <div key={spec.label} className="pdp-spec-row">
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
            <div className="pdp-spec-row">
              <dt>Brand</dt>
              <dd>{product.brand}</dd>
            </div>
            <div className="pdp-spec-row">
              <dt>Product code</dt>
              <dd className="numerals font-mono">{product.sku}</dd>
            </div>
            {detail.warranty && (
              <div className="pdp-spec-row">
                <dt>Warranty</dt>
                <dd>{detail.warranty}</dd>
              </div>
            )}
          </dl>

          <p className="pdp-panel-note">
            Specifications are published by the manufacturer. If you need a
            figure confirmed before ordering in quantity, ask the service desk
            on{" "}
            <a href={`tel:+${STORE_IDENTITY.phoneDigits}`} className="pdp-assurance-link">
              <span className="numerals font-mono">{STORE_IDENTITY.phone}</span>
            </a>
            .
          </p>
        </div>

        {/* In the box */}
        <div
          id={panelId("box")}
          role="tabpanel"
          aria-labelledby={tabId("box")}
          hidden={active !== "box"}
          data-active-panel={active === "box" ? "true" : undefined}
          tabIndex={0}
          className="pdp-panel"
        >
          <ul className="pdp-checklist is-loose">
            {detail.inTheBox.map((item) => (
              <li key={item}>
                <IconCheck className="size-3.5 shrink-0" stroke={2.2} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="pdp-panel-note">
            Packaging is checked at the counter before dispatch. Anything
            missing on arrival is replaced, not credited.
          </p>
        </div>

        {/* Delivery & returns */}
        <div
          id={panelId("delivery")}
          role="tabpanel"
          aria-labelledby={tabId("delivery")}
          hidden={active !== "delivery"}
          data-active-panel={active === "delivery" ? "true" : undefined}
          tabIndex={0}
          className="pdp-panel"
        >
          <dl className="pdp-spec-table">
            <div className="pdp-spec-row">
              <dt>Nairobi delivery</dt>
              <dd>
                {freeDelivery
                  ? "Free on this item"
                  : `Free over ${formatKsh(FREE_DELIVERY_THRESHOLD)}`}
              </dd>
            </div>
            <div className="pdp-spec-row">
              <dt>Dispatch</dt>
              <dd>Same day on orders before 14:00</dd>
            </div>
            <div className="pdp-spec-row">
              <dt>Collection</dt>
              <dd>
                {STORE_IDENTITY.street}, {STORE_IDENTITY.city}
              </dd>
            </div>
            <div className="pdp-spec-row">
              <dt>Returns</dt>
              <dd>14 days, unopened and in original packaging</dd>
            </div>
            <div className="pdp-spec-row">
              <dt>Payment</dt>
              <dd>M-Pesa, card on delivery, bank transfer or LPO</dd>
            </div>
          </dl>

          <p className="pdp-panel-note">
            Consumables — ink, toner and paper — can only be returned sealed.
            Hardware faults inside the warranty period are handled through the
            manufacturer&rsquo;s service centre, and we log the claim for you.
          </p>
        </div>
      </div>
    </section>
  );
}
