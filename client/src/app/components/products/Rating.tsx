"use client";

import { IconStar, IconStarFilled } from "../icons";

type RatingProps = {
  value: number;
  reviewCount?: number;
  /** Hide the star row on the densest layouts and show the number alone. */
  compact?: boolean;
  className?: string;
};

const STARS = [1, 2, 3, 4, 5];

/**
 * Five stars, rounded to the nearest half for the fill and announced as a
 * single sentence — a screen reader should hear "Rated 4.6 out of 5 from 128
 * reviews", not "star star star star star".
 */
export default function Rating({
  value,
  reviewCount,
  compact = false,
  className = "",
}: RatingProps) {
  const rounded = Math.round(value * 2) / 2;

  return (
    <span
      className={`product-rating ${className}`}
      role="img"
      aria-label={`Rated ${value.toFixed(1)} out of 5${
        reviewCount ? ` from ${reviewCount} reviews` : ""
      }`}
    >
      {!compact && (
        <span className="product-rating-stars" aria-hidden="true">
          {STARS.map((star) =>
            star <= rounded ? (
              <IconStarFilled key={star} className="size-3" />
            ) : (
              <IconStar key={star} className="size-3" stroke={1.6} />
            )
          )}
        </span>
      )}
      <span className="numerals font-mono text-[10.5px] font-medium" aria-hidden="true">
        {value.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span
          className="numerals font-mono text-[10.5px] text-neutral-400"
          aria-hidden="true"
        >
          ({reviewCount})
        </span>
      )}
    </span>
  );
}
