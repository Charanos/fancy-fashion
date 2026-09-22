"use client";

import React, { useId } from "react";

interface GlyphProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  variant?: "default" | "active" | "accent";
}

/**
 * SVG `<defs>` are document-global: two glyphs that declare the same gradient id
 * collide, and every `url(#id)` reference resolves to whichever one painted
 * first. The header mounts these glyphs in several places at once (the rail, the
 * masthead, the docked console, the drawer), so each instance derives a unique
 * suffix from `useId`. The colons React puts in that id are stripped because
 * they are not valid inside a `url(#…)` fragment reference.
 */
function useGlyphIds(prefix: string) {
  const raw = useId();
  const uid = `${prefix}-${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  return {
    id: (part: string) => `${uid}-${part}`,
    ref: (part: string) => `url(#${uid}-${part})`,
  };
}

/**
 * High-Fidelity 3D Apple-Grade Heart Glyph
 * Features multi-stop metallic shading, top specular highlight, and contact shadow
 */
export function GlyphHeart({
  size = 19,
  className = "",
  variant = "default",
  ...props
}: GlyphProps) {
  const isAccent = variant === "accent" || variant === "active";
  const { id, ref } = useGlyphIds("heart");
  const shape =
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={`transition-transform duration-200 ease-out group-hover:scale-110 ${className}`}
      {...props}
    >
      <defs>
        {/* Ambient & Specular Drop Shadow */}
        <filter id={id("shadow")} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="rgba(24, 20, 16, 0.35)" />
          <feDropShadow dx="0" dy="0.5" stdDeviation="0.4" floodColor="rgba(255, 255, 255, 0.8)" />
        </filter>

        {/* 3D Graphite / Obsidian Body Gradient */}
        <linearGradient id={id("body")} x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isAccent ? "#f87171" : "#5a544c"} />
          <stop offset="30%" stopColor={isAccent ? "#dc2626" : "#3d3832"} />
          <stop offset="85%" stopColor={isAccent ? "#991b1b" : "#24201b"} />
          <stop offset="100%" stopColor={isAccent ? "#7f1d1d" : "#171411"} />
        </linearGradient>

        {/* Specular Rim Highlight */}
        <linearGradient id={id("rim")} x1="4" y1="3" x2="20" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>

        {/* Inner Glint */}
        <linearGradient id={id("glint")} x1="7" y1="5" x2="10" y2="9" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Main 3D Sculpted Body */}
      <path d={shape} fill={ref("body")} filter={ref("shadow")} />

      {/* 3D Chamfer / Bevel Stroke */}
      <path d={shape} stroke={ref("rim")} strokeWidth="0.8" strokeLinejoin="round" />

      {/* Top Left Specular Glint */}
      <ellipse cx="7.2" cy="6.2" rx="2.2" ry="1.2" transform="rotate(-30 7.2 6.2)" fill={ref("glint")} />
    </svg>
  );
}

/**
 * High-Fidelity 3D Apple-Grade Shopping Bag Glyph
 * Features sculpted bag geometry, arched metal handle with shadow, and folded gusset sheen
 */
export function GlyphShoppingBag({
  size = 19,
  className = "",
  ...props
}: GlyphProps) {
  const { id, ref } = useGlyphIds("bag");
  const bagShape =
    "M4.8 8.8C4.6 7.8 5.3 7 6.3 7h11.4c1 0 1.7.8 1.5 1.8l-1.6 10.8c-.1.9-.9 1.4-1.8 1.4H8.2c-.9 0-1.7-.5-1.8-1.4L4.8 8.8z";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={`transition-transform duration-200 ease-out group-hover:scale-110 ${className}`}
      {...props}
    >
      <defs>
        <filter id={id("shadow")} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="rgba(24, 20, 16, 0.35)" />
          <feDropShadow dx="0" dy="0.5" stdDeviation="0.4" floodColor="rgba(255, 255, 255, 0.8)" />
        </filter>

        {/* Bag Body 3D Gradient */}
        <linearGradient id={id("body")} x1="12" y1="6" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#554f47" />
          <stop offset="35%" stopColor="#3c3731" />
          <stop offset="85%" stopColor="#221e1a" />
          <stop offset="100%" stopColor="#151310" />
        </linearGradient>

        {/* Handle Gradient with metallic light catch */}
        <linearGradient id={id("handle")} x1="12" y1="2" x2="12" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8d8479" />
          <stop offset="50%" stopColor="#4d4740" />
          <stop offset="100%" stopColor="#25211c" />
        </linearGradient>

        {/* Bevel Rim */}
        <linearGradient id={id("rim")} x1="5" y1="6" x2="19" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Arched Handle */}
      <path
        d="M8.5 9V6.5C8.5 4.57 10.07 3 12 3s3.5 1.57 3.5 3.5V9"
        stroke={ref("handle")}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Bag Body */}
      <path d={bagShape} fill={ref("body")} filter={ref("shadow")} />

      {/* Bag Rim Highlight */}
      <path d={bagShape} stroke={ref("rim")} strokeWidth="0.8" />

      {/* Top Fold Specular Line */}
      <line x1="6.5" y1="7.6" x2="17.5" y2="7.6" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="0.6" />

      {/* Handle Rivets / Anchors */}
      <circle cx="8.5" cy="9.2" r="1" fill="#756d64" stroke="#1f1c19" strokeWidth="0.4" />
      <circle cx="15.5" cy="9.2" r="1" fill="#756d64" stroke="#1f1c19" strokeWidth="0.4" />
    </svg>
  );
}

