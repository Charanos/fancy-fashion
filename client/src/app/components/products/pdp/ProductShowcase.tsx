import ProductMedia from "../ProductMedia";
import {
  discountPercent,
  type CatalogueProduct,
} from "../product-catalog";

type ProductShowcaseProps = {
  product: CatalogueProduct;
};

/**
 * The visual half of the detail page. There is no photography for this
 * catalogue (see ProductMedia), so rather than pad the page with a fake
 * thumbnail strip, the plate is shown at full size and the space beneath it
 * carries the three specs that a shopper would otherwise scroll for.
 */
export default function ProductShowcase({ product }: ProductShowcaseProps) {
  const discount = discountPercent(product);

  return (
    <div className="pdp-showcase group">
      <div className="pdp-plate">
        <ProductMedia product={product} size="plate" />

        <div className="product-card-flags">
          {discount > 0 && <span className="product-flag is-sale">−{discount}%</span>}
          {product.badges.map((badge) => (
            <span key={badge} className="product-flag">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <dl className="pdp-glance">
        {product.specs.map((spec) => (
          <div key={spec.label} className="pdp-glance-item">
            <dt>{spec.label}</dt>
            <dd>{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
