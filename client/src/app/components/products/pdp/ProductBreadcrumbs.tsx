import Link from "next/link";
import { IconChevronRight } from "../../icons";
import { departmentLabel, type CatalogueProduct } from "../product-catalog";

type ProductBreadcrumbsProps = {
  product: CatalogueProduct;
};

/**
 * The department crumb is a working link: the homepage catalogue reads
 * `?department=` from the URL, so this lands on a filtered grid rather than
 * the decorative dead crumb these usually turn into.
 */
export default function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="pdp-breadcrumbs">
      <ol>
        <li>
          <Link href="/">Home</Link>
          <IconChevronRight className="size-3 shrink-0" aria-hidden="true" />
        </li>
        <li>
          <Link href={`/?department=${product.department}#catalogue`}>
            {departmentLabel(product.department)}
          </Link>
          <IconChevronRight className="size-3 shrink-0" aria-hidden="true" />
        </li>
        <li>
          <span aria-current="page">{product.name}</span>
        </li>
      </ol>
    </nav>
  );
}
