import { getCategories, getProducts } from '@/lib/services';
import CatalogContent from '@/components/catalog/CatalogContent';
import { FilterState, SortOption } from '@/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catalog — Shop All Modest Silhouettes | AUREN',
  description: 'Browse our complete catalog of modest clothing: linen trousers, oversized hoodies, basic tees, modern kurtas, relaxed dusters, and daily streetwear sets.',
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  // Await the searchParams Promise per Next.js 15/16 specification
  const resolvedParams = await searchParams;

  // 1. Parse categories
  const categoryParam = resolvedParams.category;
  const categorySlugs = Array.isArray(categoryParam)
    ? categoryParam
    : categoryParam
    ? [categoryParam]
    : [];

  // 2. Parse sizes
  const sizeParam = resolvedParams.size;
  const sizes = Array.isArray(sizeParam) ? sizeParam : sizeParam ? [sizeParam] : [];

  // 3. Parse colors
  const colorParam = resolvedParams.color;
  const colors = Array.isArray(colorParam) ? colorParam : colorParam ? [colorParam] : [];

  // 4. Parse price range
  const minPrice = resolvedParams.minPrice ? parseInt(resolvedParams.minPrice as string) : undefined;
  const maxPrice = resolvedParams.maxPrice ? parseInt(resolvedParams.maxPrice as string) : undefined;
  const priceRange: [number, number] | undefined =
    minPrice !== undefined && maxPrice !== undefined ? [minPrice, maxPrice] : undefined;

  // 5. Parse inStock
  const inStock = resolvedParams.inStock === 'true';

  // 6. Parse sort option
  const sort = (resolvedParams.sort as SortOption) || 'featured';

  // Fetch all categories
  const categories = await getCategories();

  // Map category slugs back to category IDs for internal filter tracking
  const categoryIds = categories
    .filter((c) => categorySlugs.includes(c.slug))
    .map((c) => c.id);

  // Fetch filtered products from database
  // Note: We pass one main category slug if there is exactly one, or query by IDs.
  // For the service signature, let's pass a structured parameter.
  const products = await getProducts({
    categorySlug: categorySlugs.length === 1 ? categorySlugs[0] : undefined,
    sort,
    sizes,
    colors,
    priceRange,
    // Add additional filtering locally if needed
  });

  // Filter inStock locally if requested (or inside service if supported)
  const filteredProducts = inStock ? products.filter((p) => p.in_stock) : products;

  // Assemble initial filter state
  const initialFilters: FilterState = {
    categories: categoryIds,
    sizes,
    colors,
    priceRange: priceRange || null,
    inStock,
  };

  return (
    <CatalogContent
      products={filteredProducts}
      categories={categories}
      initialFilters={initialFilters}
      initialSort={sort}
    />
  );
}