/**
 * High-Fidelity 3D Apple-Grade User Avatar Glyph
 * Features volumetric sphere head and sculpted shoulder mantle with light-directional shading
 */
export function GlyphUser({ size = 19, className = "", ...props }: GlyphProps) {
  const { id, ref } = useGlyphIds("user");

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={`transition-transform duration-200 ease-out group-hover:scale-110 ${className}`}
      {...props}
    >
      <defs>
        <filter id={id("shadow")} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="rgba(24, 20, 16, 0.35)" />
          <feDropShadow dx="0" dy="0.5" stdDeviation="0.4" floodColor="rgba(255, 255, 255, 0.8)" />
        </filter>

        {/* 3D Sphere Head Gradient */}
        <radialGradient id={id("head")} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#686157" />
          <stop offset="45%" stopColor="#433e38" />
          <stop offset="85%" stopColor="#25211c" />
          <stop offset="100%" stopColor="#151310" />
        </radialGradient>

        {/* 3D Torso Gradient */}
        <linearGradient id={id("torso")} x1="12" y1="13" x2="12" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#554f47" />
          <stop offset="40%" stopColor="#3d3832" />
          <stop offset="90%" stopColor="#201c18" />
          <stop offset="100%" stopColor="#14120f" />
        </linearGradient>

        <linearGradient id={id("rim")} x1="6" y1="4" x2="18" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Head Sphere */}
      <circle
        cx="12"
        cy="7.5"
        r="4.2"
        fill={ref("head")}
        stroke={ref("rim")}
        strokeWidth="0.7"
        filter={ref("shadow")}
      />

      {/* Specular Highlight on Head */}
      <ellipse cx="10.8" cy="5.8" rx="1.4" ry="0.8" transform="rotate(-30 10.8 5.8)" fill="#ffffff" fillOpacity="0.5" />

      {/* Torso / Shoulders */}
      <path
        d="M4.5 19.8C4.5 16.3 7.8 13.8 12 13.8s7.5 2.5 7.5 6c0 .5-.4.7-.8.7H5.3c-.4 0-.8-.2-.8-.7z"
        fill={ref("torso")}
        stroke={ref("rim")}
        strokeWidth="0.7"
        filter={ref("shadow")}
      />

      {/* Shoulder Light Ridge */}
      <path
        d="M6.2 18.2C7.5 15.6 9.6 14.5 12 14.5s4.5 1.1 5.8 3.7"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * High-Fidelity 3D Apple-Grade Search Magnifier Glyph
 * Features a beveled optical glass lens, specular reflection, and shaded brass/titanium handle
 */
export function GlyphSearch({ size = 18, className = "", ...props }: GlyphProps) {
  const { id, ref } = useGlyphIds("search");

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={`transition-transform duration-200 ease-out group-hover:scale-110 ${className}`}
      {...props}
    >
      <defs>
        <filter id={id("shadow")} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="0.8" floodColor="rgba(24, 20, 16, 0.35)" />
          <feDropShadow dx="0" dy="0.5" stdDeviation="0.4" floodColor="rgba(255, 255, 255, 0.8)" />
        </filter>

        {/* Lens Rim Metallic Gradient */}
        <linearGradient id={id("lens-rim")} x1="4" y1="4" x2="16" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#736b61" />
          <stop offset="35%" stopColor="#47413a" />
          <stop offset="80%" stopColor="#25211c" />
          <stop offset="100%" stopColor="#14120f" />
        </linearGradient>

        {/* Lens Glass Interior Reflection */}
        <radialGradient id={id("lens-glass")} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#d1ccc3" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#3d3730" stopOpacity="0.2" />
        </radialGradient>

        {/* Handle Gradient */}
        <linearGradient id={id("handle")} x1="14" y1="14" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7a7268" />
          <stop offset="50%" stopColor="#443f38" />
          <stop offset="100%" stopColor="#1a1714" />
        </linearGradient>
      </defs>

      {/* Handle */}
      <path
        d="M14.8 14.8l5.4 5.4c.5.5.5 1.3 0 1.8-.5.5-1.3.5-1.8 0l-5.4-5.4"
        stroke={ref("handle")}
        strokeWidth="2.4"
        strokeLinecap="round"
        filter={ref("shadow")}
      />

      {/* Lens Interior Glass */}
      <circle cx="10" cy="10" r="6.2" fill={ref("lens-glass")} />

      {/* Outer Lens Rim */}
      <circle cx="10" cy="10" r="6.2" stroke={ref("lens-rim")} strokeWidth="1.8" filter={ref("shadow")} />

      {/* Specular Edge Ring Highlight */}
      <circle cx="10" cy="10" r="5.4" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.5" />

      {/* Lens Glint Arc */}
      <path
        d="M7 6.5C8 5.6 9.4 5.2 10.8 5.4"
        stroke="#ffffff"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
    </svg>
  );
}

