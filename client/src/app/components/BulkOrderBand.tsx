import Link from "next/link";
import {
  IconArrowRight,
  IconBolt,
  IconCheck,
  IconPackage,
  IconShieldCheck,
} from "./icons";

const POINTS = [
  { icon: IconPackage, label: "Tiered pricing from 10 units" },
  { icon: IconBolt, label: "Same-week delivery across Nairobi" },
  { icon: IconShieldCheck, label: "LPO and 30-day invoicing" },
  { icon: IconCheck, label: "A named account contact" },
] as const;

/**
 * A server component — it is static copy and a link, so there is no reason to
 * ship it to the browser as JavaScript. Bulk supply is where an office
 * stationer actually earns, so it gets a section rather than a footer line.
 */
export default function BulkOrderBand() {
  return (
    <section className="bulk-band" aria-labelledby="bulk-heading">
      <span className="bulk-band-grid" aria-hidden="true" />

      <div className="relative">
        <p className="bulk-band-eyebrow">
          <span className="h-px w-5 bg-current opacity-50" aria-hidden="true" />
          Business supply
        </p>
        <h2 id="bulk-heading" className="bulk-band-title">
          Stocking a whole office, school or branch?
        </h2>
        <p className="bulk-band-copy">
          Send us the list. We price it against current stock, confirm lead times
          in writing and deliver on one consolidated docket — so procurement
          chases one invoice instead of nine suppliers.
        </p>
        <Link href="/bulk-orders" className="bulk-band-cta">
          <span>Request a bulk quote</span>
          <IconArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <ul className="bulk-band-points">
        {POINTS.map((point) => {
          const Icon = point.icon;
          return (
            <li key={point.label} className="bulk-band-point">
              <Icon className="size-4 shrink-0 opacity-70" stroke={1.7} aria-hidden="true" />
              <span>{point.label}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
