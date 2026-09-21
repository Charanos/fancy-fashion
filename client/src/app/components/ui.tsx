import Link from "next/link";
import type { ComponentPropsWithoutRef, ComponentType } from "react";

import type { IconProps } from "./icons";

type IconComponent = ComponentType<IconProps>;

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function GlassSurface({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("glass-surface", className)} {...props}>
      {children}
    </div>
  );
}

export function IconAction({
  href,
  label,
  icon: Icon,
  badge,
  className,
  ...props
}: {
  href: string;
  label: string;
  icon: IconComponent;
  badge?: number;
  className?: string;
} & Pick<ComponentPropsWithoutRef<"a">, "aria-current">) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn("icon-action inline-grid", className)}
      {...props}
    >
      <Icon aria-hidden="true" className="size-5" stroke={1.7} />
      {typeof badge === "number" ? (
        <span className="numerals absolute -right-1 -top-1 grid min-h-4 min-w-4 place-items-center rounded-full bg-neutral-950/80 px-1 text-[10px] leading-none text-white backdrop-blur">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