/**
 * High-Fidelity 3D Apple-Grade Menu Toggle Glyph
 * Features dual tactile pills with micro-bevel and specular lighting
 */
export function GlyphMenu({
  size = 18,
  className = "",
  isOpen = false,
  ...props
}: GlyphProps & { isOpen?: boolean }) {
  const { id, ref } = useGlyphIds("menu");

  if (isOpen) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        className={`transition-transform duration-200 ease-out ${className}`}
        {...props}
      >
        <path
          d="M6 18L18 6M6 6l12 12"
          stroke="#25211c"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={`transition-transform duration-200 ease-out group-hover:scale-105 ${className}`}
      {...props}
    >
      <defs>
        <linearGradient id={id("bar")} x1="4" y1="0" x2="4" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#554f47" />
          <stop offset="60%" stopColor="#35302a" />
          <stop offset="100%" stopColor="#181512" />
        </linearGradient>
        <filter id={id("shadow")} x="-10%" y="-20%" width="120%" height="160%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodColor="rgba(24, 20, 16, 0.3)" />
          <feDropShadow dx="0" dy="0.4" stdDeviation="0.3" floodColor="rgba(255, 255, 255, 0.7)" />
        </filter>
      </defs>

      {/* Top Bar */}
      <rect
        x="4"
        y="7.5"
        width="16"
        height="2.5"
        rx="1.25"
        fill={ref("bar")}
        stroke="#ffffff"
        strokeOpacity="0.4"
        strokeWidth="0.5"
        filter={ref("shadow")}
      />

      {/* Bottom Bar (slightly narrower for Apple elegance) */}
      <rect
        x="6"
        y="14"
        width="12"
        height="2.5"
        rx="1.25"
        fill={ref("bar")}
        stroke="#ffffff"
        strokeOpacity="0.4"
        strokeWidth="0.5"
        filter={ref("shadow")}
      />
    </svg>
  );
}

/**
 * High-Fidelity 3D Apple-Grade Drafting Compass Emblem
 * Features brass/steel brushed metallic sheen, machined hinge wheel, and shadow
 */
export function GlyphCompassLogo({
  size = 38,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const { id, ref } = useGlyphIds("compass");

  return (
    <span
      className={`relative inline-grid shrink-0 place-items-center rounded-full transition-transform duration-300 group-hover:scale-105 ${className}`}
      style={{
        width: size,
        height: size,
        background: "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(246, 242, 235, 0.7) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.95)",
        boxShadow:
          "inset 0 1px 1px 0 rgba(255, 255, 255, 1), inset 0 -1px 1px 0 rgba(20, 18, 14, 0.06), 0 3px 8px -2px rgba(35, 30, 22, 0.1), 0 1px 2px -0.5px rgba(35, 30, 22, 0.05)",
      }}
    >
      <svg
        width={size * 0.65}
        height={size * 0.65}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={id("brass")} x1="6" y1="3" x2="18" y2="21" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#b4935d" />
            <stop offset="35%" stopColor="#8d6e3f" />
            <stop offset="70%" stopColor="#5d4726" />
            <stop offset="100%" stopColor="#3c2d17" />
          </linearGradient>
          <linearGradient id={id("steel")} x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#696258" />
            <stop offset="50%" stopColor="#3f3a34" />
            <stop offset="100%" stopColor="#1a1815" />
          </linearGradient>
          <filter id={id("shadow")} x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.6" floodColor="rgba(24, 20, 15, 0.3)" />
          </filter>
        </defs>

        {/* Pivot Top Knob */}
        <circle cx="12" cy="4.2" r="1.8" fill={ref("brass")} filter={ref("shadow")} />
        <circle cx="11.5" cy="3.7" r="0.6" fill="#ffffff" fillOpacity="0.7" />

        {/* Compass Legs */}
        <path d="M12 5.5L7 20" stroke={ref("steel")} strokeWidth="1.8" strokeLinecap="round" filter={ref("shadow")} />
        <path d="M12 5.5L17 20" stroke={ref("steel")} strokeWidth="1.8" strokeLinecap="round" filter={ref("shadow")} />

        {/* Brass Adjustment Arc & Screw */}
        <path d="M8.5 13.5a6 6 0 0 1 7 0" stroke={ref("brass")} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="12" cy="13.2" r="1.2" fill={ref("brass")} />
        <circle cx="11.7" cy="12.9" r="0.4" fill="#ffffff" fillOpacity="0.8" />
      </svg>
    </span>
  );
}
