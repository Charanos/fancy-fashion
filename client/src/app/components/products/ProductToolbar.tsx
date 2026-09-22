"use client";

import { useId } from "react";
import {
  IconArrowsSort,
  IconLayoutGrid,
  IconLayoutList,
  IconX,
} from "../icons";
import {
  SORT_OPTIONS,
  departmentLabel,
  type DepartmentSlug,
  type SortId,
} from "./product-catalog";

export type ViewMode = "grid" | "list";

type ProductToolbarProps = {
  resultCount: number;
  totalCount: number;
  department: DepartmentSlug | "all";
  onClearDepartment: () => void;
  sort: SortId;
  onSortChange: (sort: SortId) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
};

/**
 * Sits between the category ribbon and the results: says what is being shown,
 * offers a way out of the current filter, and owns sort and view mode. The
 * count is announced politely so filtering is not a silent change for anyone
 * using a screen reader.
 */
export default function ProductToolbar({
  resultCount,
  totalCount,
  department,
  onClearDepartment,
  sort,
  onSortChange,
  view,
  onViewChange,
}: ProductToolbarProps) {
  const sortId = useId();
  const isFiltered = department !== "all";

  return (
    <div className="product-toolbar">
      <div className="product-toolbar-status">
        <p className="product-toolbar-count" aria-live="polite">
          <span className="numerals font-mono font-semibold text-neutral-900">
            {resultCount}
          </span>
          <span>
            {resultCount === 1 ? "product" : "products"}
            {isFiltered && (
              <>
                {" "}
                of <span className="numerals font-mono">{totalCount}</span>
              </>
            )}
          </span>
        </p>

        {isFiltered && (
          <button
            type="button"
            onClick={onClearDepartment}
            className="product-filter-chip"
            aria-label={`Clear the ${departmentLabel(department)} filter`}
          >
            <span className="truncate">{departmentLabel(department)}</span>
            <IconX className="size-3 shrink-0" stroke={2.4} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="product-toolbar-controls">
        <div className="product-sort">
          <IconArrowsSort
            className="size-3.5 shrink-0 text-neutral-400"
            stroke={1.8}
            aria-hidden="true"
          />
          <label htmlFor={sortId} className="product-sort-label">
            Sort
          </label>
          {/* A native select: it gets the platform's own picker on touch, which
              beats any custom listbox on a phone. */}
          <select
            id={sortId}
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortId)}
            className="product-sort-select"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className="product-view-toggle"
          role="group"
          aria-label="Result layout"
        >
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            aria-pressed={view === "grid"}
            className="product-view-button"
            title="Grid view"
          >
            <IconLayoutGrid className="size-4" stroke={1.8} aria-hidden="true" />
            <span className="sr-only">Grid view</span>
          </button>
          <button
            type="button"
            onClick={() => onViewChange("list")}
            aria-pressed={view === "list"}
            className="product-view-button"
            title="List view"
          >
            <IconLayoutList className="size-4" stroke={1.8} aria-hidden="true" />
            <span className="sr-only">List view</span>
          </button>
        </div>
      </div>
    </div>
  );
}
