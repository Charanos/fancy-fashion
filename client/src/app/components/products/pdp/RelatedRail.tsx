import ProductCard from "../ProductCard";
import { getRelatedProducts, type CatalogueProduct } from "../product-catalog";

type RelatedRailProps = {
  product: CatalogueProduct;
};

/**
 * Reuses the grid card rather than defining a fourth card variant — the same
 * price rules, stock pill and add-to-bag behaviour, so the rail cannot drift
 * away from the catalogue it is pulled from.
 */
export default function RelatedRail({ product }: RelatedRailProps) {
  const related = getRelatedProducts(product, 4);
  if (related.length === 0) return null;

  return (
    <section className="pdp-related" aria-labelledby="related-heading">
      <div className="section-header">
        <div className="section-title-block">
          <p className="section-eyebrow">
            <span className="section-eyebrow-rule" aria-hidden="true" />
            Goes with it
          </p>
          <h2 id="related-heading" className="section-title">
            Ordered alongside
          </h2>
        </div>
        <p className="section-lede">
          Pulled from the same department first, so a single delivery covers the
          whole order.
        </p>
      </div>

      <div className="product-grid">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
