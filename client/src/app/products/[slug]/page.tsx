import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductBreadcrumbs from "../../components/products/pdp/ProductBreadcrumbs";
import ProductBuyBox from "../../components/products/pdp/ProductBuyBox";
import ProductShowcase from "../../components/products/pdp/ProductShowcase";
import ProductTabs from "../../components/products/pdp/ProductTabs";
import RelatedRail from "../../components/products/pdp/RelatedRail";
import { STORE_IDENTITY } from "../../components/navigation/nav-config";
import {
  PRODUCTS,
  departmentLabel,
  getProductBySlug,
  stockLevel,
} from "../../components/products/product-catalog";
import { getProductDetail } from "../../components/products/product-details";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Every product is prerendered at build time — the catalogue is static. */
export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  const title = `${product.name} | ${STORE_IDENTITY.name}`;

  return {
    title,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title,
      description: product.shortDescription,
      siteName: STORE_IDENTITY.name,
      locale: "en_KE",
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const detail = getProductDetail(product.slug);
  if (!detail) notFound();

  const availability =
    stockLevel(product.stock) === "out"
      ? "https://schema.org/OutOfStock"
      : "https://schema.org/InStock";

  // Structured data, so a search result can carry the price, availability and
  // rating instead of just a blue link.
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand },
    category: departmentLabel(product.department),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: product.price,
      availability,
      seller: { "@type": "Organization", name: STORE_IDENTITY.name },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: departmentLabel(product.department),
        item: `/?department=${product.department}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `/products/${product.slug}`,
      },
    ],
  };

  return (
    <div className="page-bounded pdp" style={{ paddingTop: "calc(var(--nav-h) + 1.5rem)" }}>
      <script
        type="application/ld+json"
        // Serialising our own catalogue data, not user input.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productSchema, breadcrumbSchema]),
        }}
      />

      <ProductBreadcrumbs product={product} />

      <div className="pdp-layout">
        <ProductShowcase product={product} />
        <ProductBuyBox product={product} warranty={detail.warranty} />
      </div>

      <ProductTabs product={product} detail={detail} />

      <RelatedRail product={product} />
    </div>
  );
}
