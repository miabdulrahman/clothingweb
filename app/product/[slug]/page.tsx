import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/services';
import ProductDetailContent from '@/components/product/ProductDetailContent';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | AUREN',
    };
  }

  return {
    title: `${product.title} | AUREN`,
    description: product.description,
    openGraph: {
      title: `${product.title} | AUREN`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  // Await the params Promise per Next.js 15/16 specification
  const { slug } = await params;

  // Fetch product
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products (same category)
  const relatedProducts = await getRelatedProducts(product.id, product.category_id, 4);

  return (
    <ProductDetailContent
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
