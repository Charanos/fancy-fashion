import Image from "next/image";
import Link from "next/link";

import {
  IconBrandInstagram,
  IconBrandX,
  IconMail,
  IconMapPin,
  IconPhone,
} from "./icons";
import { GlassSurface, IconAction } from "./ui";

const footerLinks = [
  {
    title: "Shop",
    links: ["Office & paper", "Print & scan", "Computers & tech", "Workspace & school"],
  },
  {
    title: "Support",
    links: ["Nairobi delivery", "Returns", "Bulk orders", "Contact"],
  },
  {
    title: "Company",
    links: ["About", "Stores", "Careers", "Journal"],
  },
];

const contactItems = [
  { icon: IconMapPin, label: "Nairobi, Kenya", numerals: false },
  { icon: IconPhone, label: "+254 700 000 000", numerals: true },
  { icon: IconMail, label: "hello@roioffice.co.ke", numerals: false },
];

const Footer = () => {
  return (
    <footer className="pt-12 pb-6">
      <GlassSurface className="overflow-hidden rounded-4xl p-5 sm:p-6 lg:p-8">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_2fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="glass-control grid size-12 place-items-center rounded-2xl">
                <Image
                  src="/logo.png"
                  alt=""
                  width={44}
                  height={34}
                  className="size-8 object-contain"
                />
              </span>
              <span className="font-title text-xl font-normal tracking-tight text-neutral-950">
                Roi Stationer &amp; Electronics
              </span>
            </Link>

            <p className="mt-4 text-sm leading-6 text-neutral-600">
              Reliable office supplies, print essentials and work-ready technology for Nairobi teams, schools and home workspaces.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <IconAction
                href="#"
                label="Instagram"
                icon={IconBrandInstagram}
              />
              <IconAction href="#" label="X" icon={IconBrandX} />
              <IconAction
                href="mailto:hello@roioffice.co.ke"
                label="Email"
                icon={IconMail}
              />
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h2 className="font-title text-base font-normal tracking-tight text-neutral-950">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-neutral-600 transition hover:text-neutral-950"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-t border-white/70 pt-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <ul className="grid gap-3 text-sm text-neutral-600 sm:grid-cols-3">
            {contactItems.map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <item.icon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-neutral-500"
                  stroke={1.7}
                />
                <span className={item.numerals ? "numerals" : undefined}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-sm text-neutral-500">
            © <span className="numerals">{new Date().getFullYear()}</span> Roi
            Stationer &amp; Electronics. All rights reserved.
          </p>
        </div>
      </GlassSurface>
    </footer>
  );
};

export default Footer;
