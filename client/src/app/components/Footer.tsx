import Link from "next/link";
import { GlyphCompassLogo } from "./AppleGlyphs";
import {
  IconArrowUpRight,
  IconBrandInstagram,
  IconBrandX,
  IconBuildingStore,
  IconChevronRight,
  IconClock,
  IconDeviceMobile,
  IconMail,
  IconMapPin,
  IconPhone,
  IconRosetteDiscountCheck,
  IconShieldCheck,
  IconTruck,
} from "./icons";
import { NAVIGATION_CATEGORIES, STORE_IDENTITY } from "./navigation/nav-config";

/**
 * Shop links are generated from the navigation config rather than retyped, so
 * the footer cannot drift out of step with the header the way the previous
 * hand-written list had (it was missing a department and linked nowhere).
 */
const SHOP_LINKS = NAVIGATION_CATEGORIES.map((category) => ({
  label: category.label,
  href: category.href,
}));

const SUPPORT_LINKS = [
  { label: "Delivery & collection", href: "/support/delivery" },
  { label: "Returns & warranty", href: "/support/returns" },
  { label: "Bulk orders", href: "/bulk-orders" },
  { label: "Track an order", href: "/support/orders" },
  { label: "Service desk", href: "/support" },
];

const COMPANY_LINKS = [
  { label: "About Roi", href: "/about" },
  { label: "Our Nairobi store", href: "/stores" },
  { label: "Journal", href: "/journal" },
  { label: "Careers", href: "/careers" },
];

const PAYMENT_METHODS = [
  { icon: IconDeviceMobile, label: "M-Pesa" },
  { icon: IconShieldCheck, label: "Card on delivery" },
  { icon: IconBuildingStore, label: "Bank transfer" },
  { icon: IconRosetteDiscountCheck, label: "LPO · 30-day terms" },
];

const LEGAL_LINKS = [
  { label: "Terms of sale", href: "/legal/terms" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Returns policy", href: "/support/returns" },
];

/**
 * Site footer.
 *
 * Deliberately a server component: it is structure, copy and links, so there
 * is no reason to ship it to the browser. Everything that can be a working
 * link is one — tel:, mailto: and wa.me are all derived from a single store
 * identity record, and "back to top" is a plain anchor rather than a scroll
 * handler, so it survives with JavaScript disabled.
 */
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        {STORE_IDENTITY.name} — site footer
      </h2>

      <div className="footer-shell">
        <div className="footer-top">
          {/* Identity */}
          <div className="footer-brand">
            <Link href="/" className="group footer-lockup" aria-label={`${STORE_IDENTITY.name} — home`}>
              <GlyphCompassLogo size={40} />
              <span>
                <span className="footer-lockup-name">{STORE_IDENTITY.name}</span>
                <span className="footer-lockup-tag">{STORE_IDENTITY.tagline}</span>
              </span>
            </Link>

            <p className="footer-blurb">{STORE_IDENTITY.blurb}</p>

            <ul className="footer-contact">
              <li>
                <a href={`tel:+${STORE_IDENTITY.phoneDigits}`} className="footer-contact-link">
                  <IconPhone className="size-4 shrink-0" stroke={1.7} aria-hidden="true" />
                  <span className="numerals font-mono">{STORE_IDENTITY.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${STORE_IDENTITY.email}`} className="footer-contact-link">
                  <IconMail className="size-4 shrink-0" stroke={1.7} aria-hidden="true" />
                  <span>{STORE_IDENTITY.email}</span>
                </a>
              </li>
              <li>
                <span className="footer-contact-link is-static">
                  <IconMapPin className="size-4 shrink-0" stroke={1.7} aria-hidden="true" />
                  <span>
                    {STORE_IDENTITY.street}, {STORE_IDENTITY.city}
                  </span>
                </span>
              </li>
            </ul>

            <div className="footer-social">
              <a
                href={`https://wa.me/${STORE_IDENTITY.phoneDigits}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Message us on WhatsApp"
                className="footer-social-link"
              >
                <IconDeviceMobile className="size-4" stroke={1.7} aria-hidden="true" />
              </a>
              <a href="#" aria-label="Instagram" className="footer-social-link">
                <IconBrandInstagram className="size-4" stroke={1.7} aria-hidden="true" />
              </a>
              <a href="#" aria-label="X" className="footer-social-link">
                <IconBrandX className="size-4" stroke={1.7} aria-hidden="true" />
              </a>
              <a
                href={`mailto:${STORE_IDENTITY.email}`}
                aria-label="Email the service desk"
                className="footer-social-link"
              >
                <IconMail className="size-4" stroke={1.7} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Navigation columns */}
          <nav className="footer-nav" aria-label="Footer">
            <div className="footer-column">
              <h3 className="footer-column-title">Shop</h3>
              <ul className="footer-links">
                {SHOP_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">
                      <IconChevronRight className="footer-link-mark" aria-hidden="true" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-column-title">Support</h3>
              <ul className="footer-links">
                {SUPPORT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">
                      <IconChevronRight className="footer-link-mark" aria-hidden="true" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-column-title">Company</h3>
              <ul className="footer-links">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">
                      <IconChevronRight className="footer-link-mark" aria-hidden="true" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Visit us */}
          <div className="footer-visit">
            <p className="footer-column-title">Visit the counter</p>

            <dl className="footer-hours">
              {STORE_IDENTITY.hours.map((slot) => (
                <div key={slot.days} className="footer-hours-row">
                  <dt>{slot.days}</dt>
                  <dd className="numerals font-mono">{slot.time}</dd>
                </div>
              ))}
            </dl>

            <p className="footer-visit-note">
              <IconClock className="size-3.5 shrink-0" stroke={1.7} aria-hidden="true" />
              <span>Orders placed before 14:00 go out the same day.</span>
            </p>

            <p className="footer-visit-note">
              <IconTruck className="size-3.5 shrink-0" stroke={1.7} aria-hidden="true" />
              <span>{STORE_IDENTITY.deliveryNotice}.</span>
            </p>

            <Link href="/bulk-orders" className="group/cta footer-visit-cta">
              <span>Open a business account</span>
              <IconArrowUpRight
                className="size-3.5 transition-transform duration-200 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* Payment & assurance */}
        <div className="footer-payments">
          <p className="footer-payments-label">Ways to pay</p>
          <ul className="footer-payments-list">
            {PAYMENT_METHODS.map((method) => {
              const Icon = method.icon;
              return (
                <li key={method.label} className="footer-payment">
                  <Icon className="size-3.5 shrink-0" stroke={1.7} aria-hidden="true" />
                  <span>{method.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-legal">
          <p className="footer-copyright">
            © <span className="numerals font-mono">{year}</span>{" "}
            {STORE_IDENTITY.name}. All rights reserved.
          </p>

          <ul className="footer-legal-links">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer-legal-link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="footer-legal-meta">
            <span className="numerals font-mono">{STORE_IDENTITY.currency}</span>
            {/* A plain anchor, so returning to the top needs no JavaScript. */}
            <a href="#main-content" className="footer-top-link">
              <span>Back to top</span>
              <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
